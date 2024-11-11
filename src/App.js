import React, { lazy, Suspense, useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import "./App.css";

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const SyaratPage = lazy(() => import("./pages/SyaratPage"));
const Popup = lazy(() => import("./pages/Popup"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));

const validRoles = ["mother", "child"]; // Centralized role validation

const App = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null);

  // Restore state from sessionStorage on load
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem("sessionId");
    const storedUserId = sessionStorage.getItem("userId");
    const storedIsAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true";

    if (storedSessionId && storedUserId && storedIsAuthenticated) {
      setSessionId(storedSessionId);
      setUserId(storedUserId);
      setIsAuthenticated(true);
    }
  }, []);

  // Store state in sessionStorage whenever it changes
  useEffect(() => {
    if (sessionId && userId && isAuthenticated) {
      sessionStorage.setItem("sessionId", sessionId);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("isAuthenticated", isAuthenticated.toString());
    }
  }, [sessionId, userId, isAuthenticated]);

  const handlePopupClose = () => setShowPopup(false);

  const handleLogin = async (userData) => {
    setSessionId(userData.sessionId);
    setUserId(userData.userId);
    setIsAuthenticated(true);
  };

  const resetRole = () => {
    setSessionId(null);
    setUserId(null);
    setIsAuthenticated(false);
    setShowPopup(true);
    sessionStorage.clear(); // Clear session storage on reset
  };

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <HomePage />, // Default route
      },
      {
        path: "/:role",
        element: (
          <RoleBasedComponent
            isAuthenticated={isAuthenticated}
            showPopup={showPopup}
            sessionId={sessionId}
            userId={userId}
            handlePopupClose={handlePopupClose}
            handleLogin={handleLogin}
          />
        ),
      },
      {
        path: "/:role/syarat",
        element: (
          <Suspense fallback={<div>Loading Syarat Page...</div>}>
            <SyaratPage />
          </Suspense>
        ),
      },
      {
        path: "/:role/terms",
        element: (
          <Suspense fallback={<div>Loading Terms Page...</div>}>
            <TermsPage />
          </Suspense>
        ),
      },
      {
        path: "/:role/result",
        element: <ResultPage onResetRole={resetRole} />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />, // Fallback route
      },
    ],
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      },
    }
  );

  return (
    <div className="app-container">
      <Header />
      <main>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </main>
    </div>
  );
};

export default App;

const RoleBasedComponent = ({
  isAuthenticated,
  showPopup,
  sessionId,
  userId,
  handlePopupClose,
  handleLogin,
}) => {
  const { role } = useParams(); // Extract role
  const navigate = useNavigate();

  // UseEffect to handle conditional navigation
  useEffect(() => {
    if (!validRoles.includes(role)) {
      navigate("/", { replace: true });
    } else if (showPopup) {
      // Popup logic handled elsewhere
    } else if (!isAuthenticated) {
      navigate(`/${role}`, { replace: true });
    } else {
      const termsAccepted = sessionStorage.getItem("termsAccepted") === "true";

      if (!termsAccepted) {
        navigate(`/${role}/syarat`, { replace: true });
      }
    }
  }, [role, showPopup, isAuthenticated, navigate]);

  if (showPopup) {
    return <Popup onClose={handlePopupClose} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <QuizPage
      role={role}
      sessionId={sessionId}
      userId={userId}
      onComplete={() => {
        if (sessionId) {
          navigate(`/${role}/result`, { state: { sessionId } });
        } else {
          console.error("Session ID missing during navigation to ResultPage.");
          navigate(`/${role}`);
        }
      }}
    />
  );
};

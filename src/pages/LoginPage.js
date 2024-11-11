import React, { useState, useEffect } from "react";
import "../styles/LoginPage.css";
import { useParams } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const { role } = useParams(); // Extract role from URL
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    domicile: "",
    role: role.charAt(0).toUpperCase() + role.slice(1), // Set role dynamically
  });
  const [cities, setCities] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("/data-kota.json")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch(() => {
        setFetchError("Gagal memuat data kota. Coba lagi nanti.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" }); // Clear field-specific errors
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Nama harus diisi.";
    if (!/^\d{10,15}$/.test(formData.phone))
      errors.phone = "Nomor telepon tidak valid.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Email tidak valid.";
    if (!formData.domicile) errors.domicile = "Domisili harus dipilih.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;

    if (!isChecked) {
      setApiError("Anda harus menyetujui syarat dan ketentuan.");
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Store user data and get the user ID
      const userResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || "Gagal menyimpan data pengguna.");
      }

      const userData = await userResponse.json();
      const userId = userData.user._id;
      console.log("User ID created:", userId);

      // Step 2: Start the session using the valid userId
      const sessionResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/sessions/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            motherId: formData.role === "Mother" ? userId : null,
            childId: formData.role === "Child" ? userId : null,
          }),
        }
      );

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json();
        throw new Error(errorData.error || "Gagal memulai sesi.");
      }

      const sessionData = await sessionResponse.json();
      console.log("Session started:", sessionData.sessionId);

      // Step 3: Call onLogin to transition to the next page
      console.log("Calling onLogin with:", {
        sessionId: sessionData.sessionId,
        userId: userId,
      });
      onLogin({ sessionId: sessionData.sessionId, userId: userId });
    } catch (error) {
      console.error("Error during login:", error.message);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img
        src="/assets/headline.png"
        alt="Kita Kenalan Dulu Yuk!"
        className="login-title"
      />
      {fetchError && <p className="error-banner">{fetchError}</p>}
      {apiError && <p className="error-banner">{apiError}</p>}
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <div className="form-group">
          <label htmlFor="name">Nama</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Nama"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.name}
            className={fieldErrors.name ? "input-error" : ""}
          />
          {fieldErrors.name && (
            <span className="error-text">{fieldErrors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">No. Handphone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="No. Handphone"
            value={formData.phone}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.phone}
            className={fieldErrors.phone ? "input-error" : ""}
          />
          {fieldErrors.phone && (
            <span className="error-text">{fieldErrors.phone}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.email}
            className={fieldErrors.email ? "input-error" : ""}
          />
          {fieldErrors.email && (
            <span className="error-text">{fieldErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="domicile">Domisili</label>
          <select
            id="domicile"
            name="domicile"
            value={formData.domicile}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.domicile}
            className={fieldErrors.domicile ? "input-error" : ""}
          >
            <option value="" disabled>
              Pilih Domisili
            </option>
            {isLoading ? (
              <option value="" disabled>
                Loading...
              </option>
            ) : (
              cities.map((city, index) => (
                <option key={city.id || index} value={city.label}>
                  {city.label}
                </option>
              ))
            )}
          </select>
          {fieldErrors.domicile && (
            <span className="error-text">{fieldErrors.domicile}</span>
          )}
        </div>

        <div className="terms-checkbox">
          <input
            type="checkbox"
            id="agree"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="agree">
            Dengan ini saya memahami dan menyetujui S&K berlaku.
          </label>
        </div>

        <button
          type="submit"
          className={`login-button ${
            !isChecked || isLoading ? "button-disabled" : ""
          }`}
          disabled={!isChecked || isLoading}
        >
          {isLoading ? "Loading..." : "Masuk"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

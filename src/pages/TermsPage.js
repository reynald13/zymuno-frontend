// src/pages/TermsPage.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/TermsPage.css";

const TermsPage = () => {
  const { role } = useParams(); // Get the role (mother or child) from the URL
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Save the user's agreement to sessionStorage
    sessionStorage.setItem("termsAccepted", "true");
    navigate(`/${role}`); // Navigate to the Quiz page for the role
  };

  return (
    <div className="terms-container">
      <div className="terms-content">
        <img
          src="/assets/headline-tnc.png"
          alt="ATURAN BERMAIN"
          className="terms-title"
        />
        <p>
          Akan ada 7 pernyataan yang perlu kamu tentukan kebenarannya. Jumlah
          pernyataan benar akan menentukan seberapa dekat hubungan Ibu dan anak
          mengenal satu sama lain.
        </p>
        <p>
          Seluruh jawaban akan ditampung dan pemenang akan diundi untuk jadi
          bintang iklan Zymuno* Keputusan panitia bersifat mutlak dan tanpa ada
          pungutan biaya apapun*.
        </p>
        <button onClick={handleButtonClick} className="terms-button">
          Oke, saya siap bermain!
        </button>
      </div>
    </div>
  );
};

export default TermsPage;

// src/pages/SyaratPage.js
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/syarat.css";

const SyaratPage = () => {
  const { role } = useParams(); // Get the role (mother or child) from the URL
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/${role}/terms`); // Navigate to the Terms page for the role
  };

  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role, navigate]);

  return (
    <div className="syarat-container">
      <div className="syarat-content">
        <ol className="syarat-list">
          <li>Semua yang dikatakan jujur tanpa paksaan.</li>
          <li>Bersedia mengikuti semua tahap hingga akhir.</li>
          <li>
            Dalam proses tanya jawab ini, peserta menyetujui bahwa seluruh
            dokumentasi menjadi milik Zymuno dan dipergunakan untuk kebutuhan
            komersil.
          </li>
          <li>
            Apabila terpilih, pasangan Ibu dan Anak menyetujui untuk jadi
            bintang iklan Zymuno.
          </li>
        </ol>
        <button onClick={handleButtonClick} className="syarat-button">
          Oke, saya siap bermain!
        </button>
      </div>
    </div>
  );
};

export default SyaratPage;

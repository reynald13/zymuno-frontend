// src/components/Popup.js
import React from "react";
import "../styles/Popup.css";

const Popup = ({ onClose }) => {
  return (
    <div
      className="popup-container"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <p>
          Kami mengajak kamu, Ibu dan Anak, untuk saling mengenal lebih dalam
          dalam menyadari hal-hal sederhana akan kebiasaan dan sifat satu sama
          lain. Karena bagi Zymuno, menjaga imunitas bukan hanya soal kesehatan
          fisik, tetapi juga menjaga koneksi dan cinta dalam keluarga.
        </p>
        <p>
          Melalui <b>#JagaYangBerharga</b>, Zymuno percaya bahwa tiap kebiasaan,
          perhatian, dan waktu bersama adalah bagian dari kepedulian akan
          keluarga.
        </p>
        <p>
          Mari kita mulai perjalanan ini dan temukan seberapa baik kamu mengenal
          mereka yang berharga di hidupmu.
        </p>
        <button
          onClick={onClose}
          className="popup-button"
          aria-label="Start Journey"
        >
          Mulai
        </button>
      </div>
    </div>
  );
};

export default Popup;

// src/components/Header.js
import React from "react";
import PropTypes from "prop-types";
import "../styles/Header.css";

const Header = ({
  logoSrc = "/assets/logo-zymuno.png",
  altText = "Zymuno - Strengthening Bonds",
}) => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logoSrc} alt={altText} className="logo" />
      </div>
    </header>
  );
};

Header.propTypes = {
  logoSrc: PropTypes.string,
  altText: PropTypes.string,
};

export default Header;

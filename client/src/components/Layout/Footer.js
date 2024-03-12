import React from "react";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <div className="footer">

      <div className="footter">
        <div className="footer-1">
          <p className="text-center mt-3">
            <Link to="/about">ABOUT</Link>|
            <Link to="/contact">CONTACT</Link>|
            <Link to="/policy">PRIVACY POLICY</Link>
          </p>
        </div>

        <div className="footer-2">
          <h1>TRRIPY ECOMMERCE</h1>
        </div>

        <div className="footer-3">
          <h6>ADDRESS:</h6>
          <h6>271, Galle Road, Colombo - 15</h6>
        </div>
      </div>

      <h6 className="text-center">Copyright © 1999–2023 Trripy.com™.</h6>
    </div>
  );
};

export default Footer;
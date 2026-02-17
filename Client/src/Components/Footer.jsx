// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto w-full">
      <div className="container mx-auto px-6 md:px-20 py-10 flex flex-col md:flex-row justify-between gap-6">
        {/* روابط سريعة */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Quick Links</h3>
          <Link to="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-400 transition">
            About
          </Link>
          <Link to="/profile" className="hover:text-blue-400 transition">
            Profile
          </Link>
          <Link to="/signup" className="hover:text-blue-400 transition">
            Sign Up
          </Link>
        </div>

        {/* معلومات التواصل */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Contact Us</h3>
          <p>
            Email:{" "}
            <a
              href="mailto:ahmedalfoad230@gmail.com"
              className="hover:text-blue-400 transition"
            >
              ahmedalfoad230@gmail.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a
              href="tel:01553007698"
              className="hover:text-blue-400 transition"
            >
              01553007698
            </a>
          </p>
        </div>

        {/* أيقونات التواصل الاجتماعي */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Follow Us</h3>
          <div className="flex gap-3 mt-2">
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-full hover:bg-blue-500 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 rounded-full hover:bg-blue-700 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} FDT Estate. All rights reserved.
      </div>
    </footer>
  );
}

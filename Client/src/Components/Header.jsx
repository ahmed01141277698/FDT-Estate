import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaAlignJustify, FaTimes } from "react-icons/fa";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="p-4 flex items-center justify-between bg-white shadow-md sticky top-0 z-10 sm:gap-2 sm:flex-row ">
      <Link to="/" className=" text-xs sm:text-2xl  font-bold">
        <span className="from-neutral-500">FDT</span>
        <span className=" text-yellow-500 ">Estate</span>
      </Link>
      <div>
        <form
          action=""
          className=" flex items-center text-sm sm:2xl:w-[500px] w-[200px] relative"
        >
          <input
            type="text"
            placeholder="Search for properties..."
            className=" w-25 bg-gray-100 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 sm:text-sm text-xs "
          />
          <span className="text-gray-500 relative right-6">
            <FaSearch />
          </span>
          <button
            type="submit"
            className="hidden sm:block bg-slate-500 flex items-center gap-1 relative right-3 text-white px-2 py-0.5 rounded hover:bg-slate-600 transition-colors duration-300 sm:text-sm text-xs font-medium"
          >
            Search
          </button>
        </form>
      </div>
      <div className=" hidden sm:flex items-center gap-6">
        <Link
          to="/"
          className="text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          About
        </Link>
        <Link
          to="/profile"
          className="text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          Profile
        </Link>
        {false ? (
          <Link
            to="/signin"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Sign In
          </Link>
        ) : (
          <Link
            to="/signup"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Sign Up
          </Link>
        )}
      </div>

      <div className="relative z-50">
        {/* Mobile Icon */}
        <div className="sm:hidden">
          <FaAlignJustify
            className="text-gray-700 cursor-pointer text-xl"
            onClick={() => setOpen(true)}
          />
        </div>

        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
            open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        ></div>
        {/* Drawer Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out sm:hidden ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <FaTimes
              className="text-gray-600 cursor-pointer text-xl"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6 px-6 mt-6">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            >
              About
            </Link>

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Profile
            </Link>

            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
// import VerifyEmail from "./Pages/VerifyEmail";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import Home from "./Pages/Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Listing from "./Pages/CreateListing";
import ListingDetailsPage from "./Pages/ListingDetailsPage";
import { signInSuccess, signOut } from "../redux/user/userSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok || !data.user) {
          dispatch(signOut());
          return;
        }

        dispatch(signInSuccess(data.user));
      } catch (error) {
        dispatch(signOut());
      }
    };

    fetchProfile();
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        {/* <Route path="/verify-email" element={<VerifyEmail />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/create-listing" element={<Listing />} />
        <Route path="/listing/:id" element={<ListingDetailsPage />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;

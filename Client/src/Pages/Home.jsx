import React from "react";
// import HeroSearch from "../Components/Hero/HeroSearch.jsx";
// import HeroButtons from "../components/Hero/HeroButtons";
// import Heroone from "../components/Hero/Hero";
// import HeroContent from "../components/Hero/HeroContent";
import Hero from "../components/HomeSections/Hero.jsx";
import FeaturedProperties from "../components/HomeSections/FeaturedProperties";
import PropertyTypes from "../components/HomeSections/PropertyTypes";
import WhyUs from "../components/HomeSections/WhyUs";
import MarketInsights from "../components/HomeSections/MarketInsights";
import Testimonials from "../components/HomeSections/Testimonials";
import CTA from "../components/HomeSections/CTA";

export default function Home() {
  return (
    <div
      dir="rtl"
      className="flex flex-col min-h-screen"
      style={{ background: "#0e0e16", minHeight: "100vh" }}
    >
      {/* <Heroone /> */}
      <Hero />
      <FeaturedProperties />
      <PropertyTypes />
      <WhyUs />
      <MarketInsights />
      <Testimonials />
      <CTA />
    </div>
  );
}

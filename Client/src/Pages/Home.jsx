import React from "react";
// import HeroSearch from "../Components/Hero/HeroSearch.jsx";
// import HeroButtons from "../components/Hero/HeroButtons";
// import Heroone from "../components/Hero/Hero";
// import HeroContent from "../components/Hero/HeroContent";
import Hero from "../Components/HomeSections/Hero.jsx";
import FeaturedProperties from "../Components/HomeSections/FeaturedProperties.jsx";
import PropertyTypes from "../Components/HomeSections/PropertyTypes";
import WhyUs from "../Components/HomeSections/WhyUs";
import MarketInsights from "../Components/HomeSections/MarketInsights";
import Testimonials from "../Components/HomeSections/Testimonials";
import CTA from "../Components/HomeSections/CTA";
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

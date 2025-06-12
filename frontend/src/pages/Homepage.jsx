import React from "react";
import KanbanSection from "../components/homepage/KanbanSection";
import HeroSection from "../components/homepage/HeroSection";

function Homepage() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <HeroSection />
      <KanbanSection />
    </div>
  );
}

export default Homepage;

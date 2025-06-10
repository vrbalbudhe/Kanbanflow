import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  Zap,
  Target,
} from "lucide-react";

// Feature data
const features = [
  {
    icon: CheckCircle,
    title: "Visual Task Management",
    description: "Organize your work with intuitive Kanban boards",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates",
  },
  {
    icon: Zap,
    title: "Boost Productivity",
    description: "Built-in Pomodoro timer to maximize focus",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Monitor progress and achieve your objectives",
  },
];

// Animated background particles component
const BackgroundParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-blue-400/20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Call-to-action button component
const CTAButton = ({
  children,
  variant = "primary",
  onClick,
  className = "",
}) => {
  const baseClasses =
    "px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg";
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:shadow-blue-500/25",
    secondary:
      "bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/40",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="flex items-center space-x-4 mb-3">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

// Main hero section component
const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Productivity", "Collaboration", "Focus", "Success"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    console.log("Get Started clicked");
  };

  const handleWatchDemo = () => {
    console.log("Watch Demo clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-800 to-pink-300 relative overflow-hidden">
      <BackgroundParticles />

      <div className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-medium text-white mb-8 leading-tight">
              Unleash Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500">
                {words[currentWord]}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform the way you work with KanbanFlow's powerful visual
              project management. Boost productivity with integrated Pomodoro
              timers and seamless team collaboration.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <CTAButton
                onClick={handleGetStarted}
                className="flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </CTAButton>
              <CTAButton
                variant="secondary"
                onClick={handleWatchDemo}
                className="flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </CTAButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

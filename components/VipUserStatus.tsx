"use client";

import { Crown, Sparkles, Zap, Shield, Star, Clock } from "lucide-react";

interface VipUserStatusProps {
  userType: string;
  siteName: string;
}

export function VipUserStatus({ userType, siteName }: VipUserStatusProps) {
  const normalizedUserType = userType.toLowerCase();
  const isPro = normalizedUserType === "pro";

  const planConfig = {
    pro: {
      label: "Pro",
      icon: Crown,
      gradient: "from-[#ffd700] via-[#ffed4e] to-[#ffd700]",
      bgGradient: "from-[#fff9e6] via-[#fffef7] to-[#fff9e6]",
      borderGradient: "from-[#ffd700] to-[#ffed4e]",
      iconColor: "text-[#b8860b]",
      features: [
        { icon: Zap, text: "Priority review & instant approval" },
        { icon: Shield, text: "No verification requirements" },
        { icon: Star, text: "Premium listing placement" },
        { icon: Sparkles, text: "Enhanced visibility" }
      ]
    },
    basic: {
      label: "Basic",
      icon: Star,
      gradient: "from-[#ff6d57] via-[#ff7d68] to-[#ff6d57]",
      bgGradient: "from-[#fff7f5] via-[#fffcfc] to-[#fff7f5]",
      borderGradient: "from-[#ff6d57] to-[#ff7d68]",
      iconColor: "text-[#ff6d57]",
      features: [
        { icon: Zap, text: "Fast-tracked review process" },
        { icon: Shield, text: "No backlink verification needed" },
        { icon: Star, text: "Premium member benefits" },
        { icon: Clock, text: "Reduced waiting time" }
      ]
    }
  };

  const config = isPro ? planConfig.pro : planConfig.basic;

  return (
    <section
      className="relative overflow-hidden rounded-[26px] border bg-white shadow-[0_26px_50px_-40px_rgba(23,23,31,0.35)] transition-all duration-300 hover:shadow-[0_30px_60px_-30px_rgba(23,23,31,0.4)]"
      style={{
        background: `linear-gradient(135deg, ${config.bgGradient.replace("from-", "").replace("via-", ", ").replace("to-", ", ")})`
      }}
    >
      {/* Animated border gradient */}
      <div
        className="absolute inset-0 rounded-[26px] p-[2px]"
        style={{
          background: `linear-gradient(135deg, ${config.borderGradient.replace("from-", "").replace("to-", ", ")})`
        }}
      >
        <div
          className="h-full w-full rounded-[24px]"
          style={{
            background: `linear-gradient(135deg, ${config.bgGradient.replace("from-", "").replace("via-", ", ").replace("to-", ", ")})`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative px-10 py-8">
        {/* Header with VIP badge */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            {/* Glowing effect */}
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-[#ffd700] to-[#ffed4e] opacity-20 blur-xl"></div>

            {/* VIP Badge */}
            <div
              className="relative flex items-center gap-3 rounded-full px-6 py-3 text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${config.gradient.replace("from-", "").replace("via-", ", ").replace("to-", ", ")})`
              }}
            >
              <config.icon className="h-6 w-6" />
              <span className="text-lg font-bold tracking-wide">
                {config.label} VIP Member
              </span>
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Welcome message */}
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#1f1f24]">
            Welcome, Valued {config.label} Member! 👑
          </h2>
          <p className="text-lg leading-relaxed text-[#5a5a63]">
            <span className="font-semibold text-[#1f1f24]">{siteName}</span> is getting the VIP treatment.
            <br />
            Your premium membership unlocks priority processing and exclusive benefits.
          </p>
        </div>

        {/* Features grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {config.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-[16px] bg-white/60 p-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/80"
            >
              <div className={`rounded-full bg-white p-2 shadow-sm ${config.iconColor}`}>
                <feature.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-[#1f1f24]">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Status indicator */}
        <div className="rounded-[18px] bg-white/80 p-6 text-center backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
            <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
              VIP Processing Active
            </span>
          </div>
          <p className="text-[#5a5a63]">
            Your submission is being <strong>fast-tracked</strong> through our priority review queue.
            <br />
            Expected processing time: <span className="font-semibold text-[#ff6d57]">24-48 hours</span>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-4 top-4 opacity-10">
          <Crown className="h-16 w-16 text-[#ffd700]" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-10">
          <Sparkles className="h-12 w-12 text-[#ff6d57]" />
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-[26px] pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-gradient-to-r from-[#ffd700] to-[#ff6d57] opacity-40"
              style={{
                left: `${15 + i * 15}%`,
                top: `${10 + (i % 2) * 70}%`,
                animationDelay: `${i * 0.5}s`,
                animation: `float 4s ease-in-out infinite alternate`
              }}
            />
          ))}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </section>
  );
}
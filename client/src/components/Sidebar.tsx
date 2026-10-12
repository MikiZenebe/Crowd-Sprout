import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiZap } from "react-icons/fi";
import type { IconType } from "react-icons";

import { navlinks } from "../constants";
import logo from "../assets/crowdsprout_logo.jpg";

interface NavLinkItem {
  name: string;
  icon: IconType;
  link: string;
  disabled?: boolean;
}

const getTooltipMeta = (name: string, disabled?: boolean) => {
  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    campaign: "Create Campaign",
    payment: "Direct Payments",
    withdraw: "Withdrawals",
    profile: "Creator Profile",
    logout: "Disconnect Wallet",
  };
  return {
    title: titles[name] || name.charAt(0).toUpperCase() + name.slice(1),
    isSoon: disabled,
  };
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Determine if a nav item matches the current active route
  const isLinkActive = (link: NavLinkItem) => {
    if (link.disabled) return false;
    if (link.link === "/") {
      return location.pathname === "/" && link.name === "dashboard";
    }
    return location.pathname.startsWith(link.link);
  };

  return (
    <aside
      aria-label="Application Sidebar"
      className="flex justify-between items-center flex-col sticky top-5 h-[93vh] select-none z-30"
    >
      {/* Brand Logo Container */}
      <Link
        to="/"
        className="group relative flex items-center justify-center focus:outline-none"
        title="CrowdSprout Home"
      >
        <div className="relative w-[56px] h-[56px] rounded-2xl bg-[#1c1c24] border border-[#2c2f32] group-hover:border-[#1dc071]/50 p-2 flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-xl group-hover:shadow-[0_0_20px_rgba(29,192,113,0.3)]">
          <img
            src={logo}
            alt="CrowdSprout Logo"
            className="w-full h-full rounded-xl object-cover"
          />
          {/* Subtle Live Status Beacon */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1dc071] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1dc071] border-2 border-[#13131a]" />
          </span>
        </div>

        {/* Logo Tooltip */}
        <div className="absolute left-full ml-3.5 px-3 py-1.5 rounded-xl bg-[#1c1c24]/95 backdrop-blur-md border border-[#2c2f32] text-xs font-medium text-white shadow-2xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 z-50 flex items-center gap-1.5">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1c1c24] border-l border-b border-[#2c2f32] rotate-45" />
          <span className="font-bold text-[#1dc071]">CrowdSprout</span>
          <span className="text-[#808191] text-[11px]">• Web3 Funding</span>
        </div>
      </Link>

      {/* Main Glassmorphic Navigation Island */}
      <div className="flex-1 flex flex-col justify-between items-center bg-gradient-to-b from-[#1c1c24]/95 via-[#181822]/95 to-[#14141c]/95 backdrop-blur-xl border border-[#2c2f32] rounded-[24px] w-[72px] py-4 px-2 my-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Navigation Items */}
        <nav className="flex flex-col justify-center items-center gap-2.5 w-full">
          {navlinks.map((link) => {
            const active = isLinkActive(link);
            const { title, isSoon } = getTooltipMeta(link.name, link.disabled);
            const IconComponent = link.icon;

            return (
              <div
                key={link.name}
                className="relative group flex items-center justify-center w-full"
              >
                {/* Active Indicator Bar on Left Edge */}
                {active && (
                  <span className="absolute -left-2 w-1.5 h-6 bg-[#1dc071] rounded-r-full shadow-[0_0_10px_#1dc071] transition-all" />
                )}

                <button
                  type="button"
                  disabled={link.disabled}
                  onClick={() => {
                    if (!link.disabled) {
                      navigate(link.link);
                    }
                  }}
                  className={`w-[48px] h-[48px] rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                    link.disabled
                      ? "cursor-not-allowed opacity-35 text-[#808191]"
                      : active
                        ? "bg-gradient-to-br from-[#1dc071]/25 to-[#1dc071]/5 text-[#1dc071] border border-[#1dc071]/40 shadow-[0_0_16px_rgba(29,192,113,0.3)] scale-105"
                        : "text-[#808191] hover:text-white hover:bg-[#252830] hover:scale-105 active:scale-95 border border-transparent"
                  }`}
                  aria-label={title}
                >
                  <IconComponent className="text-[20px] transition-transform duration-200 group-hover:scale-110" />
                </button>

                {/* Floating Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#1c1c24]/95 backdrop-blur-md border border-[#2c2f32] text-xs font-medium text-white shadow-2xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 z-50 flex items-center gap-2">
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1c1c24] border-l border-b border-[#2c2f32] rotate-45" />
                  <span>{title}</span>
                  {isSoon && (
                    <span className="px-1.5 py-0.5 rounded-md bg-[#2c2f32] text-[10px] text-[#808191] font-semibold uppercase tracking-wider">
                      Soon
                    </span>
                  )}
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1dc071]" />
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom Utility Controls */}
        <div className="flex flex-col items-center gap-2 w-full pt-3">
          {/* Subtle Separator */}
          <div className="w-8 h-[1px] bg-[#2c2f32]/80 mb-1" />

          {/* Sepolia Live Network Pulse Pill */}
          <div className="relative group flex items-center justify-center">
            <div className="w-[42px] h-[42px] rounded-2xl bg-[#13131a] border border-[#2c2f32] group-hover:border-[#1dc071]/40 flex items-center justify-center text-[#1dc071] transition-all duration-300 group-hover:scale-105 cursor-default">
              <FiZap className="text-[17px] group-hover:animate-pulse" />
            </div>

            {/* Network Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#1c1c24]/95 backdrop-blur-md border border-[#2c2f32] text-xs font-medium text-white shadow-2xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 z-50 flex items-center gap-2">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1c1c24] border-l border-b border-[#2c2f32] rotate-45" />
              <span className="w-2 h-2 rounded-full bg-[#1dc071] animate-ping" />
              <span className="font-semibold text-[#1dc071]">Sepolia</span>
              <span className="text-[#808191] text-[11px]">Network Live</span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <div className="relative group flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="w-[42px] h-[42px] rounded-2xl bg-[#13131a] hover:bg-[#252830] text-[#808191] hover:text-[#1dc071] border border-[#2c2f32] hover:border-[#1dc071]/40 transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 hover:shadow-[0_0_12px_rgba(29,192,113,0.2)]"
              aria-label="Toggle theme appearance"
            >
              {isDarkMode ? (
                <FiSun className="text-[18px] transition-transform duration-300 group-hover:rotate-45" />
              ) : (
                <FiMoon className="text-[18px] transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            {/* Theme Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#1c1c24]/95 backdrop-blur-md border border-[#2c2f32] text-xs font-medium text-white shadow-2xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 z-50 flex items-center gap-1.5">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1c1c24] border-l border-b border-[#2c2f32] rotate-45" />
              <span>{isDarkMode ? "Dark Mode (Active)" : "Light Mode"}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiCompass, FiShield, FiZap, FiGlobe } from "react-icons/fi";
import logo from "../assets/crowdsprout_logo.jpg";

interface HeroBannerProps {
  onExploreClick?: () => void;
}

const HeroBanner: FC<HeroBannerProps> = ({ onExploreClick }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1c1c24] via-[#1a2327] to-[#141d1a] border border-[#2c2f32] p-6 sm:p-10 mb-10 shadow-2xl">
      {/* Background ambient glowing orbs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#1dc071]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#8c6dfd]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid subtle texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1dc071_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Text & Actions */}
        <div className="flex-1 flex flex-col items-start max-w-[700px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1dc071]/15 border border-[#1dc071]/30 text-[#4acd8d] text-xs font-semibold tracking-wide uppercase mb-5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#1dc071] animate-ping" />
            <span>Decentralized Crowdfunding on Sepolia</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-4 text-left">
            Plant Web3 Ideas. <br />
            <span className="bg-gradient-to-r from-[#1dc071] via-[#4acd8d] to-[#60a5fa] bg-clip-text text-transparent">
              Sprout Tomorrow.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#9ca3af] text-base sm:text-lg leading-relaxed mb-7 text-left max-w-[620px]">
            CrowdSprout empowers Web3 innovators, open-source builders, and visionaries
            to raise funds transparently. Back projects with ETH directly through audited smart contracts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/create-campaign")}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#1dc071] to-[#10b981] hover:from-[#4acd8d] hover:to-[#059669] text-white font-bold rounded-xl text-sm sm:text-base shadow-[0_0_20px_rgba(29,192,113,0.35)] hover:shadow-[0_0_25px_rgba(29,192,113,0.5)] transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <FiPlus className="w-5 h-5" />
              <span>Plant a Campaign</span>
            </button>

            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#242430] hover:bg-[#2c2c3b] border border-[#3a3a43] hover:border-[#1dc071]/50 text-white font-medium rounded-xl text-sm sm:text-base transition-all cursor-pointer"
            >
              <FiCompass className="w-5 h-5 text-[#1dc071]" />
              <span>Explore Sprouts</span>
            </button>
          </div>

          {/* Micro Trust Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-4 border-t border-[#2c2f32]/80">
            <div className="flex items-center gap-2 text-xs text-[#808191]">
              <FiZap className="w-4 h-4 text-[#1dc071] shrink-0" />
              <span>100% Direct Payout</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#808191]">
              <FiShield className="w-4 h-4 text-[#4acd8d] shrink-0" />
              <span>Non-Custodial Escrow</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#808191]">
              <FiGlobe className="w-4 h-4 text-[#60a5fa] shrink-0" />
              <span>Global Permissionless</span>
            </div>
          </div>
        </div>

        {/* Right Column: Web3 Graphic Card */}
        <div className="relative shrink-0 w-full lg:w-[320px] flex justify-center">
          <div className="relative group p-4 rounded-2xl bg-gradient-to-b from-[#252830] to-[#1c1c24] border border-[#3a3a48] shadow-2xl hover:border-[#1dc071]/50 transition-all duration-300">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1dc071] to-[#8c6dfd] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4 border border-[#1dc071]/40 shadow-[0_0_20px_rgba(29,192,113,0.3)]">
                <img
                  src={logo}
                  alt="CrowdSprout"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1dc071]/15 text-[#4acd8d] text-xs font-semibold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1dc071]" />
                <span>Ecosystem Live</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                CrowdSprout Hub
              </h3>
              <p className="text-xs text-[#808191] max-w-[240px] mb-4">
                Transparent crowdfunding engineered on Ethereum Sepolia testnet.
              </p>

              <div className="w-full bg-[#16171d] rounded-xl p-3 border border-[#2c2f32] flex justify-between items-center text-xs">
                <span className="text-[#808191]">Network</span>
                <span className="text-[#4acd8d] font-mono font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#4acd8d]" />
                  Sepolia Testnet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

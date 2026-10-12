import { type FC, useState } from "react";
import { FiArrowUpRight, FiClock, FiCheckCircle } from "react-icons/fi";
import {
  daysLeft,
  calculateBarPercentage,
  formatEth,
  truncateAddress,
} from "../utils";
import type { Campaign } from "../context";
import { ethers } from "ethers";

interface FundCardProps {
  campaign: Campaign;
  onCardClick?: (campaign: Campaign) => void;
  onDonateClick?: (campaign: Campaign) => void;
}

const FundCard: FC<FundCardProps> = ({
  campaign,
  onCardClick,
  onDonateClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // Time and progress calculations
  const remainingDays = daysLeft(campaign.deadline);
  const isExpired = remainingDays <= 0;

  const targetEthNum = (() => {
    try {
      return parseFloat(ethers.formatEther(campaign.target || 0n));
    } catch {
      return 0;
    }
  })();

  const collectedEthNum = (() => {
    try {
      return parseFloat(ethers.formatEther(campaign.amountCollected || 0n));
    } catch {
      return 0;
    }
  })();

  const percentage = calculateBarPercentage(targetEthNum, collectedEthNum);
  const isFunded = targetEthNum > 0 && collectedEthNum >= targetEthNum;

  // Normalize image URL
  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
    }
    return url;
  };

  const imageUrl = getImageUrl(campaign.image);

  return (
    <div
      onClick={() => onCardClick?.(campaign)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-[#1c1c24] border border-[#2c2f32] hover:border-[#1dc071]/50 shadow-lg hover:shadow-[0_10px_30px_rgba(29,192,113,0.15)] transition-all duration-300 cursor-pointer hover:-translate-y-1.5"
    >
      {/* Top Image Section */}
      <div className="relative w-full h-[185px] overflow-hidden bg-[#13131a]">
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={campaign.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a2327] via-[#1c1c24] to-[#252830] text-[#1dc071] p-4 text-center">
            <span className="text-4xl mb-2">🌱</span>
            <span className="text-xs font-semibold text-[#808191]">
              CrowdSprout Project
            </span>
          </div>
        )}

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c24] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-[#13131a]/85 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-[#4acd8d] flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1dc071]" />
            Web3 Sprout
          </span>

          {isFunded ? (
            <span className="px-2.5 py-1 rounded-full bg-[#1dc071] text-white text-[11px] font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(29,192,113,0.5)]">
              <FiCheckCircle className="w-3 h-3" />
              Goal Reached
            </span>
          ) : isExpired ? (
            <span className="px-2.5 py-1 rounded-full bg-[#ef4444]/80 text-white text-[11px] font-semibold flex items-center gap-1">
              Ended
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
              <FiClock className="w-3 h-3 text-[#1dc071]" />
              {remainingDays}d left
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-5">
        {/* Title */}
        <h3 className="font-bold text-white text-lg leading-snug line-clamp-2 mb-2 group-hover:text-[#4acd8d] transition-colors">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#808191] line-clamp-2 mb-5 leading-relaxed">
          {campaign.description || "No description provided."}
        </p>

        {/* Progress Bar */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-[#808191]">Funding Progress</span>
            <span className="text-[#4acd8d] font-mono font-bold">
              {percentage}%
            </span>
          </div>

          <div className="w-full h-2 bg-[#2c2f32] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1dc071] to-[#4acd8d] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(29,192,113,0.6)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-[#2c2f32] mb-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-[#808191] uppercase">
              Raised
            </span>
            <span className="text-base font-bold text-white font-mono flex items-center gap-1">
              <span className="text-[#1dc071] text-xs">Ξ</span>
              {formatEth(campaign.amountCollected)}
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-[11px] font-medium text-[#808191] uppercase">
              Goal
            </span>
            <span className="text-base font-bold text-gray-300 font-mono flex items-center justify-end gap-1">
              <span className="text-gray-400 text-xs">Ξ</span>
              {formatEth(campaign.target)}
            </span>
          </div>
        </div>

        {/* Creator & Quick Action Footer */}
        <div className="mt-auto flex items-center justify-between pt-1">
          {/* Creator Chip */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1dc071] to-[#60a5fa] p-0.5 shrink-0">
              <div className="w-full h-full rounded-full bg-[#1c1c24] flex items-center justify-center text-[10px] font-bold text-[#4acd8d]">
                🌱
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#808191] leading-none mb-0.5">
                Sprouter
              </span>
              <span className="text-xs font-mono text-gray-300">
                {truncateAddress(campaign.owner)}
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDonateClick?.(campaign);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#252830] hover:bg-[#1dc071] text-xs font-semibold text-white transition-all cursor-pointer group-hover:bg-[#1dc071]"
          >
            <span>Back</span>
            <FiArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundCard;

import { FiCheckCircle, FiClock, FiUsers } from "react-icons/fi";
import { formatEth } from "../../utils";
import type { Campaign, Donator } from "../../context";

interface CampaignHeroProps {
  campaign: Campaign;
  remainingDays: number;
  isExpired: boolean;
  isFunded: boolean;
  percentage: number;
  getImageUrl: (url: string) => string;
  isLoadingDonators: boolean;
  donators: Donator[];
}

export default function CampaignHero({
  campaign,
  remainingDays,
  isExpired,
  isFunded,
  percentage,
  getImageUrl,
  isLoadingDonators,
  donators,
}: CampaignHeroProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-sprout-card border border-sprout-border shadow-2xl">
      {/* Banner Image */}
      <div className="w-full h-80 sm:h-100 relative bg-sprout-dark overflow-hidden">
        <img
          src={getImageUrl(campaign.image)}
          alt={campaign.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/1200x600/1c1c24/1dc071?text=CrowdSprout";
          }}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-sprout-card via-transparent to-black/40" />

        {/* Badges on Top */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3.5 py-1.5 rounded-full bg-sprout-dark/85 backdrop-blur-md border border-white/10 text-xs font-semibold text-sprout-mint flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-sprout-green animate-pulse" />
            🌱 Sepolia Testnet
          </span>

          {isFunded ? (
            <span className="px-3.5 py-1.5 rounded-full bg-sprout-green text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(29,192,113,0.5)]">
              <FiCheckCircle className="w-3.5 h-3.5" />
              Goal Reached
            </span>
          ) : isExpired ? (
            <span className="px-3.5 py-1.5 rounded-full bg-red-500/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
              Campaign Ended
            </span>
          ) : (
            <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 text-sprout-green" />
              {remainingDays} Days Left
            </span>
          )}
        </div>
      </div>

      {/* Campaign Header Info */}
      <div className="p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
          {campaign.title}
        </h1>

        {/* Stat Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#16171d] border border-sprout-border mb-6">
          <div>
            <span className="text-[11px] text-sprout-muted uppercase font-semibold block mb-1">
              Raised
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-1">
              <span className="text-sprout-green">Ξ</span>
              {formatEth(campaign.amountCollected)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-sprout-muted uppercase font-semibold block mb-1">
              Target Goal
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-gray-300 flex items-center gap-1">
              <span className="text-gray-400">Ξ</span>
              {formatEth(campaign.target)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-sprout-muted uppercase font-semibold block mb-1">
              Progress
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-sprout-mint">
              {percentage}%
            </span>
          </div>

          <div>
            <span className="text-[11px] text-sprout-muted uppercase font-semibold block mb-1">
              Backers
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-1">
              <FiUsers className="w-4 h-4 text-sprout-muted" />
              {isLoadingDonators ? "..." : donators.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="w-full h-3 bg-sprout-dark rounded-full overflow-hidden p-0.5 border border-sprout-border">
            <div
              className="h-full bg-linear-to-r from-sprout-green to-sprout-mint rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(29,192,113,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

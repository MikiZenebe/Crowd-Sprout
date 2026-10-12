import { type FC, useState } from "react";
import { FiLayers, FiTarget, FiTrendingUp, FiClock } from "react-icons/fi";
import { formatEth } from "../utils";
import type { Campaign } from "../context";

interface StatsBarProps {
  campaigns: Campaign[];
  isLoading: boolean;
}

const StatsBar: FC<StatsBarProps> = ({ campaigns, isLoading }) => {
  const [now] = useState(() => Date.now());

  // Aggregate stats
  const totalCampaigns = campaigns.length;

  const totalTargetWei = campaigns.reduce(
    (acc, c) => acc + (c.target || 0n),
    0n,
  );

  const totalCollectedWei = campaigns.reduce(
    (acc, c) => acc + (c.amountCollected || 0n),
    0n,
  );

  const activeCampaigns = campaigns.filter((c) => {
    const deadlineMs =
      Number(c.deadline) < 10000000000
        ? Number(c.deadline) * 1000
        : Number(c.deadline);
    return deadlineMs > now;
  }).length;

  const stats = [
    {
      title: "All Sprouts",
      value: isLoading ? "-" : totalCampaigns.toString(),
      subtext: "Total campaigns launched",
      icon: FiLayers,
      color: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-[#1dc071]",
      borderColor: "hover:border-[#1dc071]/40",
    },
    {
      title: "Active Campaigns",
      value: isLoading ? "-" : activeCampaigns.toString(),
      subtext: "Currently accepting funds",
      icon: FiClock,
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-[#38bdf8]",
      borderColor: "hover:border-[#38bdf8]/40",
    },
    {
      title: "Total Raised",
      value: isLoading ? "-" : `${formatEth(totalCollectedWei)} ETH`,
      subtext: "Contributed by backers",
      icon: FiTrendingUp,
      color: "from-green-500/20 to-green-500/5",
      iconColor: "text-[#4acd8d]",
      borderColor: "hover:border-[#4acd8d]/40",
    },
    {
      title: "Total Goal Value",
      value: isLoading ? "-" : `${formatEth(totalTargetWei)} ETH`,
      subtext: "Target funding sought",
      icon: FiTarget,
      color: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-[#8c6dfd]",
      borderColor: "hover:border-[#8c6dfd]/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 w-full">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden rounded-2xl bg-[#1c1c24] border border-[#2c2f32] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${stat.borderColor} shadow-lg`}
        >
          {/* Subtle gradient accent background */}
          <div
            className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} blur-xl pointer-events-none`}
          />

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-medium text-[#808191] uppercase tracking-wider">
              {stat.title}
            </span>
            <div
              className={`w-9 h-9 rounded-xl bg-[#252830] flex items-center justify-center ${stat.iconColor}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
              {stat.value}
            </span>
            <span className="text-[11px] sm:text-xs text-[#6b7280] mt-1">
              {stat.subtext}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;

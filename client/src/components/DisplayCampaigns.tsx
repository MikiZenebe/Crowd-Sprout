import { type FC, useState, useMemo } from "react";
import { FiSearch, FiRefreshCw, FiPlus, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import FundCard from "./FundCard";
import type { Campaign } from "../context";
import { daysLeft } from "../utils";

interface DisplayCampaignsProps {
  title: string;
  isLoading: boolean;
  campaigns: Campaign[];
  error: string | null;
  onRefresh?: () => void;
  onCardClick?: (campaign: Campaign) => void;
  onDonateClick?: (campaign: Campaign) => void;
}

type FilterType = "all" | "active" | "funded" | "ending";
type SortType = "newest" | "target-desc" | "target-asc" | "funded-desc";

const DisplayCampaigns: FC<DisplayCampaignsProps> = ({
  title,
  isLoading,
  campaigns,
  error,
  onRefresh,
  onCardClick,
  onDonateClick,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");

  // Filter and sort logic
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((campaign) => {
        // Search filter
        const matchesSearch =
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          campaign.owner.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Category filter
        const daysRemaining = daysLeft(campaign.deadline);
        const isExpired = daysRemaining <= 0;
        const isFunded =
          campaign.target > 0n && campaign.amountCollected >= campaign.target;

        if (activeFilter === "active") return !isExpired;
        if (activeFilter === "funded") return isFunded;
        if (activeFilter === "ending") return !isExpired && daysRemaining <= 7;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "target-desc") {
          return b.target > a.target ? 1 : -1;
        }
        if (sortBy === "target-asc") {
          return a.target > b.target ? 1 : -1;
        }
        if (sortBy === "funded-desc") {
          return b.amountCollected > a.amountCollected ? 1 : -1;
        }
        // default newest (by index descending)
        return (b.pId ?? 0) - (a.pId ?? 0);
      });
  }, [campaigns, searchQuery, activeFilter, sortBy]);

  return (
    <div id="campaigns-section" className="w-full flex flex-col mb-16">
      {/* Top Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
            <span className="px-3 py-0.5 rounded-full bg-[#1dc071]/15 text-[#4acd8d] text-xs font-mono font-bold border border-[#1dc071]/30">
              {isLoading ? "..." : filteredCampaigns.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#808191] mt-1">
            Discover verified initiatives ready to sprout on Ethereum
          </p>
        </div>

        {/* Controls: Search, Filter Tabs, Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick in-section search */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full h-10 bg-[#1c1c24] border border-[#2c2f32] focus:border-[#1dc071] rounded-xl pl-9 pr-3 text-xs text-white placeholder-[#6b7280] outline-none transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808191] w-3.5 h-3.5" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="h-10 bg-[#1c1c24] border border-[#2c2f32] hover:border-[#3a3a43] focus:border-[#1dc071] text-xs text-gray-300 rounded-xl px-3 outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="funded-desc">Most Funded</option>
              <option value="target-desc">Highest Goal</option>
              <option value="target-asc">Lowest Goal</option>
            </select>
          </div>

          {/* Refresh button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh Campaigns"
              disabled={isLoading}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#1c1c24] border border-[#2c2f32] hover:border-[#1dc071] text-gray-400 hover:text-[#1dc071] transition-all cursor-pointer disabled:opacity-50"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === "all"
              ? "bg-[#1dc071] text-white shadow-[0_0_12px_rgba(29,192,113,0.35)]"
              : "bg-[#1c1c24] text-[#808191] hover:text-white border border-[#2c2f32]"
          }`}
        >
          All Projects
        </button>
        <button
          onClick={() => setActiveFilter("active")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === "active"
              ? "bg-[#1dc071] text-white shadow-[0_0_12px_rgba(29,192,113,0.35)]"
              : "bg-[#1c1c24] text-[#808191] hover:text-white border border-[#2c2f32]"
          }`}
        >
          🌱 Active Sprouts
        </button>
        <button
          onClick={() => setActiveFilter("funded")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === "funded"
              ? "bg-[#1dc071] text-white shadow-[0_0_12px_rgba(29,192,113,0.35)]"
              : "bg-[#1c1c24] text-[#808191] hover:text-white border border-[#2c2f32]"
          }`}
        >
          🎯 Goal Reached
        </button>
        <button
          onClick={() => setActiveFilter("ending")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === "ending"
              ? "bg-[#1dc071] text-white shadow-[0_0_12px_rgba(29,192,113,0.35)]"
              : "bg-[#1c1c24] text-[#808191] hover:text-white border border-[#2c2f32]"
          }`}
        >
          ⌛ Ending Soon
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-white flex items-center gap-3 mb-6">
          <FiAlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-xs sm:text-sm text-red-300">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((skeleton) => (
            <div
              key={skeleton}
              className="rounded-[20px] bg-[#1c1c24] border border-[#2c2f32] overflow-hidden flex flex-col p-4 animate-pulse"
            >
              <div className="w-full h-44 rounded-xl bg-[#252830] mb-4" />
              <div className="w-3/4 h-5 bg-[#252830] rounded-md mb-2" />
              <div className="w-full h-3 bg-[#252830] rounded-md mb-2" />
              <div className="w-2/3 h-3 bg-[#252830] rounded-md mb-4" />
              <div className="w-full h-2 bg-[#252830] rounded-full mb-4" />
              <div className="flex justify-between items-center pt-2 border-t border-[#2c2f32]">
                <div className="w-24 h-6 bg-[#252830] rounded-md" />
                <div className="w-16 h-6 bg-[#252830] rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCampaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-[24px] bg-[#1c1c24]/50 border border-[#2c2f32] text-center my-4">
          <div className="w-20 h-20 rounded-2xl bg-[#1dc071]/10 border border-[#1dc071]/20 flex items-center justify-center text-4xl mb-4 shadow-[0_0_20px_rgba(29,192,113,0.15)]">
            🌱
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No Campaigns Found
          </h3>
          <p className="text-sm text-[#808191] max-w-[420px] mb-6">
            {searchQuery
              ? `No campaigns match "${searchQuery}". Try a different keyword or reset filters.`
              : "No active campaigns currently match the selected filter. Be the first innovator to plant a campaign!"}
          </p>

          <div className="flex items-center gap-3">
            {searchQuery || activeFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="px-5 py-2.5 rounded-xl bg-[#252830] hover:bg-[#323640] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            ) : null}

            <button
              onClick={() => navigate("/create-campaign")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1dc071] hover:bg-[#4acd8d] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(29,192,113,0.3)] cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              Plant a Campaign
            </button>
          </div>
        </div>
      )}

      {/* Campaigns Grid */}
      {!isLoading && filteredCampaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <FundCard
              key={`${campaign.owner}-${campaign.pId ?? campaign.title}`}
              campaign={campaign}
              onCardClick={onCardClick}
              onDonateClick={onDonateClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayCampaigns;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiPlus,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiShare2,
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiLayers,
} from "react-icons/fi";
import { calculateBarPercentage, formatEth, truncateAddress } from "../utils";

// Static mock data representation matching your smart contract's Campaign structure
export interface StaticCampaignItem {
  pId: number;
  owner: string;
  title: string;
  description: string;
  target: bigint;
  deadline: bigint;
  amountCollected: bigint;
  image: string;
  category: string;
  backersCount: number;
}

const STATIC_USER_ADDRESS = "0x71C8F61e4b9B500C1258F5B12e9b0151f15cA123";

const STATIC_MY_CAMPAIGNS: StaticCampaignItem[] = [
  {
    pId: 0,
    owner: STATIC_USER_ADDRESS,
    title: "EcoSprout: Automated Urban Hydroponic Rigs",
    description:
      "Developing open-source, IoT-monitored vertical farming units for urban rooftops with zero pesticide footprint and 90% water recycling.",
    target: 2500000000000000000n, // 2.5 ETH
    deadline: BigInt(Math.floor(Date.now() / 1000) + 18 * 86400), // 18 days left
    amountCollected: 1850000000000000000n, // 1.85 ETH (74%)
    image:
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80",
    category: "Green Tech",
    backersCount: 19,
  },
  {
    pId: 1,
    owner: STATIC_USER_ADDRESS,
    title: "SolSolar: Decentralized Community Microgrid",
    description:
      "Tokenized community solar arrays providing clean renewable electricity to off-grid rural clinics across developing regions.",
    target: 4000000000000000000n, // 4.0 ETH
    deadline: BigInt(Math.floor(Date.now() / 1000) + 32 * 86400), // 32 days left
    amountCollected: 4200000000000000000n, // 4.2 ETH (105% - Goal Reached)
    image:
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    category: "Clean Energy",
    backersCount: 44,
  },
  {
    pId: 2,
    owner: STATIC_USER_ADDRESS,
    title: "OceanClean Autonomous Drone Mesh",
    description:
      "Solar-powered aquatic surface vessels designed to intercept microplastics in coastal river mouths before reaching open sea.",
    target: 1500000000000000000n, // 1.5 ETH
    deadline: BigInt(Math.floor(Date.now() / 1000) + 8 * 86400), // 8 days left
    amountCollected: 650000000000000000n, // 0.65 ETH (43%)
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    category: "Ecology",
    backersCount: 11,
  },
];

type FilterTab = "all" | "active" | "funded";

export default function Profile() {
  const navigate = useNavigate();

  const [campaigns] = useState<StaticCampaignItem[]>(STATIC_MY_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [now] = useState(() => Date.now());

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(STATIC_USER_ADDRESS);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Analytics calculations
  const totalCreated = campaigns.length;

  const totalCollectedEth = campaigns.reduce((acc, c) => {
    return acc + Number(c.amountCollected) / 1e18;
  }, 0);

  const totalTargetEth = campaigns.reduce((acc, c) => {
    return acc + Number(c.target) / 1e18;
  }, 0);

  const totalBackers = campaigns.reduce((acc, c) => acc + c.backersCount, 0);

  const overallProgress =
    totalTargetEth > 0
      ? Math.round((totalCollectedEth / totalTargetEth) * 100)
      : 0;

  // Filter campaigns
  const nowSec = Math.floor(now / 1000);
  const filteredCampaigns = campaigns.filter((c) => {
    const isFunded = c.amountCollected >= c.target;
    const isExpired = Number(c.deadline) <= nowSec;

    if (activeTab === "active") return !isExpired && !isFunded;
    if (activeTab === "funded") return isFunded;
    return true;
  });

  return (
    <div className="flex flex-col w-full text-white pb-16 max-w-295 mx-auto animate-fadeIn">
      {/* Profile Header Hero Island */}
      <div className="relative rounded-[28px] bg-linear-to-br from-sprout-card via-[#181822] to-sprout-dark border border-sprout-border p-6 sm:p-8 shadow-2xl overflow-hidden mb-8">
        {/* Ambient background glow accents */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-sprout-green/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#3b82f6]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Identity */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Glowing Avatar */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-linear-to-tr from-sprout-green via-[#10b981] to-[#3b82f6] p-0.75 shadow-[0_0_25px_rgba(29,192,113,0.3)] shrink-0">
              <div className="w-full h-full rounded-[21px] bg-sprout-card flex items-center justify-center text-4xl">
                🌱
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sprout-green border-2 border-sprout-dark flex items-center justify-center text-[10px] shadow-sm"
                title="Active on Sepolia"
              >
                ✓
              </span>
            </div>

            {/* User Meta */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Creator Portfolio
                </h1>
                <span className="px-3 py-1 rounded-full bg-sprout-green/15 text-sprout-mint text-xs font-semibold border border-sprout-green/30">
                  Verified Sprouter
                </span>
              </div>

              <p className="text-xs sm:text-sm text-sprout-muted mt-1 mb-3">
                Manage, monitor, and track your decentralized crowdfunding
                campaigns on Ethereum
              </p>

              {/* Address with Copy & Etherscan */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sprout-dark border border-sprout-border">
                  <span className="w-2 h-2 rounded-full bg-sprout-green animate-pulse" />
                  <span className="text-xs font-mono text-gray-300">
                    {truncateAddress(STATIC_USER_ADDRESS)}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    title="Copy wallet address"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer ml-1"
                  >
                    {copiedAddress ? (
                      <FiCheck className="w-3.5 h-3.5 text-sprout-green" />
                    ) : (
                      <FiCopy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <a
                  href={`https://sepolia.etherscan.io/address/${STATIC_USER_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View on Sepolia Etherscan"
                  className="p-2 rounded-xl bg-sprout-dark border border-sprout-border hover:border-sprout-green text-gray-400 hover:text-sprout-green transition-all cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Etherscan</span>
                </a>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            <button
              onClick={handleCopyProfileLink}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sprout-card hover:bg-[#252830] text-gray-300 hover:text-white border border-sprout-border hover:border-sprout-green/50 text-xs font-semibold transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <FiCheck className="w-4 h-4 text-sprout-green" />
                  <span className="text-sprout-green">Copied Link!</span>
                </>
              ) : (
                <>
                  <FiShare2 className="w-4 h-4" />
                  <span>Share Profile</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/create-campaign")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-sprout-green to-[#10b981] hover:from-sprout-mint hover:to-[#059669] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(29,192,113,0.35)] cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Plant New Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics KPI Metric Island */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* KPI 1: Total Raised */}
        <div className="p-5 rounded-2xl bg-sprout-card border border-sprout-border hover:border-sprout-green/40 transition-all group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sprout-muted">
              Total Raised
            </span>
            <div className="w-8 h-8 rounded-xl bg-sprout-green/15 text-sprout-green flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              <FiTrendingUp />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-1.5">
            <span className="text-sprout-green text-xl">Ξ</span>
            {totalCollectedEth.toFixed(2)}
          </div>
          <span className="text-[11px] text-sprout-muted mt-1 block">
            Across all your launched sprouts
          </span>
        </div>

        {/* KPI 2: Total Campaigns */}
        <div className="p-5 rounded-2xl bg-sprout-card border border-sprout-border hover:border-sprout-green/40 transition-all group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sprout-muted">
              Campaigns
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#60a5fa]/15 text-[#60a5fa] flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              <FiLayers />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {totalCreated}
          </div>
          <span className="text-[11px] text-sprout-muted mt-1 block">
            {campaigns.filter((c) => c.amountCollected >= c.target).length}{" "}
            funded successfully
          </span>
        </div>

        {/* KPI 3: Total Backers */}
        <div className="p-5 rounded-2xl bg-sprout-card border border-sprout-border hover:border-sprout-green/40 transition-all group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sprout-muted">
              Total Backers
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#a855f7]/15 text-[#a855f7] flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              <FiUsers />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {totalBackers}
          </div>
          <span className="text-[11px] text-sprout-muted mt-1 block">
            Community contributions received
          </span>
        </div>

        {/* KPI 4: Overall Progress */}
        <div className="p-5 rounded-2xl bg-sprout-card border border-sprout-border hover:border-sprout-green/40 transition-all group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sprout-muted">
              Avg. Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#f59e0b]/15 text-[#f59e0b] flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              <FiAward />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sprout-mint font-mono">
            {overallProgress}%
          </div>
          <span className="text-[11px] text-sprout-muted mt-1 block">
            Aggregate funding completion rate
          </span>
        </div>
      </div>

      {/* Campaigns Explorer Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>My Created Campaigns</span>
            <span className="px-2.5 py-0.5 rounded-full bg-sprout-green/15 text-sprout-mint text-xs font-mono font-bold border border-sprout-green/30">
              {filteredCampaigns.length}
            </span>
          </h2>
          <p className="text-xs text-sprout-muted mt-0.5">
            Manage your initiatives and track funding milestones
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-sprout-green text-white shadow-[0_0_12px_rgba(29,192,113,0.35)]"
                : "bg-sprout-card text-sprout-muted hover:text-white border border-sprout-border"
            }`}
          >
            All ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "active"
                ? "bg-sprout-green text-white shadow-[0_0_12px_rgba(29,192,113,0.35)]"
                : "bg-sprout-card text-sprout-muted hover:text-white border border-sprout-border"
            }`}
          >
            Active (
            {campaigns.filter((c) => c.amountCollected < c.target).length})
          </button>
          <button
            onClick={() => setActiveTab("funded")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "funded"
                ? "bg-sprout-green text-white shadow-[0_0_12px_rgba(29,192,113,0.35)]"
                : "bg-sprout-card text-sprout-muted hover:text-white border border-sprout-border"
            }`}
          >
            Funded (
            {campaigns.filter((c) => c.amountCollected >= c.target).length})
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-sprout-card/50 border border-sprout-border text-center my-4">
          <div className="w-16 h-16 rounded-2xl bg-sprout-green/10 flex items-center justify-center text-3xl mb-4">
            🌱
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            No Campaigns in this Category
          </h3>
          <p className="text-xs text-sprout-muted max-w-90 mb-6">
            You don't have any campaigns matching the "{activeTab}" filter.
          </p>
          <button
            onClick={() => setActiveTab("all")}
            className="px-4 py-2 rounded-xl bg-[#252830] hover:bg-[#323640] text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((item) => {
            const targetEthNum = Number(item.target) / 1e18;
            const collectedEthNum = Number(item.amountCollected) / 1e18;
            const pct = calculateBarPercentage(targetEthNum, collectedEthNum);
            const isFunded = collectedEthNum >= targetEthNum;
            const daysRemaining = Math.max(
              0,
              Math.ceil(
                (Number(item.deadline) * 1000 - now) / (1000 * 86400),
              ),
            );

            return (
              <div
                key={item.pId}
                onClick={() =>
                  navigate(`/campaign-details/${item.pId}`, {
                    state: {
                      pId: item.pId,
                      owner: item.owner,
                      title: item.title,
                      description: item.description,
                      target: item.target,
                      deadline: item.deadline,
                      amountCollected: item.amountCollected,
                      image: item.image,
                    },
                  })
                }
                className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] bg-sprout-card border border-sprout-border hover:border-sprout-green/50 shadow-lg hover:shadow-[0_12px_32px_rgba(29,192,113,0.15)] transition-all duration-300 cursor-pointer hover:-translate-y-1.5"
              >
                {/* Media Banner */}
                <div className="relative w-full h-47.5 overflow-hidden bg-sprout-dark">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400/1c1c24/1dc071?text=CrowdSprout";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-sprout-card via-transparent to-black/30 pointer-events-none" />

                  {/* Badges on Banner */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-sprout-dark/85 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-sprout-mint shadow-sm">
                      {item.category}
                    </span>

                    {isFunded ? (
                      <span className="px-2.5 py-1 rounded-full bg-sprout-green text-white text-[11px] font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(29,192,113,0.4)]">
                        <FiCheckCircle className="w-3 h-3" />
                        Goal Reached
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
                        <FiClock className="w-3 h-3 text-sprout-green" />
                        {daysRemaining}d left
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex-1 flex flex-col p-5">
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-2 group-hover:text-sprout-mint transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-sprout-muted line-clamp-2 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full mb-4">
                    <div className="flex items-center justify-between text-xs mb-1 font-medium">
                      <span className="text-sprout-muted">Progress</span>
                      <span className="text-sprout-mint font-mono font-bold">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-sprout-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-sprout-green to-sprout-mint rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(29,192,113,0.6)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-sprout-border mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-sprout-muted uppercase">
                        Raised
                      </span>
                      <span className="text-sm font-bold text-white font-mono flex items-center gap-1">
                        <span className="text-sprout-green text-xs">Ξ</span>
                        {formatEth(item.amountCollected)}
                      </span>
                    </div>

                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-medium text-sprout-muted uppercase">
                        Target
                      </span>
                      <span className="text-sm font-bold text-gray-300 font-mono flex items-center justify-end gap-1">
                        <span className="text-gray-400 text-xs">Ξ</span>
                        {formatEth(item.target)}
                      </span>
                    </div>
                  </div>

                  {/* Footer Meta & Button */}
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-sprout-muted">
                      <FiUsers className="w-3.5 h-3.5 text-sprout-green" />
                      <span>{item.backersCount} Backers</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/campaign-details/${item.pId}`, {
                          state: {
                            pId: item.pId,
                            owner: item.owner,
                            title: item.title,
                            description: item.description,
                            target: item.target,
                            deadline: item.deadline,
                            amountCollected: item.amountCollected,
                            image: item.image,
                          },
                        });
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#252830] group-hover:bg-sprout-green text-xs font-semibold text-white transition-all cursor-pointer"
                    >
                      <span>Manage</span>
                      <FiArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

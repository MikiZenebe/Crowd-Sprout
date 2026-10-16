import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  FiArrowLeft,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiTrendingUp,
  FiShield,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiShare2,
} from "react-icons/fi";
import { useCampaign, type Campaign } from "../context";
import {
  daysLeft,
  calculateBarPercentage,
  formatEth,
  truncateAddress,
} from "../utils";

interface DonatorItem {
  donator: string;
  donation: string;
}

const PRESET_AMOUNTS = ["0.01", "0.05", "0.1", "0.5"];

const CampaignDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address } = useCampaign();

  // Campaign state: prioritize location.state, fallback to fetching by id
  const [campaign] = useState<Campaign | null>(
    (location.state as Campaign) || null,
  );
  const [isLoading] = useState(!campaign);
  const [donators] = useState<DonatorItem[]>([]);
  const [isLoadingDonators] = useState(false);

  // Donation form state
  const [donationAmount, setDonationAmount] = useState<string>("0.05");
  const [isDonating] = useState(false);
  const [txHash] = useState<string | null>(null);
  const [donationError] = useState<string | null>(null);

  // Copy address state
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Calculations
  const remainingDays = campaign ? daysLeft(campaign.deadline) : 0;
  const isExpired = remainingDays <= 0;

  const targetEthNum = (() => {
    try {
      return parseFloat(ethers.formatEther(campaign?.target || 0n));
    } catch {
      return 0;
    }
  })();

  const collectedEthNum = (() => {
    try {
      return parseFloat(ethers.formatEther(campaign?.amountCollected || 0n));
    } catch {
      return 0;
    }
  })();

  const percentage = calculateBarPercentage(targetEthNum, collectedEthNum);
  const isFunded = targetEthNum > 0 && collectedEthNum >= targetEthNum;

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
    }
    return url;
  };

  const handleCopyOwner = () => {
    if (campaign?.owner) {
      navigator.clipboard.writeText(campaign.owner);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col w-full text-white py-8 max-w-275 mx-auto animate-pulse">
        <div className="h-8 w-48 bg-sprout-card rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-90 bg-sprout-card rounded-3xl" />
            <div className="h-10 bg-sprout-card rounded-xl w-3/4" />
            <div className="h-28 bg-sprout-card rounded-2xl" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-115 bg-sprout-card rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center p-12 sm:p-20 rounded-3xl bg-sprout-card border border-sprout-border text-center my-10 max-w-162.5 mx-auto">
        <div className="w-20 h-20 rounded-2xl bg-sprout-green/10 border border-sprout-green/20 flex items-center justify-center text-4xl mb-4">
          🌱
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Campaign Not Found
        </h3>
        <p className="text-sm text-sprout-muted max-w-105 mb-8">
          The campaign you are looking for does not exist on the Sepolia smart
          contract or may have been removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sprout-green hover:bg-sprout-mint text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(29,192,113,0.3)] cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to All Campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full text-white pb-16 max-w-285 mx-auto">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between gap-4 py-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sprout-card border border-sprout-border hover:border-sprout-green text-gray-300 hover:text-white transition-all text-xs font-semibold cursor-pointer group"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Campaigns</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sprout-card border border-sprout-border hover:border-sprout-green text-gray-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
            title="Share Campaign Link"
          >
            {shared ? (
              <>
                <FiCheck className="w-3.5 h-3.5 text-sprout-green" />
                <span className="text-sprout-green">Copied Link!</span>
              </>
            ) : (
              <>
                <FiShare2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Story & Media, Right Donation Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Media, Stats, Creator & Details */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Campaign Hero Card */}
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

          {/* Creator Information Card */}
          <div className="rounded-3xl bg-sprout-card border border-sprout-border p-6 sm:p-8 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sprout-muted mb-4">
              Campaign Creator & Verification
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#16171d] border border-sprout-border">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-sprout-green to-[#3b82f6] p-0.5 shrink-0">
                  <div className="w-full h-full rounded-2xl bg-sprout-card flex items-center justify-center text-xl">
                    🌱
                  </div>
                </div>

                <div className="min-w-0">
                  <span className="text-xs text-sprout-muted block">
                    Beneficiary Wallet Address
                  </span>
                  <span className="text-sm font-mono text-white font-medium break-all sm:break-normal">
                    {campaign.owner}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={handleCopyOwner}
                  title="Copy Creator Address"
                  className="p-2.5 rounded-xl bg-[#252830] hover:bg-[#323640] text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                >
                  {copied ? (
                    <>
                      <FiCheck className="w-4 h-4 text-sprout-green" />
                      <span className="text-sprout-green">Copied</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://sepolia.etherscan.io/address/${campaign.owner}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View on Etherscan"
                  className="p-2.5 rounded-xl bg-[#252830] hover:bg-[#323640] text-gray-300 hover:text-sprout-green transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                >
                  <FiExternalLink className="w-4 h-4" />
                  <span>Etherscan</span>
                </a>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-sprout-muted">
              <FiShield className="w-4 h-4 text-sprout-green shrink-0" />
              <span>
                Smart contract guarantees direct payout: 100% of all
                contributions flow immediately to this address on Sepolia.
              </span>
            </div>
          </div>

          {/* Project Story / Description */}
          <div className="rounded-3xl bg-sprout-card border border-sprout-border p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>About this Sprout</span>
            </h3>

            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line bg-[#16171d] p-6 rounded-2xl border border-sprout-border">
              {campaign.description ||
                "No description provided for this project."}
            </div>
          </div>

          {/* Donators / Backers List Card */}
          <div className="rounded-3xl bg-sprout-card border border-sprout-border p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiUsers className="text-sprout-green" />
                  <span>Sprout Backers</span>
                </h3>
                <p className="text-xs text-sprout-muted mt-0.5">
                  Supporters who have pledged funds to this campaign
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-sprout-green/15 text-sprout-mint text-xs font-mono font-bold border border-sprout-green/30">
                {donators.length} {donators.length === 1 ? "Backer" : "Backers"}
              </span>
            </div>

            {isLoadingDonators ? (
              <div className="py-8 text-center text-sm text-sprout-muted">
                Loading donators from blockchain...
              </div>
            ) : donators.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#16171d] border border-sprout-border text-center">
                <div className="text-3xl mb-2">🌱</div>
                <h4 className="text-white font-bold text-sm mb-1">
                  No Backers Yet
                </h4>
                <p className="text-xs text-sprout-muted max-w-sm mx-auto">
                  Be the very first backer to support this sprout and help bring
                  this vision to life!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-90 overflow-y-auto pr-1">
                {donators.map((d, index) => (
                  <div
                    key={`${d.donator}-${index}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#16171d] border border-sprout-border hover:border-sprout-green/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#252830] text-gray-400 text-xs font-mono font-bold flex items-center justify-center">
                        #{index + 1}
                      </span>
                      <div>
                        <span className="text-xs font-mono text-gray-200 block">
                          {truncateAddress(d.donator)}
                        </span>
                        <a
                          href={`https://sepolia.etherscan.io/address/${d.donator}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                        >
                          View on Etherscan
                          <FiExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-sprout-mint">
                        Ξ {d.donation} ETH
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Backing & Contribution Widget */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 rounded-3xl bg-linear-to-b from-sprout-card via-[#1a2327] to-[#16171d] border border-sprout-green/35 p-6 sm:p-7 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-sprout-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sprout-green/20 flex items-center justify-center text-sprout-green">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Back This Sprout
                  </h3>
                  <p className="text-[11px] text-sprout-muted">
                    Pledge funds to support the project
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-sprout-mint bg-sprout-green/10 px-2.5 py-1 rounded-full border border-sprout-green/20">
                <FiShield className="w-3 h-3" />
                <span>On-Chain</span>
              </div>
            </div>

            {/* Success Banner */}
            {txHash && (
              <div className="mb-5 p-4 rounded-2xl bg-sprout-green/15 border border-sprout-green/40 flex flex-col gap-2 animate-fadeIn">
                <span className="text-xs font-bold text-sprout-mint flex items-center gap-1.5">
                  <FiCheck className="w-4 h-4 shrink-0" />
                  Donation Confirmed Successfully!
                </span>
                <p className="text-xs text-gray-300">
                  Thank you for backing this sprout! Your pledge is now recorded
                  on the blockchain.
                </p>
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1 break-all pt-1"
                >
                  View on Sepolia Etherscan: {txHash.substring(0, 16)}...
                  <FiExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}

            {/* Error Banner */}
            {donationError && (
              <div className="mb-5 p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-start gap-2 animate-fadeIn">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span className="leading-relaxed">{donationError}</span>
              </div>
            )}

            {/* Preset Amount Pills */}
            <div className="mb-4">
              <span className="text-xs font-medium text-sprout-muted block mb-2">
                Select Pledge Amount
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDonationAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                      donationAmount === amt
                        ? "bg-sprout-green text-white shadow-[0_0_12px_rgba(29,192,113,0.4)]"
                        : "bg-[#16171d] hover:bg-[#252830] text-gray-300 border border-sprout-border"
                    }`}
                  >
                    {amt} ETH
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="mb-5">
              <label className="text-xs font-medium text-sprout-muted block mb-1.5">
                Or Enter Custom ETH Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="0.05"
                  className="w-full h-13 bg-sprout-dark border border-sprout-border focus:border-sprout-green rounded-xl px-4 pr-16 text-white font-mono text-base outline-none transition-all shadow-inner"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-sprout-muted font-mono">
                  ETH
                </span>
              </div>
            </div>

            {/* Wallet Status Notice */}
            <div className="p-3 rounded-xl bg-[#16171d] border border-sprout-border mb-5 flex items-center justify-between text-xs">
              <span className="text-sprout-muted">Connected Account:</span>
              <span className="font-mono text-gray-200 font-semibold">
                {address ? truncateAddress(address) : "Not Connected"}
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              // onClick={handleDonate}
              disabled={isDonating || isExpired}
              className={`w-full h-13 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(29,192,113,0.35)] disabled:opacity-50 disabled:cursor-not-allowed ${
                isExpired
                  ? "bg-[#252830] text-sprout-muted"
                  : "bg-linear-to-r from-sprout-green to-[#10b981] hover:from-sprout-mint hover:to-[#059669] text-white"
              }`}
            >
              {isDonating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Confirming on MetaMask...</span>
                </>
              ) : isExpired ? (
                <span>Campaign Expired</span>
              ) : !address ? (
                <span>Connect Wallet to Back</span>
              ) : (
                <span>Back Campaign with {donationAmount || "0"} ETH</span>
              )}
            </button>

            {/* Guarantees Box */}
            <div className="mt-5 pt-4 border-t border-sprout-border/80 space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-sprout-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-sprout-green" />
                <span>Zero platform commission fee on pledges</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-sprout-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-sprout-green" />
                <span>Immediate on-chain recipient settlement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;

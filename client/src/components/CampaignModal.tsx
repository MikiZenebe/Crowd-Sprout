import { type FC, useState } from "react";
import {
  FiX,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiTrendingUp,
  FiShield,
} from "react-icons/fi";
import { type Campaign } from "../context";
import {
  daysLeft,
  calculateBarPercentage,
  formatEth,
  truncateAddress,
} from "../utils";
import { ethers } from "ethers";

interface CampaignModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessDonation?: () => void;
}

const PRESET_AMOUNTS = ["0.01", "0.05", "0.1", "0.5"];

const CampaignModal: FC<CampaignModalProps> = ({
  campaign,
  isOpen,
  onClose,
}) => {
  const [donationAmount, setDonationAmount] = useState<string>("0.05");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !campaign) return null;

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

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
    }
    return url;
  };

  const handleCopy = () => {
    if (campaign.owner) {
      navigator.clipboard.writeText(campaign.owner);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDonate = async () => {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[850px] bg-[#1c1c24] border border-[#2c2f32] rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto text-white">
        {/* Modal Header Bar with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2f32] bg-[#16171d]/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dc071] animate-pulse" />
            <span className="text-xs font-semibold text-[#4acd8d] uppercase tracking-wider">
              Sprout Details & Backing
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#252830] hover:bg-[#323640] text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-7">
          {/* Top Hero Media & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Image */}
            <div className="md:col-span-6 rounded-2xl overflow-hidden bg-[#13131a] border border-[#2c2f32] h-[240px] relative">
              <img
                src={getImageUrl(campaign.image)}
                alt={campaign.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400/1c1c24/1dc071?text=CrowdSprout";
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-semibold text-[#4acd8d]">
                🌱 Sepolia Testnet
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white leading-tight mb-3">
                  {campaign.title}
                </h2>

                {/* Creator info */}
                <div className="flex items-center gap-2 py-2 px-3 bg-[#16171d] rounded-xl border border-[#2c2f32] mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#1dc071]/20 flex items-center justify-center text-xs">
                    🌱
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#808191] block">
                      Creator Address
                    </span>
                    <span className="text-xs font-mono text-gray-200">
                      {truncateAddress(campaign.owner)}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    title="Copy address"
                    className="p-1.5 rounded-lg hover:bg-[#252830] text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    {copied ? (
                      <FiCheck className="w-4 h-4 text-[#1dc071]" />
                    ) : (
                      <FiCopy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`https://sepolia.etherscan.io/address/${campaign.owner}`}
                    target="_blank"
                    rel="noreferrer"
                    title="View on Etherscan"
                    className="p-1.5 rounded-lg hover:bg-[#252830] text-gray-400 hover:text-[#1dc071] transition-all cursor-pointer"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-[#16171d] p-4 rounded-xl border border-[#2c2f32]">
                <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                  <span className="text-[#808191]">Progress</span>
                  <span className="text-[#4acd8d] font-mono font-bold">
                    {percentage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#2c2f32] rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-[#1dc071] to-[#4acd8d] rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-[#808191] block">
                      Raised
                    </span>
                    <span className="text-xs font-bold font-mono text-white">
                      Ξ{formatEth(campaign.amountCollected)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#808191] block">
                      Goal
                    </span>
                    <span className="text-xs font-bold font-mono text-gray-300">
                      Ξ{formatEth(campaign.target)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#808191] block">
                      Status
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isExpired ? "text-amber-400" : "text-[#4acd8d]"
                      }`}
                    >
                      {isExpired ? "Ended" : `${remainingDays}d left`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story & Description */}
          <div className="bg-[#16171d] rounded-2xl p-5 border border-[#2c2f32]">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#808191] mb-2">
              About this Sprout
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {campaign.description ||
                "No description provided for this project."}
            </p>
          </div>

          {/* Donation Box Section */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1a2327] to-[#16171d] border border-[#1dc071]/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1dc071]/20 flex items-center justify-center text-[#1dc071]">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">
                    Back This Campaign
                  </h4>
                  <p className="text-xs text-[#808191]">
                    Funds are sent directly to the campaign creator on Sepolia.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#4acd8d] bg-[#1dc071]/10 px-2.5 py-1 rounded-full">
                <FiShield className="w-3.5 h-3.5" />
                <span>100% On-Chain</span>
              </div>
            </div>

            {/* Success Banner */}
            {/* {txHash && (
              <div className="mb-4 p-4 rounded-xl bg-[#1dc071]/15 border border-[#1dc071]/40 flex flex-col gap-1">
                <span className="text-xs font-bold text-[#4acd8d] flex items-center gap-1.5">
                  <FiCheck className="w-4 h-4" />
                  Donation Confirmed Successfully!
                </span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1 break-all"
                >
                  View on Sepolia Etherscan: {txHash}
                  <FiExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )} */}

            {/* Preset Amount Chips */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-[#808191] mr-1">Presets:</span>
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDonationAmount(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    donationAmount === amt
                      ? "bg-[#1dc071] text-white shadow-[0_0_10px_rgba(29,192,113,0.4)]"
                      : "bg-[#252830] hover:bg-[#2e323c] text-gray-300"
                  }`}
                >
                  {amt} ETH
                </button>
              ))}
            </div>

            {/* Input & Action */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="0.05"
                  className="w-full h-[50px] bg-[#13131a] border border-[#2c2f32] focus:border-[#1dc071] rounded-xl px-4 pr-14 text-white font-mono text-base outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#808191]">
                  ETH
                </span>
              </div>

              <button
                onClick={handleDonate}
                className="h-[50px] px-8 rounded-xl bg-gradient-to-r from-[#1dc071] to-[#10b981] hover:from-[#4acd8d] hover:to-[#059669] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(29,192,113,0.35)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <span>Connect Wallet to Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;

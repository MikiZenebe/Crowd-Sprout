import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { FiArrowLeft } from "react-icons/fi";
import { useCampaign, type Campaign } from "../context";
import { daysLeft, calculateBarPercentage } from "../utils";
import CampaignTopBar from "../components/campaign-details/CampaignTopBar";
import CampaignHero from "../components/campaign-details/CampaignHero";
import CreatorCard from "../components/campaign-details/CreatorCard";
import DonatorsCard from "../components/campaign-details/DonatorsCard";
import DonationPanel from "../components/campaign-details/DonationPanel";

interface DonatorItem {
  donator: string;
  donation: string;
}

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
    <main className="flex flex-col w-full text-white pb-16 max-w-285 mx-auto">
      <CampaignTopBar />

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 flex flex-col gap-6">
          <CampaignHero
            campaign={campaign}
            remainingDays={remainingDays}
            isExpired={isExpired}
            isFunded={isFunded}
            percentage={percentage}
            getImageUrl={getImageUrl}
            isLoadingDonators={isLoadingDonators}
            donators={donators}
          />

          {/* Creator Information Card */}
          <CreatorCard
            owner={campaign.owner}
            handleCopyOwner={handleCopyOwner}
            copied={copied}
          />

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

          {/* Donators  */}
          <DonatorsCard
            donators={donators}
            isLoadingDonators={isLoadingDonators}
          />
        </section>

        {/* Right Column: Sticky Backing & Contribution Widget */}
        <aside className="lg:col-span-4">
          <DonationPanel
            address={address}
            donationAmount={donationAmount}
            setDonationAmount={setDonationAmount}
            isDonating={isDonating}
            isExpired={isExpired}
            txHash={txHash}
            donationError={donationError}
          />
        </aside>
      </section>
    </main>
  );
};

export default CampaignDetails;

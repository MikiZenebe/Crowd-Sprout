import { useCallback, useEffect, useState } from "react";
import { useCampaign, type Campaign } from "../context";
import {
  CampaignModal,
  DisplayCampaigns,
  HeroBanner,
  StatsBar,
} from "../components";
import { FiCheckCircle, FiSend, FiShield } from "react-icons/fi";

export default function Home() {
  const { getCampaign, error } = useCampaign();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getCampaign();
      setCampaigns(result || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setIsLoading(false);
    }
  }, [getCampaign]);

  useEffect(() => {
    let isMounted = true;
    getCampaign()
      .then((result) => {
        if (isMounted) {
          setCampaigns(result || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error fetching campaigns:", err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [getCampaign]);

  const handleCardClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleDonateClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleExploreClick = () => {
    const el = document.getElementById("campaigns-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col w-full text-white pb-12">
      {/* Hero Welcome Banner */}
      <HeroBanner onExploreClick={handleExploreClick} />

      {/* Aggregate Web3 Platform Stats Bar */}
      <StatsBar campaigns={campaigns} isLoading={isLoading} />

      {/* Campaigns Explorer Grid with Filters */}
      <DisplayCampaigns
        title="Sprouted Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
        error={error}
        onRefresh={fetchCampaigns}
        onCardClick={handleCardClick}
        onDonateClick={handleDonateClick}
      />

      {/* Why CrowdSprout - Web3 Trust & Value Proposition */}
      <div className="mt-8 rounded-[24px] bg-gradient-to-br from-[#1c1c24] to-[#16171d] border border-[#2c2f32] p-8 sm:p-10 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3.5 py-1.5 rounded-full bg-[#1dc071]/15 text-[#4acd8d] text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
            🌱 The CrowdSprout Advantage
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Built for Transparent Web3 Funding
          </h3>
          <p className="text-sm text-[#808191] mt-2 leading-relaxed">
            Every transaction, pledge, and payout is etched forever onto the
            Ethereum blockchain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#13131a] border border-[#2c2f32] hover:border-[#1dc071]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#1dc071]/10 flex items-center justify-center text-[#1dc071] text-2xl mb-4 group-hover:scale-110 transition-transform">
              <FiCheckCircle />
            </div>
            <h4 className="font-bold text-white text-lg mb-2">
              100% Direct Payouts
            </h4>
            <p className="text-xs sm:text-sm text-[#808191] leading-relaxed">
              No intermediary banks or high platform cuts. Backed funds flow
              straight to creators’ Ethereum wallets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#13131a] border border-[#2c2f32] hover:border-[#1dc071]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#60a5fa]/10 flex items-center justify-center text-[#60a5fa] text-2xl mb-4 group-hover:scale-110 transition-transform">
              <FiShield />
            </div>
            <h4 className="font-bold text-white text-lg mb-2">
              Non-Custodial Security
            </h4>
            <p className="text-xs sm:text-sm text-[#808191] leading-relaxed">
              Smart contracts manage fund collection autonomously on Sepolia.
              Creators and backers retain full wallet sovereignty.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#13131a] border border-[#2c2f32] hover:border-[#1dc071]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7] text-2xl mb-4 group-hover:scale-110 transition-transform">
              <FiSend />
            </div>
            <h4 className="font-bold text-white text-lg mb-2">
              Global Permissionless Access
            </h4>
            <p className="text-xs sm:text-sm text-[#808191] leading-relaxed">
              Anyone with MetaMask or an Ethereum wallet can launch a sprout or
              back ideas from anywhere around the globe.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Campaign Modal */}
      <CampaignModal
        campaign={selectedCampaign}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccessDonation={fetchCampaigns}
      />
    </div>
  );
}

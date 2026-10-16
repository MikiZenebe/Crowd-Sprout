import React, { useState } from "react";
import { FiArrowLeft, FiCheck, FiShare2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CampaignTopBar() {
  const navigate = useNavigate();
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
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
  );
}

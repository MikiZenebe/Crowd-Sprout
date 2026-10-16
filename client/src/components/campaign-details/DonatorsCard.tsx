import React from "react";
import { FiExternalLink, FiUsers } from "react-icons/fi";
import { truncateAddress } from "../../utils";

export default function DonatorsCard({ donators, isLoadingDonators }) {
  return (
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
          <h4 className="text-white font-bold text-sm mb-1">No Backers Yet</h4>
          <p className="text-xs text-sprout-muted max-w-sm mx-auto">
            Be the very first backer to support this sprout and help bring this
            vision to life!
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
  );
}

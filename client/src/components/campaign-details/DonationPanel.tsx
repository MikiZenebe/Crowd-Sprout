import {
  FiAlertCircle,
  FiCheck,
  FiExternalLink,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { truncateAddress } from "../../utils";

const PRESET_AMOUNTS = ["0.01", "0.05", "0.1", "0.5"];

export default function DonationPanel({
  address,
  donationAmount,
  setDonationAmount,
  isDonating,
  isExpired,
  txHash,
  donationError,
  onDonate,
}) {
  return (
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
            Thank you for backing this sprout! Your pledge is now recorded on
            the blockchain.
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
        <div className="mb-5 p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex flex-col gap-2 animate-fadeIn">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed font-medium">{donationError}</span>
          </div>

          {(donationError.toLowerCase().includes("faucet") ||
            donationError.toLowerCase().includes("insufficient funds") ||
            donationError.toLowerCase().includes("out of funds")) && (
            <div className="pl-6 pt-0.5">
              <a
                href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 text-[11px] font-semibold transition-all hover:text-white"
              >
                <span>Get Free Sepolia ETH</span>
                <FiExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
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
        onClick={onDonate}
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
  );
}

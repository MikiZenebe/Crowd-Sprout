import { FiCheck, FiCopy, FiExternalLink, FiShield } from "react-icons/fi";

export default function CreatorCard({ owner, handleCopyOwner, copied }) {
  return (
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
              {owner}
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
            href={`https://sepolia.etherscan.io/address/${owner}`}
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
          Smart contract guarantees direct payout: 100% of all contributions
          flow immediately to this address on Sepolia.
        </span>
      </div>
    </div>
  );
}

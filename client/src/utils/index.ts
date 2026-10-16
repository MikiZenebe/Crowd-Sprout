import { ethers } from "ethers";

export const daysLeft = (deadline: number | bigint): number => {
  const deadlineNum = Number(deadline);
  // If timestamp is in seconds (10 digits), convert to ms
  const deadlineMs =
    deadlineNum < 10000000000 ? deadlineNum * 1000 : deadlineNum;
  const difference = deadlineMs - Date.now();
  const remainingDays = Math.ceil(difference / (1000 * 3600 * 24));

  return remainingDays;
};

export const calculateBarPercentage = (
  goal: number,
  raisedAmount: number,
): number => {
  if (!goal || goal <= 0) return 0;
  const percentage = Math.round((raisedAmount * 100) / goal);
  return Math.min(100, Math.max(0, percentage));
};

export const formatEth = (val: bigint | string | number): string => {
  try {
    let ethString: string;
    if (typeof val === "bigint") {
      ethString = ethers.formatEther(val);
    } else if (typeof val === "string") {
      ethString = val.includes(".") ? val : ethers.formatEther(val);
    } else {
      ethString = val.toString();
    }
    const num = parseFloat(ethString);
    if (isNaN(num)) return "0";
    return num % 1 === 0 ? num.toString() : num.toFixed(3).replace(/\.?0+$/, "");
  } catch {
    return "0";
  }
};

export const truncateAddress = (address: string): string => {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const checkIfImage = (
  url: string,
  callback: (isImage: boolean) => void,
) => {
  if (!url) {
    callback(false);
    return;
  }
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const parseBlockchainError = (error: unknown): string => {
  if (!error) return "An unexpected error occurred.";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as any;

  // Extract all possible message fields from ethers, MetaMask, and JSON-RPC
  const dataMessage = err?.data?.message || "";
  const nestedErrorMessage =
    err?.error?.data?.message ||
    err?.error?.message ||
    err?.info?.error?.data?.message ||
    err?.info?.error?.message ||
    "";
  const shortMessage = err?.shortMessage || "";
  const reason = err?.reason || "";
  const baseMessage =
    typeof err?.message === "string"
      ? err.message
      : typeof err === "string"
        ? err
        : "";

  // Extract error code if present
  const code =
    err?.code ??
    err?.data?.code ??
    err?.error?.code ??
    err?.info?.error?.code;

  // Compile full string for pattern matching
  let fullString = `${baseMessage} ${dataMessage} ${nestedErrorMessage} ${shortMessage} ${reason}`;
  try {
    fullString += ` ${JSON.stringify(error)}`;
  } catch {
    // Ignore circular structures
  }

  const lower = fullString.toLowerCase();

  // 1. Insufficient funds / Out of funds
  if (
    code === -32003 ||
    code === "INSUFFICIENT_FUNDS" ||
    lower.includes("outoffunds") ||
    lower.includes("out of funds") ||
    lower.includes("insufficient funds") ||
    lower.includes("exceeds balance") ||
    lower.includes("gas required exceeds allowance") ||
    lower.includes("intrinsic transaction cost")
  ) {
    return "Insufficient funds: Your wallet does not have enough Sepolia ETH to cover this donation plus network gas fees. Please enter a smaller amount or request testnet ETH from a Sepolia faucet.";
  }

  // 2. User rejected transaction
  if (
    code === 4001 ||
    code === "ACTION_REJECTED" ||
    lower.includes("user rejected") ||
    lower.includes("denied transaction signature") ||
    lower.includes("action_rejected")
  ) {
    return "Transaction cancelled: You rejected the transaction in MetaMask.";
  }

  // 3. RPC 403 Forbidden or rate-limiting
  if (
    lower.includes("403") ||
    lower.includes("eth_gasprice") ||
    lower.includes("rpc endpoint returned http client error") ||
    lower.includes("forbidden")
  ) {
    return "MetaMask RPC Error (HTTP 403): Your configured Sepolia RPC endpoint rejected the request. Please switch your Sepolia RPC URL in MetaMask (Settings > Networks > Sepolia) to https://ethereum-sepolia-rpc.publicnode.com or https://rpc.sepolia.org.";
  }

  // 4. Network or connection errors
  if (
    lower.includes("failed to fetch") ||
    lower.includes("could not detect network") ||
    lower.includes("network_error") ||
    lower.includes("fetch failed")
  ) {
    return "Network error: Unable to connect to the Sepolia network. Please check your internet connection and MetaMask.";
  }

  // 5. Smart contract reverts
  if (reason) {
    return `Transaction reverted: ${reason}`;
  }
  if (lower.includes("execution reverted")) {
    if (lower.includes("deadline") || lower.includes("expired")) {
      return "Transaction reverted: This campaign has ended and is no longer accepting donations.";
    }
    return "Transaction reverted: The smart contract rejected this transaction.";
  }

  // 6. Pending transaction / Nonce issues
  if (
    lower.includes("nonce") ||
    lower.includes("replacement fee too low") ||
    lower.includes("already known")
  ) {
    return "Transaction pending: A transaction is already queued in your wallet. Please wait for it to confirm or speed it up in MetaMask.";
  }

  // 7. MetaMask not installed
  if (
    lower.includes("metamask is not installed") ||
    lower.includes("metamask is nit installed") ||
    lower.includes("ethereum is undefined")
  ) {
    return "MetaMask is not detected. Please install and unlock MetaMask to continue.";
  }

  // 8. Clean message fallback
  if (
    shortMessage &&
    !shortMessage.includes("Internal JSON-RPC") &&
    !shortMessage.includes("inpage.js")
  ) {
    return shortMessage;
  }

  if (
    baseMessage &&
    !baseMessage.includes("Internal JSON-RPC") &&
    !baseMessage.includes("inpage.js") &&
    !baseMessage.includes("MetaMask - RPC Error")
  ) {
    return baseMessage;
  }

  if (dataMessage && !dataMessage.includes("Internal JSON-RPC")) {
    return dataMessage;
  }

  return "Transaction failed: An error occurred while communicating with the blockchain. Please check your wallet balance and try again.";
};


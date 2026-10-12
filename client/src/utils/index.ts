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


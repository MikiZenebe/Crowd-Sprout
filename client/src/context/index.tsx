import { createContext, useContext, useState, type ReactNode } from "react";
import { ethers } from "ethers";

import CrowdFundingABI from "../constants/CrowdFunding.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

interface CampaignForm {
  title: string;
  description: string;
  target: string;
  deadline: string;
  image: string;
}

export interface Campaign {
  pId: number;
  owner: string;
  title: string;
  description: string;
  target: bigint;
  deadline: bigint;
  amountCollected: bigint;
  image: string;
}

interface CampaignContextType {
  createCampaign: (
    form: CampaignForm,
  ) => Promise<ethers.TransactionReceipt | null>;
  getCampaign: () => Promise<Campaign[]>;
  getUserCampaigns: () => Promise<Campaign[]>;
  isCreating: boolean;
  error: string | null;
  connectWallet: () => Promise<string | null>;
  address: string | null;
}

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined,
);

interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider = ({ children }: CampaignProviderProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Connect MetaMask and return the wallet address */
  const connectWallet = async (): Promise<string | null> => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);

      return userAddress;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to connect wallet.";

      setError(message);

      return null;
    }
  };

  /* Create a campaign on the smart contract */
  const createCampaign = async (
    form: CampaignForm,
  ): Promise<ethers.TransactionReceipt | null> => {
    try {
      setIsCreating(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      if (!contractAddress) {
        throw new Error("Contract address is missing.");
      }

      /* Create browser provider */
      const provider = new ethers.BrowserProvider(window.ethereum);

      /* Verify network is Sepolia (11155111 / 0xaa36a7) */
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
        } catch (switchError: unknown) {
          const switchErr = switchError as { code?: number };
          if (switchErr?.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia test network",
                  nativeCurrency: {
                    name: "Sepolia Ether",
                    symbol: "SEP",
                    decimals: 18,
                  },
                  rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      /* Get signer */
      const signer = await provider.getSigner();

      /* Get connected wallet address */
      const owner = await signer.getAddress();

      /* Create contract instance */
      const contract = new ethers.Contract(
        contractAddress,
        CrowdFundingABI,
        signer,
      );

      /*
       * Convert ETH -> wei
       * Example: "0.5" ETH -> 500000000000000000 wei
       */
      const target = ethers.parseEther(form.target);

      /*
       * Convert date -> Unix timestamp
       * Input:
       * "2026-10-20"
       * Output:
       * Smart contract expects:
       * uint256 timestamp
       */
      const deadline = Math.floor(
        new Date(`${form.deadline}T23:59:59`).getTime() / 1000,
      );

      /* Validate deadline */
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (deadline <= currentTimestamp) {
        throw new Error("Campaign deadline must be in the future.");
      }

      /* Call smart contract */
      const transaction = await contract.createCampaign(
        owner,
        form.title,
        form.description,
        target,
        deadline,
        form.image,
      );

      /* Wait for blockchain confirmation */
      const receipt = await transaction.wait();

      return receipt;
    } catch (error: unknown) {
      console.error("Create campaign error:", error);

      let message = "Failed to create campaign.";
      const errorStr = String(error);
      const errorObj = error as { message?: string; code?: unknown };

      if (
        errorStr.includes("403") ||
        errorStr.includes("eth_gasPrice") ||
        errorStr.includes("RPC endpoint returned HTTP client error")
      ) {
        message =
          "MetaMask RPC Error (HTTP 403 Forbidden): Your wallet's configured RPC endpoint for Sepolia rejected the request. Please update your Sepolia RPC URL in MetaMask (Settings > Networks > Sepolia) to a working endpoint such as https://ethereum-sepolia-rpc.publicnode.com or https://rpc.sepolia.org.";
      } else if (
        errorStr.includes("user rejected") ||
        errorStr.includes("ACTION_REJECTED") ||
        errorObj?.code === 4001 ||
        errorObj?.code === "ACTION_REJECTED"
      ) {
        message = "Transaction rejected in MetaMask.";
      } else if (error instanceof Error) {
        message = error.message;
      }

      setError(message);

      return null;
    } finally {
      setIsCreating(false);
    }
  };

  /* Fetch all campaigns from the smart contract*/
  const getCampaign = async (): Promise<Campaign[]> => {
    try {
      setError(null);

      if (!contractAddress) {
        throw new Error("Contract address is missing.");
      }

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      // Read-only provider: no MetaMask connection required
      const provider = new ethers.BrowserProvider(window.ethereum);

      const contract = new ethers.Contract(
        contractAddress,
        CrowdFundingABI,
        provider,
      );

      // Call the getter defined in your smart contract
      const campaigns = await contract.getCampaigns();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return campaigns.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (campaign: any, i: number): Campaign => ({
          pId: i,
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: campaign.target,
          deadline: campaign.deadline,
          amountCollected: campaign.amountCollected,
          image: campaign.image,
        }),
      );
    } catch (error) {
      console.error("Get campaigns error:", error);

      const message =
        error instanceof Error ? error.message : "Failed to fetch campaigns.";

      setError(message);
      return [];
    }
  };

  /* Fetch campaigns created by the connected user */
  const getUserCampaigns = async (): Promise<Campaign[]> => {
    try {
      setError(null);

      if (!contractAddress) {
        throw new Error("Contract address is missing.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum!);

      const contract = new ethers.Contract(
        contractAddress,
        CrowdFundingABI,
        provider,
      );

      // Get the currently connected wallet without prompting
      const accounts: string[] = await provider.send("eth_accounts", []);

      const userAddress = accounts[0];

      if (!userAddress) {
        throw new Error("Please connect your wallet first.");
      }

      // Fetch all campaigns
      const campaigns = await contract.getCampaigns();

      // Filter campaigns belonging to this wallet
      return campaigns
        .map(
          (campaign: Campaign, i: number): Campaign => ({
            pId: i,
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: campaign.target,
            deadline: campaign.deadline,
            amountCollected: campaign.amountCollected,
            image: campaign.image,
          }),
        )
        .filter(
          (campaign: Campaign) =>
            campaign.owner.toLowerCase() === userAddress.toLowerCase(),
        );
    } catch (error: unknown) {
      console.error("Get user campaigns error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch user campaigns.",
      );

      return [];
    }
  };

  return (
    <CampaignContext.Provider
      value={{
        createCampaign,
        getCampaign,
        getUserCampaigns,
        // donateCampaign,
        // getDonators,
        isCreating,
        error,
        connectWallet,
        address,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

// This hook shares the provider's context and must remain in this module.
// eslint-disable-next-line react-refresh/only-export-components
export const useCampaign = (): CampaignContextType => {
  const context = useContext(CampaignContext);

  if (!context) {
    throw new Error("useCampaign must be used inside CampaignProvider");
  }

  return context;
};

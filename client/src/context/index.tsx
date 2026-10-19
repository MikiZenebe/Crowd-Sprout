import { createContext, useContext, useState, type ReactNode } from "react";
import { ethers } from "ethers";

import CrowdFundingABI from "../constants/CrowdFunding.json";
import { parseBlockchainError } from "../utils";

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

export interface Donator {
  address: string;
  amount: bigint;
}

export interface CampaignDonators {
  addresses: string[];
  amounts: bigint[];
  donators: Donator[];
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

  donate: (
    campaignId: number,
    amount: string,
  ) => Promise<ethers.TransactionReceipt | null>;

  getDonators: (campaignId: number) => Promise<CampaignDonators>;

  isDonating: boolean;
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

  const [isDonating, setIsDonating] = useState(false);

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
      const message = parseBlockchainError(error);
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

  /* Donate to campaigns */
  const donate = async (
    campaignId: number,
    amount: string,
  ): Promise<ethers.TransactionReceipt | null> => {
    try {
      setIsDonating(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      if (!contractAddress) {
        throw new Error("Contract address is missing.");
      }

      if (!Number.isSafeInteger(campaignId) || campaignId < 0) {
        throw new Error("Invalid campaign ID.");
      }

      // Validate the donation amount before opening MetaMask.
      let donationWei: bigint;

      try {
        donationWei = ethers.parseEther(amount);
      } catch (error) {
        throw new Error("Enter a valid ETH donation amount.", { cause: error });
      }

      if (donationWei <= 0n) {
        throw new Error("Donation amount must be greater than zero.");
      }

      // Request wallet access.
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Create provider
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Verify network is Sepolia (11155111 / 0xaa36a7)
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

      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        CrowdFundingABI,
        signer,
      );

      // Send ETH as msg.value to the payable contract method.
      const transaction = await contract.donateToCampaign(campaignId, {
        value: donationWei,
      });

      // Wait until the transaction is mined
      const receipt = await transaction.wait();

      if (!receipt || receipt.status !== 1) {
        throw new Error("Donation transaction failed on-chain.");
      }

      return receipt;
    } catch (error: unknown) {
      console.error("Donation error:", error);
      const message = parseBlockchainError(error);
      setError(message);
      throw new Error(message, { cause: error });
    } finally {
      setIsDonating(false);
    }
  };

  /* Get Donators */
  const getDonators = async (campaignId: number): Promise<CampaignDonators> => {
    try {
      setError(null);

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      if (!contractAddress) {
        throw new Error("Contract address is missing.");
      }

      if (!Number.isSafeInteger(campaignId) || campaignId < 0) {
        throw new Error("Invalid campaign ID.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const contract = new ethers.Contract(
        contractAddress,
        CrowdFundingABI,
        provider,
      );

      const [addresses, amounts] = await contract.getDonators(campaignId);

      const donatorAddresses = Array.from(addresses as string[]);
      const donationAmounts = Array.from(amounts as bigint[]);

      const donators: Donator[] = donatorAddresses.map(
        (donatorAddress, index) => ({
          address: donatorAddress,
          amount: donationAmounts[index],
        }),
      );

      return {
        addresses: donatorAddresses,
        amounts: donationAmounts,
        donators,
      };
    } catch (error) {
      console.error("Get donators error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch campaign donators.";

      setError(message);
      throw new Error(message, { cause: error });
    }
  };
  return (
    <CampaignContext.Provider
      value={{
        createCampaign,
        getCampaign,
        getUserCampaigns,
        isCreating,
        error,
        connectWallet,
        address,
        isDonating,
        donate,
        getDonators,
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

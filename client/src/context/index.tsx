import { createContext, useContext, useState, type ReactNode } from "react";
import { ethers } from "ethers";

import { useGetContractABIQuery } from "../utils/api";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

interface CampaignForm {
  title: string;
  description: string;
  target: string;
  deadline: string;
  image: string;
}

interface CampaignContextType {
  createCampaign: (
    form: CampaignForm,
  ) => Promise<ethers.TransactionReceipt | null>;
  isCreating: boolean;
  error: string | null;
  connectWallet: () => Promise<string | null>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined,
);

interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider = ({ children }: CampaignProviderProps) => {
  const { data: abi, isLoading: isAbiLoading } = useGetContractABIQuery();

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
      const address = await signer.getAddress();

      return address;
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

      if (!abi) {
        throw new Error("Contract ABI is not loaded");
      }

      if (!contractAddress) {
        throw new Error("Contract address is missing.");
      }

      /* Create browser provider */
      const provider = new ethers.BrowserProvider(window.ethereum);

      /* Get signer */
      const signer = await provider.getSigner();

      /* Get connected wallet address */
      const owner = await signer.getAddress();

      /* Create contract instance */
      const contract = new ethers.Contract(contractAddress, abi, signer);

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
    } catch (error) {
      console.error("Create campaign error:", error);

      const message =
        error instanceof Error ? error.message : "Failed to create campaign.";

      setError(message);

      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <CampaignContext.Provider
      value={{
        createCampaign,
        isCreating: isCreating || isAbiLoading,
        error,
        connectWallet,
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

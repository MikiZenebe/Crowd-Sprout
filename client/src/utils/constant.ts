import axios from "axios";

const etherscan = import.meta.env.VITE_ETHERSCAN_API_KEY;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export async function getContractABI() {
  const res = await axios.get(
    `https://api.etherscan.io/v2/api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscan}`,
  );
  return res.data.result;
}

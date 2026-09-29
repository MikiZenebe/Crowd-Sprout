import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const etherscan = import.meta.env.VITE_ETHERSCAN_API_KEY;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export const etherscanApi = createApi({
  reducerPath: "etherscanApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.etherscan.io/v2/" }),
  endpoints: (builder) => ({
    getContractABI: builder.query<string, void>({
      query: () =>
        `api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscan}`,
      transformResponse: (response: { status: string; message: string; result: string }) => 
        response.result,
    }),
  }),
});

export const { useGetContractABIQuery } = etherscanApi;

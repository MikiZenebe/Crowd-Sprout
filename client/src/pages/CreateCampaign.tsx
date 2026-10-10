import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetContractABIQuery } from "../utils/api";
import { useCampaign } from "../context";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { createCampaign, isCreating } = useCampaign();

  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleFormFieldChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const receipt = await createCampaign(form);

      if (!receipt) {
        return;
      }

      alert(`Campaign created successfully!\n\nTransaction: ${receipt.hash}`);

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const { data: contractABI } = useGetContractABIQuery();
  console.log("Contract ABI:", contractABI); // Log the fetched contract ABI for debugging

  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-10 text-white w-full">
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13131a]/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 border-4 border-[#1dc071] border-t-transparent rounded-full animate-spin" />

            <p className="text-white font-semibold">
              Waiting for transaction...
            </p>

            <p className="text-[#808191] text-sm">
              Please confirm the transaction in MetaMask.
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-[800px] flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Start a Campaign
          </h1>
          <p className="text-lg text-[#808191]">
            Bring your vision to life. Provide details to start raising funds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col gap-3 flex-1">
              <label className="text-xs font-bold text-[#808191] uppercase tracking-wider">
                Your Name
              </label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full py-4 px-5 rounded-xl bg-[#1c1c24] border border-[#2c2f32] focus:border-[#1dc071] focus:ring-1 focus:ring-[#1dc071] outline-none transition-all text-white placeholder-[#4b5264]"
                value={form.name}
                onChange={(e) => handleFormFieldChange("name", e)}
              />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <label className="text-xs font-bold text-[#808191] uppercase tracking-wider">
                Campaign Title
              </label>
              <input
                required
                type="text"
                placeholder="Write a title"
                className="w-full py-4 px-5 rounded-xl bg-[#1c1c24] border border-[#2c2f32] focus:border-[#1dc071] focus:ring-1 focus:ring-[#1dc071] outline-none transition-all text-white placeholder-[#4b5264]"
                value={form.title}
                onChange={(e) => handleFormFieldChange("title", e)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-[#808191] uppercase tracking-wider">
              Story
            </label>
            <textarea
              required
              rows={5}
              placeholder="Write your story"
              className="w-full py-4 px-5 rounded-xl bg-[#1c1c24] border border-[#2c2f32] focus:border-[#1dc071] focus:ring-1 focus:ring-[#1dc071] outline-none transition-all text-white placeholder-[#4b5264] resize-none leading-relaxed"
              value={form.description}
              onChange={(e) => handleFormFieldChange("description", e)}
            />
          </div>

          <div className="p-6 bg-gradient-to-r from-[#1dc071]/10 to-[#1dc071]/5 border border-[#1dc071]/20 rounded-2xl flex items-center shadow-sm">
            <div className="w-12 h-12 bg-[#1dc071] rounded-full flex items-center justify-center mr-5 shrink-0 shadow-[0_0_15px_rgba(29,192,113,0.4)]">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <h4 className="font-bold text-lg text-white">
                You will get 100% of the raised amount
              </h4>
              <p className="text-[#808191] text-sm mt-1">
                We believe in empowering creators without hidden fees.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col gap-3 flex-1">
              <label className="text-xs font-bold text-[#808191] uppercase tracking-wider">
                Goal (ETH)
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.50"
                className="w-full py-4 px-5 rounded-xl bg-[#1c1c24] border border-[#2c2f32] focus:border-[#1dc071] focus:ring-1 focus:ring-[#1dc071] outline-none transition-all text-white placeholder-[#4b5264]"
                value={form.target}
                onChange={(e) => handleFormFieldChange("target", e)}
              />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <label className="text-xs font-bold text-[#808191] uppercase tracking-wider">
                End Date
              </label>
              <input
                required
                type="date"
                className="w-full py-4 px-5 rounded-xl bg-[#1c1c24] border border-[#2c2f32] focus:border-[#1dc071] focus:ring-1 focus:ring-[#1dc071] outline-none transition-all text-white [color-scheme:dark]"
                value={form.deadline}
                onChange={(e) => handleFormFieldChange("deadline", e)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-[#808191] uppercase tracking-wider">
              Campaign image URL
            </label>
            <input
              required
              type="url"
              placeholder="Place image URL of your campaign"
              className="w-full py-4 px-5 rounded-xl bg-[#1c1c24] border border-[#2c2f32] focus:border-[#1dc071] focus:ring-1 focus:ring-[#1dc071] outline-none transition-all text-white placeholder-[#4b5264]"
              value={form.image}
              onChange={(e) => handleFormFieldChange("image", e)}
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-4 font-bold text-lg text-white bg-[#1dc071] hover:bg-[#18a05e] rounded-xl transition-all shadow-[0_4px_14px_0_rgba(29,192,113,0.39)] hover:shadow-[0_6px_20px_rgba(29,192,113,0.23)] hover:-translate-y-[1px]"
            >
              Submit New Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;

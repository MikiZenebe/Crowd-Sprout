import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import CrowdFundingABI from "../constants/CrowdFunding.json";
import { useCampaign } from "../context";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: "",
  pinataGateway: import.meta.env.VITE_GATEWAY_URL,
});

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { createCampaign, isCreating, error } = useCampaign();

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [link, setLink] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploadStatus("Getting upload URL...");

      const urlResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/presigned_url`,
        {
          method: "GET",
          headers: {
            // Handle your own server authorization here
          },
        },
      );

      const data = await urlResponse.json();

      setUploadStatus("Uploading file...");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const upload = (await pinata.upload.public
        .file(file)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .url(data.url)) as any;
      const cid = upload?.cid || upload?.data?.cid;

      if (cid) {
        setUploadStatus("File uploaded successfully!");
        const ipfsLink = await pinata.gateways.public.convert(cid);
        setLink(ipfsLink);
        setForm((prev) => ({ ...prev, image: ipfsLink }));
      } else {
        setUploadStatus("Upload failed");
      }
    } catch (error) {
      setUploadStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const [form, setForm] = useState({
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

  console.log("Contract ABI:", CrowdFundingABI);

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

        {error && (
          <div className="p-5 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-white flex items-start gap-4 shadow-lg backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-[#ef4444]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#ef4444]">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#ef4444] text-base">
                Transaction Error
              </h4>
              <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row gap-8">
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
              Campaign image
            </label>

            {link ? (
              <div className="w-full h-64 rounded-xl overflow-hidden relative group border border-[#2c2f32]">
                <img
                  src={link}
                  alt="campaign"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button
                    type="button"
                    onClick={() => {
                      setLink("");
                      setFile(null);
                      setUploadStatus("");
                      setForm((prev) => ({ ...prev, image: "" }));
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.23)] hover:-translate-y-[1px]"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-[#2c2f32] border-dashed rounded-xl cursor-pointer bg-[#1c1c24] hover:bg-[#23232d] hover:border-[#1dc071] transition-all overflow-hidden relative group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {file ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 mb-3 rounded-full bg-[#1dc071]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg
                              className="w-6 h-6 text-[#1dc071]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                          </div>
                          <p className="mb-2 text-sm text-[#808191] max-w-[200px] sm:max-w-[300px] truncate">
                            <span className="font-semibold text-white">
                              {file.name}
                            </span>
                          </p>
                          <p className="text-xs text-[#808191]">
                            Click to change file
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 mb-3 rounded-full bg-[#2c2f32] flex items-center justify-center group-hover:bg-[#3a3f45] group-hover:scale-110 transition-all">
                            <svg
                              className="w-6 h-6 text-[#808191] group-hover:text-white transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              ></path>
                            </svg>
                          </div>
                          <p className="mb-2 text-sm text-[#808191]">
                            <span className="font-semibold text-white">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-[#808191]">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={
                      !file ||
                      uploadStatus === "Uploading file..." ||
                      uploadStatus === "Getting upload URL..." ||
                      uploadStatus === "File uploaded successfully!"
                    }
                    className={`py-3 px-6 font-bold rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto
                      ${
                        !file || uploadStatus === "File uploaded successfully!"
                          ? "bg-[#2c2f32] text-[#808191] cursor-not-allowed"
                          : "bg-[#8c6dfd] hover:bg-[#7a5ce0] text-white shadow-[0_4px_14px_0_rgba(140,109,253,0.39)] hover:shadow-[0_6px_20px_rgba(140,109,253,0.23)] hover:-translate-y-[1px]"
                      }`}
                  >
                    {uploadStatus === "Uploading file..." ||
                    uploadStatus === "Getting upload URL..." ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          ></path>
                        </svg>
                        Upload to Pinata
                      </>
                    )}
                  </button>

                  {uploadStatus && (
                    <div
                      className={`flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl w-full sm:w-auto
                      ${
                        uploadStatus.includes("Error") ||
                        uploadStatus.includes("failed")
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : uploadStatus === "File uploaded successfully!"
                            ? "bg-[#1dc071]/10 text-[#1dc071] border border-[#1dc071]/20"
                            : "text-[#808191]"
                      }`}
                    >
                      {uploadStatus.includes("Error") ||
                      uploadStatus.includes("failed") ? (
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      ) : uploadStatus === "File uploaded successfully!" ? (
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      ) : (
                        <div className="w-4 h-4 border-2 border-[#808191] border-t-transparent rounded-full animate-spin shrink-0" />
                      )}
                      <span className="truncate">{uploadStatus}</span>
                    </div>
                  )}
                </div>
              </>
            )}
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

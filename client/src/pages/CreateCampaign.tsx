import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleFormFieldChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call for static version
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Campaign created successfully (Static Version)!");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center flex-col sm:p-10 p-4 bg-[#13131a] min-h-screen font-sans text-white">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13131a]/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-[#1dc071] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="w-full max-w-4xl bg-[#1c1c24] rounded-2xl shadow-lg border border-[#2c2f32] overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-10 sm:px-12 border-b border-[#2c2f32]">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Start a Campaign
          </h1>
          <p className="mt-2 text-sm text-[#808191]">
            Provide details about your project to start raising funds.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-12 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#b2b3bd]">Your Name *</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full py-3 px-4 outline-none border border-[#3a3a43] bg-transparent text-white rounded-lg focus:border-[#1dc071] focus:bg-[#1c1c24] transition-colors"
                value={form.name}
                onChange={(e) => handleFormFieldChange("name", e)}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#b2b3bd]">Campaign Title *</label>
              <input
                required
                type="text"
                placeholder="Write a title"
                className="w-full py-3 px-4 outline-none border border-[#3a3a43] bg-transparent text-white rounded-lg focus:border-[#1dc071] focus:bg-[#1c1c24] transition-colors"
                value={form.title}
                onChange={(e) => handleFormFieldChange("title", e)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#b2b3bd]">Story *</label>
            <textarea
              required
              rows={6}
              placeholder="Write your story"
              className="w-full py-3 px-4 outline-none border border-[#3a3a43] bg-transparent text-white rounded-lg focus:border-[#1dc071] focus:bg-[#1c1c24] transition-colors resize-none"
              value={form.description}
              onChange={(e) => handleFormFieldChange("description", e)}
            />
          </div>

          {/* Banner */}
          <div className="w-full flex items-center justify-center p-5 bg-[#1dc071]/10 border border-[#1dc071]/20 rounded-xl">
            <span className="text-xl mr-3">💰</span>
            <h4 className="font-semibold text-lg text-[#1dc071]">
              You will get 100% of the raised amount
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#b2b3bd]">Goal *</label>
              <input
                required
                type="text"
                placeholder="ETH 0.50"
                className="w-full py-3 px-4 outline-none border border-[#3a3a43] bg-transparent text-white rounded-lg focus:border-[#1dc071] focus:bg-[#1c1c24] transition-colors"
                value={form.target}
                onChange={(e) => handleFormFieldChange("target", e)}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#b2b3bd]">End Date *</label>
              <input
                required
                type="date"
                className="w-full py-3 px-4 outline-none border border-[#3a3a43] bg-transparent text-white rounded-lg focus:border-[#1dc071] focus:bg-[#1c1c24] transition-colors [color-scheme:dark]"
                value={form.deadline}
                onChange={(e) => handleFormFieldChange("deadline", e)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#b2b3bd]">Campaign image URL *</label>
            <input
              required
              type="url"
              placeholder="Place image URL of your campaign"
              className="w-full py-3 px-4 outline-none border border-[#3a3a43] bg-transparent text-white rounded-lg focus:border-[#1dc071] focus:bg-[#1c1c24] transition-colors"
              value={form.image}
              onChange={(e) => handleFormFieldChange("image", e)}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 font-semibold text-white bg-[#1dc071] hover:bg-[#18a05e] rounded-lg transition-colors"
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

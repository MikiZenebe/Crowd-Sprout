import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiUser, FiCheckCircle } from "react-icons/fi";
import logo from "../assets/crowdsprout_logo.jpg";

import { useCampaign } from "../context";
import { CustomButton } from "./";
import { navlinks } from "../constants";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connectWallet, address } = useCampaign();

  const handleConnect = async () => {
    await connectWallet();
  };

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6 items-center">
      <div className="lg:flex-1 flex flex-row w-full max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] border border-[#2c2f32] rounded-[100px] focus-within:border-[#1dc071] transition-all">
        <input
          type="text"
          placeholder="Search for campaigns, innovators..."
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />

        <div className="w-[72px] h-full rounded-[20px] bg-[#1dc071] hover:bg-[#4acd8d] flex justify-center items-center cursor-pointer transition-all">
          <FiSearch className="w-[16px] h-[16px] text-white" />
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end items-center gap-4">
        {address ? (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1c1c24] border border-[#2c2f32] rounded-[100px] text-sm text-[#808191]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dc071] animate-pulse"></span>
            <span className="font-mono text-white text-xs">{truncatedAddress}</span>
            <FiCheckCircle className="text-[#1dc071] w-4 h-4" />
          </div>
        ) : null}

        <CustomButton
          btnType="button"
          title={address ? "Create Campaign" : "Connect Wallet"}
          styles={
            address
              ? "bg-[#1dc071] hover:bg-[#4acd8d] transition-all text-white font-bold px-6 shadow-[0_0_15px_rgba(29,192,113,0.3)]"
              : "bg-[#1dc071] hover:bg-[#4acd8d] transition-all text-white font-bold px-6 shadow-[0_0_15px_rgba(29,192,113,0.3)]"
          }
          handleClick={() => {
            if (address) navigate("/create-campaign");
            else void handleConnect();
          }}
        />

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] hover:bg-[#353D46] border border-transparent hover:border-[#1dc071]/50 flex justify-center items-center cursor-pointer transition-all">
            <FiUser className="w-[45%] h-[45%] text-white" />
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img
            src={logo}
            alt="logo"
            className="w-[60%] h-[60%] object-contain rounded-[10px]"
          />
        </div>

        <FiMenu
          className="w-[34px] h-[34px] text-white cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"} transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && "bg-[#3a3a43]"}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <link.icon
                  className={`w-[24px] h-[24px] ${isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"}`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"}`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={address ? "Create Campaign" : "Connect Wallet"}
              styles="bg-[#1dc071] hover:bg-[#4acd8d] transition-all text-white font-bold w-full"
              handleClick={() => {
                setToggleDrawer(false);
                if (address) navigate("/create-campaign");
                else void handleConnect();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

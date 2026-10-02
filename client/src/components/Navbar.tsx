import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiUser } from "react-icons/fi";
import logo from "../assets/crowdsprout_logo.jpg";

// import { useStateContext } from "../context";
import { CustomButton } from "./";
import { navlinks } from "../constants";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);

  // Mocked for static UI
  // const { connect, address } = useStateContext();
  const address = "";
  const connect = () => console.log("Connect clicked");

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input
          type="text"
          placeholder="Search for campaigns"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />

        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <FiSearch className="w-[15px] h-[15px] text-white" />
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={address ? "Create a campaign" : "Connect"}
          styles={address ? "bg-[#4ACD8D]" : "bg-[#4ACD8D]"}
          handleClick={() => {
            if (address) navigate("create-campaign");
            else connect();
          }}
        />

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <FiUser className="w-[60%] h-[60%] text-white" />
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
              title={address ? "Create a campaign" : "Connect"}
              styles={address ? "bg-[#4ACD8D]" : "bg-[#4ACD8D]"}
              handleClick={() => {
                if (address) navigate("create-campaign");
                else connect();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

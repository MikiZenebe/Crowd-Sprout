import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSun } from "react-icons/fi";

import { navlinks } from "../constants";
import logo from "../assets/crowdsprout_logo.jpg";

interface IconProps {
  styles?: string;
  name?: string;
  imgUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  isActive?: string;
  disabled?: boolean;
  handleClick?: () => void;
}

const Icon = ({
  styles,
  name,
  imgUrl,
  icon: IconComponent,
  isActive,
  disabled,
  handleClick,
}: IconProps) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && "bg-[#353D46]"} flex justify-center items-center ${!disabled && "cursor-pointer"} ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      IconComponent ? (
        <IconComponent className="w-1/2 h-1/2 text-[#808191]" />
      ) : (
        <img src={imgUrl} alt="fund_logo" className="w-2/2 h-2/2 rounded-xl" />
      )
    ) : IconComponent ? (
      <IconComponent
        className={`w-1/2 h-1/2 ${isActive !== name ? "text-[#808191]" : "text-[#1dc071]"}`}
      />
    ) : (
      <img
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1D262D] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        <Icon styles="bg-[#1c1c24] shadow-secondary" icon={FiSun} />
      </div>
    </div>
  );
};

export default Sidebar;

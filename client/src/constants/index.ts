import { FiHome, FiPlusSquare, FiCreditCard, FiArrowUpRight, FiUser, FiLogOut } from "react-icons/fi";

export const navlinks = [
  {
    name: "dashboard",
    icon: FiHome,
    link: "/",
  },
  {
    name: "campaign",
    icon: FiPlusSquare,
    link: "/create-campaign",
  },
  {
    name: "payment",
    icon: FiCreditCard,
    link: "/",
    disabled: true,
  },
  {
    name: "withdraw",
    icon: FiArrowUpRight,
    link: "/",
    disabled: true,
  },
  {
    name: "profile",
    icon: FiUser,
    link: "/profile",
  },
  {
    name: "logout",
    icon: FiLogOut,
    link: "/",
    disabled: true,
  },
];

"use client";

import Link from "next/link";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { FaCodeCompare } from "react-icons/fa6";

const BottomNavigation = ({ setIsCartOpen }) => {
  const user = useSelector(useCurrentUser);
  const { data } = useGetSingleUserQuery(user?._id);

  const navItems = [
    { name: "Product", href: "/products", icon: <AppstoreOutlined /> },
    { name: "Wishlist", href: "/wishlist", icon: <HeartOutlined /> },
    // Updated Cart item
    {
      name: "Cart",
      href: "/cart",
      icon: <ShoppingCartOutlined />,
      onClick: () => setIsCartOpen(true), // Open cart when clicked
    },
    {
      name: "Compare",
      href: "/compare",
      icon: <FaCodeCompare className="rotate-90" />,
    },
  ];

  if (data?.role) {
    navItems.push({
      name: "Dashboard",
      href: `/${data.role}/dashboard`,
      icon: <TbLayoutDashboardFilled />,
    });
  }

  return (
    <div className="fixed bottom-0 left-0 z-10 w-full bg-white border-t border-gray-300 shadow-md lg:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center text-gray-600 hover:text-primary transition"
            onClick={(e) => {
              if (item.onClick) {
                e.preventDefault();
                item.onClick();
              }
            }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;

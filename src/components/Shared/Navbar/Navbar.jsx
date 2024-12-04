"use client";

import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { MenuOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Drawer, Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaHeart, FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import CategoryNavigation from "./CategoryNavigation";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { useGetSingleCompareByUserQuery } from "@/redux/services/compare/compareApi";
import { useGetSingleWishlistByUserQuery } from "@/redux/services/wishlist/wishlistApi";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data } = useGetSingleUserQuery(user?._id);
  const { data: compareData } = useGetSingleCompareByUserQuery(
    user?._id ?? deviceId
  );
  const { data: wishListData } = useGetSingleWishlistByUserQuery(
    user?._id ?? deviceId
  );

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: products } = useGetAllProductsQuery(undefined, {
    skip: !isSearchOpen,
  });

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }

    const filteredOptions = products?.results?.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.category.name?.toLowerCase().includes(value.toLowerCase())
    );

    setOptions(
      filteredOptions?.map((product) => ({
        value: product.name,
        label: (
          <Link
            href={`/products/${product?.slug}`}
            className="flex items-center gap-4 hover:text-primary pb-2 border-b border-b-gray-300"
          >
            <Image
              src={formatImagePath(product?.mainImage)}
              alt="product"
              width={30}
              height={30}
              className="object-cover"
            />
            <div className="ml-2">
              <p className="text-lg font-medium">{product?.name}</p>
              <p>
                Price: $
                {product?.offerPrice
                  ? product?.offerPrice
                  : product?.sellingPrice}
              </p>
              <p>Category: {product?.category?.name}</p>
            </div>
          </Link>
        ),
      })) || []
    );
  };

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white">
      <nav className="my-container flex justify-between items-center py-2">
        <Button
          type="text"
          className="lg:hidden"
          icon={<MenuOutlined />}
          onClick={toggleDrawer}
        />
        <div className="flex items-center gap-6">
          <Link href={"/"}>
            <Image
              src={globalData?.results?.logo}
              alt="logo"
              width={50}
              height={20}
            />
          </Link>
          <div className="hidden lg:flex gap-6 items-center">
            <CategoryNavigation />
          </div>
        </div>

        <div className="flex gap-6 items-center text-lg">
          <FaSearch
            className="cursor-pointer hover:text-primary duration-300"
            onClick={() => setIsSearchOpen(true)}
          />
          <Link href={"/sign-in"}>
            <FaUser className="cursor-pointer hover:text-primary duration-300" />
          </Link>

          <Link href={"/compare"}>
            {compareData?.[0]?.product?.length > 0 ? (
              <span className="relative">
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {compareData?.[0]?.product?.length}
                </span>
                <FaCodeCompare className="cursor-pointer rotate-90 hover:text-primary duration-300" />
              </span>
            ) : (
              <FaCodeCompare className="cursor-pointer rotate-90 hover:text-primary duration-300" />
            )}
          </Link>
          <Link href={"/wishlist"}>
            {wishListData?.length > 0 ? (
              <span className="relative">
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {wishListData?.length}
                </span>
                <FaHeart className="cursor-pointer hover:text-primary duration-300" />
              </span>
            ) : (
              <FaHeart className="cursor-pointer hover:text-primary duration-300" />
            )}
          </Link>
          <FaShoppingBag
            className="cursor-pointer hover:text-primary duration-300"
            onClick={() => setIsCartOpen(true)}
          />
        </div>
      </nav>

      <Drawer
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <CategoryNavigation />
      </Drawer>
      <Modal
        open={isSearchOpen}
        onCancel={() => setIsSearchOpen(false)}
        footer={null}
        destroyOnClose
      >
        {" "}
        <div className="p-5 relative">
          <AutoComplete
            options={options}
            onSearch={handleSearch}
            placeholder="Search for Products..."
            size="large"
            className="w-full"
          />
          <FaSearch className="absolute right-8 top-1/2 -translate-y-1/2 text-primary text-xl" />
        </div>
      </Modal>
      <Drawer
        placement="right"
        onClose={() => setIsCartOpen(false)}
        open={isCartOpen}
      >
        <CategoryNavigation />
      </Drawer>
    </header>
  );
};

export default Navbar;

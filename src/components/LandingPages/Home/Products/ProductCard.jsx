import { Tooltip } from "antd";
import Image from "next/image";
import React from "react";
import QuickViewHover from "../../Products/QuickViewHover";
import Link from "next/link";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { usePathname } from "next/navigation";

const ProductCard = ({ item }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const pathname = usePathname();

  return (
    <div className="rounded-xl relative group w-[260px] mx-auto h-[550px] flex flex-col">
      <div className="relative lg:overflow-hidden rounded-xl">
        <Image
          src={
            pathname === "/products"
              ? item?.mainImage
              : formatImagePath(item?.mainImage)
          }
          alt={item?.name}
          width={300}
          height={260}
          className="rounded-xl h-[380px] group-hover:scale-110 duration-500"
        />

        <div className="hidden lg:block absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 duration-500 z-10">
          <QuickViewHover item={item} />
        </div>
        <div className="lg:hidden">
          <QuickViewHover item={item} />
        </div>
      </div>

      <div className="p-5">
        <Link href={`/products/${item?.slug}`}>
          <Tooltip placement="top" title={item?.name}>
            <h2 className="text-md text-start font-semibold mt-2 mb-4">
              {item?.name.length > 50
                ? item.name.slice(0, 50).concat("...")
                : item.name}
            </h2>
          </Tooltip>
          <div className="flex items-center gap-4 justify-start">
            {item?.offerPrice && (
              <p className="text-base font-bold line-through text-black/60">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
            {item?.offerPrice ? (
              <p className="text-black text-xl font-bold">
                {globalData?.results?.currency + " " + item?.offerPrice}
              </p>
            ) : (
              <p className="text-black text-xl font-bold">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
          </div>
        </Link>
        {!item?.stock > 0 && (
          <div className=" text-red-500">(Out Of Stock)</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

import { useDeleteCartMutation } from "@/redux/services/cart/cartApi";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const DrawerCart = ({ data, refetch }) => {
  const [counts, setCounts] = useState({});

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const [deleteCart] = useDeleteCartMutation();

  useEffect(() => {
    setCounts(
      data?.reduce(
        (acc, item) => ({ ...acc, [item?._id]: Number(item?.quantity) || 1 }),
        {}
      )
    );
  }, [data]);

  const handleDeleteCart = async (id) => {
    try {
      await deleteCart(id);
      if (refetch) {
        refetch();
      }
      toast.success("Cart deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = useMemo(() => {
    return data?.reduce((total, item) => {
      const quantity = counts[item._id] || 1;
      return total + item?.price * quantity;
    }, 0);
  }, [data, counts]);

  return (
    <div>
      {data?.length ? (
        <div className="max-h-[800px] overflow-y-auto">
          {data?.map((item) => (
            <div
              key={item?._id}
              className="flex flex-col lg:flex-row items-center gap-4 justify-center pb-5 mt-5 first:mt-0 border-b border-gray-300 last:border-b-0"
            >
              <div className="flex flex-[3] items-center gap-4 relative group">
                <div className="relative">
                  <Image
                    src={formatImagePath(item?.image)}
                    alt={item?.product?.name || "Product Image"}
                    width={128}
                    height={128}
                    className="w-28 h-32 rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center rounded-xl transition-opacity duration-300">
                    <button
                      onClick={() => handleDeleteCart(item?._id)}
                      className="bg-white px-2 py-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div>
                  <Link
                    href={`/products/${item?.slug}`}
                    className="text-base font-normal hover:underline hover:text-black"
                  >
                    <Tooltip placement="top" title={item?.productName}>
                      <h2 className="text-md text-start font-semibold mt-2 mb-4">
                        {item?.productName.length > 30
                          ? item.productName.slice(0, 30).concat("...")
                          : item.productName}
                      </h2>
                    </Tooltip>
                    {item?.variant &&
                      ` (${item?.variant?.attributeCombination
                        ?.map((combination) => combination?.name)
                        .join(" ")})`}
                  </Link>
                  <div className="mt-2 font-semibold">
                    Quantity: {counts[item._id]}
                  </div>
                  <div className="flex flex-1 items-center gap-4">
                    <p className="text-primary text-xl font-bold">
                      {globalData?.results?.currency +
                        " " +
                        item?.price * counts[item._id]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-10">
          Your cart is empty.
        </div>
      )}

      {data?.length ? (
        <Link
          href={"/cart"}
          className="hover:text-white text-white text-xl absolute bottom-10 left-10"
        >
          <div className="flex items-center justify-between bg-primary gap-10 px-5 py-4 rounded-xl">
            <p>Proceed To Checkout</p>
            <div className="flex flex-1 items-center gap-4">
              <p>|</p>
              <p className="font-bold">
                {subtotal
                  ? globalData?.results?.currency + " " + subtotal?.toFixed(2)
                  : globalData?.results?.currency + " " + "0"}
              </p>
            </div>
          </div>
        </Link>
      ) : null}
    </div>
  );
};

export default DrawerCart;

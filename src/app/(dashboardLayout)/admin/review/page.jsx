"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import DetailsModal from "@/components/Reusable/Modal/DetailsModal";
import {
  useDeleteReviewMutation,
  useGetReviewsQuery,
  useGetSingleReviewQuery,
} from "@/redux/services/review/reviewApi";
import { Dropdown, Menu, Pagination, Space, Table, Tag, Tooltip } from "antd";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";

const AdminReview = () => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const { data: reviews, isFetching } = useGetReviewsQuery({
    page: currentPage,
    limit: pageSize,
  });

  const { data: reviewData } = useGetSingleReviewQuery(itemId, {
    skip: !itemId,
  });

  const [deleteReview] = useDeleteReviewMutation();

  const handleMenuClick = (key, id) => {
    setItemId(id);
    switch (key) {
      case "delete":
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      align: "start",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      align: "start",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      align: "start",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      align: "start",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (item) => (
        <Tag
          color={item == "Active" ? "green" : "red"}
          className="capitalize font-semibold"
        >
          {item == "Active" ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (item) => {
        const menu = (
          <Menu
            onClick={({ key }) => handleMenuClick(key, item.key)}
            className="w-full flex flex-col gap-2"
          >
            <Menu.Item key="delete">
              <Tooltip placement="top" title={"Delete"}>
                <button className="bg-red-500 p-2 rounded-xl text-white hover:scale-110 duration-300">
                  <MdDelete />
                </button>
              </Tooltip>
            </Menu.Item>
          </Menu>
        );

        return (
          <Space size="middle">
            <Tooltip placement="top" title={"Details"}>
              <button
                onClick={() => {
                  setItemId(item.key);
                  setDetailsModalOpen(true);
                }}
                className="bg-blue-600 p-2 rounded-xl text-white hover:scale-110 duration-300"
              >
                <TbListDetails />
              </button>
            </Tooltip>
            <Dropdown overlay={menu} trigger={["click"]} placement="bottom">
              <Tooltip placement="top" title={"More"}>
                <button className="bg-blue-500 p-2 rounded-xl text-white hover:scale-110 duration-300">
                  <BsThreeDotsVertical />
                </button>
              </Tooltip>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const tableData = reviews?.results?.map((item) => ({
    key: item._id,
    user: item?.user?.name,
    product: item?.product?.map((item) => item.name).join(", "),
    rating: item?.rating,
    comment: item?.comment,
    status: item?.status,
  }));

  return (
    <div className="px-5">
      <Table
        columns={columns}
        pagination={false}
        dataSource={tableData}
        className="mt-10"
        loading={isFetching}
      />

      <Pagination
        className="flex justify-end items-center !mt-10"
        total={reviews?.meta?.totalCount}
        current={currentPage}
        onChange={handlePageChange}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={paginationNumbers}
        simple
      />

      <DetailsModal
        itemId={itemId}
        modalOpen={detailsModalOpen}
        setModalOpen={setDetailsModalOpen}
        title={"Review"}
        details={reviewData}
      />
      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"review"}
        func={deleteReview}
      />
    </div>
  );
};

export default AdminReview;
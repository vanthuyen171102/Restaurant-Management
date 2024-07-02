import { FaRegClock, FaRegMoneyBillAlt, FaRegUser } from "react-icons/fa";
import { InUseCircle, ReadyCircle } from "../TableStatus";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";
import config from "./../../config/index";
import axios from "axios";
import { useState } from "react";
import {
  convertMinsToHrsMins,
  formatCurrency,
  getTimeDifference,
} from "../../helper/format";
import clsx from "clsx";
import PaymentStatus from "../../enums/PaymentStatus";
import OrderItemStatus from "../../enums/OrderItemStatus";
import { useSelector } from "react-redux";

function DinnerTable({ tableData, handleClick, disabled, selected }) {
  const { id, name, status, currentOrder, capacity, area } = tableData;
  const notCanceledOrderItems = currentOrder?.items.filter(item => item.status !== OrderItemStatus.CANCELLED)
  const currentTime = useSelector((state) => state.time.currentTime);

  return (
    <div
      className={clsx(
        "flex flex-col h-full bg-[rgb(42,55,79)]   rounded-md text-sm text-[rgb(235,238,244)] text-center",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        selected ? "border-[blue] border-2" : "border-[rgb(60,78,113)] border-2"
      )}
      onClick={() => {
        if (!disabled) handleClick();
      }}
    >
      <div className="relative p-4 flex-1">
        <div className="absolute top-2 left-2 z-[4]">
          {(() => {
            switch (status) {
              case "READY":
                return <ReadyCircle />;
              case "USING":
                return <InUseCircle />;
              default:
                return "";
            }
          })()}
        </div>
        <div className="font-medium">Bàn</div>
        <div className="text-4xl font-semibold leading-[1.5] line-clamp-1">
          {name}
        </div>
        <div className="font-medium mb-2">Khu {area.name}</div>
        {notCanceledOrderItems ? (
          <>
            <div className="text-xs text-[rgba(235,238,244,0.5)]">
              Hoàn thành:{" "}
              {
                notCanceledOrderItems.filter(
                  (item) => item.status === OrderItemStatus.COMPLETED
                ).length
              }
              /{notCanceledOrderItems.length}
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-[rgba(235,238,244,0.5)]">
              {capacity} chỗ ngồi
            </div>
          </>
        )}
      </div>
      <div className="grid grid-cols-2 gap-[1px] text-xs">
        <div className="flex items-center h-6 justify-center px-2 py-1 border border-l-0 border-b-0 border-[rgb(60,78,113)]">
          {currentOrder && `#${currentOrder.id}`}
        </div>
        <div className="flex items-center h-6 justify-center px-2 py-1 border border-r-0 border-l-0 border-b-0 border-[rgb(60,78,113)]">
          {currentOrder && (
            <>
              <FaRegClock className="mr-2" />{" "}
              {convertMinsToHrsMins(
                Math.floor(
                  (currentTime - new Date(currentOrder.createAt)) / (1000 * 60)
                )
              )}
            </>
          )}
        </div>
        <div className="flex items-center h-6 justify-center px-2 py-1 border border-b-0 border-l-0 border-[rgb(60,78,113)]">
          {currentOrder ? `${formatCurrency(currentOrder.grandTotal)} VNĐ` : ""}
        </div>
        <div
          className={clsx(
            "flex items-center h-6 justify-center px-2 py-1 border border-b-0 border-l-0 border-r-0 border-[rgb(60,78,113)]",
            {
              "text-[rgb(2,136,36)]":
                currentOrder?.paymentStatus === PaymentStatus.PAID,
            }
          )}
        >
          {currentOrder
            ? currentOrder.paymentStatus === PaymentStatus.PAID
              ? "Đã thanh toán"
              : currentOrder.paymentStatus === PaymentStatus.REFUND_NEEDED ? "Cần hoàn tiền" : "Chưa thanh toán"
            : ""}
        </div>
      </div>
    </div>
  );
}

export default DinnerTable;

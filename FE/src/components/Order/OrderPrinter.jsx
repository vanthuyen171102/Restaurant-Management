import React, { useEffect, useState } from "react";
import { forwardRef } from "react";
import { formatCurrency, formatDateTime } from "../../helper/format";
import OrderType from "./../../enums/OrderTypeEnum";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config";
import { formatIsoToDate } from "./../../helper/format";

const OrderPrinter = forwardRef((props, ref) => {
  const order = props.order;
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_HOST}/order/${order.id}`);
        setCurrentOrder(response.data);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [order]);

  if (isLoading) return <></>;
  if (currentOrder === null) return <></>;

  const groupedItems = {};

  currentOrder.items.forEach((item) => {
    const key = `${item.item.id}-${item.price}`;

    if (groupedItems[key]) {
      groupedItems[key].quantity += item.quantity; 
    } else {
      groupedItems[key] = { ...item };
    }
  });

  const mergedItems = Object.values(groupedItems);

  return (
    <div ref={ref} className="p-4 font-semibold">
      <h1 className="text-blac text-center font-bold text-2xl">
      ILLDIVO RESTAURANT
      </h1>
      <div className="flex justify-between mt-6">
        <span>Mã hóa đơn</span>
        <span>#{currentOrder?.id}</span>
      </div>
      <div className="flex justify-between">
        <span>Ngày tạo</span>
        <span>{formatIsoToDate(currentOrder?.createAt)}</span>
      </div>
      <div className="flex justify-between">
        <span>Bàn</span>
        <span>
          {currentOrder?.type === OrderType.DINE_IN
            ? currentOrder.tables.map((table) => (
                <span key={table.id}>Bàn {table.table.name} - Khu {table.table.area.name}</span>
              ))
            : "Mang về"}
        </span>
      </div>

      <div className="w-full h-[2px] bg-black my-4"></div>

      <div>
        <table class="table-auto mt-5 w-full text-left">
          <thead className="w-full">
            <tr>
              <th class="border-0 pr-2 w-[40%]">Tên món</th>
              <th class="border-0 pr-2">Đơn giá</th>
              <th class="border-0 pr-2">Sl</th>
              <th class="border-0 pr-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {currentOrder &&
              mergedItems &&
              mergedItems.map((orderItem, index) => {
                return (
                  <tr key={index} className="align-top">
                    <td>{orderItem.item.title}</td>
                    <td>{formatCurrency(orderItem.price)} đ</td>
                    <td>{orderItem.quantity}</td>
                    <td>
                      {formatCurrency(orderItem.price * orderItem.quantity)} đ
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="w-full h-[2px] bg-black my-4"></div>
      <div className="mt-2 flex items-center justify-between font-semibold">
        <h4 className="text-base">Tổng cộng:</h4>
        <span>{formatCurrency(currentOrder?.grandTotal)} đ</span>
      </div>
    </div>
  );
});

export default OrderPrinter;

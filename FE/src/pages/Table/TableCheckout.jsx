import { FaCircle } from "react-icons/fa";
import DinnerTable from "../../components/Tables";
import {
  InUseCircle,
  ReadyCircle,
  UnavailableCircle,
} from "../../components/TableStatus";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import config from "../../config";
import {
  FaBowlRice,
  FaCashRegister,
  FaCreditCard,
  FaFileInvoice,
} from "react-icons/fa6";
import { Button } from "flowbite-react";
import { formatCurrency } from "./../../helper/format";
import { CartSidebarItem } from "../../components/CartSidebar";
import { toast } from "react-toastify";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";
import PaymentStatus from "../../enums/PaymentStatus";
import { GiReturnArrow } from "react-icons/gi";
import ReactToPrint from "react-to-print";
import { OrderPrinter } from "../../components/Order";
import CashCheckoutModal from "../../components/Modal/CashCheckoutModal";
import { node } from "prop-types";
import OrderItemStatus from "../../enums/OrderItemStatus";

function TableCheckout() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [cashCheckoutShow, setCashCheckoutShow] = useState(false);
  const clientRef = useRef(null);

  const printOrderRef = useRef();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_HOST}/tables/all`);
        setTables(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Lấy dữ liệu bàn ăn không thành công!"
        );
      }
    };

    fetchData();

    return () => {
      setTables([]);
    };
  }, []);

  const handlePaymentMessage = useCallback((message) => {
    const paidOrder = JSON.parse(message.body);
    toast.success(`Hóa đơn #${paidOrder.id} đã được thanh toán!`);

    const updatedTables = tables.map((table) => {
      if (table?.currentOrder?.id === paidOrder.id) {
        return { ...table, currentOrder: paidOrder };
      }
      return table;
    });

    setTables(updatedTables);

    if (selectedTable?.currentOrder?.id === paidOrder.id) {
      setSelectedTable({ ...selectedTable, currentOrder: paidOrder });
    }
  }, [tables, selectedTable]);

  const handleTableUpdateMessage = useCallback((message) => {
    const updatedTable = JSON.parse(message.body);
    setTables((prevTables) => {
      return prevTables.map((table) => {
        if (table.id === updatedTable.id) {
          return updatedTable;
        }
        return table;
      });
    });
    if (selectedTable?.id === updatedTable.id) {
      setSelectedTable(updatedTable);
    }
  }, [tables, selectedTable]);

  useEffect(() => {
    const socket = new SockJS(`${config.HOST}/ws`);
    const client = Stomp.over(socket);
    clientRef.current = client

    let paymentSuccessSubscription = null;
    let tableUpdateSubscription = null;
  
    client.connect({}, () => {
      paymentSuccessSubscription = client.subscribe(
        "/topic/payment/success-payment/*",
        handlePaymentMessage
      );
      tableUpdateSubscription = client.subscribe(
        "/topic/table/update/*",
        handleTableUpdateMessage
      );
    });
  
    return () => {
      if (paymentSuccessSubscription) {
        paymentSuccessSubscription.unsubscribe();
      }
      if (tableUpdateSubscription) {
        tableUpdateSubscription.unsubscribe();
      }
      if (clientRef.current && clientRef.current.connected) {
        clientRef.current.disconnect();
      }
    };
  }, [handleTableUpdateMessage, handlePaymentMessage]);
  

  const handleCreatePayment = async (orderId) => {
    if (isNaN(orderId)) {
      return;
    }
    try {
      const response = await axios.post(
        `${config.API_HOST}/payment/create-payment/${orderId}`
      );
      let paymentLink = response.data;
      window.open(paymentLink, "_blank");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Tạo thanh toán Online không thành công!"
      );
    }
  };

  const handleReturnTable = async (tableId) => {
    if (isNaN(tableId)) {
      return;
    }
    try {
      await axios.post(`${config.API_HOST}/table/return-table/${tableId}`);
      toast.success("Trả bàn thành công!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Trả bàn không thành công!"
      );
    }
  };

  const handleRemindOrder = async (orderId) => {
    if (isNaN(orderId)) {
      return;
    }
    try {
      await axios.post(`${config.API_HOST}/payment/remind/${orderId}`);
      toast.success("Hoàn tiền thành công!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Hoàn tiền không thành công!"
      );
    }
  };

  return (
    <>
      <div className="relative size-full">
        <div className="flex">
          <div className="w-3/4">
            <div className="p-6 flex flex-col">
              <div className="grid grid-cols-4 gap-4">
                {tables.map((table) => (
                  <DinnerTable
                    tableData={table}
                    handleClick={() => setSelectedTable(table)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="fixed top-16 right-0 bottom-0 z-10 w-96 h-[calc(100%-4rem)]">
            <div className="flex flex-col size-full bg-[rgb(42,55,79)] h-full">
              <div className="flex justify-between items-center px-6 py-4 border-b border-[rgb(60,78,113)]">
                <div className="flex items-center font-semibold">
                  <FaBowlRice className="mr-3" size={"24px"} />
                  Bàn {selectedTable?.name} - Khu {selectedTable?.area.name}
                </div>
                <div className="text-xs">
                  Hóa đơn : #{selectedTable?.currentOrder?.id}
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {selectedTable?.currentOrder &&
                  Object.values(
                    selectedTable.currentOrder.items.filter(item => !(item.status == OrderItemStatus.CANCELLED)).reduce(
                      (acc, orderItem) => {
                        const { item, quantity } = orderItem;
                        if (acc[item.id]) {
                          acc[item.id].quantity += quantity;
                        } else {
                          acc[item.id] = { ...orderItem };
                        }
                        return acc;
                      },
                      {}
                    )
                  ).map((orderItem) => (
                    <CartSidebarItem
                      key={orderItem.item.id}
                      orderItem={orderItem}
                    />
                  ))}
              </div>
              {selectedTable?.currentOrder && (
                <div className="p-4 border-t border-[rgb(60,78,113)]">
                  <div className="pb-3">
                    <div className="flex items-center mb-2">
                      <div>Tổng</div>
                      <div className="flex-1 text-end h6 mb-0">
                        {selectedTable?.currentOrder &&
                          formatCurrency(selectedTable?.currentOrder.total) +
                            " VNĐ"}
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <div>VAT ({config.VAT_FEE_PERCENT}%)</div>
                      <div className="flex-1 text-end h6 mb-0">
                        {selectedTable?.currentOrder &&
                          formatCurrency(selectedTable?.currentOrder.vatFee) +
                            " VNĐ"}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>Tổng cộng</div>
                      <div className="flex-1 text-end h6 mb-0">
                        {selectedTable?.currentOrder &&
                          formatCurrency(
                            selectedTable?.currentOrder.grandTotal
                          ) + " VNĐ"}
                      </div>
                    </div>
                    {selectedTable?.currentOrder?.paid > 0 && (
                      <div className="flex items-center mt-2">
                        <div>Đã thanh toán</div>
                        <div className="flex-1 text-end h6 mb-0">
                          {selectedTable?.currentOrder &&
                            formatCurrency(selectedTable?.currentOrder.paid) +
                              " VNĐ"}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center border-t border-[rgb(60,78,113)] py-2 mb-2">
                    <div>Còn lại</div>
                    <div className="flex-1 text-end text-lg font-bold mb-0">
                      {selectedTable?.currentOrder &&
                        formatCurrency(
                          selectedTable?.currentOrder.grandTotal -
                            selectedTable?.currentOrder.paid
                        ) + " VNĐ"}
                    </div>
                  </div>
                  {selectedTable?.currentOrder && (
                    <div className="mt-3">
                      <ReactToPrint
                        trigger={() => (
                          <Button
                            className="flex flex-1 w-full flex-col px-3 py-2 items-center justify-center border border-[rgb(61,80,115)] rounded-md text-center hover:opacity-80"
                            color="black"
                          >
                            <FaFileInvoice className="mr-4" size={"16px"} />
                            <span className="mt-1 text-sm font-semibold text-white">
                              In hóa đơn
                            </span>
                          </Button>
                        )}
                        content={() => printOrderRef.current}
                      />

                      <div className="mt-3 flex items-stretch gap-4">
                        {(() => {
                          switch (selectedTable?.currentOrder?.paymentStatus) {
                            case PaymentStatus.PAID:
                              return (
                                <Button
                                  className="flex flex-1 flex-col px-3 py-2 items-center justify-center rounded-md text-center"
                                  color="success"
                                  pill
                                  onClick={() =>
                                    handleReturnTable(selectedTable?.id)
                                  }
                                >
                                  <GiReturnArrow
                                    className="mr-4"
                                    size={"16px"}
                                  />
                                  Trả bàn
                                </Button>
                              );
                            case PaymentStatus.REFUND_NEEDED:
                              return (
                                <Button
                                  className="flex flex-1 flex-col px-3 py-2 items-center justify-center rounded-md text-center"
                                  color="purple"
                                  pill
                                  onClick={() =>
                                    handleRemindOrder(
                                      selectedTable?.currentOrder?.id
                                    )
                                  }
                                >
                                  Hoàn tiền
                                </Button>
                              );
                            case PaymentStatus.PENDING:
                            case PaymentStatus.MISSING:
                              return (
                                <>
                                  <Button
                                    className="flex flex-1 flex-col px-3 py-2 items-center justify-center rounded-md text-center"
                                    color="purple"
                                    pill
                                    onClick={() => {
                                      setCashCheckoutShow(true);
                                    }}
                                  >
                                    <FaFileInvoice
                                      className="mr-4"
                                      size={"16px"}
                                    />
                                    <span className="mt-1 text-sm font-semibold">
                                      Tiền mặt
                                    </span>
                                  </Button>

                                  <Button
                                    className="flex flex-1 flex-col px-3 py-2 items-center justify-center bg-[rgb(31,107,255)] border border-[rgb(61,80,115)] rounded-md text-center hover:opacity-80"
                                    color="blue"
                                    onClick={() =>
                                      !selectedTable ||
                                      selectedTable.currentOrder
                                        .paymentStatus !== PaymentStatus.PAID
                                        ? handleCreatePayment(
                                            selectedTable?.currentOrder?.id
                                          )
                                        : null
                                    }
                                    disabled={
                                      !selectedTable ||
                                      selectedTable?.currentOrder
                                        ?.paymentStatus === PaymentStatus.PAID
                                    }
                                  >
                                    <FaCreditCard
                                      className="mr-4"
                                      size={"16px"}
                                    />
                                    <span className="mt-1 text-sm font-semibold">
                                      Chuyển khoản
                                    </span>
                                  </Button>
                                </>
                              );
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedTable?.currentOrder && (
        <div style={{ display: "none" }}>
          <OrderPrinter
            ref={printOrderRef}
            order={selectedTable?.currentOrder}
          />
        </div>
      )}
      <CashCheckoutModal
        show={cashCheckoutShow}
        order={selectedTable && selectedTable?.currentOrder}
        handleClose={() => setCashCheckoutShow(false)}
      />
    </>
  );
}

export default TableCheckout;

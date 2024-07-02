import { Link } from "react-router-dom";
import DinnerTable from "../../components/Tables/DinnerTable";
import {
  InUseCircle,
  ReadyCircle,
  UnavailableCircle,
} from "../../components/TableStatus";
import { useEffect, useState } from "react";
import config from "../../config";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";
import { useSelector } from "react-redux";
import OrderType from "../../enums/OrderTypeEnum";

function Tables() {
  const [tables, setTables] = useState([]);
  const [selectedTableIds, setSelectedTableIds] = useState([]);

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

  const handleCreateOrder = async () => {
    try {
      if (selectedTableIds.length <= 0) return;
      const response = await axios.post(`${config.API_HOST}/order/create`, {
        type: OrderType.DINE_IN,
        tableIds: selectedTableIds,
      });
      setSelectedTableIds([]);
      toast.success("Đã tạo hóa đơn thành công!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Tạo hóa đơn không thành công!"
      );
    }
  };

  useEffect(() => {
    const socket = new SockJS(`${config.HOST}/ws`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      const successPaymentSubscription = client.subscribe(
        "/topic/payment/success-payment",
        (message) => {
          const paidOrder = JSON.parse(message.body);
          toast.success(`Hóa đơn #${paidOrder.id} đã thanh toán!`);
          setTables((prevTables) => {
            return prevTables.map((table) => {
              if (
                table.currentOrder &&
                table.currentOrder.id === paidOrder.id
              ) {
                return { ...table, currentOrder: paidOrder };
              }
              return table;
            });
          });
        }
      );

      const tableUpdateSubscription = client.subscribe(
        "/topic/table/update/*",
        (message) => {
          const updatedTable = JSON.parse(message.body);
          console.log(updatedTable);
          setTables((prevTables) => {
            return prevTables.map((table) => {
              return table.id === updatedTable.id ? updatedTable : table;
            });
          });
        }
      );

      return () => {
        successPaymentSubscription.unsubscribe();
        tableUpdateSubscription.unsubscribe();
        client.disconnect();
      };
    });

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, []);

  const handleSelectTable = (tableId) => {
    if (!selectedTableIds.includes(tableId)) {
      setSelectedTableIds((prev) => [...prev, tableId]);
    } else {
      setSelectedTableIds((prev) => prev.filter((id) => tableId != id));
    }
  };

  return (
    <>
      <div className="relative size-full">
        <div className="flex flex-col">
          <div className="flex justify-between mb-6">
            <div className="text-xl mb-1">
              Bàn trống ({" "}
              {tables.filter((table) => table.status === "READY").length} /{" "}
              {tables.length} )
            </div>
            <div className="flex items-center mb-2 gap-3 mb-md-0">
              <div className="flex items-center me-3">
                <ReadyCircle className="mr-2" />
                Sẵn sàng
              </div>
              <div className="flex items-center me-3">
                <InUseCircle className="mr-2" />
                Đang dùng
              </div>
              <div className="flex items-center me-3">
                <UnavailableCircle className="mr-2" />
                Không khả dụng
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {tables.map((table) =>
              table?.currentOrder ? (
                selectedTableIds.length === 0 ? (
                  <Link
                    key={table.id}
                    to={config.routes.tableOrdering.replace(":id", table.id)}
                  >
                    <DinnerTable tableData={table} />
                  </Link>
                ) : (
                  <DinnerTable key={table.id} tableData={table} />
                )
              ) : (
                <div
                  key={table.id}
                  className="divvvv"
                  onClick={() => handleSelectTable(table.id)}
                >
                  <DinnerTable
                    selected={selectedTableIds.includes(table.id)}
                    tableData={table}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
      {selectedTableIds.length > 0 && (
        <div class="fixed px-4 py-3 bottom-5 right-10 z-50 bg-[rgb(42,55,79)] rounded-md">
          <div className="flex items-center">
            <button
              onClick={() => handleCreateOrder()}
              className="text-white-600 hover:text-white border border-blue-600 text-base hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  px-5 py-2.5 text-center"
            >
              Tạo hóa đơn
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Tables;

import { Breadcrumb, Card, Pagination, Spinner, Table } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import config from "../../config";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { formatCurrency, formatDateTime } from "../../helper/format";
import OrderType from "../../enums/OrderTypeEnum";
import PaymentStatus from "../../enums/PaymentStatus";
import { GoDotFill } from "react-icons/go";
import OrderStatus from "../../enums/OrderStatus";
import Stomp from "stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { FaEye, FaPrint } from "react-icons/fa6";
import { LuEye } from "react-icons/lu";
import { OrderPrinter } from "../../components/Order";
import ReactToPrint from "react-to-print";

function OrderList() {
  let [searchParams, setSearchParams] = useSearchParams();
  const printOrderRef = useRef();

  const navigate = useNavigate();
  let page = parseInt(searchParams.get("page")) || 1;
  const currentPage = page;

  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState();

  const handleOrderUpdateMessage = useCallback((message) => {
    const updatedOrder = JSON.parse(message.body);
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order.id === updatedOrder.id) {
          return updatedOrder;
        }
        return order;
      });
    });
  }, []);

  useEffect(() => {
    const socket = new SockJS(`${config.HOST}/ws`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/topic/order/update/*", handleOrderUpdateMessage);
    });

    return () => {
      client.disconnect();
    };
  }, [handleOrderUpdateMessage]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${config.API_HOST}/orders?page=${page}`
        );
        setOrders(response.data.items);
        setTotalPage(response.data.totalPage);
        setTotal(response.data.total);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Load dữ liệu hóa đơn không thành công!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handlePageChange = useCallback((page) => {
    navigate(`?page=${page}`);
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item>Danh sách hóa đơn</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card className="mt-10 w-full">
        <div className="">
          <Table striped className="mt-10">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Ngày tạo</Table.HeadCell>
              <Table.HeadCell>Tổng tiền</Table.HeadCell>
              <Table.HeadCell>Thanh toán</Table.HeadCell>
              <Table.HeadCell>Trạng thái</Table.HeadCell>
            </Table.Head>
            {isLoading ? (
              <div role="status" className="flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  class="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <Table.Body>
                {orders.map((order) => (
                  <Table.Row
                    key={order.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      <Link
                        to={"/order/" + order.id}
                        className="text-blue-800 font-semibold"
                      >
                        #{order.id}
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {formatDateTime(order.createAt)}
                    </Table.Cell>
                    <Table.Cell className="font-bold">
                      {formatCurrency(order.grandTotal)} VNĐ
                    </Table.Cell>
                    <Table.Cell>
                      {(() => {
                        switch (order.paymentStatus) {
                          case PaymentStatus.PENDING:
                            return (
                              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium me-2">
                                <GoDotFill color={"gray"} className="mr-2" />
                                Chờ thanh toán
                              </span>
                            );
                          case PaymentStatus.CANCELLED:
                            return (
                              <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm font-medium me-2">
                                <GoDotFill color={"red"} className="mr-2" />
                                Bị hủy
                              </span>
                            );
                          case PaymentStatus.MISSING:
                            return (
                              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium me-2 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                <GoDotFill color={"yellow"} className="mr-2" />
                                Thanh toán thiếu
                              </span>
                            );
                          case PaymentStatus.PROCESSING:
                            return (
                              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium me-2">
                                <GoDotFill color={"blue"} className="mr-2" />
                                Đang xử lý
                              </span>
                            );
                          case PaymentStatus.REFUND_NEEDED:
                            return (
                              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-sm font-medium me-2 rounded dark:bg-purple-900 dark:text-purple-300">
                                <GoDotFill color={"purple"} className="mr-2" />
                                Cần hoàn tiền
                              </span>
                            );
                          case PaymentStatus.PAID:
                            return (
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm font-medium me-2 rounded dark:bg-green-900 dark:text-green-300">
                                <GoDotFill color={"green"} className="mr-2" />
                                Đã thanh toán
                              </span>
                            );
                        }
                      })()}
                    </Table.Cell>
                    <Table.Cell>
                      {(() => {
                        switch (order.status) {
                          case OrderStatus.Pending:
                            return (
                              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium me-2">
                                <GoDotFill color={"gray"} className="mr-2" />
                                Chờ xác nhận
                              </span>
                            );
                          case OrderStatus.InProgress:
                            return (
                              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium me-2">
                                <GoDotFill color={"blue"} className="mr-2" />
                                Đang phục vụ
                              </span>
                            );

                          case OrderStatus.Completed:
                            return (
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm font-medium me-2 rounded dark:bg-green-900 dark:text-green-300">
                                <GoDotFill color={"green"} className="mr-2" />
                                Đã hoàn thành
                              </span>
                            );
                        }
                      })()}
                    </Table.Cell>
                    <Table.Cell className="flex items-center">
                      <Link
                        to={config.routes.orderInfo.replace(":id", order.id)}
                        className=""
                      >
                        <LuEye
                          color="rgb(35,119,252)"
                          size={24}
                          title="Xem hóa đơn"
                        />
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            )}
          </Table>
        </div>
        <div className="mt-4 flex justify-between items-center overflow-x-auto text-black">
          <div className="font-semibold">
            Hiển thị: {orders.length} / {total}{" "}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            showIcons
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </>
  );
}

export default OrderList;

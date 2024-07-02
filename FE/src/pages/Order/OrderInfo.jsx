import { Avatar, Breadcrumb, Card, Table } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import config from "../../config";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  formatCurrency,
  formatDateTime,
  formatIsoToDate,
} from "../../helper/format";
import OrderType from "../../enums/OrderTypeEnum";
import { GoDotFill } from "react-icons/go";
import PaymentStatus from "../../enums/PaymentStatus";

function OrderInfo() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_HOST}/order/${id}`);
        setOrder(response.data);
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
  }, []);

  if (isLoading) return <>Đang tải...</>;

  if (order == null) {
    return "Không tìm thấy đơn hàng!";
  }

  const groupedItems = {};

  order.items.forEach((item) => {
    const key = `${item.item.id}-${item.price}`;

    if (groupedItems[key]) {
      groupedItems[key].quantity += item.quantity; 
    } else {
      groupedItems[key] = { ...item };
    }
  });

  const mergedItems = Object.values(groupedItems);

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item>
            <Link to={config.routes.orderList}>Danh sách hóa đơn</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Thông tin hóa đơn</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-x-5">
        <div className="col-span-2">
          <Card>
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Món ăn</Table.HeadCell>
                <Table.HeadCell>Giá</Table.HeadCell>
                <Table.HeadCell>Số lượng</Table.HeadCell>
                <Table.HeadCell>Thành tiền</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {mergedItems.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="flex items-center font-bold text-black">
                      <Avatar
                        size="lg"
                        className="mr-3"
                        img={`${config.API_IMAGE_HOST}/${item.item.thumb}`}
                      />
                      {item.item.title}
                    </Table.Cell>
                    <Table.Cell>{formatCurrency(item.price)} đ</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                    <Table.Cell>
                      {formatCurrency(item.price * item.quantity)} đ
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col gap-4">
            <Card>
              <div className="flex flex-col gap-10">
                <div className="flex items-center gap-4">
                  <span className="text-[rgb(87,88,100)] w-24">Mã hóa đơn</span>
                  <span className="text-[rgb(17,17,17)] font-semibold">
                    #{order.id}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[rgb(87,88,100)] w-24">Ngày tạo</span>
                  <span className="text-[rgb(17,17,17)] font-semibold">
                    {formatDateTime(order.createAt)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[rgb(87,88,100)] w-24">Loại</span>
                  <span className="text-[rgb(17,17,17)] font-semibold">
                    {(() => {
                      switch (order.type) {
                        case OrderType.DINE_IN:
                          return <>Tại bàn</>;
                        case OrderType.DINE_IN:
                          return <>Mang đi</>;
                      }
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[rgb(87,88,100)] w-24">Trạng thái</span>
                  <span className="text-[rgb(17,17,17)] font-semibold">
                    {formatDateTime(order.createAt)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[rgb(87,88,100)] w-24">Thanh toán</span>
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
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-10">
                <div className="flex items-center gap-4">
                  <span className="text-[rgb(87,88,100)] w-24">Thành tiền</span>
                  <span className="text-[rgb(17,17,17)] font-semibold">
                    {formatCurrency(order.total)} đ
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[rgb(87,88,100)] w-24">
                    Phí VAT ({config.VAT_FEE_PERCENT}%)
                  </span>
                  <span className="text-[rgb(17,17,17)] font-semibold">
                    {formatCurrency(order.vatFee)} đ
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[rgb(87,88,100)] w-24">Tổng tiền</span>
                  <span className="text-[rgb(17,17,17)] font-semibold">
                    {formatCurrency(order.grandTotal)} đ
                  </span>
                </div>
                {order.paid > 0 && order.paid != order.grandTotal && (
                  <>
                    <div className="w-full h-[1px] bg-[rgb(237,241,245)]"></div>
                    <div className="flex items-center gap-4">
                      <span className="text-[rgb(87,88,100)] w-24">
                        Đã thanh toán
                      </span>
                      <span className="text-[rgb(17,17,17)] font-semibold">
                        {formatCurrency(order.paid)} đ
                      </span>
                    </div>
                    {order.paid > order.grandTotal ? (
                      <div className="flex items-center gap-4">
                        <span className="text-[rgb(87,88,100)] w-24">
                          Trả lại khách
                        </span>
                        <span className="text-[rgb(17,17,17)] font-semibold">
                          {formatCurrency(order.paid - order.grandTotal)} đ
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className="text-[rgb(87,88,100)] w-24">
                          Còn lại
                        </span>
                        <span className="text-[rgb(17,17,17)] font-semibold">
                          {formatCurrency(order.grandTotal - order.paid)} đ
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderInfo;

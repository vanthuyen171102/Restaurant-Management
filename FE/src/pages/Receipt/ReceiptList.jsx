import {
  Breadcrumb,
  Card,
  Pagination,
  Spinner,
  Table,
  Button,
  Modal
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import config from "../../config";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { formatCurrency, formatDateTime } from "../../helper/format";
import OrderType from "../../enums/OrderTypeEnum";
import PaymentStatus from "../../enums/PaymentStatus";
import { GoDotFill } from "react-icons/go";
import OrderStatus from "../../enums/OrderStatus";
import Stomp from "stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { FaEye } from "react-icons/fa6";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

function ReceiptList() {
  let [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  let page = parseInt(searchParams.get("page")) || 1;
  const currentPage = page;

  const [isLoading, setIsLoading] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${config.API_HOST}/material-receipts?page=${page}`
        );
        setReceipts(response.data.items);
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

  const handleDeleteClick = (receipt) => {
    setSelectedReceipt(receipt);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${config.API_HOST}/material-receipts/delete/${selectedReceipt.id}`);
      toast.success("Xóa biên lai thành công!");
      setReceipts(receipts.filter(receipt => receipt.id !== selectedReceipt.id));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Xóa biên lai không thành công!"
      );
    } finally {
      setShowDeleteModal(false);
      setSelectedReceipt(null);
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item>Danh sách biên lai</Breadcrumb.Item>
        </Breadcrumb>
        <Link to={config.routes.createReceipt}>
          <Button color={"blue"}>
            <IoAddCircleOutline className="mr-2 h-5 w-5" />
            Thêm biên lai
          </Button>
        </Link>
      </div>
      <Card className="mt-10 w-full">
        <div className="">
          <Table striped className="mt-10">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Nhà cung cấp</Table.HeadCell>
              <Table.HeadCell>Ngày tạo</Table.HeadCell>
              <Table.HeadCell>Tổng tiền</Table.HeadCell>
              <Table.HeadCell>Thanh toán</Table.HeadCell>
              <Table.HeadCell>Hành động</Table.HeadCell>
            </Table.Head>
            {isLoading ? (
              <div role="status" className="flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <Table.Body>
                {receipts.map((receipt) => (
                  <Table.Row
                    key={receipt.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      <Link
                        to={"/receipt/" + receipt.id}
                        className="text-blue-800 font-semibold"
                      >
                        #{receipt.id}
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {receipt.supplier.name}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {formatDateTime(receipt.createdAt)}
                    </Table.Cell>
                    <Table.Cell className="font-bold">
                      {formatCurrency(receipt.total)} đ
                    </Table.Cell>
                    <Table.Cell>
                      {receipt?.paid ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm font-medium me-2 rounded dark:bg-green-900 dark:text-green-300">
                          <GoDotFill color={"green"} className="mr-2" />
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium me-2">
                          <GoDotFill color={"gray"} className="mr-2" />
                          Chưa thanh toán
                        </span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={config.routes.receiptInfo.replace(
                          ":id",
                          receipt.id
                        )}
                        className="inline-flex items-center px-2 py-1 rounded-md border bg-purple-100 border-[purple] text-purple-800"
                      >
                        <FaEye size={"12"} color="purple" className="mr-2" />
                        Xem thông tin
                      </Link>
                      <Link
                        to={config.routes.editReceipt.replace(
                          ":id",
                          receipt.id
                        )}
                        className="ml-2 inline-flex items-center px-2 py-1 rounded-md border bg-green-100 text-green-600 border-[green]"
                      >
                        <CiEdit size={"12"} color="green" className="mr-2" />
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(receipt)}
                        className="ml-2 inline-flex items-center px-2 py-1 rounded-md border bg-red-100 text-red-600 border-[red]"
                      >
                        <MdDeleteForever
                          size={"12"}
                          color="red"
                          className="mr-2"
                        />
                        Xóa
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            )}
          </Table>
        </div>
        <div className="mt-4 flex justify-between items-center overflow-x-auto text-black">
          <div className="font-semibold">
            Hiển thị: {receipts.length} / {total}{" "}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            showIcons
            onPageChange={handlePageChange}
          />
        </div>
      </Card>

      <Modal
        show={showDeleteModal}
        size="md"
        popup
        onClose={() => setShowDeleteModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <MdDeleteForever size={36} className="mx-auto mb-4 text-red-600" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc chắn muốn xóa biên lai này không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteConfirm}>
                Có, tôi chắc chắn
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                Không, hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ReceiptList;

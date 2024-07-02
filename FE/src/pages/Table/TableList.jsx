import axios from "axios";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  Modal,
  Pagination,
  Table,
  Textarea,
} from "flowbite-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { HiHome, HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "./../../config/index";
import { IoAddCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import routes from "../../config/routes";

function TableList() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get("page")) || 1;
  const currentPage = page;

  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingRange, setBookingRange] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [tables, setTables] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${config.API_HOST}/tables?page=${currentPage}`
        );
        setTables(response.data.items);
        setTotalPages(response.data.totalPage);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Lỗi khi tải dữ liệu bàn!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = useCallback((page) => {
    navigate(`?page=${page}`);
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `${config.API_HOST}/table/delete/${selectedTableId}`
      );
      const deletedTableId = selectedTableId;
      setTables(
        tables.filter((table) =>
          table.id != deletedTableId
        )
      );
      toast.success(`Đã xóa bàn #${selectedTableId}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Xóa bàn ${selectedTableId} không thành công`
      );
    } finally {
      setSelectedTableId(null);
      setOpenModal(false);
    }
  };

  return (
    <>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <MdDeleteForever size={36} className="mx-auto mb-4 text-red-600" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc chắn muốn xóa bàn này không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteConfirm}>
                Có, tôi chắc chắn
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Không, hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to={routes.admin}>
            <Breadcrumb.Item icon={HiHome}>Trang quản trị</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item>Danh sách bàn ăn</Breadcrumb.Item>
        </Breadcrumb>
        <Link to={config.routes.createTable}>
          <Button color={"blue"}>
            <IoAddCircleOutline className="mr-2 h-5 w-5" />
            Tạo bàn ăn
          </Button>
        </Link>
      </div>
      <Card className="mt-10 w-full">
        <div className="">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Tên bàn</Table.HeadCell>
              <Table.HeadCell>Số chỗ ngồi</Table.HeadCell>
              <Table.HeadCell>Khu</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {tables.map((table) => (
                <Table.Row
                  key={table.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 font-semibold text-black"
                >
                  <Table.Cell>#{table.id}</Table.Cell>
                  <Table.Cell>{table.name}</Table.Cell>
                  <Table.Cell>{table.capacity}</Table.Cell>
                  <Table.Cell>{table.area.name}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center">
                      <Link
                        to={config.routes.updateTable.replace(":id", table.id)}
                        className="text-purple-600 hover:text-white border border-purple-600 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:hover:bg-purple-600 dark:focus:ring-purple-800"
                      >
                        Xem / Sửa thông tin
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedTableId(table.id);
                          setOpenModal(true);
                        }}
                        className="text-red-600 hover:text-white border border-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-800"
                      >
                        Xóa
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="mt-4 flex justify-end overflow-x-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            showIcons
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </>
  );
}

export default TableList;

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
} from "flowbite-react";
import { useEffect, useState, useCallback } from "react";
import { HiHome, HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "./../../config/index";
import { IoAddCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaEllipsisVertical } from "react-icons/fa6";
import { formatIsoToDate, formatPhoneNumber } from "../../helper/format";
import Dropdwon from "../../components/Dropdown/Dropdown";

function EmployeeList() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get("page")) || 1;
  const currentPage = page;

  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${config.API_HOST}/employees?page=${currentPage}`
        );
        setEmployees(response.data.items);
        setTotalPages(response.data.totalPage);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Lỗi khi tải dữ liệu nhân viên!"
        );
      } finally {
        setIsLoading(false);
    }
    };

    fetchEmployees();
  }, [currentPage]);

  const handlePageChange = useCallback((page) => {
    navigate(`?page=${page}`);
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${config.API_HOST}/employee/delete/${selectedEmployeeId}`
      );
      setEmployees(employees.filter(
        (employee) => employee.id !== selectedEmployeeId
      ));
      toast.success(`Đã xóa nhân viên #${selectedEmployeeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || `Xóa nhân viên #${selectedEmployeeId} không thành công`);
    } finally {
      setOpenModal(false);
    }
  };

  return (
    <>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn xóa nhân viên này?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  handleConfirmDelete();
                }}
              >
                {"Đồng ý"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Không
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item>Employees</Breadcrumb.Item>
        </Breadcrumb>
        <Link to={config.routes.createEmployee}>
          <Button color={"blue"}>
            <IoAddCircleOutline className="mr-2 h-5 w-5" />
            Thêm nhân viên
          </Button>
        </Link>
      </div>
      <Card className="mt-10 w-full">
        <div className="">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Tên nhân viên</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>SĐT</Table.HeadCell>
              <Table.HeadCell>Ngày sinh</Table.HeadCell>
              <Table.HeadCell>Quyền</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {employees.map((employee) => (
                <Table.Row
                  key={employee.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <Link to={"/employee/" + employee.id}>#{employee.id}</Link>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center font-semibold ">
                      <Avatar
                        img={`${config.API_IMAGE_HOST}/${employee.avatar}`}
                        size="lg"
                        className="mr-3 select-none"
                      />
                      {employee.fullName}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{employee.email}</Table.Cell>
                  <Table.Cell>
                    <a
                      href={`tel:${employee.phone}`}
                      className="hover:text-cyan-700"
                    >
                      {formatPhoneNumber(employee.phone)}
                    </a>
                  </Table.Cell>
                  <Table.Cell>{formatIsoToDate(employee.birth)}</Table.Cell>
                  <Table.Cell>{employee.role.nameVI}</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      label=""
                      placement="bottom"
                      renderTrigger={() => (
                        <span className="cursor-pointer">
                          <FaEllipsisVertical />
                        </span>
                      )}
                    >
                      <Dropdown.Item>
                        <Link
                          className="text-gray-700 block px-4 py-2 text-sm"
                          to={`${config.routes.editEmployee.replace(
                            ":id",
                            employee.id
                          )}`}
                        >
                          Sửa
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="text-gray-700 block px-4 py-2 text-sm"
                        onClick={() => {
                          setSelectedEmployeeId(employee.id);
                          setOpenModal(true);
                        }}
                      >
                        Xóa
                      </Dropdown.Item>
                    </Dropdown>
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

export default EmployeeList;

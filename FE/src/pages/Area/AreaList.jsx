import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import config from "../../config";
import {
  Modal,
  Table,
  Button,
  Breadcrumb,
  Dropdown,
  Card,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { HiHome, HiOutlineExclamationCircle } from "react-icons/hi";
import { IoAddCircleOutline } from "react-icons/io5";
import { formatIsoToDate } from "../../helper/format";
import { FaEllipsisVertical } from "react-icons/fa6";
import routes from "../../config/routes";

function AreaList() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_HOST}/area/all`);
        setAreas(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Load dữ liệu khu vực bàn không thành công!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      setAreas([]);
    };
  }, []);

  const handleDelete = async () => {
    // console.log(selectedCatId);
    // try {
    //   await axios.delete(`${config.API_HOST}/category/delete/${selectedCatId}`);
    //   setOpenModal(false);
    //   setCategories(
    //     categories.filter((category) => category.id !== selectedCatId)
    //   );
    //   toast.success(`Đã xóa danh mục #${selectedCatId}`);
    // } catch (error) {
    //   setOpenModal(false);
    //   toast.error(
    //     error?.response?.data?.message ||
    //       `Xóa danh mục #${selectedCatId} không thành công`
    //   );
    // }
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
              Bạn có chắc muốn xóa khu vực này?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  handleDelete();
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
          <Link to={routes.admin}>
            <Breadcrumb.Item icon={HiHome}>Trang quản trị</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item>Danh sách khu vực</Breadcrumb.Item>
        </Breadcrumb>
        <Link to={config.routes.createArea}>
          <Button color={"blue"}>
            <IoAddCircleOutline className="mr-2 h-5 w-5" />
            Thêm khu vực
          </Button>
        </Link>
      </div>
      <Card className="mt-10 w-full">
        <div className="">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Tên khu vực</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {areas.map((area) => (
                <Table.Row
                  key={area.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>#{area.id}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                    {area.name}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center">
                      <Link
                        to={`${config.routes.editArea.replace(
                          ":id",
                          area.id
                        )}`}
                        className="text-purple-600 hover:text-white border border-purple-600 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:hover:bg-purple-600 dark:focus:ring-purple-800"
                      >
                        Sửa thông tin
                      </Link>
                      <button
                          onClick={() => {
                            setSelectedAreaId(area.id);
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
      </Card>
    </>
  );
}

export default AreaList;

import { Breadcrumb, Button, Modal } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { HiHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Datatable } from "../../components/Table";
import { formatCurrency } from "../../helper/format";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";

function SupplierList() {
  const [materials, setMaterials] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_HOST}/materials/all`);
        setMaterials(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Load dữ liệu nguyên liệu không thành công!"
        );
      }
    };
    fetchData();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedMaterialId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${config.API_HOST}/materials/delete/${selectedMaterialId}`);
      setMaterials(materials.filter(material => material.id !== selectedMaterialId));
      toast.success("Xóa nguyên liệu thành công!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Xóa nguyên liệu không thành công!"
      );
    } finally {
      setShowDeleteModal(false);
      setSelectedMaterialId(null);
    }
  };

  const colDefs = useMemo(
    () => [
      {
        field: "id",
        headerName: "Mã nguyên liệu",
        cellRenderer: (params) => {
          return (
            <Link
              className="hover: text-blue-500"
              to={config.routes.materialInfo.replace(":id", params.value)}
            >
              #{params.value}
            </Link>
          );
        },
        width: 90,
      },
      { field: "name", headerName: "Tên nguyên liệu" },
      {
        field: "price",
        headerName: "Giá",
        width: 120,
        cellRenderer: (params) => {
          return formatCurrency(params.value) + " đ";
        },
      },
      { field: "stock", headerName: "Tồn kho", width: 90 },
      { field: "unit", headerName: "Đơn vị tính", width: 80 },
      {
        field: "id",
        headerName: "Thao tác",
        autoHeight: true,
        cellRenderer: (params) => {
          return (
            <div className="table-actions py-2 h-auto">
              <Link
                to={config.routes.materialInfo.replace(":id", params.value)}
                className="inline-flex items-center px-2 py-1 rounded-md border bg-purple-100 border-[purple] text-purple-800"
              >
                <FaEye size={"12"} color="purple" className="mr-2" />
                Xem thông tin
              </Link>
              <Link
                to={config.routes.editMaterial.replace(":id", params.value)}
                className="ml-2 inline-flex items-center px-2 py-1 rounded-md border bg-green-100 text-green-600 border-[green]"
              >
                <CiEdit size={"12"} color="green" className="mr-2" />
                Sửa
              </Link>
              <button
                onClick={() => handleDeleteClick(params.value)}
                className="ml-2 inline-flex items-center px-2 py-1 rounded-md border bg-red-100 text-red-600 border-[red]"
              >
                <MdDeleteForever size={"12"} color="red" className="mr-2" />
                Xóa
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const rowData = useMemo(() => {
    const normalizedSearchKey = searchKey
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return materials
      .filter((material) =>
        Object.values(material).some(
          (value) =>
            typeof value === "string" &&
            value
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(normalizedSearchKey)
        )
      )
      .map((material) => {
        return {
          ...material,
        };
      });
  }, [searchKey, materials]);

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item>Danh sách nguyên liệu</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="mt-10 mb-5 ">
        <div className="flex items-center justify-end">
          <Link
            to={config.routes.createMaterial}
            className="flex items-center px-4 py-3 mr-5 text-white font-semibold rounded-lg bg-green-500"
          >
            <CiCirclePlus className="mr-2" color={"white"} size={22} />
            Thêm nguyên liệu
          </Link>
          <input
            type="text"
            className="px-4 py-2 bg-[rgba(255,255,255,.1)] rounded-xl text-white border-[rgba(255,255,255,.5)]"
            placeholder="Tìm kiếm..."
            onChange={(event) => setSearchKey(event.target.value)}
          />
        </div>
        <div className="mt-5">
          <Datatable cols={colDefs} rows={rowData} autoHeight={true} />
        </div>
        <Modal
          show={showDeleteModal}
          size="md"
          popup
          onClose={() => setShowDeleteModal(false)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <MdDeleteForever
                size={36}
                className="mx-auto mb-4 text-red-600"
              />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Bạn có chắc chắn muốn xóa nguyên liệu này không?
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
      </div>
    </>
  );
}

export default SupplierList;

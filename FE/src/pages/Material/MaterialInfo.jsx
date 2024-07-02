import axios from "axios";
import { Breadcrumb } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import config from "./../../config/index";
import { formatCurrency } from "../../helper/format";

function MaterialInfo() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [material, setMaterial] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_HOST}/materials/${id}`);
        setMaterial(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Load dữ liệu nguyên liệu không thành công!"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <>Đang tải</>;
  }
  if (material == null) {
    return <>Không tìm thấy nguyên liệu!</>;
  }

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>

          <Breadcrumb.Item>
            <Link to={config.routes.supplierList}>Danh sách nguyên liệu</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Thông tin nguyên liệu</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="w-full mt-10 rounded-lg border border-[rgb(60,78,113)] bg-[rgb(42,55,79)]">
        <h4 className=" p-4  border-b border-[rgb(60,78,113)] text-white text-lg font-bold">
          Thông tin nguyên liệu
        </h4>
        <div className="p-4 text-base">
          <div className="grid grid-cols-2 gap-y-4">
              <div className="">
                <h4 className="font-semibold text-[15px]">Tên nguyên liệu:</h4>
                <span className="">{material.name}</span>
              </div>
              <div className="">
                <h4 className="font-semibold text-[15px]">Đơn vị tính:</h4>
                <span className="">{material.unit}</span>
              </div>
              <div className="">
                <h4 className="font-semibold text-[15px]">Giá:</h4>
                <span className="">{formatCurrency(material.price)} đ</span>
              </div>
              <div className="">
                <h4 className="font-semibold text-[15px]">Tồn kho:</h4>
                <span className="">{material.stock}</span>
              </div>
          </div>
        </div>

      </div>

      <div className="w-full mt-10 rounded-lg border border-[rgb(60,78,113)] bg-[rgb(42,55,79)]">
        <h4 className=" p-4  border-b border-[rgb(60,78,113)] text-white text-lg font-bold">
         Lịch sử nhập hàng
        </h4>
      </div>
    </>
  );
}

export default MaterialInfo;

import axios from "axios";
import { Breadcrumb } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import config from "./../../config/index";

function SupplierInfo() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [supplier, setSupplier] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_HOST}/suppliers/${id}`);
        setSupplier(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Load dữ liệu NCC không thành công!"
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
  if (supplier == null) {
    return <>Không tìm thấy NCC!</>;
  }

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>

          <Breadcrumb.Item>
            <Link to={config.routes.supplierList}>Danh sách nhà cung cấp</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Thông tin NCC</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="w-full mt-10 rounded-lg border border-[rgb(60,78,113)] bg-[rgb(42,55,79)]">
        <h4 className=" p-4  border-b border-[rgb(60,78,113)] text-white text-lg font-bold">
          Thông tin NCC
        </h4>
        <div className="p-4 text-base">
          <div className="grid grid-cols-2 gap-y-4">
              <div className="">
                <h4 className="font-semibold text-[15px]">Tên nhà cung cấp:</h4>
                <span className="">{supplier?.name}</span>
              </div>
              <div className="">
                <h4 className="font-semibold text-[15px]">Số điện thoại:</h4>
                <span className="">{supplier?.phone}</span>
              </div>
              <div className="">
                <h4 className="font-semibold text-[15px]">Email:</h4>
                <span className="">{supplier?.email}</span>
              </div>
              <div className="">
                <h4 className="font-semibold text-[15px]">Địa chỉ:</h4>
                <span className="">{supplier?.address}</span>
              </div>
          </div>
        </div>

      </div>

      <div className="w-full mt-10 rounded-lg border border-[rgb(60,78,113)] bg-[rgb(42,55,79)]">
        <h4 className=" p-4  border-b border-[rgb(60,78,113)] text-white text-lg font-bold">
         Lịch sử giao dịch
        </h4>
      </div>
    </>
  );
}

export default SupplierInfo;

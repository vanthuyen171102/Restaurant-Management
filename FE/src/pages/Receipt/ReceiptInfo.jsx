import axios from "axios";
import { Breadcrumb } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import config from "./../../config/index";
import { GoDotFill } from "react-icons/go";
import { formatCurrency } from "../../helper/format";
import { Datatable } from "../../components/Table";

function ReceiptInfo() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${config.API_HOST}/material-receipts/${id}`
        );
        setReceipt(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Load dữ liệu biên lai không thành công!"
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
  if (receipt == null) {
    return <>Không tìm thấy biên lai!</>;
  }

  const colDefs = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    { field: "material.name", headerName: "Tên nguyên liệu" },
    { field: "price", headerName: "Đơn giá", cellRenderer: (params) => {
        return formatCurrency(params.value) + " đ";
      }, },
    { field: "quantity", headerName: "Số lượng", width: 150 },
    {
      field: "total",
      headerName: "Tổng tiền",
      cellRenderer: (params) => {
        return formatCurrency(params.value) + " đ";
      },
    },
  ];

  const rowData = receipt.items.map((item) => {
    return {
      ...item,
      total: item.price * item.quantity,
    };
  });

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>

          <Breadcrumb.Item>
            <Link to={config.routes.receiptList}>Danh sách biên lai</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Thông tin biên lai</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="w-full mt-10 rounded-lg border border-[rgb(60,78,113)] bg-[rgb(42,55,79)]">
        <h4 className=" p-4  border-b border-[rgb(60,78,113)] text-white text-lg font-bold">
          Thông tin biên lai
        </h4>
        <div className="p-4 text-base">
          <div className="grid grid-cols-2 gap-y-4">
            <div className="">
              <h4 className="font-semibold text-[15px]">Mã biên lai:</h4>
              <span className="inline-block mt-2">#{receipt.id}</span>
            </div>
            <div className="">
              <h4 className="font-semibold text-[15px]">Nhà cung cấp:</h4>
              <span className="inline-block mt-2">{receipt.supplier.name}</span>
            </div>
            <div className="">
              <h4 className="font-semibold text-[15px]">Tổng tiền:</h4>
              <span className="inline-block mt-2">
                {formatCurrency(receipt.total)} đ
              </span>
            </div>
            <div className="">
              <h4 className="font-semibold text-[15px]">Thanh toán:</h4>
              <span className="inline-block mt-2">
                {" "}
                {receipt?.isPaid ? (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm font-medium me-2 rounded dark:bg-green-900 dark:text-green-300">
                    <GoDotFill color={"green"} className="mr-2" />
                    Đã thanh toán
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium me-2">
                    <GoDotFill color={"gray"} className="mr-2" />
                    Chưa thanh toán
                  </span>
                )}
              </span>
            </div>
            <div className="">
              <h4 className="font-semibold text-[15px]">Người tạo:</h4>
              <span className="inline-block mt-2">
                {receipt.employee.id} - {receipt.employee.fullName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-10 rounded-lg border border-[rgb(60,78,113)] bg-[rgb(42,55,79)]">
        <h4 className=" p-4  border-b border-[rgb(60,78,113)] text-white text-lg font-bold">
          Danh sách nhập
        </h4>
        <div className="p-4">
          <Datatable cols={colDefs} rows={rowData} />
        </div>
      </div>
    </>
  );
}

export default ReceiptInfo;

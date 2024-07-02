import { useState } from "react";
import { MdTableRestaurant } from "react-icons/md";
import { AiFillDashboard } from "react-icons/ai";
import { FaFileInvoiceDollar, FaRegCalendarAlt } from "react-icons/fa";
import { IoFastFood, IoReceiptOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import SubMenu from "./SubMenu";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { FaChartArea, FaUser } from "react-icons/fa6";
import config from "./../../config/index";
import { TbCategoryFilled, TbReport } from "react-icons/tb";
import { RiShakeHandsLine } from "react-icons/ri";
import { GiWoodPile } from "react-icons/gi";

function Sidebar() {
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);

  const sidebarItems = [
    { label: "Bảng điều khiển", icon: AiFillDashboard, link: "/" },
    {
      label: "Quản lý bàn",
      icon: MdTableRestaurant,
      submenu: [
        {
          label: "Danh sách bàn",
          link: config.routes.tableList,
        },
        {
          label: "Sơ đồ bàn",
          link: config.routes.tables,
        },
        {
          label: "Tạo bàn",
          link: config.routes.createTable,
        },
        {
          label: "Thanh toán",
          link: config.routes.tableCheckout,
        },
      ],
    },
    {
      label: "Quản lý nhân viên",
      icon: FaUser,
      submenu: [
        {
          label: "Danh sách nhân viên",
          link: config.routes.employeeList,
        },
        {
          label: "Thêm mới nhân viên",
          link: config.routes.createEmployee,
        },
      ],
    },
    {
      label: "Đặt bàn",
      icon: FaRegCalendarAlt,
      submenu: [
        {
          label: "Danh sách đơn đặt bàn",
          link: config.routes.bookingList,
        },
        {
          label: "Thêm mới đơn đặt bàn",
          link: config.routes.createBooking,
        },
        {
          label: "Xếp bàn",
          link: config.routes.bookingReservation,
        },
      ],
    },
    {
      label: "Hóa đơn",
      icon: FaFileInvoiceDollar,
      link: config.routes.orderList
    },
    {
      label: "Danh mục",
      icon: TbCategoryFilled,
      submenu: [
        {
          label: "Danh sách danh mục",
          link: config.routes.categoryList,
        },
        {
          label: "Tạo danh mục mới",
          link: config.routes.createCategory,
        },
      ],
    },
    {
      label: "Khu vực",
      icon: FaChartArea,
      submenu: [
        {
          label: "Danh sách khu vực",
          link: config.routes.areaList,
        },
        {
          label: "Tạo khu vực mới",
          link: config.routes.createArea,
        },
      ],
    },
    {
      label: "Món ăn",
      icon: IoFastFood,
      submenu: [
        {
          label: "Danh sách món ăn",
          link: config.routes.itemList,
        },
        {
          label: "Tạo món ăn mới",
          link: config.routes.createItem,
        },
      ],
    },
    {
      label: "Bếp",
      icon: IoFastFood,
      submenu: [
        {
          label: "Tồn kho món ăn",
          link: config.routes.menuStock,
        },
        {
          label: "Phục vụ món",
          link: config.routes.kitchenOrder,
        },
      ],
    },
    {
      label: "Nhà cung cấp",
      icon: RiShakeHandsLine,
      submenu: [
        {
          label: "Danh sách NCC",
          link: config.routes.supplierList,
        },
        {
          label: "Thêm NCC",
          link: config.routes.createSupplier,
        },
      ],
    },
    {
      label: "Biên lai nhập hàng",
      icon: IoReceiptOutline,
      submenu: [
        {
          label: "Danh sách biên lai",
          link: config.routes.receiptList,
        },
        {
          label: "Thêm biên lai",
          link: config.routes.createReceipt,
        },
      ],
    },
    {
      label: "Nguyên liệu",
      icon: GiWoodPile,
      submenu: [
        {
          label: "Danh sách nguyên liệu",
          link: config.routes.materialList,
        },
        {
          label: "Thêm nguyên liệu",
          link: config.routes.createMaterial,
        },
      ],
    },
    {
      label: "Báo cáo",
      icon: TbReport,
      submenu: [
        {
          label: "Báo cáo doanh thu",
          link: config.routes.revenue,
        },
        {
          label: "Báo cáo hàng hóa",
          link: config.routes.itemRevenue,
        },
      ],
    },
  ];

  const [subMenuStates, setSubMenuStates] = useState(
    new Array(sidebarItems.length).fill(false)
  );

  const handleSubMenuToggle = (index) => {
    const updatedSubMenuStates = { ...subMenuStates };
    updatedSubMenuStates[index] = !updatedSubMenuStates[index];
    setSubMenuStates(updatedSubMenuStates);
  };

  return (
    <motion.div
      className={`fixed top-16 left-0 bottom-0 w-64  flex justify-center bg-[#212837] ${
        isSidebarOpen ? "open" : ""
      }`}
      initial={{ x: "-100%" }}
      animate={{ x: isSidebarOpen ? 0 : "-100%" }}
      transition={{ type: "tween" }}
    >
      <div className="overflow-y-scroll w-full min-h-full bg-gray-900">
        <div className="px-6 pt-4">
        </div>

        <div className="px-6 pt-4">
          <ul className="flex flex-col space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <div className="relative text-gray-500 hover:text-white focus-within:text-white">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    {item.icon && <item.icon />}
                  </div>
                  {item.submenu?.length > 0 ? (
                    <h6
                      className="inline-block w-full py-2 pl-10 pr-4 text-xs rounded hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-gray-800"
                      onClick={() => handleSubMenuToggle(index)}
                    >
                      {item.label}
                    </h6>
                  ) : (
                    <Link
                      to={item.link}
                      className="inline-block w-full py-2 pl-10 pr-4 text-xs rounded hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-gray-800"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
                {item.submenu?.length > 0 && (
                  <SubMenu items={item.submenu} isOpen={subMenuStates[index]} />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pt-8">
          <hr className="border-gray-700" />
        </div>
      </div>
    </motion.div>
  );
}

export default Sidebar;

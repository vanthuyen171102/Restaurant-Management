import { BasicLayout, DefaultLayout, HeaderOnly, HomeLayout } from "../layouts";
import Dashboard from "../pages/Dashboard";
import config from "../config";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import {
  CreateEmployee,
  EmployeeInfo,
  EmployeeList,
  UpdateEmployee,
} from "../pages/Employee";
import {
  CreateTable,
  TableOrdering,
  Tables,
  TableCheckout,
  UpdateTable,
  TableList,
} from "./../pages/Table";
import {
  CategoryList,
  CreateCategory,
  UpdateCategory,
} from "../pages/Category";
import { CreateItem, ItemInfo, ItemList, UpdateItem } from "../pages/Item";
import { MenuStock, KitchenOrder } from "../pages/Kitchen";
import { PaymentSuccess } from "../pages/Payment";
import { OrderInfo, OrderList } from "../pages/Order";
import { ItemRevenue, Revenue } from "../pages/Revenue";
import {
  CreateSupplier,
  EditSupplier,
  SupplierInfo,
  SupplierList,
} from "../pages/Supplier";
import {
  CreateMaterial,
  EditMaterial,
  MaterialInfo,
  MaterialList,
} from "../pages/Material";
import ReceiptList from "./../pages/Receipt/ReceiptList";
import { CreateReceipt, EditReceipt, ReceiptInfo } from "../pages/Receipt";
import Home from "../pages/Home/Home";
import {
  BookingDetail,
  BookingList,
  BookingReservation,
  CreateBooking,
  UpdateBooking,
} from "../pages/Booking";
import { AreaList, CreateArea, UpdateArea } from "../pages/Area";
import { hasAnyRole } from "../components/PrivateRoute/PrivateRoute";
import Test from "../pages/Test";

const routes = [
  // {
  //   path: config.routes.home,
  //   page: Home,
  //   layout: HomeLayout,
  //   title: "Trang chủ",
  // },
  {
    path: config.routes.admin,
    page: Dashboard,
    hasAnyRoles: [config.roles.admin],
    title: "Trang quản trị",
  },
  {
    path: config.routes.login,
    page: Login,
    layout: BasicLayout,
    title: "Đăng nhập",
  },
  {
    path: config.routes.logout,
    page: Logout,
    layout: BasicLayout,
    title: "Đăng xuất",
  },

  // Tables
  {
    path: config.routes.tableList,
    page: TableList,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Danh sách bàn"
  },
  {
    path: config.routes.tables,
    page: Tables,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.waiter],
    title: "Sơ đồ bàn ăn"
  },
  {
    path: config.routes.tableOrdering,
    page: TableOrdering,
    layout: BasicLayout,
    hasAnyRoles: [config.roles.admin, config.roles.waiter],
    title: "Gọi món"
  },
  {
    path: config.routes.createTable,
    page: CreateTable,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Thêm mới bàn ăn"
  },
  {
    path: config.routes.updateTable,
    page: UpdateTable,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Cập nhật bàn ăn"
  },
  {
    path: config.routes.tableCheckout,
    page: TableCheckout,
    layout: HeaderOnly,
    hasAnyRoles: [config.roles.admin, config.roles.cashier],
    title: "Thanh toán bàn ăn"
  },

  // Employee
  {
    path: config.routes.employeeList,
    page: EmployeeList,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Danh sách nhân viên"
  },
  {
    path: config.routes.createEmployee,
    page: CreateEmployee,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Thêm mới nhân viên"
  },
  {
    path: config.routes.editEmployee,
    page: UpdateEmployee,
    layout: DefaultLayout,
    title: "Cập nhật nhân viên",
  },
  {
    path: config.routes.employeeInfo,
    page: EmployeeInfo,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Thông tin nhân viên"
  },

  // Category
  {
    path: config.routes.categoryList,
    page: CategoryList,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Danh sách danh mục món ăn"
  },
  {
    path: config.routes.createCategory,
    page: CreateCategory,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Tạo danh mục món ăn"
  },
  {
    path: config.routes.editCategory,
    page: UpdateCategory,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Cập nhật danh mục món ăn"
  },

   // Area
   {
    path: config.routes.areaList,
    page: AreaList,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Danh sách khu vực"
  },
  {
    path: config.routes.createArea,
    page: CreateArea,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Tạo khu vực"
  },
  {
    path: config.routes.editArea,
    page: UpdateArea,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Cập nhật khu vực"
  },

  // Item
  {
    path: config.routes.itemList,
    page: ItemList,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Danh sách món ăn"
  },
  {
    path: config.routes.createItem,
    page: CreateItem,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Tạo món ăn mới"
  },
  {
    path: config.routes.editItem,
    page: UpdateItem,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Cập nhật món ăn"
  },
  {
    path: config.routes.itemInfo,
    page: ItemInfo,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Chi tiết món ăn"
  },

  // Supplier
  {
    path: config.routes.supplierList,
    page: SupplierList,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Danh sách nhà cung cấp"
  },
  {
    path: config.routes.createSupplier,
    page: CreateSupplier,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Thêm mới nhà cung cấp"
  },
  {
    path: config.routes.editSupplier,
    page: EditSupplier,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Cập nhật nhà cung cấp"
  },
  {
    path: config.routes.supplierInfo,
    page: SupplierInfo,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Thông tin nhà cung cấp"
  },

  // Booking
  {
    path: config.routes.bookingList,
    page: BookingList,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.cashier],
    title: "Danh sách đặt bàn"
  },
  {
    path: config.routes.createBooking,
    page: CreateBooking,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.cashier],
    title: "Tạo đơn đặt bàn"
  },
  {
    path: config.routes.editBooking,
    page: UpdateBooking,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.cashier],
    title: "Cập nhật đặt bàn"
  },
  {
    path: config.routes.bookingReservation,
    page: BookingReservation,
    layout: HeaderOnly,
    hasAnyRoles: [config.roles.admin, config.roles.cashier],
    title: "Xếp bàn"
  },

  // Material
  {
    path: config.routes.materialList,
    page: MaterialList,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Danh sách nguyên vật liệu"
  },
  {
    path: config.routes.materialInfo,
    page: MaterialInfo,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Thông tin nguyên vật liệu"
  },
  {
    path: config.routes.editMaterial,
    page: EditMaterial,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Cập nhật thông tin nguyên vật liệu"
  },
  {
    path: config.routes.createMaterial,
    page: CreateMaterial,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin],
    title: "Tạo nguyên vật liệu"
  },

  // Receipt
  {
    path: config.routes.receiptList,
    page: ReceiptList,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.stocker],
    title: "Danh sách biên lai"
  },
  {
    path: config.routes.createReceipt,
    page: CreateReceipt,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.stocker],
    title: "Tạo mới biên lai"
  },
  {
    path: config.routes.editReceipt,
    page: EditReceipt,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.stocker],
    title: "Cập nhật thông tin biên lai"
  },
  {
    path: config.routes.receiptInfo,
    page: ReceiptInfo,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.stocker],
    title: "Thông tin biên lai"
  },

  // Kitchen
  {
    path: config.routes.menuStock,
    page: MenuStock,
    layout: HeaderOnly,
    hasAnyRoles: [config.roles.admin, config.roles.kitchen],
    title: "Tồn kho bếp"
  },
  {
    path: config.routes.kitchenOrder,
    page: KitchenOrder,
    layout: HeaderOnly,
    hasAnyRoles: [config.roles.admin, config.roles.kitchen],
    title: "Hóa đơn bếp"
  },

  // Payment
  {
    path: config.routes.paymentSuccess,
    page: PaymentSuccess,
    layout: HeaderOnly,
    title: "Thanh toán"
  },

  // Order
  {
    path: config.routes.orderList,
    page: OrderList,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.cashier],
    title: "Danh sách hóa đơn"
  },
  {
    path: config.routes.orderInfo,
    page: OrderInfo,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.cashier],
    title: "Thông tin hóa đơn"
  },

  //Revenue
  {
    path: config.routes.revenue,
    page: Revenue,
    hasAnyRoles: [config.roles.admin, config.roles.cashier],
    title: "Doanh thu"
  },
  {
    path: config.routes.itemRevenue,
    page: ItemRevenue,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.cashier],
    title: "Doanh thu theo sản phẩm"
  },

  {
    path: config.routes.test,
    page: Test,
    layout: DefaultLayout,
    hasAnyRoles: [config.roles.admin, config.roles.cashier],
    title: "Test"
  },
];

export { routes };

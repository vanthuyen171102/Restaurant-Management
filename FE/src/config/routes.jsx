
const routes = {

  home: "/",
  
  admin: "/",

  // Table
  tableList: "/table-list",
  tables: "/tables",
  tableCheckout: "/table-checkout",
  tableOrdering: "/tables/:id",
  createTable: "/table/create",
  updateTable: "/table/update/:id",

  // Authenticate
  login: "/login",
  logout: "/logout",

  // User
  userList: "/users",
  userInfo: "/user/:id",
  createUser: "/user/create",
  editUser: "/user/edit/:id",

  // Employee
  employeeList: "/employees",
  employeeInfo: "/employee/:id",
  createEmployee: "/employee/create",
  editEmployee: "/employee/edit/:id",

  // Category
  categoryList: "/categories",
  categoryInfo: "/category/:id",
  createCategory: "/category/create",
  editCategory: "/category/edit/:id",

  // Area
  areaList: "/areas",
  areaInfo: "/area/:id",
  createArea: "/area/create",
  editArea: "/area/edit/:id",

  // Item
  itemList: "/items",
  itemInfo: "/item/:id",
  createItem: "/item/create",
  editItem: "/item/edit/:id",

  // Supplier
  supplierList: "/suppliers",
  supplierInfo: "/supplier/:id",
  createSupplier: "/supplier/create",
  editSupplier: "/supplier/edit/:id",

  // Kitchen
  menuStock: "/menu-stock",
  kitchenOrder: "/kitchen-order",

  //Payment
  paymentSuccess: "/payment-success",

  //Order
  orderList: "/orders",
  orderInfo: "/order/:id",

  //Revenue
  revenue: "/revenue",
  itemRevenue: "/item-revenue",

  //Receipts
  receiptList: "/receipts",
  receiptInfo: "/receipt/:id",
  createReceipt: "/receipt/create",
  editReceipt: "/receipt/edit/:id",

  // Supplier
  materialList: "/materials",
  materialInfo: "/material/:id",
  createMaterial: "/material/create",
  editMaterial: "/material/edit/:id",

  // Booking
  bookingList: "/bookings",
  bookingReservation: "/booking/reservation",
  bookingInfo: "/booking/:id",
  createBooking: "/booking/create",
  editBooking: "/booking/edit/:id",

  test: "/test",
};

export default routes;

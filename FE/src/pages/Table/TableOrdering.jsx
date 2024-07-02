import { GrLinkPrevious } from "react-icons/gr";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../../components/Product";
import { FaBowlRice, FaCashRegister } from "react-icons/fa6";
import Tabs, { TabItem } from "../../components/Tabs";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { FiPlus, FiMinus } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsCash, BsCreditCard } from "react-icons/bs";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import { formatCurrency } from "../../helper/format";
import { CartSidebarItem } from "../../components/CartSidebar";
import { Button } from "flowbite-react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";
import OrderType from "../../enums/OrderTypeEnum";

function TableOrdering() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [items, setItems] = useState([]);
  const [table, setTable] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    setCurrentOrder(table?.currentOrder);
  }, [table]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const itemsResponse = await axios.get(`${config.API_HOST}/items/all`);
        const tableResponse = await axios.get(`${config.API_HOST}/table/${id}`);
        setItems(itemsResponse.data);
        setTable(tableResponse.data);
        setCurrentOrder(tableResponse.data.currentOrder);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Xảy ra lỗi khi load dữ liệu"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateStockMessage = useCallback((message) => {
    const updateStockItem = JSON.parse(message.body);    
    const updatedItems = items.map((item) => {
      if (item.id === updateStockItem.id) {
        return { ...item, stock: updateStockItem.stock };
      }
      return item;
    });

    setItems(updatedItems);
  }, [items]);

  const handleTableUpdateMessage = useCallback((message) => {
    const updatedTable = JSON.parse(message.body);
    setTable(updatedTable);
  }, []);

  useEffect(() => {
    const socket = new SockJS(`${config.HOST}/ws`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      const updateStockeSubscription = client.subscribe(
        "/topic/item/update-stock",
        handleUpdateStockMessage
      );

      const tableUpdateSubscription = client.subscribe(
        "/topic/table/update/" + id,
        handleTableUpdateMessage
      );
      return () => {
        updateStockeSubscription.unsubscribe();
        tableUpdateSubscription.unsubscribe();
      };
    });

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [handleUpdateStockMessage, handleTableUpdateMessage]);

  const addToCart = (selectedItem) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === selectedItem.id
    );
    if (existingItemIndex !== -1) {
      const updatedCartItems = cartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedCartItems);
    } else {
      const updatedCartItems = [...cartItems, { ...selectedItem, quantity: 1 }];
      setCartItems(updatedCartItems);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems => cartItems.filter(cartItem => cartItem.id !== itemId))
  };

  const handleIncreaseQuantity = (itemId) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(updatedCartItems);
  };

  const handleSubmitOrder = async () => {
    setIsSending(true);
    try {
      if (currentOrder) {
        const response = await axios.post(
          `${config.API_HOST}/order/addItems/${currentOrder.id}`,
          cartItems
        );
        setCartItems([]);
        setCurrentOrder(response.data);
        toast.success("Gọi món thành công!");
      } else {
        const response = await axios.post(`${config.API_HOST}/order/create`, {
          type: OrderType.DINE_IN,
          tableIds: [parseInt(id)],
          items: cartItems,
        });
        setCartItems([]);
        setCurrentOrder(response.data);
        toast.success("Đã tạo hóa đơn và gọi món thành công!");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Gọi món không thành công!"
      );
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <p>Đang tải...</p>;
  }

  if (table === null) {
    return <p>Load dữ liệu bàn không thành công!</p>;
  }

  return (
    <div className="relative size-full pl-40 pr-96">
      <div className="fixed top-0 left-0 bottom-0 z-10 flex flex-col w-40 pl-4">
        <Link to={config.routes.tables} className="p-4 flex items-center justify-center">
          <GrLinkPrevious
            size={"40px"}
            className="p-2 w-full border border-[rgb(61,80,115)] rounded-md text-center hover:opacity-80"
          />
        </Link>
        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            {/* <ul className="block list-none">
              <li className="px-4 py-2">
                <a
                  href=""
                  className="block p-3 bg-[rgb(31,107,255)] border border-[rgb(31,107,255)] rounded-lg text-center text-sm font-semibold"
                >
                  Tất cả
                </a>
              </li>
              <li className="px-4 py-2">
                <a
                  href=""
                  className="block p-3 bg-[rgb(42,55,79)] border border-[rgb(60,78,113)] rounded-lg text-center text-sm font-semibold"
                >
                  Phở
                </a>
              </li>
            </ul> */}
          </div>
        </div>
      </div>
      <div className="px-4 pt-3 pb-8 flex">
        <div className="flex-1 grid grid-cols-3 gap-3">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} addToCart={addToCart} />
          ))}
        </div>
      </div>
      <div className="fixed top-0 right-0 bottom-0 z-10 p-4 w-96 h-full">
        <div className="flex flex-col size-full bg-[rgb(42,55,79)] border border-[rgb(60,78,113)] h-full rounded-lg">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center font-semibold">
              <FaBowlRice className="mr-3" size={"24px"} />
              Bàn {table.name} - Khu {table.area.name}
            </div>
            <div className="text-xs">Order : #{currentOrder?.id}</div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Tabs className="justify-between" paddingX={"6px"}>
              <TabItem title="Gọi món" className="flex-1">
                {cartItems.map((cartItem) => (
                  <div className="flex p-6 border-b border-[rgb(60,78,113)]">
                    <div className="flex flex-1">
                      <img
                        src={`${config.API_IMAGE_HOST}/${cartItem.thumb}`}
                        alt=""
                        className="size-[72px] rounded-sm object-cover"
                      />
                      <div className="flex-1 ml-4">
                        <h4 className="mb-1 text-white text-sm font-semibold line-clamp-1" title={cartItem.title}>
                          {cartItem.title}
                        </h4>
                        <span className="text-xs mb-2"></span>
                        <div className="flex mt-2 items-center">
                          <span
                            onClick={() => handleDecreaseQuantity(cartItem.id)}
                            className="flex items-center justify-center px-2 py-1 text-black bg-[rgb(201,210,227)] border border-[rgb(201,210,227)] rounded"
                          >
                            <FiMinus size={"16px"} />
                          </span>
                          <input
                            type="text"
                            className="mx-2 w-[50px] text-center font-semibold px-2 py-1 bg-[rgba(255,255,255,0.25)] border border-[rgb(60,78,113)] rounded"
                            readonly=""
                            value={cartItem.quantity}
                          />
                          <span
                            onClick={() => handleIncreaseQuantity(cartItem.id)}
                            className="flex items-center justify-center px-2 py-1 text-black bg-[rgb(201,210,227)] border border-[rgb(201,210,227)] rounded"
                          >
                            <FiPlus size={"16px"} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col ml-5 items-end justify-between">
                      <span className="font-semibold text-sm text-end">
                        {formatCurrency(cartItem.price)} VNĐ
                      </span>
                      <button onClick={() => removeFromCart(cartItem.id)} className="w-auto px-2 py-1 bg-[rgb(60,78,113)] border border-[rgb(60,78,113)] rounded">
                        <RiDeleteBin5Fill size={"16px"} />
                      </button>
                    </div>
                  </div>
                ))}
              </TabItem>

              <TabItem title="Hóa đơn" className="flex-1">
                {currentOrder &&
                  Object.values(
                    currentOrder.items.reduce((acc, orderItem) => {
                      const { item, quantity } = orderItem;
                      if (acc[item.id]) {
                        acc[item.id].quantity += quantity;
                      } else {
                        acc[item.id] = { ...orderItem };
                      }
                      return acc;
                    }, {})
                  ).map((orderItem) => (
                    <CartSidebarItem
                      key={orderItem.item.id}
                      orderItem={orderItem}
                    />
                  ))}
              </TabItem>
            </Tabs>
          </div>
          <div className="p-4 border-t border-[rgb(60,78,113)]">
            <div className="pb-3">
              <div className="flex items-center mb-2">
                <div>Thành tiền</div>
                <div className="flex-1 text-end h6 mb-0">
                  {formatCurrency(
                    (currentOrder ? currentOrder.total : 0) +
                      cartItems.reduce(
                        (total, cartItem) =>
                          total + cartItem.price * cartItem.quantity,
                        0
                      )
                  )}{" "}
                  VNĐ
                </div>
              </div>
              <div className="flex items-center">
                <div>VAT ({config.VAT_FEE_PERCENT}%)</div>
                <div className="flex-1 text-end h6 mb-0">
                  {formatCurrency(
                    (currentOrder ? currentOrder.vatFee : 0) +
                      cartItems.reduce(
                        (total, cartItem) =>
                          total +
                          config.VAT_FEE_VALUE *
                            cartItem.price *
                            cartItem.quantity,
                        0
                      )
                  )}{" "}
                  VNĐ
                </div>
              </div>
            </div>
            <div className="flex items-center border-t border-[rgb(60,78,113)] py-2 mb-2">
              <div>Tổng cộng</div>
              <div className="flex-1 text-end text-lg font-bold mb-0">
                {formatCurrency(
                  (currentOrder ? currentOrder.grandTotal : 0) +
                    cartItems.reduce(
                      (total, cartItem) =>
                        total +
                        Number(1 + config.VAT_FEE_VALUE) *
                          Number(cartItem.price) *
                          Number(cartItem.quantity),
                      0
                    )
                )}{" "}
                VNĐ
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-4">
                <Button
                  href="#/"
                  disabled={isSending}
                  onClick={() => handleSubmitOrder()}
                  className="flex flex-1 flex-col px-3 py-2 items-center justify-center bg-[rgb(31,107,255)] border border-[rgb(61,80,115)] rounded-md text-center hover:opacity-80"
                >
                  <FaCashRegister className="mr-4" size={"30px"} />

                  <span className="mt-1 text-sm font-semibold">Gọi món</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableOrdering;

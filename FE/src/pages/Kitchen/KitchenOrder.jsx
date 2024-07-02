import axios from "axios";
import { Badge, Button } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import config from "../../config";
import { toast } from "react-toastify";
import OrderItemStatus from "../../enums/OrderItemStatus";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";
import OrderStatus from "../../enums/OrderStatus";

function KitchenOrder() {
  const [orders, setOrders] = useState([]);
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.API_HOST}/order/get-all-in-progress-order`
        );
        setOrders(response.data);
      } catch (error) {
        toast.error("Load dữ liệu không thành công!");
      }
    };

    fetchData();
  }, []);

  const handleOrderUpdateMessage = useCallback((message) => {
    const updatedOrder = JSON.parse(message.body);
    console.log(updatedOrder)
    setOrders((prevOrders) => {
      return prevOrders
        .map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
        .filter((order) => order.status === OrderStatus.InProgress);
    });
  }, []);

const handleNewOrderMessage = useCallback((message) => {
    const newOrder = JSON.parse(message.body);
    toast.info("Bạn nhận được 1 đơn mới!");
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  }, []);

const handleAddItemToOrderMessage = useCallback((message) => {
    const updatedOrder = JSON.parse(message.body);
    toast.info(`Bàn ${updatedOrder?.table.name} đã gọi thêm món!`);
  }, []);

useEffect(() => {
    const socket = new SockJS(`${config.HOST}/ws`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      const orderUpdateSubscription = client.subscribe("/topic/order/update/*", handleOrderUpdateMessage);
      const addItemSubscription = client.subscribe("/topic/order/add-order-item", handleAddItemToOrderMessage);
      const newOrderSubscription = client.subscribe("/topic/order/new-order", handleNewOrderMessage);

      return () => {
        orderUpdateSubscription.unsubscribe();
        addItemSubscription.unsubscribe();
        newOrderSubscription.unsubscribe();
        client.disconnect();
      };
    });
    
    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [handleOrderUpdateMessage, handleAddItemToOrderMessage, handleNewOrderMessage]);

  const handleCompleteOrderItem = async (orderItemId) => {
    try {
      await axios.post(`${config.API_HOST}/order/complete/${orderItemId}`);
      toast.success("Đã hoàn thành món ăn!");
    } catch (error) {
      toast.error("Hoàn thành món ăn không thành công!");
    }
  };

  const handleCancelOrderItem = async (orderItemId) => {
    try {
      await axios.post(`${config.API_HOST}/order/cancel/${orderItemId}`);
      toast.success("Đã hủy món ăn!");
    } catch (error) {
      toast.error("Hủy món ăn không thành công!");
    }
  };

  return (
    <>
      {orders.map((order) => (
        <div className="flex  border-b border-[rgb(60,78,113)]">
          <div className="w-[30%] text-right p-6 text-white">
            <h3 className="flex flex-col gap-3 font-semibold text-2xl">{order.tables.map((table) => (
                <span key={table.id}>Bàn {table.table.name} - Khu {table.table.area.name}</span>
              ))}</h3>
            <h4 className="text-base mt-3">Hóa đơn: #{order.id}</h4>
            <Badge className="mt-3 inline-block" size={20} color="purple">
              {order.type}
            </Badge>
          </div>
          <div className="flex-1 p-6 text-white border-l border-[rgb(60,78,113)]">
            <h4 className="text-lg">
              Hoàn thành: (
              {
                order.items.filter(
                  (item) => item.status === OrderItemStatus.COMPLETED
                ).length
              }
              /{order.items.length})
            </h4>
            <div className="grid mt-6 grid-cols-4 gap-6 ">
              {order.items.map((orderItem) => (
                <div className="d-flex flex-col">
                  <div className="relative pt-[75%]">
                    <div
                      className={`absolute top-0 left-0 bottom-0 right-0 bg-center bg-no-repeat bg-cover rounded-lg`}
                      style={{
                        backgroundImage: `url('${config.API_IMAGE_HOST}/${orderItem.item.thumb}')`,
                      }}
                    >
                      {orderItem.status === OrderItemStatus.COMPLETED && (
                        <div className="absolute top-0 left-0 bottom-0 right-0 flex h-full items-center justify-center bg-center bg-[rgba(60,78,113,0.75)] rounded-lg z-10 text-xl font-medium text-green-600">
                          Hoàn thành
                        </div>
                      )}
                                            {orderItem.status === OrderItemStatus.CANCELLED && (
                        <div className="absolute top-0 left-0 bottom-0 right-0 flex h-full items-center justify-center bg-center bg-[rgba(60,78,113,0.75)] rounded-lg z-10 text-xl font-medium text-red-600">
                          Đã hủy
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 text-lg font-semibold">
                    <h4 className="line-clamp-1" title={orderItem.item.title}>
                      {orderItem.item.title}
                    </h4>
                    <span className="ml-2">x{orderItem.quantity}</span>
                  </div>
                  <div className="">
                    <Button
                      className="mt-4 w-full text-center"
                      color="blue"
                      disabled={
                        orderItem.status === OrderItemStatus.CANCELLED ||
                        orderItem.status === OrderItemStatus.COMPLETED
                      }
                      onClick={() => handleCompleteOrderItem(orderItem.id)}
                    >
                      Hoàn thành
                    </Button>
                    <Button
                      className="mt-4 w-full text-center"
                      onClick={() => handleCancelOrderItem(orderItem.id)}
                      color="gray"
                      disabled={
                        orderItem.status === OrderItemStatus.CANCELLED ||
                        orderItem.status === OrderItemStatus.COMPLETED
                      }
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default KitchenOrder;

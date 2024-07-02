import axios from "axios";
import { Button, TextInput } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import config from "../../config";
import { toast } from "react-toastify";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

function MenuStock() {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const stockRefs = useRef([]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_HOST}/items/all`);
        setItems(response.data);
      } catch (error) {
        toast.error("Load dữ liệu không thành công!");
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

  useEffect(() => {
    const socket = new SockJS(`${config.HOST}/ws`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      const updateStockeSubscription = client.subscribe(
        "/topic/item/update-stock",
        handleUpdateStockMessage
      );

      return () => {
        updateStockeSubscription.unsubscribe();
      };
    });

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [handleUpdateStockMessage]);

  

  const updateStock = async (itemId, index) => {
    try {
      let newStock = stockRefs.current[index].value;
      await axios.patch(`${config.API_HOST}/item/updateStock/${itemId}?stock=${newStock}`);
      toast.success("Cập nhật tồn kho thành công!");
    } catch (error) {
      toast.error("Cập nhật tồn kho không thành công!");
    }
  };




  return (
    <div className="grid grid-cols-6 gap-6 p-4">
      {items.map((item, index) => (
        <div className="flex flex-col text-sm bg-[rgb(42,55,79)] border border-[rgb(60,78,113)] rounded-md overflow-hidden">
          <div
            className={`min-h-44 bg-center bg-no-repeat bg-cover rounded-t-sm`}
            style={{backgroundImage: `url('${config.API_IMAGE_HOST}/${item.thumb}')`}}
          ></div>
          <div className="flex-1 p-4 bg-[rgba(255,255,255,0.1)]">
            <div className="text-base font-medium">{item.title}</div>
            <div className="flex items-center my-3 box-border">
              <label className="inline-block">Tồn:</label>
              <TextInput type="number" ref={el => (stockRefs.current[index] = el)} className="ml-12" defaultValue={item.stock} />
            </div>
            <div className="">
              <Button className="mt-4 w-full text-center" color="blue" onClick={() =>  updateStock(item.id, index)}>
                Cập nhật
              </Button>
              <Button className="mt-4 w-full text-center" color="gray">
                Hủy
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuStock;

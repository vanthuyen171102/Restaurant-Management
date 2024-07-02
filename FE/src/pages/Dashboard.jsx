import axios from "axios";
import { useEffect, useState } from "react";
import config from "../config";
import { Card } from "flowbite-react";
import { formatCurrency } from "../helper/format";

function Dashboard() {
  const [restaurantInfo, setRestaurantInfo] = useState();

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const response = await axios.get(`${config.API_HOST}/restaurant-info`);
        setRestaurantInfo(response.data);
      } catch {}
    };
    fetchRestaurantInfo();
  }, []);
  return (
    <>
      <div className="grid grid-cols-3 gap-4 text-black">
          <Card className="bg-white px-6 py-2">
            <div className="text-lg font-semibold">Hóa đơn hôm nay</div>
            <div className="text-xl">{restaurantInfo?.ordersToday}</div>
          </Card>
          <Card className="bg-white px-6 py-2">
            <div className="text-lg font-semibold">Doanh thu hôm nay</div>
            <div className="text-xl">{formatCurrency(restaurantInfo?.revenueToday)} đ</div>
          </Card>
          <Card className="bg-white px-6 py-2">
            <div className="text-lg font-semibold">Lợi nhuận hôm nay</div>
            <div className="text-xl">{formatCurrency(restaurantInfo?.profitToday)} đ</div>
          </Card>
      </div>
    </>
  );
}

export default Dashboard;

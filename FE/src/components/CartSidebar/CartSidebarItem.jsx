import config from "../../config";
import { formatCurrency } from './../../helper/format';

function CartSidebarItem({orderItem}) {
  return (
    <div className="flex pl-5 pr-3 py-4">
      <div className="flex flex-1">
        <img
          className="img size-12 rounded"
          src={`${config.API_IMAGE_HOST}/${orderItem.item.thumb}`}
                  />
        <div className="flex-1 ml-2">
          <div className="flex items-start justify-between">
            <div className="w-7/12 pr-2">
              <h6 className="font-semibold line-clamp-1" title={orderItem.item.title}>{orderItem.item.title}</h6>
              <div className="text-[13px]">{formatCurrency(orderItem.price)} VNĐ</div>
            </div>

            <span className="w-1/12 px-1">x{orderItem.quantity}</span>
            <div className="flex-1 pl-1 text-end font-semibold">{formatCurrency(orderItem.price * orderItem.quantity)} VNĐ</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSidebarItem;

import clsx from "clsx";
import config from "../../config";
import { formatCurrency } from "./../../helper/format";
import { CiCirclePlus } from "react-icons/ci";

function ProductCard({ item, addToCart }) {
  return (
    <div
      className={clsx(
        "relative flex flex-col bg-[rgb(42,55,79)] border border-[rgb(60,78,113)] rounded-md",
        {
          "cursor-not-allowed opacity-50": item.stock === 0,
        }
      )}
    >
      <img
        src={`${config.API_IMAGE_HOST}/${item.thumb}`}
        alt=""
        className="h-44 w-full rounded-t-md"
      />
      <div className="flex items-center justify-between p-4 rounded-b-md bg-[rgba(255,255,255,0.1)]">
        <div className="flex-1 flex flex-col">
          <div className="text-[15px] mb-4 font-semibold line-clamp-2">
            {item.title}
          </div>
          <div className="text-base font-semibold">
            {formatCurrency(item.price)} VNĐ
          </div>
        </div>
        <CiCirclePlus size={"40px"} cursor={"pointer"} onClick={() => {
        if (item.stock > 0) addToCart(item);
      }}/>
      </div>

      {item.stock === 0 && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xl text-white">
          <span className="bg-black bg-opacity-50 px-4 py-1 rounded-lg">
            Hết hàng!
          </span>
        </div>
      )}
    </div>
  );
}

export default ProductCard;

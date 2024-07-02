import { Link } from "react-router-dom";
import config from "./../../config/index";

function Header() {
  return (
    <div className="flex py-5 justify-center bg-[url('https://quanildivo.vn/wp-content/uploads/2023/10/Artboard-2-scaled.jpg')]  shadow-md">
      <div className="flex justify-between w-[1120px]">
        <div className="flex items-center">
          <Link to={config.routes.home} className="block max-w-60">
            <img
              src="https://quanildivo.vn/wp-content/uploads/2023/09/logo-1@3x.png"
              alt=""
              className="w-full h-auto"
            />
          </Link>
          <div className="ml-5 pl-5 border-l">
            <h2 className="uppercase text-lg font-medium mb-2">Hotline</h2>
            <Link to={"tel:0986354108"} className="font-bold text-xl text-[rgb(255,168,39)]">
              <h2>098.635.4108</h2>
            </Link>
          </div>
        </div>
        <div>
          <div className="flex h-full  items-center">
            <Link className="px-4 text-base font-medium uppercase ">
                Thực đơn
            </Link>
            <Link className="px-4 text-base font-medium uppercase ">
                Liên hệ
            </Link>
            <Link className="px-6 py-3 bg-[rgb(255,168,39)] rounded-full text-base uppercase">
                Đặt bàn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;

import { Link } from "react-router-dom";
import config from "../../config";

function Footer() {
  return (
    <div className="flex py-8 justify-center bg-[rgb(31,47,41)]">
      <div className="flex justify-between w-[1120px]">
        <div className="flex">
          <div className="flex">
            <div>
              <Link to={config.routes.home} className="block max-w-60">
                <img
                  src="https://quanildivo.vn/wp-content/uploads/2023/09/logo-1@3x.png"
                  alt=""
                  className="w-full h-auto"
                />
              </Link>
              <Link className="inline-block mr-[50%] translate-x-1/2 mt-6 border border-[rgb(255,168,39)] rounded-lg px-6 py-3 font-medium text-base">
                Đặt bàn
              </Link>
            </div>
            <ul className="ml-16">
              <li className="mb-3 font-medium">
                <Link>Trang chủ</Link>
              </li>
              <li className="mb-3 font-medium">
                <Link>Thực đơn</Link>
              </li>
              <li className="mb-3 font-medium">
                <Link>Liên hệ</Link>
              </li>
            </ul>
          </div>
          <div className="flex-1 ml-20 flex justify-between">
            <div>
              <div>
                <h3 className="text-white text-sm font-semibold">SĐT</h3>
                <h3 className="mt-2 text-sm text-[rgb(255,168,39)] font-semibold">098.635.4108</h3>
              </div>
              <div className="mt-4">
                <h3 className="text-white text-sm font-semibold">Email</h3>
                <h3 className="mt-2 text-sm text-[rgb(255,168,39)] font-semibold">thuyentruong39@gmail.com</h3>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;

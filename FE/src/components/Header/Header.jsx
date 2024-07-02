import { FaBars, FaBowlRice } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react/headless";
import { useEffect, useRef, useState } from "react";
import Dropdown, { Divider, DropdownItem } from "../Dropdown";
import { FaUserCircle } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../redux/slices/sidebarSlice";
import config from "../../config";

function Header({ noSidebar }) {
  const account = useSelector((state) => state.auth.account);
  const currentTime = useSelector(state => state.time.currentTime);
  const dispatch = useDispatch();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const [userDropdownShow, setUserDropdownShow] = useState(false);

  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownShow(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header
        id="header"
        className="fixed top-0 left-0 right-0 z-40 w-screen h-16 bg-[rgb(39,51,73)] text-[rgb(201,210,227)] border-b border-[rgb(60,78,113)] shadow-[0px_2px_16px_0px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex h-full">
            {!noSidebar && (
              <button className="h-full px-4" onClick={handleToggleSidebar}>
                <FaBars size={"30"} />
              </button>
            )}
            <Link to="/" className="flex items-center ml-2 text-body-color">
              <FaBowlRice size={"28"} />
              <h3 className="ml-3 text-base font-semibold">ILLDIVO Restaurant</h3>
            </Link>
          </div>
          <div className="text-[rgb(235,238,244)] font-semibold text-xl">
              {currentTime.toLocaleTimeString()}
          </div>
          <div className="flex items-center h-full px-4">
            <Tippy
              placement="bottom-end"
              visible={userDropdownShow}
              interactive
              render={() => (
                <Dropdown>
                  <DropdownItem
                    icon={FiLogOut}
                    href={"/logout"}
                    label="Đăng xuất"
                  />
                </Dropdown>
              )}
            >
              <div
                className="flex items-center select-none"
                onClick={() => setUserDropdownShow(!userDropdownShow)}
                ref={userDropdownRef}
              >
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  src={config.API_IMAGE_HOST + "/" + account.avatar}
                  alt=""
                />
                <h4 className="ml-3 text-sm text-[rgb(201,210,227)] font-semibold">
                  {account.email}
                </h4>
              </div>
            </Tippy>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;

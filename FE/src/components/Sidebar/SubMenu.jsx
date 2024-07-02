  import { useState } from "react";
  import { motion } from "framer-motion";
  import { IoIosArrowDown } from "react-icons/io";
  import { Link, NavLink, useLocation } from "react-router-dom";
  import clsx from "clsx";

  function SubMenu({ items, isOpen, onToggle}) {
    return (
      <div className={clsx("pt-2 pl-4", isOpen ? "block" : "hidden")}>
        <ul className="flex flex-col pl-2 text-gray-500 border-l border-gray-700">
          {items.map((item, index) => {
            return (<li key={index}>
              <Link
                to={item.link}
                className="inline-block w-full px-4 py-2 text-xs rounded hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-500 focus:text-white"
              >
                {item.label}
              </Link>
            </li>);
          })}
        </ul>
      </div>
    );
  }

  export default SubMenu;

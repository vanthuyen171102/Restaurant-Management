import PropTypes from "prop-types";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { motion } from "framer-motion";

function DefaultLayout({ children }) {
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);

  return (
    <div className="pt-16 min-h-screen">
      <Header />
      <Sidebar />
      <motion.div
        className={clsx(
          "relative min-h-screen px-[50px] py-[30px] bg-[rgb(33,40,55)] text-sm text-[rgb(235,238,244)]"
        )}
        initial={false}
        animate={{ marginLeft: isSidebarOpen ? "16rem" : "0" }}
        transition={{ type: "tween" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;

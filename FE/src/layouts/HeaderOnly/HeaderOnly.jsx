import PropTypes from "prop-types";
import Header from "../../components/Header";
function HeaderOnly({ children }) {
  return (
    <div className="pt-16 min-h-full">
      <Header noSidebar/>
      <div className="relative  min-h-full bg-[rgb(33,40,55)] text-sm text-[rgb(235,238,244)]">
        {children}
      </div>
    </div>
  );
}

HeaderOnly.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HeaderOnly;

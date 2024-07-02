import { Link } from "react-router-dom";

function DropdownItem({icon : Icon , href, label, handleClick}) {
    const handleClickWrapper = (event) => {
        if (handleClick) {
            event.preventDefault();
            handleClick();
        }
    };
    return ( 
        <Link className="flex items-center px-4 py-3 text-sm text-left hover:bg-[#2f3b54]" to={href} onClick={handleClickWrapper}>
            <Icon className="mr-4 text-xl" />
            {label}
        </Link>
     );
}

export default DropdownItem;
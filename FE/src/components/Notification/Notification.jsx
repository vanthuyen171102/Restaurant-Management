import Dropdown, { Divider } from "../Dropdown";

function Notification({notifyItems}) {

    
    return (  
        <Dropdown>
            <h6 className="px-4 py-2 text-sm font-bold text-[rgb(235,238,244)]">Thông báo</h6>
            <Divider />
            {children}
        </Dropdown>
    );
}

export default Notification;
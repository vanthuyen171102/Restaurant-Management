import clsx from "clsx";

function Dropdwon({children}) {
    return ( 
        <div className="min-w-40 py-2 bg-[rgb(60,78,113)] border border-[rgba(218,224,236,0.2)] rounded-[6px] shadow-[rgba(0,0,0,0.15)_0px_8px_16px_0px]">
            {children}
        </div>
     );
}

export default Dropdwon;
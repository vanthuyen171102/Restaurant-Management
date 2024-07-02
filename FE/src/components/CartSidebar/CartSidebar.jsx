import { FaRegCreditCard } from "react-icons/fa";
import { FaBowlRice } from "react-icons/fa6";
import { BsCash, BsCreditCard, BsCart4 } from "react-icons/bs";
import CartSidebarItem from "./CartSidebarItem";

function CardSidebar() {
  return (
    <div className="size-full bg-[rgb(42,55,79)] border-l border-[rgb(60,78,113)] text-sm">
      <div className="flex flex-col h-full">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[rgb(60,78,113)]">
          <div class="flex items-center font-bold">
            <FaBowlRice size={"28"} className="mr-4" />
            Table -
          </div>
          <div class="order">
            Order: <span class="fw-semibold">#-</span>
          </div>
        </div>

        <div className="overflow-y-auto pr-[4px]">
          <div className="flex-1 h-full overflow-y-auto">
            <div className="overflow-y-auto">
              {/* <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem />
              <CartSidebarItem /> */}
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        {/* <div className="flex flex-col h-full items-center justify-center">
                <BsCart4 size={"80px"} />
                <h4 className="mt-4 text-xl">Trống</h4>
            </div> */}

        <div class="p-4 border-t border-[rgb(60,78,113)]">
          <div className="pb-3">
            <div class="flex items-center mb-2">
              <div>Subtotal</div>
              <div class="flex-1 text-end h6 mb-0">0 VNĐ</div>
            </div>
            <div class="flex items-center">
              <div>Taxes (10%)</div>
              <div class="flex-1 text-end h6 mb-0">0 VNĐ</div>
            </div>
          </div>
          <div class="flex items-center border-t border-[rgb(60,78,113)] py-2 mb-2">
            <div>Total</div>
            <div class="flex-1 text-end text-lg font-bold mb-0">
              2.000.000 VNĐ
            </div>
          </div>
          <div class="mt-3">
            <div class="flex items-center gap-4">
              <a
                href="#/"
                class="flex flex-1 flex-col px-3 py-2 items-center justify-center bg-[rgb(77,101,147)] border border-[rgb(61,80,115)] rounded-md text-center hover:opacity-80"
              >
                <BsCreditCard size={"30px"} />

                <span class="mt-1 text-sm font-semibold">Chuyển khoản</span>
              </a>
              <a
                href="#/"
                class="flex flex-1 flex-col px-3 py-2 items-center justify-center bg-[rgb(31,107,255)] border border-[rgb(61,80,115)] rounded-md text-center hover:opacity-80"
              >
                <BsCash size={"30px"} />

                <span class="mt-1 text-sm font-semibold">Tiền mặt</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSidebar;

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import config from "../../config";
import { toast } from "react-toastify";
import {
  formatCurrency,
  formatDateTime,
  formatIsoToDate,
} from "./../../helper/format";
import PaymentMethod from "./../../enums/PaymentMethod";
import PaymentStatus from "../../enums/PaymentStatus";
import { CiCircleCheck, CiWarning } from "react-icons/ci";
import { MdCancel, MdOutlinePending } from "react-icons/md";

function PaymentSucess() {
  const [payment, setPayment] = useState(null);
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.API_HOST}/payment/get-payment-detail/${orderCode}`
        );
        setPayment(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Load dữ liệu giao dịch không thành công!"
        );
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {payment && (
        <div
          class="flex flex-col items-center justify-center min-h-screen gap-4 p-4 md:p-6"
          data-id="1"
        >
          {(() => {
            switch (payment.paymentStatus) {
              case PaymentStatus.PENDING:
                return (
                  <div class="flex flex-col items-center gap-2 text-center">
                    <MdOutlinePending color="gray" size={"100"}/>

                    <h1 class="font-semibold text-3xl" data-id="4">
                      Chờ thanh toán
                    </h1>
                  </div>
                );
              case PaymentStatus.PAID:
                return (
                  <div class="flex flex-col items-center gap-2 text-center">
                    <CiCircleCheck color="green" size={"100"}/>

                    <h1 class="font-semibold text-3xl" data-id="4">
                      Thanh toán thành công
                    </h1>
                  </div>
                );
              case PaymentStatus.CANCELLED:
                return (
                  <div class="flex flex-col items-center gap-2 text-center">
                    <MdCancel  color="red" size={"100"} />

                    <h1 class="font-semibold text-3xl" data-id="4">
                      Thanh toán bị hủy
                    </h1>
                  </div>
                );
              case PaymentStatus.MISSING:
                return (
                  <div class="flex flex-col items-center gap-2 text-center">
                    <CiWarning color="yellow" size={"100"} />

                    <h1 class="font-semibold text-3xl" data-id="4">
                      Thanh toán thiếu
                    </h1>
                  </div>
                );
              case PaymentStatus.REFUND_NEEDED:
                return (
                  <div class="flex flex-col items-center gap-2 text-center">
                    <CiWarning color="purple" size={"100"} />

                    <h1 class="font-semibold text-3xl" data-id="4">
                      Thanh toán thừa
                    </h1>
                  </div>
                );
            }
          })()}

          <div
            class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-sm p-0"
            data-id="6"
            data-v0-t="card"
          >
            <div class="p-4 md:p-6" data-id="7">
              <div class="grid gap-1 text-sm" data-id="8">
                <div class="flex items-center gap-2" data-id="9">
                  <div class="font-medium" data-id="10">
                    Mã hóa đơn:
                  </div>
                  <div data-id="11">#{payment.order.id}</div>
                </div>
                <div class="flex items-center gap-2" data-id="9">
                  <div class="font-medium" data-id="10">
                    Mã giao dịch:
                  </div>
                  <div data-id="11">#{payment.id}</div>
                </div>
                <div class="flex items-center gap-2" data-id="12">
                  <div class="font-medium" data-id="13">
                    Ngày tạo giao dịch:
                  </div>
                  <div data-id="14">{formatDateTime(payment.createdAt)}</div>
                </div>
                <div class="flex items-center gap-2" data-id="15">
                  <div class="font-medium" data-id="16">
                    Phương thức thanh toán:
                  </div>
                  <div data-id="17">
                    {(() => {
                      switch (payment.paymentMethod) {
                        case PaymentMethod.CASH:
                          return "Tiền mặt";
                        case PaymentMethod.TRANSFER:
                          return "Chuyển khoản";
                      }
                    })()}
                  </div>
                </div>
              </div>
              <div
                data-orientation="horizontal"
                role="none"
                class="shrink-0 bg-gray-100 h-[1px] w-full my-4"
                data-id="18"
              ></div>
              <div class="grid gap-1 text-sm" data-id="19">
                <div class="flex items-center gap-2" data-id="20">
                  <div class="font-medium" data-id="21">
                    Phải thanh toán:
                  </div>
                  <div data-id="22">{formatCurrency(payment?.amount)} VNĐ</div>
                </div>
                <div class="flex items-center gap-2" data-id="23">
                  <div class="font-medium" data-id="24">
                    Đã thanh toán:
                  </div>
                  <div data-id="25">
                    {formatCurrency(payment?.paidAmount)} VNĐ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentSucess;

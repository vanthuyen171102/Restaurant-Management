import { Label, Modal, TextInput, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../helper/format";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";

function CashCheckoutModal({ order, show, handleClose }) {
  const [amountPaid, setAmountPaid] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (order && order.grandTotal) {
      setTotal(order.grandTotal - order.paid);
      setAmountPaid(order.grandTotal - order.paid);
    }
  }, [order]);

  const onCloseModal = () => {
    handleClose();
  }

  const handleConfirmCashPayment = async() => {
    try {
      await axios.post(`${config.API_HOST}/payment/success-cash-payment/${order.id}?amountPaid=${amountPaid}`);
      handleClose();
    } catch(error) {
      toast.error(error?.response?.data?.message || "Thanh toán tiền mặt không thành công!");
    }
  }

  return (
    <Modal show={show} size="md" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl text-center font-medium text-gray-900 dark:text-white">
            Thanh toán tiền mặt
          </h3>
          <div className="flex justify-between items-center">
            <div className="mb-2">
              <Label htmlFor="paid-amount" value="Tiền khách đưa" />
            </div>
            <TextInput
            id="paid-amount"
            type="number"
            value={amountPaid}
              onChange={(event) => setAmountPaid(event.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="mb-2">
              <Label htmlFor="paid-amount" value="Trả lại khách" />
            </div>
            <span className="">{formatCurrency(amountPaid - total)} VNĐ</span>
          </div>
          <div className="w-full">
            <Button className="w-full" onClick={handleConfirmCashPayment}>Xác nhận thanh toán</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CashCheckoutModal;

import {
  Breadcrumb,
  Button,
  Card,
  Datepicker,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import config from "./../../config/index";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { formatIsoToDate } from "./../../helper/format";
import { format } from "date-fns";

function UpdateBooking() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [bookingRange, setBookingRange] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      numberOfPeople: "",
      bookingDate: "",
      bookingTime: "",
    },
    mode: "onTouched",
  });

  const validationRules = {
    customerName: {
      required: "Tên khách hàng không được để trống!",
    },
    customerPhone: {
      required: "Số điện thoại không được để trống!",
    },
    numberOfPeople: {
      required: "Số người không được để trống!",
    },
    bookingDate: {
      required: "Ngày đặt bàn không được để trống!",
    },
    bookingTime: {
      required: "Giờ đặt bàn không được để trống!",
    },
  };

  useEffect(() => {
    const fetchBookingRange = async () => {
      try {
        const response = await axios.get(
          `${config.API_HOST}/booking/booking-range`
        );
        setBookingRange(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookingRange();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_HOST}/booking/${id}`);
        reset(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Load dữ liệu đơn đặt bàn không thành công!"
        );
      }
    };
    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    if (data.bookingDate) {
      const formattedDate = format(new Date(data.bookingDate), "dd-MM-yyyy");
      formData.append("bookingDate", formattedDate);
    }

    Object.keys(data).forEach((key) => {
      if (data[key] != null) formData.append(key, data[key]);
    });

    try {
      await axios.put(`${config.API_HOST}/booking/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Cập nhật đơn đặt bàn thành công!");
      navigate(config.routes.bookingList);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Đã xảy ra lỗi khi cập nhật đơn đặt bàn!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>

          <Breadcrumb.Item>
            <Link to={config.routes.bookingList}>Danh sách đặt bàn</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Thêm đơn đặt bàn</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="flex justify-center">
        <Card className="mt-10 w-full">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="customerName" value="Tên khách hàng" />
                <TextInput
                  id="customerName"
                  type="text"
                  className="mt-2"
                  placeholder="Tên khách hàng..."
                  {...register("customerName", validationRules.customerName)}
                />
                {errors.customerName && (
                  <ErrorAlert className="mt-2">
                    {errors.customerName.message}
                  </ErrorAlert>
                )}
              </div>
              <div className="w-1/2">
                <Label htmlFor="customerPhone" value="SĐT khách hàng" />
                <TextInput
                  id="customerPhone"
                  type="number"
                  className="mt-2"
                  placeholder="SĐT khách hàng..."
                  {...register("customerPhone", validationRules.customerPhone)}
                />
                {errors.customerPhone && (
                  <ErrorAlert className="mt-2">
                    {errors.customerPhone.message}
                  </ErrorAlert>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/3">
                <Label htmlFor="bookingDate" value="Ngày đặt bàn" />

                <Controller
                  name="bookingDate"
                  control={control}
                  rules={{ required: "Chọn ngày đặt bàn!" }}
                  render={({ field }) => (
                    <Datepicker
                      id="bookingDate"
                      language="vi"
                      value={formatIsoToDate(field.value)}
                      onSelectedDateChanged={(date) => field.onChange(date)}
                      className="mt-2"
                    />
                  )}
                />

                {errors.bookingDate && (
                  <ErrorAlert className="mt-2">
                    {errors.bookingDate.message}
                  </ErrorAlert>
                )}
              </div>

              <div className="w-1/3">
                <Label htmlFor="bookingTime" value="Giờ đến" />
                <TextInput
                  type="time"
                  id="bookingTime"
                  min={bookingRange?.start}
                  max={bookingRange?.end}
                  step={parseInt(bookingRange?.step) * 60 || null}
                  className="mt-2"
                  {...register("bookingTime", validationRules.bookingTime)}
                />

                {errors.bookingTime && (
                  <ErrorAlert className="mt-2">
                    {errors.bookingTime.message}
                  </ErrorAlert>
                )}
              </div>

              <div className="w-1/3">
                <Label htmlFor="numberOfPeople" value="Số lượng đến" />
                <TextInput
                  id="numberOfPeople"
                  type="number"
                  className="mt-2"
                  placeholder="Số lượng đến..."
                  {...register(
                    "numberOfPeople",
                    validationRules.numberOfPeople
                  )}
                />
                {errors.numberOfPeople && (
                  <ErrorAlert className="mt-2">
                    {errors.numberOfPeople.message}
                  </ErrorAlert>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-full">
                <Label htmlFor="note" value="Ghi chú" />
                <Textarea
                  id="note"
                  className="mt-2"
                  rows={6}
                  {...register("note")}
                />
              </div>
            </div>

            {errorMessage && (
              <ErrorAlert className="mt-2">{errorMessage}</ErrorAlert>
            )}

            <Button type="submit" className="mt-5" disabled={isLoading}>
              Cập nhật đơn đặt bàn
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
export default UpdateBooking;

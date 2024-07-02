import axios from "axios";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  Modal,
  Pagination,
  Table,
  Textarea,
} from "flowbite-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { HiHome, HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "./../../config/index";
import { IoAddCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaEllipsisVertical } from "react-icons/fa6";
import { formatIsoToDate, formatPhoneNumber } from "../../helper/format";
import Dropdwon from "../../components/Dropdown/Dropdown";
import {
  format,
  isBefore,
  isWithinInterval,
  parseISO,
  subMinutes,
} from "date-fns";
import BookingStatus from "./../../enums/BookingStatus";
import { GoDotFill } from "react-icons/go";
import UpdateBooking from "./UpdateBooking";
import { FaRegDotCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

function BookingList() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTime = useSelector((state) => state.time.currentTime);
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get("page")) || 1;
  const currentPage = page;

  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingRange, setBookingRange] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const cancelReasonRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${config.API_HOST}/bookings?page=${currentPage}`
        );
        setBookings(response.data.items);
        setTotalPages(response.data.totalPage);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Lỗi khi tải dữ liệu đặt bàn!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

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

  const handlePageChange = useCallback((page) => {
    navigate(`?page=${page}`);
  }, []);

  const handleConfirmBooking = async (bookingId) => {
    try {
      const response = await axios.post(
        `${config.API_HOST}/booking/confirm/${bookingId}`
      );

      const confirmedBooking = response.data;

      setBookings(
        bookings.map((booking) =>
          booking.id === confirmedBooking.id ? confirmedBooking : booking
        )
      );
      toast.success(`Xác nhận đơn đạt bàn #${bookingId} thành công!`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Xác nhận đơn đạt bàn #${bookingId} không thành công!`
      );
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await axios.post(
        `${config.API_HOST}/booking/cancel/${selectedBookingId}`,
        {
          cancelReason: cancelReasonRef.current.value,
        }
      );

      const canceledBooking = response.data;

      setBookings(
        bookings.map((booking) =>
          booking.id === canceledBooking.id ? canceledBooking : booking
        )
      );
      toast.success(`Đã hủy đơn đạt bàn #${selectedBookingId}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Hủy đơn đặt bàn #${selectedBookingId} không thành công`
      );
    } finally {
      cancelReasonRef.current.value = "";
      setOpenModal(false);
    }
  };

  const handleBookingCheckIn = async (bookingId) => {
    try {
      const response = await axios.post(
        `${config.API_HOST}/booking/check-in/${bookingId}`
      );

      const checkInBooking = response.data;

      setBookings(
        bookings.map((booking) =>
          booking.id === checkInBooking.id ? checkInBooking : booking
        )
      );
      toast.success(`Khách nhận bàn thành công!`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || `Khách nhận bàn không thành công!`
      );
    }
  };

  const bookingCanCheckIn = (booking) => {
    if (
      booking.status !== BookingStatus.CONFIRMED &&
      booking.status !== BookingStatus.EXPIRED
    ) {
      return false;
    }

    const bookingDateTime = new Date(
      `${booking.bookingDate} ${booking.bookingTime}`
    );
    const canCheckInAt = new Date(
      bookingDateTime.getTime() -
        (parseInt(bookingRange?.minutesBeforeArrival) || 0) * 60000
    );
    if (currentTime >= canCheckInAt) {
      return true;
    }

    return false;
  };

  return (
    <>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <h4 className="mb-3">Nguyên nhân hủy đặt bàn</h4>
          <div className="text-center">
            <Textarea className="mb-4" rows={4} ref={cancelReasonRef} />
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  handleConfirmCancel();
                  setOpenModal(false);
                }}
              >
                Xác nhận
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Không
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item>Danh sách đơn đặt bàn</Breadcrumb.Item>
        </Breadcrumb>
        <Link to={config.routes.createBooking}>
          <Button color={"blue"}>
            <IoAddCircleOutline className="mr-2 h-5 w-5" />
            Tạo đơn đặt bàn
          </Button>
        </Link>
      </div>
      <Card className="mt-10 w-full">
        <div className="">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Thông tin đơn</Table.HeadCell>
              <Table.HeadCell>Trạng thái</Table.HeadCell>
              <Table.HeadCell>Xếp bàn</Table.HeadCell>
              <Table.HeadCell>Ngày tạo</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {bookings.map((booking) => (
                <Table.Row
                  key={booking.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <Link
                      to={config.routes.bookingInfo.replace(":id", booking.id)}
                    >
                      #{booking.id}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-4">
                        <span className="text-[rgb(87,88,100)] min-w-32 line-clamp-1">
                          Tên khách hàng
                        </span>
                        <span className="text-[rgb(17,17,17)] line-clamp-1 font-semibold">
                          {booking.customerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[rgb(87,88,100)] min-w-32 line-clamp-1">
                          Số điện thoại
                        </span>
                        <span className="text-[rgb(17,17,17)] line-clamp-1 font-semibold">
                          {booking.customerPhone}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[rgb(87,88,100)] min-w-32 line-clamp-1">
                          Ngày đặt
                        </span>
                        <span className="text-[rgb(17,17,17)] line-clamp-1 font-semibold">
                          {format(booking.bookingDate, "dd-MM-yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[rgb(87,88,100)] min-w-32 line-clamp-1">
                          Giờ đặt
                        </span>
                        <span className="text-[rgb(17,17,17)] line-clamp-1 font-semibold">
                          {booking.bookingTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[rgb(87,88,100)] min-w-32 line-clamp-1">
                          Số lượng người
                        </span>
                        <span className="text-[rgb(17,17,17)] line-clamp-1 font-semibold">
                          {booking.numberOfPeople}
                        </span>
                      </div>
                      {booking.status === BookingStatus.CANCELED && (
                        <div className="flex items-center gap-4">
                          <span className="text-[rgb(87,88,100)] min-w-32 line-clamp-1">
                            Nguyên nhân hủy
                          </span>
                          <span
                            className="text-[rgb(17,17,17)] line-clamp-1 font-semibold"
                            title={booking.canceledReason}
                          >
                            {booking.canceledReason}
                          </span>
                        </div>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {(() => {
                      switch (booking.status) {
                        case BookingStatus.PENDING:
                          return (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium me-2">
                              <GoDotFill color={"gray"} className="mr-2" />
                              Chờ xác nhận
                            </span>
                          );
                        case BookingStatus.CANCELED:
                          return (
                            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm font-medium me-2">
                              <GoDotFill color={"red"} className="mr-2" />
                              Bị hủy
                            </span>
                          );
                        case BookingStatus.EXPIRED:
                          return (
                            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium me-2 rounded dark:bg-yellow-900 dark:text-yellow-300">
                              <GoDotFill color={"yellow"} className="mr-2" />
                              Quá giờ
                            </span>
                          );
                        case BookingStatus.CONFIRMED:
                          return (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium me-2">
                              <GoDotFill color={"blue"} className="mr-2" />
                              Đã xác nhận
                            </span>
                          );
                        case BookingStatus.COMPLETE:
                          return (
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm font-medium me-2 rounded dark:bg-green-900 dark:text-green-300">
                              <GoDotFill color={"green"} className="mr-2" />
                              Đã hoàn thành
                            </span>
                          );
                      }
                    })()}
                  </Table.Cell>
                  <Table.Cell>
                    {booking.reservations.length !== 0 ? (
                      <div className="flex flex-col gap-5">
                        {booking.reservations.map((reservation) => (
                          <div
                            className="flex items-center text-black font-medium"
                            key={reservation.id}
                          >
                            <FaRegDotCircle
                              color="rgba(28,100,242,.6)"
                              className="mr-2"
                            />
                            <div>
                              {`Bàn ${reservation.table.name} - Khu ${reservation.table.area.name} - ${reservation.table.capacity} chỗ ngồi`}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "Chưa xếp bàn"
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {format(parseISO(booking.createAt), "dd-MM-yyyy")}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      {bookingCanCheckIn(booking) && (
                        <button
                          onClick={() => handleBookingCheckIn(booking.id)}
                          className="text-green-500 hover:text-white border border-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-500 dark:focus:ring-green-800"
                        >
                          Khách nhận bàn
                        </button>
                      )}

                      {booking.status == BookingStatus.PENDING && (
                        <button
                          onClick={() => handleConfirmBooking(booking.id)}
                          className="text-green-600 hover:text-white border border-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                        >
                          Xác nhận
                        </button>
                      )}

                      {booking.status == BookingStatus.CONFIRMED &&
                        !booking.reservation && (
                          <Link
                            target="_blank"
                            to={`${
                              config.routes.bookingReservation
                            }?date=${format(
                              booking.bookingDate,
                              "yyyy-MM-dd"
                            )}`}
                            className="text-yellow-600 hover:text-white border border-yellow-600 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-yellow-500 dark:text-yellow-500 dark:hover:text-white dark:hover:bg-yellow-600 dark:focus:ring-yellow-800"
                          >
                            Xếp bàn
                          </Link>
                        )}

                      {booking.status !== BookingStatus.COMPLETE &&
                        booking.status !== BookingStatus.CANCELED && (
                          <Link
                            to={config.routes.editBooking.replace(
                              ":id",
                              booking.id
                            )}
                            className="text-purple-600 hover:text-white border border-purple-600 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:hover:bg-purple-600 dark:focus:ring-purple-800"
                          >
                            Sửa thông tin
                          </Link>
                        )}

                      {booking.status !== BookingStatus.CANCELED &&
                        booking.status !== BookingStatus.COMPLETE && (
                          <button
                            onClick={() => {
                              setSelectedBookingId(booking.id);
                              setOpenModal(true);
                            }}
                            className="text-red-600 hover:text-white border border-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-800"
                          >
                            Hủy
                          </button>
                        )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="mt-4 flex justify-end overflow-x-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            showIcons
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </>
  );
}

export default BookingList;

import { Button, Datepicker, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import config from "../../config";
import axios from "axios";
import { format, parse, parseISO } from "date-fns";
import Select from "react-select";
import { toast } from "react-toastify";
import { formatCurrency, formatPhoneNumber } from "../../helper/format";
import BookingStatus from "./../../enums/BookingStatus";
import clsx from "clsx";
import { FaRegCircleXmark } from "react-icons/fa6";

function BookingReservation() {
  const getDateFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const dateString = params.get("date");
    if (dateString) {
      const date = parseISO(dateString);
      const offset = 7 * 60;
      const localTime = new Date(date.getTime() + offset * 60 * 1000);
      return localTime;
    }
    return new Date();
  };

  const [date, setDate] = useState(getDateFromUrl());
  const [tables, setTables] = useState([]);
  const [bookingHours, setBookingHours] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState();
  const [bookingOptions, setBookingOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState([]);
  const [selectedReservations, setSelectedReservations] = useState({});

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      "&:hover": {
        border: "none",
      },
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none",
    }),
  };

  useEffect(() => {
    const fetchBookingTables = async () => {
      try {
        const response = await axios.get(`${config.API_HOST}/tables/all`, {
          params: {
            date: format(date, "yyyy-MM-dd"),
          },
        });
        setTables(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Lấy dữ liệu bàn ăn không thành công!"
        );
      }
    };

    fetchBookingTables();

    return () => {
      setTables([]);
    };
  }, [date]);

  useEffect(() => {
    const fetchBookingHours = async () => {
      try {
        const response = await axios.get(
          `${config.API_HOST}/booking/booking-hours`
        );
        setBookingHours(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Lấy dữ liệu giờ đặt bàn không thành công!"
        );
      }
    };

    fetchBookingHours();

    return () => {
      setBookingHours([]);
    };
  }, []);

  const handleMenuOpen = async (time) => {
    setIsLoadingOptions([...isLoadingOptions, time]);
    try {
      const response = await axios.get(
        `${config.API_HOST}/available-bookings`,
        {
          params: {
            date: format(date, "yyyy-MM-dd"),
            time: time,
          },
        }
      );
      setBookingOptions(
        response.data.map((option) => ({
          value: option.id,
          label: `${option.customerName} - ${formatPhoneNumber(
            option.customerPhone
          )}`,
        }))
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Load dữ liệu bàn có thể xếp không thành công!"
      );
      setBookingOptions([]);
    } finally {
      setIsLoadingOptions((prevLoadingOptions) =>
        prevLoadingOptions.filter((option) => option !== time)
      );
    }
  };

  const handleSelectChange = (selectedOption, bookingHour) => {
    setSelectedReservations((prevSelectedReservations) => ({
      ...prevSelectedReservations,
      [bookingHour]: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleDeleteTableReservation = (reservationId) => {
    if (selectedTable == null) return;

    setSelectedTable((prev) => ({
      ...prev,
      reservations: prev.reservations.filter(
        (reservation) => reservation.id !== reservationId
      ),
    }));
  };

  const handleSave = async () => {
    const existingReservations = selectedTable?.reservations.map(
      (reservation) => ({
        time: reservation.booking.bookingTime,
        bookingId: reservation.booking.id,
      })
    );
    

    const newReservations = Object.keys(selectedReservations).map(
      (bookingHour) => ({
        time: bookingHour,
        bookingId: selectedReservations[bookingHour],
      })
    );

    const allReservations = [
      ...existingReservations,
      ...newReservations,
    ].filter(
      (reservation) => reservation.time != null && reservation.bookingId != null
    );

    try {
      const response = await axios.post(
        `${config.API_HOST}/table/save-reservations/${selectedTable.id}`,
        {
          reservations: allReservations,
          date: format(date, "yyyy-MM-dd"),
        }
      );
      const updatedTable = response.data;

      toast.success("Lưu lịch xếp bàn thành công!");
      setTables(
        tables.map((table) =>
          table.id === updatedTable.id ? updatedTable : table
        )
      );
      if (selectedTable.id === updatedTable.id) {
        setSelectedTable(updatedTable);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Lưu dữ liệu đặt bàn không thành công!"
      );
    } finally {
      setSelectedReservations([])
    }
  };

  const updateUrlParameter = (newDate) => {
    const params = new URLSearchParams(window.location.search);
    params.set("date", format(newDate, "yyyy-MM-dd"));
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  useEffect(() => {
    const handleUrlChange = () => {
      setDate(getDateFromUrl());
    };

    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    updateUrlParameter(newDate);
  };

  return (
    <div className="p-5">
      <Datepicker
        language="vi"
        className="w-52"
        defaultDate={date}
        onSelectedDateChanged={handleDateChange}
      />
      <div className="mt-8">
        <div className="grid grid-cols-5 gap-6">
          {tables.map((table) => (
            <div
              className="bg-[rgb(42,55,79)] border border-[rgb(60,78,113)] rounded-md cursor-pointer"
              onClick={() => {
                setSelectedTable(table);
                setOpenModal(true);
              }}
              key={table.id}
            >
              <div className="w-full p-4">
                <div className="flex flex-col text-center">
                  <h4 className="font-semibold text-2xl">
                    Bàn {table.name} - Khu {table.area.name}
                  </h4>
                  <span className="mt-3 text-[rgba(235,238,244,0.5)] text-sm font-medium">
                    {table.capacity} chỗ ngồi
                  </span>
                </div>
              </div>
              <div>
                {bookingHours.map((bookingHour) => (
                  <div
                    className="flex h-8 items-center px-4 py-[6px] border-t border-[rgb(60,78,113)]"
                    key={bookingHour}
                  >
                    <div className="w-14 text-xs font-semibold">
                      {format(
                        parse(bookingHour, "HH:mm:ss", new Date()),
                        "HH:mm"
                      )}
                    </div>
                    <div className="flex-1">
                      {table.reservations.length !== 0
                        ? (() => {
                            const filteredReservations =
                              table.reservations.filter((reservation) =>
                                reservation.booking.bookingTime.startsWith(
                                  bookingHour
                                )
                              );
                            return filteredReservations.length > 0 ? (
                              filteredReservations.map((reservation) => (
                                <div
                                  key={reservation.id}
                                  title={`${
                                    reservation.booking.customerName
                                  } - ${formatPhoneNumber(
                                    reservation.booking.customerPhone
                                  )} - ${reservation.booking.numberOfPeople}`}
                                  className={clsx(
                                    "line-clamp-1",
                                    reservation.booking.status ===
                                      BookingStatus.CANCELED && "text-red-600",
                                    reservation.booking.status ===
                                      BookingStatus.EXPIRED &&
                                      "text-yellow-600",
                                    reservation.booking.status ===
                                      BookingStatus.COMPLETE && "text-green-600"
                                  )}
                                >
                                  Đặt bởi {reservation.booking.customerName}
                                </div>
                              ))
                            ) : (
                              <div key="no-reservation">-</div>
                            );
                          })()
                        : "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          Bàn {selectedTable?.name} - Khu {selectedTable?.area.name} (
          {selectedTable?.capacity} chỗ ngồi )
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-2 gap-3 text-[rgb(33,40,55)]">
            {bookingHours.map((bookingHour) => (
              <div className="flex items-stretch" key={bookingHour}>
                <div className="w-16 px-3 py-2 bg-[rgb(235,238,244)] border border-[rgb(209,217,231)] rounded-l-md font-medium">
                  {format(parse(bookingHour, "HH:mm:ss", new Date()), "HH:mm")}
                </div>
                {selectedTable?.reservations.some((reservation) =>
                  reservation.booking.bookingTime.startsWith(bookingHour)
                ) ? (
                  <div className="flex-1 items-center px-3 py-2 border border-[rgb(209,217,231)] rounded-r-md">
                    {selectedTable?.reservations
                      .filter((reservation) =>
                        reservation.booking.bookingTime.startsWith(bookingHour)
                      )
                      .map((reservation) => (
                        <div
                          key={reservation.id}
                          className="flex h-full items-center line-clamp-1"
                          title={` Đặt bởi ${reservation.booking.customerName}`}
                        >
                          Đặt bởi {reservation.booking.customerName}
                          <FaRegCircleXmark
                            color="red"
                            className="ml-2 cursor-pointer"
                            onClick={() =>
                              handleDeleteTableReservation(reservation.id)
                            }
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <Select
                    className="flex-1 px-3 py-2 border border-[rgb(209,217,231)] rounded-r-md"
                    options={bookingOptions}
                    onMenuOpen={() => {
                      handleMenuOpen(bookingHour);
                    }}
                    onChange={(selectedOption) => {
                      handleSelectChange(selectedOption, bookingHour);
                    }}
                    styles={customStyles}
                    isLoading={isLoadingOptions.includes(bookingHour)}
                    loadingMessage={() => "Đang tải..."}
                    noOptionsMessage={() => "Không có đơn đặt bàn phù hợp"}
                    defaultValue={{ value: "-", label: "-" }}
                    isClearable
                  />
                )}
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave}>Lưu</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BookingReservation;

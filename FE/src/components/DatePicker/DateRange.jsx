import { DateRangePicker, locale } from "react-date-range";
import { addDays, format } from "date-fns";
import { useRef, useState } from "react";
import { vi } from "date-fns/locale";
import { SlCalender } from "react-icons/sl";

function DateRange({
  startDate = new Date(),
  endDate = new Date(),
  open = false,
}) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const refDatePicker = useRef(null);

  return (
    <div className="relative inline-flex flex-col">
      <div
        className="inline-flex items-center  bg-[rgb(42,55,79)] border rounded-md border-[rgb(60,78,113)] mb-2 text-[rgb(235,238,244)]"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <SlCalender size={"20"} className="mx-2" />

        <input
          className="flex-1 px-4 bg-[rgb(42,55,79)] text-sm border-none min-w-60 focus:outline-none focus:border-none"
          readOnly={true}
          value={`${format(range[0].startDate, "dd/MM/yyy")} - ${format(
            range[0].endDate,
            "dd/MM/yyy"
          )}`}
          type="text"
          placeholder="Khoảng cần xem báo cáo"
        />
      </div>
      <div className="calender-wrap" ref={refDatePicker}>
        {isOpen && (
          <DateRangePicker
          className="absolute left-0 z-10"
            onChange={(item) => {
              setRange([item.selection]);
            }}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={2}
            direction="horizontal"
            dateDisplayFormat="dd-MM-yyyy"
            color="#33333"
            locale={vi}
          />
        )}
      </div>
    </div>
  );
}

export default DateRange;

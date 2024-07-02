import { useEffect, useMemo, useState } from "react";
import { Select } from "flowbite-react";
import RevenueSortType from "../../enums/RevenueSortType";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import { PieChart } from "../../components/Chart";
import { addDays, differenceInDays, endOfYear, format, isSameDay, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { AgGridReact } from "ag-grid-react";
import { Datatable } from "../../components/Table";
import { formatCurrency } from "../../helper/format";
import Tippy from "@tippyjs/react";
import { createStaticRanges, DateRangePicker } from "react-date-range";
import { vi } from "date-fns/locale";

function ItemRevenue() {
  const [sortBy, setSortBy] = useState(RevenueSortType.REVENUE);
  const today = useMemo(() => new Date(), []);
  const [restaurantInfo, setRestaurantInfo] = useState();
  const definedTimes = useMemo(
    () => ({
      startOfMonth: startOfMonth(today),
      startOfLastMonth: startOfMonth(addDays(today, -30)),
      endOfLastMonth: endOfYear(today),
    }),
    [today]
  );
  const [dateRangePickerShow, setDateRangePickerShow] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfWeek(today, { weekStartsOn: 1 }),
      endDate: today,
      key: "selection",
    },
  ]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const response = await axios.get(`${config.API_HOST}/restaurant-info`);
        setRestaurantInfo(response.data);
      } catch {}
    };
    fetchRestaurantInfo();
  }, []);
  const fetchTopItemRevenueByDate = async (date) => {
    try {
      const response = await axios.get(
        config.API_HOST + "/revenue/get-top-item-by-date",
        {
          params: {
            date: format(date, "yyyy-MM-dd"),
            sortBy: sortBy,
          },
        }
      );
      setItems(response.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Load dữ liệu không thành công!"
      );
    }
  };

  const fetchTopItemRevenueByDateRange = async (dateStart, dateEnd) => {
    try {
      const response = await axios.get(
        config.API_HOST + "/revenue/get-top-item-by-date-range",
        {
          params: {
            dateStart: format(dateStart, "yyyy-MM-dd"),
            dateEnd: format(dateEnd, "yyyy-MM-dd"),
            sortBy: sortBy,
          },
        }
      );

      setItems(response.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Load dữ liệu không thành công!"
      );
    }
  };

  const fetchTopItemRevenueByYearRange = async (yearStart, yearEnd) => {
    try {
      const response = await axios.get(
        config.API_HOST + "/revenue/get-top-item-by-year-range",
        {
          params: {
            yearStart: yearStart,
            yearEnd: yearEnd,
            sortBy: sortBy,
          },
        }
      );

      setItems(response.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Load dữ liệu không thành công!"
      );
    }
  };

  const fetchTopItemRevenueByMonthRange = async (monthStart, monthEnd) => {
    try {
      const response = await axios.get(
        config.API_HOST + "/revenue/get-top-item-by-month-range",
        {
          params: {
            monthStart: format(monthStart, "yyyy-MM"),
            monthEnd: format(monthEnd, "yyyy-MM"),
            sortBy: sortBy,
          },
        }
      );

      setItems(response.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Load dữ liệu không thành công!"
      );
    }
  };

  const fetchTopItemAllTime = async () => {
    try {
      const response = await axios.get(
        config.API_HOST + "/revenue/get-top-item-all-time",
        {
          params: {
            sortBy: sortBy,
          },
        }
      );

      const items = response.data;

      setItems(items);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Load dữ liệu không thành công!"
      );
    }
  };


  const pieChartData = useMemo(() => {
    switch (sortBy) {
      case RevenueSortType.REVENUE:
        return {
          names: items.map((item) => item.item.title),
          values: items.map((item) => item.revenue),
          isCurrency: true
        };
      case RevenueSortType.SOLD:
        return {
          names: items.map((item) => item.item.title),
          values: items.map((item) => item.quantitySold),
        };
      case RevenueSortType.PROFIT:
        return {
          names: items.map((item) => item.item.title),
          values: items.map((item) => item.profit),
          isCurrency: true
        };
      default:
        return {};
    }
  
  }, [items]);

  const rowData = useMemo(() => {
    return items.map((that, index) => {
      return {
        index: index + 1,
        itemName: that.item.title,
        sold: that.quantitySold,
        revenue: that.revenue,
        profit: that.profit,
      };
    });
  }, [items]);

  const colDefs = useMemo(
    () => [
      { field: "index", headerName: "STT" },
      { field: "itemName", headerName: "Tên sản phẩm" },
      { field: "sold", headerName: "Đã bán" },
      {
        field: "revenue",
        headerName: "Doanh thu",
        cellRenderer: (params) => {
          return formatCurrency(params.value) + " đ";
        },
      },
      {
        field: "profit",
        headerName: "Lợi nhuận",
        cellRenderer: (params) => {
          return formatCurrency(params.value) + " đ";
        },
      },
    ],
    []
  );

  const handleToggle = () => {
    setDateRangePickerShow(!dateRangePickerShow);
  };

  const handleDateChange = (item) => {
    setDateRange([item.selection]);
  };

  const staticRanges = useMemo(
    () =>
      createStaticRanges([
        {
          label: "Hôm nay",
          range: () => ({
            startDate: today,
            endDate: today,
          }),
        },
        {
          label: "Tuần này",
          range: () => ({
            startDate: startOfWeek(today, { weekStartsOn: 1 }),
            endDate: today,
          }),
        },
        {
          label: "Tháng này",
          range: () => ({
            startDate: definedTimes.startOfMonth,
            endDate: today,
          }),
        },
        {
          label: "Năm nay",
          range: () => ({
            startDate: startOfYear(today),
            endDate: today,
          }),
        },
        {
          label: "Tất cả",
          range: () => ({
            startDate: startOfYear(new Date(2023, 1, 1)),
            endDate: today,
          }),
        },
      ]),
    [definedTimes]
  );

  useEffect(() => {
    let startDate = dateRange[0].startDate;
    let endDate = dateRange[0].endDate;
    let daysDifference = differenceInDays(endDate, startDate);
    if (daysDifference > 365) {
      fetchTopItemAllTime();
    } else if (daysDifference > 31) {
      fetchTopItemRevenueByMonthRange(startDate, endDate);
    } else {
      fetchTopItemRevenueByDateRange(startDate, endDate);
    }
  }, [dateRange[0].startDate, dateRange[0].endDate, sortBy]);

  return (
    <>
      <h3 className="h2 text-2xl font-bold mb-5 text-center">
        Báo cáo sản phẩm
      </h3>
      <div className="flex items-center">
      <Tippy
          visible={dateRangePickerShow}
          onClickOutside={() => setDateRangePickerShow(false)}
          content={
            <DateRangePicker
              onChange={handleDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              locale={vi}
              direction="horizontal"
              staticRanges={staticRanges}
              maxDate={today}
              {...(restaurantInfo?.startYear && {
                minDate: new Date(restaurantInfo.startYear, 0, 1),
              })}
            />
          }
          interactive={true}
          placement="right-start"
        >
          <div
            className="px-3 py-2 rounded-lg cursor-pointer font-semibold bg-white text-[rgb(42,55,79)]"
            onClick={handleToggle}
          >
            {!isSameDay(dateRange[0].startDate, dateRange[0].endDate)
              ? `Từ ${format(
                  dateRange[0].startDate,
                  "dd/MM/yyyy"
                )} đến ${format(dateRange[0].endDate, "dd/MM/yyyy")}`
              : `Ngày ${format(dateRange[0].startDate, "dd/MM/yyyy")}`}
          </div>
        </Tippy>
      </div>
      <div className="flex items-start mt-4 text-[rgb(235,238,244)] rounded-md bg-[rgb(42,55,79)]">
        <div className="p-4 w-full ">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-semibold">Tỉ trọng sản phẩm</h4>
            <Select
              onChange={(event) => {
                setSortBy(event.target.value);
              }}
            >
              <option
                value={RevenueSortType.REVENUE}
                selected={sortBy === RevenueSortType.REVENUE}
              >
                Theo doanh thu
              </option>
              <option
                value={RevenueSortType.SOLD}
                selected={sortBy === RevenueSortType.SOLD}
              >
                Theo đã bán
              </option>
              <option
                value={RevenueSortType.PROFIT}
                selected={sortBy === RevenueSortType.PROFIT}
              >
                Theo lợi nhuận
              </option>
            </Select>
          </div>
          <PieChart
            names={pieChartData.names}
            values={pieChartData.values}
            type={"currency"}
            height={"450px"}
            isCurrency={sortBy === RevenueSortType.REVENUE || sortBy === RevenueSortType.PROFIT}
          />
        </div>
      </div>
      <div className="flex-1 p-4 mt-4 text-[rgb(235,238,244)] rounded-md bg-[rgb(42,55,79)]">
        <div className="flex items-center justify-between text-xl font-semibold">
          Báo cáo chi tiết
        </div>
        <div className="mt-5">
          <Datatable cols={colDefs} rows={rowData}/>
        </div>
      </div>
    </>
  );
}

export default ItemRevenue;

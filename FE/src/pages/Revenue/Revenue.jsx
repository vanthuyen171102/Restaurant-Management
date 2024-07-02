import { useEffect, useMemo, useState } from "react";
import { DateRange } from "../../components/DatePicker";
import {
  addDays,
  differenceInDays,
  endOfWeek,
  endOfYear,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import Chart from "react-apexcharts";
import { PieChart, RevenueSplineAreaChart } from "../../components/Chart";
import config from "./../../config/index";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import sortBy from "sort-by";
import RevenueSortType from "../../enums/RevenueSortType";
import { formatCurrency } from "../../helper/format";
import { createStaticRanges, DateRangePicker } from "react-date-range";
import { vi } from "date-fns/locale";
import Tippy from "@tippyjs/react";
import { Card } from "flowbite-react";

function Revenue() {
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
  const [revenue, setRevenue] = useState(0);
  const [profit, setProfit] = useState(0);

  const [splineChartCategories, setSplineChartCategories] = useState([]);
  const [splineChartSeries, setSplineChartSeries] = useState([]);
  const [pieChartData, setPieChartData] = useState({
    names: [],
    values: [],
  });
  const [selectedOption, setSelectedOption] = useState("thisWeek");

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const response = await axios.get(`${config.API_HOST}/restaurant-info`);
        setRestaurantInfo(response.data);
      } catch {}
    };
    fetchRestaurantInfo();
  }, []);

  const fetchRevenueByDateRange = async (dateStart, dateEnd) => {
    try {
      const response = await axios.get(
        config.API_HOST + "/revenue/revenue-by-date-range",
        {
          params: {
            dateStart: format(dateStart, "yyyy-MM-dd"),
            dateEnd: format(dateEnd, "yyyy-MM-dd"),
          },
        }
      );
      const daysRevenue = response.data;
      const categories = daysRevenue.map((item) =>
        format(new Date(item.date), "dd/MM")
      );
      const revenueData = [];
      const profitData = [];

      daysRevenue.forEach((item) => {
        revenueData.push(item.revenue);
        profitData.push(item.profit);
      });

      const chartSeries = [
        {
          name: "Doanh thu",
          data: revenueData,
        },
        {
          name: "Lợi nhuận",
          data: profitData,
        },
      ];

      setRevenue(
        revenueData.reduce((acc, currentValue, index) => acc + currentValue, 0)
      );
      setProfit(
        profitData.reduce((acc, currentValue, index) => acc + currentValue, 0)
      );

      setSplineChartCategories(categories);
      setSplineChartSeries(chartSeries);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Load dữ liệu không thành công!"
      );
    }
  };

  const fetchRevenueByMonthRange = async (monthStart, monthEnd) => {
    try {
      const response = await axios.get(
        config.API_HOST + "/revenue/revenue-by-month-range",
        {
          params: {
            monthStart: format(monthStart, "yyyy-MM"),
            monthEnd: format(monthEnd, "yyyy-MM"),
          },
        }
      );
      const monthsRevenue = response.data;
      const categories = monthsRevenue.map(
        (item) => " Tháng " + item.month + "/" + item.year
      );
      const revenueData = [];
      const profitData = [];

      monthsRevenue.forEach((item) => {
        revenueData.push(item.revenue);
        profitData.push(item.profit);
      });

      setRevenue(
        revenueData.reduce((acc, currentValue, index) => acc + currentValue, 0)
      );
      setProfit(
        profitData.reduce((acc, currentValue, index) => acc + currentValue, 0)
      );

      const chartSeries = [
        {
          name: "Doanh thu",
          data: revenueData,
        },
        {
          name: "Lợi nhuận",
          data: profitData,
        },
      ];

      setSplineChartCategories(categories);
      setSplineChartSeries(chartSeries);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Load dữ liệu không thành công!"
      );
    }
  };

  const fetchRevenueByYearRange = async (yearStart, yearEnd) => {
    try {
      const response = await axios.get(
        config.API_HOST + "/revenue/revenue-by-year-range",
        {
          params: {
            yearStart: yearStart,
            yearEnd: yearEnd,
          },
        }
      );
      const yearsRevenue = response.data;
      const categories = yearsRevenue.map((item) => `Năm ${item.year}`);
      const revenueData = [];
      const profitData = [];

      yearsRevenue.forEach((item) => {
        revenueData.push(item.revenue);
        profitData.push(item.profit);
      });

      setRevenue(
        revenueData.reduce((acc, currentValue, index) => acc + currentValue, 0)
      );
      setProfit(
        profitData.reduce((acc, currentValue, index) => acc + currentValue, 0)
      );

      const chartSeries = [
        {
          name: "Doanh thu",
          data: revenueData,
        },
        {
          name: "Lợi nhuận",
          data: profitData,
        },
      ];

      setSplineChartCategories(categories);
      setSplineChartSeries(chartSeries);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Load dữ liệu không thành công!"
      );
    }
  };

  const fetchAllRevenue = async () => {
    try {
      const response = await axios.get(config.API_HOST + "/revenue/all");
      const revenues = response.data;
      const categories = revenues.map((item) => "Năm " + item.year);
      const revenueData = [];
      const profitData = [];

      revenues.forEach((item) => {
        revenueData.push(item.revenue);
        profitData.push(item.profit);
      });

      const chartSeries = [
        {
          name: "Doanh thu",
          data: revenueData,
        },
        {
          name: "Lợi nhuận",
          data: profitData,
        },
      ];

      setRevenue(
        revenueData.reduce((acc, currentValue, index) => acc + currentValue, 0)
      );
      setProfit(
        profitData.reduce((acc, currentValue, index) => acc + currentValue, 0)
      );

      setSplineChartCategories(categories);
      setSplineChartSeries(chartSeries);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Load dữ liệu không thành công!"
      );
    }
  };

  const fetchTopItemRevenueByDate = async (date) => {
    try {
      const response = await axios.get(
        config.API_HOST + "/revenue/get-top-item-by-date",
        {
          params: {
            date: format(date, "yyyy-MM-dd"),
          },
        }
      );
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
            sortBy: RevenueSortType.REVENUE,
          },
        }
      );

      const items = response.data;
      const names = [];
      const values = [];
      items.forEach((item) => {
        names.push(item.item.title);
        values.push(item.revenue);
      });

      setPieChartData({
        names: names,
        values: values,
      });
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
            sortBy: RevenueSortType.REVENUE,
          },
        }
      );

      const items = response.data;
      const names = [];
      const values = [];
      items.forEach((item) => {
        names.push(item.item.title);
        values.push(item.revenue);
      });

      setPieChartData({
        names: names,
        values: values,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Load dữ liệu không thành công!"
      );
    }
  };

  useEffect(() => {
    let startDate = dateRange[0].startDate;
    let endDate = dateRange[0].endDate;
    let daysDifference = differenceInDays(endDate, startDate);
    if (daysDifference > 365) {
      fetchRevenueByYearRange(startDate.getFullYear(), endDate.getFullYear());
    } else if (daysDifference > 31) {
      fetchRevenueByMonthRange(startDate, endDate);
    } else {
      fetchRevenueByDateRange(startDate, endDate);
    }
  }, [dateRange[0].startDate, dateRange[0].endDate]);

  useEffect(() => {
    const fetchData = () => {
      if (selectedOption === "thisWeek") {
        const now = new Date();
        const options = { weekStartsOn: 1 };
        const startOfCurrentWeek = startOfWeek(now, options);
        fetchTopItemRevenueByDateRange(startOfCurrentWeek, now);
        fetchRevenueByDateRange(startOfCurrentWeek, now);
      } else if (selectedOption === "thisMonth") {
        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);
        fetchTopItemRevenueByDateRange(startOfCurrentMonth, now);
        fetchRevenueByDateRange(startOfCurrentMonth, now);
      } else if (selectedOption === "thisYear") {
        const now = new Date();
        fetchRevenueByMonthRange(startOfYear(now), now);
        fetchTopItemRevenueByMonthRange(startOfYear(now), now);
      } else if (selectedOption === "allYear") {
        fetchAllRevenue();
      }
    };

    fetchData();
  }, [selectedOption]);

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

  return (
    <>
      <h3 className="h2 text-2xl font-bold mb-5 text-center">
        Báo cáo doanh thu
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
      <div className="flex items-start  mt-4 gap-4">
        <div className="p-4 w-[67%] text-[rgb(235,238,244)] bg-white rounded-md">
          <RevenueSplineAreaChart
            categories={splineChartCategories}
            series={splineChartSeries}
          />
        </div>
        <div className="flex-1">
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-[rgb(87,88,100)] w-30">
                  Tổng doanh thu
                </span>
                <span className="text-[rgb(17,17,17)] font-semibold">
                  {formatCurrency(revenue)} đ
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[rgb(87,88,100)] w-30">
                  Tổng lợi nhuận
                </span>
                <span className="text-[rgb(17,17,17)] font-semibold">
                {formatCurrency(profit )} đ
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Revenue;

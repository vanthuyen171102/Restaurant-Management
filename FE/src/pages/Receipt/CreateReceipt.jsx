import axios from "axios";
import {
  Breadcrumb,
  Button,
  Label,
  Table,
  Textarea,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { HiHome } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import config from "./../../config/index";
import { formatCurrency } from "../../helper/format";
import { IoMdClose } from "react-icons/io";

function CreateReceipt() {
  const navigate = useNavigate();
  const [materialOptions, setMaterialOptions] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const paidRef = useRef();
  const noteRef = useRef();
  const [rows, setRows] = useState([
    {
      id: 1,
      material: null,
      price: "",
      quantity: "",
      total: "",
    },
  ]);
  const total = useMemo(
    () => rows.reduce((acc, row) => acc + row.total, 0),
    [rows]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.API_HOST}/enums/material-options`
        );
        const materialOptions = response.data;
        setMaterialOptions(
          materialOptions.map((option) => {
            return {
              value: option.id,
              label: option.name,
            };
          })
        );
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Load dữ liệu nguyên liệu không thành công!"
        );
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.API_HOST}/enums/supplier-options`
        );
        const supplierOptions = response.data;
        setSupplierOptions(
          supplierOptions.map((option) => {
            return {
              value: option.id,
              label: option.name,
            };
          })
        );
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Load dữ liệu NCC không thành công!"
        );
      }
    };
    fetchData();
  }, []);

  const customTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: "rgb(60,78,113)", // Hover color
      primary: "rgb(60,78,113)", // Focus color
      neutral0: "rgb(42,55,79)", // Dropdown background
      neutral80: "rgb(235,238,244)", // Text color
      neutral20: "rgb(235,238,244)", // Border color
    },
  });

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgb(42,55,79)",
      borderColor: "rgb(60,78,113)",
      color: "rgb(235,238,244)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "rgb(235,238,244)",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgb(42,55,79)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "rgb(60,78,113)" : "rgb(42,55,79)",
      color: "rgb(235,238,244)",
      "&:hover": {
        backgroundColor: "rgb(60,78,113)",
      },
    }),
    input: (provided) => ({
      ...provided,
      color: "rgb(235,238,244)",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgb(235,238,244)",
    }),
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        material: null,
        price: "",
        quantity: "",
        total: "",
      },
    ]);
  };

  const removeRow = (id) => {
    setRows(rows.filter(row => row.id != id))
  }

  const handleSelectChange = (selectedOption, rowId) => {
    const newRows = rows.map((row) =>
      row.id === rowId ? { ...row, material: selectedOption } : row
    );
    setRows(newRows);
  };

  const handleInputChange = (e, rowId, field) => {
    const value = e.target.value;
    if (parseFloat(value) < 0) {
      toast.error("Giá trị phải lớn hơn 0");
      return;
    }
    const newRows = rows.map((row) => {
      if (row.id === rowId) {
        const updatedRow = { ...row, [field]: value };
        if (field === "price" || field === "quantity") {
          const price = parseFloat(updatedRow.price) || 0;
          const quantity = parseFloat(updatedRow.quantity) || 0;
          updatedRow.total = price * quantity;
        }
        return updatedRow;
      }
      return row;
    });
    setRows(newRows);
  };

  const handleSuccessReceipt = async () => {
    setIsSubmit(true);
    try {
      await axios.post(`${config.API_HOST}/material-receipts/create`, {
        supplierId: selectedSupplier.value,
        isPaid: paidRef.current.checked,
        note: noteRef.current.value,
        receiptItems: rows
          .filter(
            (row) => row.material != null && row.quantity > 0 && row.price >= 0
          )
          .map((row) => {
            return {
              materialId: row.material.value,
              quantity: parseFloat(row.quantity),
              price: parseFloat(row.price),
            };
          }),
      });
      toast.success("Tạo biên lai nhập nguyên liệu thành công!");
      navigate(config.routes.receiptList);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Tạo biên lai không thành công!"
      );
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-lg col-span-3 border border-[rgb(60,78,113)] bg-[rgb(42,55,79)]">
          <h4 className="p-4 border-b border-[rgb(60,78,113)] text-white text-lg font-bold">
            Danh sách nhập
          </h4>
          <div className="p-4">
            <Table cellPadding={""}>
              <Table.Head>
                <Table.HeadCell className="bg-blue text-white">
                  Nguyên liệu
                </Table.HeadCell>
                <Table.HeadCell className="bg-blue text-white">
                  Giá
                </Table.HeadCell>
                <Table.HeadCell className="bg-blue text-white">
                  Số lượng
                </Table.HeadCell>
                <Table.HeadCell className="bg-blue text-white">
                  Thành tiền
                </Table.HeadCell>
                <Table.HeadCell className="bg-blue text-white"></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {rows.map((row) => (
                  <Table.Row
                    key={row.id}
                    className="bg-blue dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap text-white font-medium dark:text-white w-[40%]">
                      <Select
                        options={materialOptions}
                        className="py-1 pl-1 pr-6 text-[rgb(235,238,244)]"
                        theme={customTheme}
                        styles={customStyles}
                        value={row.material}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, row.id)
                        }
                      />
                    </Table.Cell>
                    <Table.Cell className="bg-blue text-white px-1">
                      <input
                        type="number"
                        className="w-full h-full text-sm px-2 py-[8px] bg-[rgb(42,55,79)] text-[rgb(235,238,244)] border border-[rgb(60,78,113)] rounded-md"
                        value={row.price}
                        onChange={(e) => handleInputChange(e, row.id, "price")}
                        min="0"
                      />
                    </Table.Cell>
                    <Table.Cell className="bg-blue text-white">
                      <input
                        type="number"
                        className="w-full h-full text-sm px-2 py-[8px] bg-[rgb(42,55,79)] text-[rgb(235,238,244)] border border-[rgb(60,78,113)] rounded-md"
                        value={row.quantity}
                        onChange={(e) =>
                          handleInputChange(e, row.id, "quantity")
                        }
                        min="0"
                      />
                    </Table.Cell>
                    <Table.Cell className="bg-blue text-white">
                      {formatCurrency(row.total)} đ
                    </Table.Cell>
                    <Table.Cell className="bg-blue text-white">
                      <span className="flex items-center justify-center border border-[rgb(235,238,244)] w-6 h-6 cursor-pointer"
                      onClick={() => removeRow(row.id)}>
                        <IoMdClose />
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="flex justify-between items-center">
              <button
                className="flex items-center ml-[26px] bg-[rgb(31,107,255)] text-white font-semibold rounded-md px-3 py-2 mt-4"
                onClick={addRow}
              >
                <CiCirclePlus color="white" size={20} className="mr-2" />
                Nhập thêm
              </button>
              <h5 className="font-semibold">
                Tổng cộng: {formatCurrency(total)} đ
              </h5>
            </div>
          </div>
        </div>
        <div className="rounded-lg  col-span-2 border border-[rgb(60,78,113)] bg-[rgb(42,55,79)]">
          <h4 className="p-4 border-b border-[rgb(60,78,113)] text-white text-lg font-bold">
            Thông tin
          </h4>
          <div className="p-4">
            <div className="mb-4 block">
              <Label
                htmlFor="supplier"
                className="text-white"
                value="Chọn nhà cung cấp"
              />
              <Select
                id="supplier"
                options={supplierOptions}
                onChange={setSelectedSupplier}
                className="py-1 mt-3 text-[rgb(235,238,244)]"
                theme={customTheme}
                styles={customStyles}
              />
            </div>
            <div className="mb-4 block">
              <Label htmlFor="note" className="text-white" value="Ghi chú" />
              <Textarea
                id="note"
                ref={noteRef}
                className="mt-4"
                placeholder="Ghi chú..."
                rows={4}
              />
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="paid"
                ref={paidRef}
                value=""
                class="sr-only peer"
              />
              <div class="relative w-11 h-6 bg-[rgb(42,55,79)] border border-[rgb(60,78,113)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span class="ms-3 text-sm text-white font-medium dark:text-gray-300">
                Đã thanh toán
              </span>
            </label>
            <button
              color="success"
              className="mt-4 py-3 w-full bg-[rgb(40,167,69)] rounded-md text-white font-semibold"
              onClick={handleSuccessReceipt}
              disabled={isSubmit}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateReceipt;

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
} from "flowbite-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { HiHome, HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "./../../config/index";
import { IoAddCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaEllipsisVertical } from "react-icons/fa6";
import {
  formatCurrency,
  formatIsoToDate,
  formatPhoneNumber,
} from "../../helper/format";

function ItemList() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("param change");
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get("page")) || 1;
  const keywordParam = searchParams.get("keyword") || "";
  const catIdParam = searchParams.get("catId") || null;
  const currentPage = page;

  const catRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(keywordParam);
  const [selectedCatTitle, setSelectedCatTitle] = useState("Danh mục");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const itemResponse = await axios.get(`${config.API_HOST}/items`, {
          params: {
            page: currentPage,
            keyword: searchKeyword,
            catId: catIdParam,
          },
        });
        const catResponse = await axios.get(
          `${config.API_HOST}/categories/all`
        );

        setItems(itemResponse.data.items);
        setCategories(catResponse.data);
        setTotalPages(itemResponse.data.totalPage);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Lỗi khi tải dữ liệu món ăn!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      setItems([]);
      setSelectedItem(null);
      setTotalPages(0);
    };
  }, [currentPage, catIdParam, keywordParam]);

  const handlePageChange = useCallback((page) => {
    navigate(`?page=${page}`);
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${config.API_HOST}/item/delete/${selectedItem}`);
      toast.success(`Đã xóa món ăn #${selectedItem}`);
      setItems(items.filter((item) => item.id != selectedItem));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Xóa món ăn #${selectedItem} không thành công`
      );
    } finally {
      setOpenModal(false);
    }
  };

  const handleClickSearchButton = useCallback(()  => {
    console.log(searchKeyword, selectedCatId);
    navigate(
      `?${searchKeyword ? `keyword=${searchKeyword}&` : ""}` +
        `${selectedCatId ? `catId=${selectedCatId}` : ""}`
    );
  }, [searchKeyword, selectedCatId]);

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
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn xóa món ăn này?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  handleConfirmDelete();
                }}
              >
                {"Đồng ý"}
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
          <Breadcrumb.Item>Món ăn</Breadcrumb.Item>
        </Breadcrumb>
        <Link to={config.routes.createItem}>
          <Button color={"blue"}>
            <IoAddCircleOutline className="mr-2 h-5 w-5" />
            Thêm món ăn
          </Button>
        </Link>
      </div>
      <Card className="mt-10 w-full">
        <div className="">
          <div class="w-full">
            <div class="flex items-center justify-center">
              <Dropdown ref={catRef} label={selectedCatTitle} className="">
              <Dropdown.Item
                    onClick={() => {
                      setSelectedCatTitle("Tất cả");
                      setSelectedCatId(null);
                    }}
                  >
                    Tất cả
                  </Dropdown.Item>
                {categories.map((category) => (
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedCatTitle(category.title);
                      setSelectedCatId(category.id);
                    }}
                  >
                    {category.title}
                  </Dropdown.Item>
                ))}
              </Dropdown>
              <div class="relative flex-1">
                <input
                  type="search"
                  id="search-dropdown"
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                  }}
                  defaultValue={keywordParam || ""}
                  class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                  placeholder={"Tên món ăn..."}
                  required
                />
                <button
                  type="submit"
                  class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleClickSearchButton}
                >
                  <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span class="sr-only">Tìm kiếm</span>
                </button>
              </div>
            </div>
          </div>

          <Table striped className="mt-10">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Tên món ăn</Table.HeadCell>
              <Table.HeadCell>Danh mục</Table.HeadCell>
              <Table.HeadCell>Giá bán</Table.HeadCell>
              <Table.HeadCell>Giá gốc</Table.HeadCell>
              <Table.HeadCell>Lợi nhuận</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {items.map((item) => (
                <Table.Row
                  key={item.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <Link to={"/item/" + item.id}>#{item.id}</Link>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center font-semibold ">
                      <Avatar
                        img={`${config.API_IMAGE_HOST}/${item.thumb}`}
                        size="xl"
                        className="mr-3 select-none"
                      />
                      {item.title}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{item.cat.title}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.price)} đ</Table.Cell>
                  <Table.Cell>{formatCurrency(item.capitalPrice)} đ</Table.Cell>
                  <Table.Cell>
                    {formatCurrency(item.price - item.capitalPrice)} đ
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      label=""
                      placement="bottom"
                      renderTrigger={() => (
                        <span className="cursor-pointer">
                          <FaEllipsisVertical />
                        </span>
                      )}
                    >
                      <Dropdown.Item>
                        <Link
                          className="text-gray-700 block px-4 py-2 text-sm"
                          to={`${config.routes.editItem.replace(
                            ":id",
                            item.id
                          )}`}
                        >
                          Sửa
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="text-gray-700 block px-4 py-2 text-sm"
                        onClick={() => {
                          setSelectedItem(item.id);
                          setOpenModal(true);
                        }}
                      >
                        Xóa
                      </Dropdown.Item>
                    </Dropdown>
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

export default ItemList;

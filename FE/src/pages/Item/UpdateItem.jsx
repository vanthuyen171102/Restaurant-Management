import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Card,
  Datepicker,
  FileInput,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useForm, Controller } from "react-hook-form";
import { ErrorAlert } from "../../components/Alert";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "./../../config/index";
import { toast } from "react-toastify";
import { formatIsoToDate } from "../../helper/format";
import { FaCameraRetro } from "react-icons/fa";

function UpdateItem() {
    const {id} = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState();
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [thumbURL, setThumbURL] = useState();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const validationRules = {
    title: {
      required: "Tên món ăn không được để trống",
    },
    catId: {
      required: "Danh mục món ăn không được để trống!",
    },
    price: {
      required: "Giá món ăn không được để trống!",
    },
    capitalPrice: {
      required: "Giá gốc món ăn không được để trống!",
    },
  };

  useEffect(() => {
    const fetchItemData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_HOST}/item/${id}`);
        setItem(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Load dữ liệu món ăn không thành công!"
        );
      } finally {
        setIsLoading(false);
      }
    };
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const catResponse = await axios.get(
          `${config.API_HOST}/categories/all`
        );
        setCategories(catResponse.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Load dữ liệu danh mục không thành công!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchItemData();
    return () => {
      setItem(null);
      setCategories([]);
      setErrorMessage(null);
    };
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (data[key] != null) formData.append(key, data[key]);
    });

    try {
      await axios.post(`${config.API_HOST}/item/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Thêm món ăn thành công!");
      navigate("/items");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Đã xảy ra lỗi khi thêm nhân sự!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateThumbFile = (file) => {
    if (file === null) {
      return true;
    }
    if (file.size > 10 * 1024 * 1024) return "File ảnh <= 10MB!";
    if (!["image/jpeg", "image/png", "image/jpeg"].includes(file.type))
      return "Chỉ cho phép file JPG, PNG, JPEG!";

    return true;
  };

  const handleThumbChange = (event) => {
    const file = event.target.files[0];
    if (!validateThumbFile(file)) return;
    setThumbURL(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      thumbURL && URL.revokeObjectURL(thumbURL);
    };
  }, [thumbURL]);

  if(isLoading || !item) 
    return <>Đang tải</>

  return (
    <>
      <Breadcrumb>
        <Link to="/">
          <Breadcrumb.Item icon={HiHome}>Bảng điều khiển</Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>
          <Link to={config.routes.itemList}>Danh sách món ăn</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Cập nhật món ăn</Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex justify-center">
        <Card className="mt-10 w-full">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex items-center justify-center">
              <Controller
                name="thumbFile"
                control={control}
                defaultValue={null}
                rules={{ validate: validateThumbFile }}
                render={({ field }) => (
                  <input
                    hidden
                    type="file"
                    id="thumb"
                    onChange={(e) => {
                      field.onChange(e.target.files[0]);
                      handleThumbChange(e);
                    }}
                  />
                )}
              />{" "}
              <div className="flex w-[450px] flex-grow-0 items-center justify-center">
                <Label
                  htmlFor="thumb"
                  className="flex h-64 w-full bg-no-repeat bg-center bg-cover cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  style={{
                    backgroundImage: `url(${
                      thumbURL ||
                      (item.thumb &&
                        config.API_IMAGE_HOST + `/${item.thumb}`)
                    })`,
                  }}
                >
                  {!thumbURL && (
                    <div className="flex  flex-col items-center justify-center pb-6 pt-5">
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG or JPEG
                      </p>
                    </div>
                  )}
                </Label>
              </div>
            </div>

            {errors.thumbFile && (
              <ErrorAlert className="mt-2">
                {errors.thumbFile.message}
              </ErrorAlert>
            )}
            <div className="flex gap-4">
              <div className="w-full">
                <Label htmlFor="title" value="Tên món ăn" />
                <TextInput
                  id="title"
                  type="text"
                  defaultValue={item.title}
                  className="mt-2"
                  placeholder="Tên món..."
                  {...register("title", validationRules.title)}
                />
                {errors.title && (
                  <ErrorAlert className="mt-2">
                    {errors.title.message}
                  </ErrorAlert>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/3">
                <Label htmlFor="price" value="Giá bán" />
                <TextInput
                  id="price"
                  type="number"
                  defaultValue={item.price}
                  className="mt-2"
                  placeholder="Giá bán..."
                  {...register("price", validationRules.price)}
                />
                {errors.price && (
                  <ErrorAlert className="mt-2">
                    {errors.price.message}
                  </ErrorAlert>
                )}
              </div>
              <div className="w-1/3">
                <Label htmlFor="capitalPrice" value="Giá gốc" />
                <TextInput
                  id="capitalPrice"
                  type="number"
                  defaultValue={item.capitalPrice}
                  className="mt-2"
                  placeholder="Giá gốc..."
                  {...register("capitalPrice", validationRules.capitalPrice)}
                />
                {errors.capitalPrice && (
                  <ErrorAlert className="mt-2">
                    {errors.capitalPrice.message}
                  </ErrorAlert>
                )}
              </div>
              <div className="w-1/3">
                <Label htmlFor="cat" value="Danh mục" />
                <Select
                  id="cats"
                  className="mt-2"
                  defaultValue={item.cat.id}
                  {...register("catId", validationRules.catId)}
                >
                  {categories.map((cat, index) => (
                    <option key={index} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            {errorMessage && (
              <ErrorAlert className="mt-2">{errorMessage}</ErrorAlert>
            )}
            <Button type="submit" className="mt-5" disabled={isLoading}>
              Thêm món ăn
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default UpdateItem;

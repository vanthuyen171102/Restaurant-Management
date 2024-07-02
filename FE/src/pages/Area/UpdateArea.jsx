import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Card,
  Datepicker,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useForm, Controller } from "react-hook-form";
import { ErrorAlert } from "../../components/Alert";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config/index";
import { toast } from "react-toastify";
import { formatIsoToDate } from "../../helper/format";
import { FaCameraRetro } from "react-icons/fa";

function UpdateArea() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const validationRules = {
    title: {
      required: "Tên danh mục không được để trống!",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios(`${config.API_HOST}/category/${id}`);
        setCategory(response.data);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            "Lấy dữ liệu từ server không thành công!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!isNaN(id)) {
      fetchData();
    } else {
      setErrorMessage("ID danh mục không hợp lệ!");
    }

    return () => {
      setErrorMessage(null);
      setCategory(null);
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.put(`${config.API_HOST}/category/update/${id}`, data);
      toast.success("Cập nhật danh mục thành công!");
      navigate(config.routes.categoryList);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Đã xảy ra lỗi khi cập nhật danh mục!"
      );
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (category === null) {
    return <div>{errorMessage || "Lấy dữ liệu Danh mục không thành công!"}</div>;
  }

  return (
    <>
      <Breadcrumb>
        <Link to="/">
          <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>
          <Link to={config.routes.categoryList}>Categories</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit Category</Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex justify-center">
        <Card className="mt-10 w-full">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-4">
              <div className="w-full">
                <Label htmlFor="title" value="Tên danh mục" />
                <TextInput
                  id="title"
                  type="text"
                  className="mt-2"
                  defaultValue={category.title}
                  placeholder="Tên danh mục..."
                  {...register("title", validationRules.title)}
                />
                {errors.title && (
                  <ErrorAlert className="mt-2">
                    {errors.title.message}
                  </ErrorAlert>
                )}
              </div>
            </div>

            {errorMessage && (
              <ErrorAlert className="mt-2">{errorMessage}</ErrorAlert>
            )}
            <Button type="submit" className="mt-5" disabled={isLoading}>
              Cập nhật danh mục
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default UpdateArea;

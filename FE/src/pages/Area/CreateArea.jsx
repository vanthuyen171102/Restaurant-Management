import { Link, useNavigate } from "react-router-dom";
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

function CreateArea() {
  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post(`${config.API_HOST}/category/create`, data);
      toast.success("Thêm danh mục thành công!");
      navigate(config.routes.categoryList);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Đã xảy ra lỗi khi thêm danh mục!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb>
        <Link to="/">
          <Breadcrumb.Item icon={HiHome}>Bảng đều khiển</Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>
          <Link to={config.routes.areaList}>Danh sách khu vực</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Tạo khu vực</Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex justify-center">
        <Card className="mt-10 w-full">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-4">
              <div className="w-full">
                <Label htmlFor="title" value="Tên khu vực" />
                <TextInput
                  id="title"
                  type="text"
                  className="mt-2"
                  placeholder="Tên khu vực..."
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
              Thêm khu vực
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default CreateArea;

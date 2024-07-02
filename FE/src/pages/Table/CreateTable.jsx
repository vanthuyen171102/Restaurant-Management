import axios from "axios";
import {
  Breadcrumb,
  Card,
  Label,
  TextInput,
  Button,
  Textarea,
  Select,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import config from "./../../config/index";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HiHome } from "react-icons/hi";
import ErrorAlert from "./../../components/Alert/ErrorAlert";

function CreateTable() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [areas, setAreas] = useState([])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const validationRules = {
    name: {
      required: "Tên bàn không đươc để trống!",
    },
    capacity: {
      required: "Sức chứa không được để trống!",
    },
    areaId: {
      required: "Phải chọn khu vực!",
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_HOST}/area/all`);
        setAreas(response.data);
      } catch(error) {
        toast.error(error?.response?.data?.message || "Load dữ liệu khu vực bàn không thành công!");
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
    return () => {
      setAreas([]);
      setErrorMessage(null);
    };
  }, []);


  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post(`${config.API_HOST}/table/create`, data);
      toast.success("Thêm bàn thành công!");
      navigate(config.routes.tableList);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Thêm bàn không thành công!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb>
        <Link to="/">
          <Breadcrumb.Item icon={HiHome}>Trang quản trị</Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>
          <Link to={config.routes.tables}>Danh sách bàn</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Tạo bàn</Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex justify-center">
        <Card className="mt-10 w-full">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="name" value="Tên bàn" />
                <TextInput
                  id="name"
                  type="text"
                  className="mt-2"
                  placeholder="Tên bàn"
                  {...register("name", validationRules.name)}
                />
                {errors.name && (
                  <ErrorAlert className="mt-2">
                    {errors.name.message}
                  </ErrorAlert>
                )}
              </div>
              <div className="w-1/2">
                <Label htmlFor="capacity" value="Số chỗ ngồi" />
                <TextInput
                  id="capacity"
                  type="number"
                  className="mt-2"
                  placeholder="Số chỗ ngồi"
                  {...register("capacity", validationRules.capacity)}
                />
                {errors.capacity && (
                  <ErrorAlert className="mt-2">
                    {errors.capacity.message}
                  </ErrorAlert>
                )}
              </div>

              <div className="w-1/2">
                <Label htmlFor="role" value="Khu" />
                <Select
                  id="areaId"
                  className="mt-2"
                  {...register("areaId", validationRules.role)}
                >
                  {areas.map((area, index) => (
                    <option key={index} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </Select>
                {errors.areaId && (
                  <ErrorAlert className="mt-2">
                    {errors.areaId.message}
                  </ErrorAlert>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="desc" value="Mô tả"/>
              <Textarea
                id="desc"
                placeholder="Mô tả..."
                rows={4}
                {...register("description")}
              />
            </div>

            {errorMessage && (
              <ErrorAlert className="mt-2">{errorMessage}</ErrorAlert>
            )}
            <Button type="submit" className="mt-5" disabled={isLoading}>
              Thêm bàn
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default CreateTable;

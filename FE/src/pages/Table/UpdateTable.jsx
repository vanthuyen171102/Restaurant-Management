import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import config from "../../config";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  Breadcrumb,
  Card,
  Label,
  Textarea,
  TextInput,
  Button,
  Select,
} from "flowbite-react";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { HiHome } from "react-icons/hi";

function UpdateTable() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [areas, setAreas] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      capacity: "",
      description: "",
      areaId: "",
    },
    mode: "onTouched",
  });

  const validationRules = {
    name: {
      required: "Tên bàn không đươc để trống!",
    },
    capacity: {
      required: "Sức chứa không được để trống!",
    },
    areaId: {
      required: "Phải chọn khu vực!",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_HOST}/table/${id}`);
        reset({ ...response.data, areaId: response.data.area.id });
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            `Load dữ liệu bàn #${id} không thành công!`
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAreas = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_HOST}/area/all`);
        setAreas(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Load dữ liệu khu vực bàn không thành công!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!isNaN(id)) {
      fetchData();
      fetchAreas();
    } else {
      setErrorMessage("ID bàn không hợp lệ!");
    }

    return () => {
      setIsLoading(false);
      setErrorMessage(null);
      setAreas([]);
    };
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const parsedData = {
        ...data,
        areaId: parseInt(data.areaId, 10),
      };

      await axios.put(`${config.API_HOST}/table/update/${id}`, parsedData);
      toast.success("Cập nhật bàn thành công!");
      navigate(config.routes.tables);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Cập nhật bàn không thành công!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (errorMessage) {
    toast.error(errorMessage);
  }

  return (
    <>
      <Breadcrumb>
        <Link to="/">
          <Breadcrumb.Item icon={HiHome}>Trang quản trị</Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>
          <Link to={config.routes.tables}>Danh sách bàn</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Cập nhật thông tin bàn</Breadcrumb.Item>
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
                <Label htmlFor="areaId" value="Khu" />
                <Select
                  id="areaId"
                  className="mt-2"
                  {...register("areaId", validationRules.areaId)}
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
              <Label htmlFor="description" value="Mô tả" />
              <Textarea
                id="description"
                placeholder="Mô tả..."
                rows={4}
                {...register("description")}
              />
            </div>

            {errorMessage && (
              <ErrorAlert className="mt-2">{errorMessage}</ErrorAlert>
            )}
            <Button type="submit" className="mt-5" disabled={isLoading}>
              Cập nhật bàn
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default UpdateTable;

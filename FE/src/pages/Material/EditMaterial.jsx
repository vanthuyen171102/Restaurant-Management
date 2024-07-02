import { Breadcrumb, Button, Card, Label, TextInput } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import config from "./../../config/index";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function EditMaterial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: "",
      unit: "",
      price: "",
      stock: ""
    },
    mode: "onTouched"
  });

  const validationRules = {
    name: { required: "Tên nguyên liệu không được để trống!" },
    unit: { required: "Đơn vị tính không được để trống!" },
    price: { required: "Giá không được để trống!" },
    stock: { required: "Tồn kho không được để trống!" }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.put(`${config.API_HOST}/materials/update/${id}`, data);
      toast.success("Cập nhật nguyên liệu thành công!");
      navigate(config.routes.materialList);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Cập nhật nguyên liệu không thành công!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_HOST}/materials/${id}`);
        reset(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Load dữ liệu nguyên liệu không thành công!"
        );
      }
    };
    fetchData();
  }, [id, reset]);

  return (
    <>
      <div className="flex justify-between">
        <Breadcrumb>
          <Link to="/admin">
            <Breadcrumb.Item icon={HiHome}>Dashboard</Breadcrumb.Item>
          </Link>

          <Breadcrumb.Item>
            <Link to={config.routes.materialList}>Danh sách nguyên liệu</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Cập nhật nguyên liệu</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="flex justify-center">
        <Card className="mt-10 w-full">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <Label htmlFor="name" value="Tên nguyên liệu" />
              <TextInput
                id="name"
                placeholder="Tên nguyên liệu..."
                {...register("name", validationRules.name)}
              />
              {errors.name && (
                <ErrorAlert className="mt-2">{errors.name.message}</ErrorAlert>
              )}
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="unit" value="Đơn vị tính" />
                <TextInput
                  id="unit"
                  type="text"
                  className="mt-2"
                  placeholder="Đơn vị tính..."
                  {...register("unit", validationRules.unit)}
                />
                {errors.unit && (
                  <ErrorAlert className="mt-2">{errors.unit.message}</ErrorAlert>
                )}
              </div>
              <div className="w-1/2">
                <Label htmlFor="price" value="Giá" />
                <TextInput
                  id="price"
                  type="number"
                  className="mt-2"
                  placeholder="Giá..."
                  {...register("price", validationRules.price)}
                />
                {errors.price && (
                  <ErrorAlert className="mt-2">{errors.price.message}</ErrorAlert>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="stock" value="Tồn kho" />
              <TextInput
                id="stock"
                placeholder="Tồn kho..."
                {...register("stock", validationRules.stock)}
              />
              {errors.stock && (
                <ErrorAlert className="mt-2">{errors.stock.message}</ErrorAlert>
              )}
            </div>
            {errorMessage && (
              <ErrorAlert className="mt-2">{errorMessage}</ErrorAlert>
            )}

            <Button type="submit" className="mt-5" disabled={isLoading}>
              Cập nhật nhà cung cấp
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default EditMaterial;

import { Breadcrumb, Button, Card, Label, TextInput } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import config from "./../../config/index";
import ErrorAlert from "../../components/Alert/ErrorAlert";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: ""
    },
    mode: "onTouched"
  });

  const validationRules = {
    name: { required: "Tên NCC không được để trống!" },
    phone: { required: "Số diện thoại NCC không được để trống!" },
    email: { required: "Email NCC không được để trống!" },
    address: { required: "Địa chỉ NCC không được để trống!" }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.put(`${config.API_HOST}/suppliers/update/${id}`, data);
      toast.success("Cập nhật NCC thành công!");
      navigate(config.routes.supplierList);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Cập nhật NCC không thành công!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_HOST}/suppliers/${id}`);
        reset(response.data); // Cập nhật form với dữ liệu nhà cung cấp
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Load dữ liệu NCC không thành công!"
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
            <Link to={config.routes.supplierList}>Danh sách nhà cung cấp</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Cập nhật nhà cung cấp</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="flex justify-center">
        <Card className="mt-10 w-full">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <Label htmlFor="name" value="Tên nhà cung cấp" />
              <TextInput
                id="name"
                placeholder="Tên nhà cung cấp..."
                {...register("name", validationRules.name)}
              />
              {errors.name && (
                <ErrorAlert className="mt-2">{errors.name.message}</ErrorAlert>
              )}
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="phone" value="Số điện thoại" />
                <TextInput
                  id="phone"
                  type="number"
                  className="mt-2"
                  placeholder="Số điện thoại..."
                  {...register("phone", validationRules.phone)}
                />
                {errors.phone && (
                  <ErrorAlert className="mt-2">{errors.phone.message}</ErrorAlert>
                )}
              </div>
              <div className="w-1/2">
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="text"
                  className="mt-2"
                  placeholder="Email..."
                  {...register("email", validationRules.email)}
                />
                {errors.email && (
                  <ErrorAlert className="mt-2">{errors.email.message}</ErrorAlert>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="address" value="Địa chỉ NCC" />
              <TextInput
                id="address"
                placeholder="Địa chỉ nhà cung cấp..."
                {...register("address", validationRules.address)}
              />
              {errors.address && (
                <ErrorAlert className="mt-2">{errors.address.message}</ErrorAlert>
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

export default EditSupplier;

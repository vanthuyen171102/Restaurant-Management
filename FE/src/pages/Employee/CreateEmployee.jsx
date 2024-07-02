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
import config from "./../../config/index";
import { toast } from "react-toastify";
import { formatIsoToDate } from "../../helper/format";
import { FaCameraRetro } from "react-icons/fa";

function CreateEmployee() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [thumbURL, setThumbURL] = useState();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const validationRules = {
    fullName: {
      required: "Họ tên không được để trống!",
    },
    email: {
      required: "Email không được để trống!",
    },
    phone: {
      required: "Số điện thoại không được để trống!",
    },
    gender: {
      required: "Vui lòng chọn giới tính!",
    },
    address: {
      required: "Địa chỉ không được để trống!",
    },
    birth: {
      required: "Ngày sinh không được để trống",
    },
    roleId: {
      required: "Quyền không được để trống!",
    },
    password: {
      required: "Mật khẩu không được để trống!",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const rolesResponse = await axios.get(`${config.API_HOST}/enums/role`);
        setRoles(rolesResponse.data);
      } catch(error) {
        toast.error(error?.response?.data?.message || "Load dữ liệu quyền không thành công!");
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
    return () => {
      setRoles([]);
      setErrorMessage(null);
    };
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
  
    Object.keys(data).forEach((key) => {
      if(data[key] != null)
        formData.append(key, data[key]);
    });
    
    try {
      await axios.post(`${config.API_HOST}/employee/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Thêm nhân sự thành công!");
      navigate(config.routes.employeeList);
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

  return (
    <>
      <Breadcrumb>
        <Link to="/">
          <Breadcrumb.Item icon={HiHome}>Bảng điều khiển</Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>
          <Link to={config.routes.employeeList}>Danh sách nhân viên</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Thêm nhân viên</Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex justify-center">
        <Card className="mt-10 w-full">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div class="max-w-205 mx-auto mt-50 relative">
              <div class="absolute right-0 z-10 top-0 translate-x-1/2 -translate-y-1/2">
                <Controller
                  name="avatarFile"
                  control={control}
                  defaultValue={null}
                  rules={{ validate: validateThumbFile }}
                  render={({ field }) => (
                    <input
                      hidden
                      type="file"
                      id="avatar"
                      onChange={(e) => {
                        field.onChange(e.target.files[0])
                        handleThumbChange(e)
                      }}
                    />
                  )}
                />{" "}
                <label
                  htmlFor="avatar"
                  class="flex items-center justify-center mb-0 w-10 h-10 rounded-full bg-white border border-transparent shadow-md cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200 hover:border-gray-400"
                >
                  <FaCameraRetro className="text-gray-500" size={20} />
                </label>
              </div>
              <div class="w-48 h-48 relative rounded-lg border border-gray-200 shadow-md">
                <div
                  class="w-full h-full rounded-lg bg-cover bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url(${
                      thumbURL ||
                      "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1712288377~exp=1712288977~hmac=5b9cb0146ccab664a50b010aafffcf99e8fc3c3f3d20fad57b62db2add5c3e56"
                    })`,
                  }}
                ></div>
              </div>
            </div>

            {errors.avatarFile && (
              <ErrorAlert className="mt-2">{errors.avatarFile.message}</ErrorAlert>
            )}

            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="fullName" value="Họ tên" />
                <TextInput
                  id="fullName"
                  type="text"
                  className="mt-2"
                  placeholder="Họ tên..."
                  {...register("fullName", validationRules.fullName)}
                />
                {errors.fullName && (
                  <ErrorAlert className="mt-2">
                    {errors.fullName.message}
                  </ErrorAlert>
                )}
              </div>
              <div className="w-1/2">
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  className="mt-2"
                  placeholder="Email"
                  {...register("email", validationRules.email)}
                />
                {errors.email && (
                  <ErrorAlert className="mt-2">
                    {errors.email.message}
                  </ErrorAlert>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="birth" value="Ngày sinh" />

                <Controller
                  name="birth"
                  control={control}
                  rules={{ required: "Chọn ngày sinh!" }}
                  render={({ field }) => (
                    <Datepicker
                      id="birth"
                      value={field.value}
                      onSelectedDateChanged={(date) =>
                        field.onChange(formatIsoToDate(date))
                      }
                      className="mt-2"
                    />
                  )}
                />

                {errors.birth && (
                  <ErrorAlert className="mt-2">
                    {errors.birth.message}
                  </ErrorAlert>
                )}
              </div>
              <div className="w-1/2">
                <Label htmlFor="gender" value="Giới tính" />
                <Select
                  id="gender"
                  className="mt-2"
                  {...register("gender", validationRules.gender)}
                >
                  <option>Nam</option>
                  <option>Nữ</option>
                </Select>
              </div>
              <div className="w-1/2">
                <Label htmlFor="phone" value="Số điện thoại" />
                <TextInput
                  id="phone"
                  type="text"
                  className="mt-2"
                  placeholder="Số điện thoại..."
                  {...register("phone", validationRules.phone)}
                />
                {errors.phone && (
                  <ErrorAlert className="mt-2">
                    {errors.phone.message}
                  </ErrorAlert>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-full">
                <Label htmlFor="address" value="Địa chỉ" />
                <TextInput
                  id="address"
                  type="text"
                  className="mt-2"
                  placeholder="Địa chỉ..."
                  {...register("address", validationRules.address)}
                />
                {errors.address && (
                  <ErrorAlert className="mt-2">
                    {errors.address.message}
                  </ErrorAlert>
                )}
              </div>
            </div>

            <div className="flex gap-4">
            <div className="w-1/2">
                <Label htmlFor="password" value="Mật khẩu" />
                <TextInput
                  id="password"
                  type="password"
                  className="mt-2"
                  placeholder="Mật khẩu"
                  {...register("password", validationRules.password)}
                />
                {errors.password && (
                  <ErrorAlert className="mt-2">
                    {errors.password.message}
                  </ErrorAlert>
                )}
              </div>
              <div className="w-1/2">
                <Label htmlFor="role" value="Phân quyền" />
                <Select
                  id="roles"
                  className="mt-2"
                  {...register("roleId", validationRules.role)}
                >
                  {roles.map((role, index) => (
                    <option key={index} value={role.id}>
                      {role.nameVI}
                    </option>
                  ))}
                </Select>
                {errors.roleId && (
                  <ErrorAlert className="mt-2">
                    {errors.roleId.message}
                  </ErrorAlert>
                )}
              </div>
            </div>

            {errorMessage && (
              <ErrorAlert className="mt-2">{errorMessage}</ErrorAlert>
            )}
            <Button type="submit" className="mt-5" disabled={isLoading}>
              Thêm nhân viên
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default CreateEmployee;

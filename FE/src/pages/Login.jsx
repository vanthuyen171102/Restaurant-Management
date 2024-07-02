import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { authenticate } from "../redux/slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "flowbite-react";
import { toast } from "react-toastify";
import { ErrorAlert } from "../components/Alert";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loginError = useSelector((state) => state.auth.loginError);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.loading);
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const from = location.state?.from?.pathname || '/tables';

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    dispatch(authenticate(data));
  };
  if (isAuthenticated) {
    toast.success("Đăng nhập thành công!");
    navigate(from);
  }

  return (
    <div className="min-h-screen flex items-center justify-center size-full">
      <div className="flex-1 max-w-96">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="mb-4 text-center text-white text-4xl font-semibold">
            Đăng nhập
          </h1>
          <div className="mb-5">
            <label className="block text-sm mb-2">
              Tên đăng nhập <span className="text-red-800">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-[rgb(42,55,79)] px-4 py-2 border rounded-lg border-[rgb(60,78,113)]"
              placeholder="Tên đăng nhập..."
              autoComplete="off"
              {...register("username", {
                required: "Tên đăng nhập không được để trống",
              })}
            />
            {errors.username && (
              <span className="text-red-500">{errors.username.message}</span>
            )}
          </div>
          <div className="mb-5">
            <label className="block text-sm mb-2">
              Mật khẩu <span className="text-red-800">*</span>
            </label>
            <input
              type="password"
              className="w-full bg-[rgb(42,55,79)] px-4 py-2 border rounded-lg border-[rgb(60,78,113)]"
              placeholder="Mật khẩu..."
              autoComplete="off"
              {...register("password", {
                required: "Mật khẩu không được để trống",
              })}
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>
          {loginError ? (
            <div className="mb-4 text-center">
              <ErrorAlert className="mt-2">
                {errorMessage || "Đăng nhập không thành công!"}
              </ErrorAlert>
            </div>
          ) : null}
          <Button
            color={"blue"}
            className="w-full font-bold"
            size={"lg"}
            type="submit"
            disabled={isLoading}
          >
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;

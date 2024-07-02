import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import config from "../../config";
import UnauthorizePage from "../403";
import { authenticate } from "./../../redux/slices/authSlice";
import { toast } from "react-toastify";

function PrivateRoute({ hasAnyRoles, children }) {
  const isLoading = useSelector((state) => state.auth.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const account = useSelector((state) => state.auth.account);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading && !isAuthenticated) {
      toast.error("Bạn cần đăng nhập để sử dụng chức năng này!")
      navigate(config.routes.login, { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  if (!children) {
    throw new Error(``);
  }

  if (isAuthenticated) {
    const isAuthorized = hasAnyRole(account?.role?.name, hasAnyRoles);
    if (isAuthorized) {
      return <>{children}</>;
    }
    return <UnauthorizePage />;
  }

  return null;
}

export const hasAnyRole = (authorities, hasAnyRoles) => {
  if (hasAnyRoles == null || hasAnyRole.length == 0) {
    return true;
  }

  if (authorities && authorities.length !== 0) {
    
    return hasAnyRoles.some((auth) => authorities.includes(auth));
  }
  return false;
};

export default PrivateRoute;

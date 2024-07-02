
import { useDispatch } from 'react-redux';
import { logout } from './../redux/slices/authSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { toast } from 'react-toastify';

export const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
    toast.success("Đăng xuất thành công!")
    navigate(config.routes.login)
  }) 
  
  return (
    <></>
  );
};

export default Logout;

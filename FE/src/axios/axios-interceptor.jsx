import axios from "axios";
import Storage from "../utils/LocalStorageUtil";
import config from "../config";
import LocalStorageUtil from '../utils/LocalStorageUtil';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = config.API_HOST;

const setupAxiosInterceptors = (onUnauthenticated) => {
  const onRequestSuccess = (config) => {
    const token = Storage.get("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    convertDateTimeFormat(config.data);
    return config;
  };
  const onResponseSuccess = (response) => {
    return response;
  };

  const onResponseError = (err) => {
    const status = err.status || (err.response ? err.response.status : 0);
    if (status === 403 || status === 401) {
      onUnauthenticated();
    }

    if (err?.response?.data?.message) {
      err.message = err.response.data.message;
    }

    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

const convertDateTimeFormat = (data) => {
  if (Array.isArray(data)) {
    data.forEach(convertDateTimeFormat);
  } else if (typeof data === "object" && data !== null) {
    // Duyệt qua từng thuộc tính của đối tượng
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "string" && /^\d{2}-\d{2}-\d{4}$/.test(data[key])) {
        // Nếu giá trị là một chuỗi có định dạng ngày tháng dd-mm-yyyy
        const parts = data[key].split('-');
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Giảm 1 vì tháng bắt đầu từ 0 trong Date
        const year = parseInt(parts[2]);
        const formattedDate = new Date(year, month, day);
        // Gán giá trị mới cho thuộc tính
        data[key] = formattedDate;
      } else {
        // Nếu giá trị không phải là chuỗi ngày tháng, duyệt tiếp
        convertDateTimeFormat(data[key]);
      }
    });
  }
};

export default setupAxiosInterceptors;

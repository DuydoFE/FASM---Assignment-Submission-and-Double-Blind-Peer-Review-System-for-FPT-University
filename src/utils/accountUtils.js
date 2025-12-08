import { useSelector } from "react-redux";
import { store } from "../redux/store";

// Custom hook - chỉ sử dụng trong React component
export const useCurrentAccount = () => {
  return useSelector((state) => state.user);
};

// Function thường - lấy trực tiếp từ store (không phải hook)
export const getCurrentAccount = () => {
  return store.getState().user;
};


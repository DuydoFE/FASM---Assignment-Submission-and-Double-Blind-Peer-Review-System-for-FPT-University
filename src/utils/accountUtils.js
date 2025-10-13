import { useSelector } from "react-redux";

export const getCurrentAccount = () => {
  return useSelector((state) => state.user);
};



import axios from "axios";
import config from "../config/config";

export const getCategory = async () => {
  const path = `${config.apiAddress}/group/secure/queryCategory`;
  const configHeader = {
    headers: {
      Authorization: localStorage.getItem("access_token") ?? "",
    },
  };
  const response = await axios.post(path, {}, configHeader);
  return response.data;
};

/* eslint-disable consistent-return */
import axios from "axios";
import config from "../config/config";

export const getGroupsById = async () => {
  const path = `${config.apiAddress}/chat/secure/queryGroups`;
  const configHeader = {
    headers: {
      Authorization: localStorage.getItem("access_token") ?? "",
    },
  };
  const result = await axios.post(path, {}, configHeader);
  return result.data;
};

// {
//   pageNum: 1,
//   pageSize: 10,
//   courseCode: String,
//   categoryId: Number
// };
export const getGroups = async (data) => {
  const path = `${config.apiAddress}/group/secure/queryGroupsByCondition`;

  data.pageSize = 10;

  const configHeader = {
    headers: {
      Authorization: localStorage.getItem("access_token") ?? "",
    },
  };
  const result = await axios.post(path, data, configHeader);

  return result.data;
};

export const enrolGroup = async (data) => {
  const path = `${config.apiAddress}/group/secure/enrollGroup`;

  const configHeader = {
    headers: {
      Authorization: localStorage.getItem("access_token") ?? "",
    },
  };
  const result = await axios.post(path, data, configHeader);

  return result.data;
};

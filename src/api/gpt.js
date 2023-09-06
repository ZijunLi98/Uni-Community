import axios from "axios";
import config from "../config/config";

export const getConnectionId = async (data) => {
  const path = `${config.gptAddress}/gpt/secure/chatGptInit`;

  const configHeader = {
    headers: {
      Authorization: localStorage.getItem("access_token") ?? "",
    },
  };
  const response = await axios.post(path, data);
  return response.data;
};

export const sendMessage = async (data) => {
  const path = `${config.gptAddress}/gpt/secure/chatMsgSend`;

  const configHeader = {
    headers: {
      Authorization: localStorage.getItem("access_token") ?? "",
    },
  };
  const response = await axios.post(path, data);
  return response.data;
};

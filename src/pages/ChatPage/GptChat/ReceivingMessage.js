import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./GptMessage.module.scss";
import config from "../../../config/config";
import { sendMessage } from "../../../api/gpt";

const ReceivingMessage = ({
  chatName,
  avatar,
  connectionId,
  setMessages,
  sentMsg,
  setSentMsg,
}) => {
  const [receivedMsg, setReceivedMsg] = useState("");
  const receivedMsgRef = useRef();

  const sendAndGetReplyHandler = useCallback(
    async (message) => {
      console.log("✨✨✨✨✨✨✨✨✨✨");
      console.log("message: " + message);
      console.log("connectionId: " + connectionId);
      console.log("✨✨✨✨✨✨✨✨✨✨");
      const data = { uuid: connectionId, message };
      await sendMessage(data);
      setMessages((prevState) => {
        return [
          ...prevState,
          {
            message: message,
            sendTime: Date.now(),
            messageId: Math.random(),
            isQuestion: false,
          },
        ];
      });
      const eventSource = new EventSource(
        `${config.gptAddress}/gpt/secure/chatGptStream/${connectionId}`
      );
      eventSource.onmessage = function (event) {
        console.log("Received event:", event.data);
        const response = JSON.parse(event.data);
        if (response.choices !== undefined) {
          const { delta } = response.choices[0];
          if (delta.content !== undefined) {
            console.log("✨✨✨✨✨✨✨✨✨✨");
            console.log(delta.content);
            setReceivedMsg((prevState) => prevState + delta.content);
          }
        }
      };

      eventSource.onerror = function (event) {
        console.log("error close: 🥓🥓🥓🥓🥓🥓🥓🥓🥓🥓🥓", event);
        eventSource.close();
        setMessages((prevState) => [
          ...prevState,
          {
            message: receivedMsgRef.current?.innerText,
            sendTime: Date.now(),
            messageId: Math.random(),
            isQuestion: true,
          },
        ]);
        setSentMsg("");
        setReceivedMsg("");
      };
    },
    [connectionId, setMessages, setSentMsg]
  );

  useEffect(() => {
    if (sentMsg !== "") {
      sendAndGetReplyHandler(sentMsg);
    }
  }, [sendAndGetReplyHandler, sentMsg]);

  return (
    <div className={styles.chatContainer}>
      <img className={styles.messageImg} src={avatar} alt="" />
      <div className={styles.messageContainer}>
        <h4>{chatName}</h4>
        <div className={styles.messageBox}>
          <div className={styles.messageInnerBox} ref={receivedMsgRef}>
            {receivedMsg === "" ? "Replying" : receivedMsg}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReceivingMessage;

import React, { useCallback, useState } from "react";
import styles from "./GptInput.module.scss";
export default function GptInput({ name, onSend }) {
  const [input, setInput] = useState("");

  // const sendMsgHandler = useCallback(async () => {
  //   console.log("✨✨✨✨✨✨✨✨✨✨");
  //   console.log("message: " + message);
  //   console.log("connectionId: " + connectionId);
  //   console.log("✨✨✨✨✨✨✨✨✨✨");
  //   const data = { uuid: connectionId, message };
  //   await sendMessage(data);
  //   setMessages((prevState) => {
  //     return [
  //       ...prevState,
  //       {
  //         message: message,
  //         sendTime: Date.now(),
  //         messageId: Math.random(),
  //         isQuestion: false,
  //       },
  //     ];
  //   });
  // }, []);

  return (
    <div
      className={styles.chatInput}
      onKeyDown={(e) => {
        if (input && e.key === "Enter") {
          onSend(input);
          setInput("");
        }
      }}
    >
      <input
        type="text"
        value={input}
        autoFocus
        placeholder={`消息@${name}`}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
    </div>
  );
}

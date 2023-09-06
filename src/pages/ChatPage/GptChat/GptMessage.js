import React from "react";
import styles from "./GptMessage.module.scss";

const GptMessage = ({ chatName, message, avatar, dateTime }) => {
  return (
    <div className={styles.chatContainer}>
      <img className={styles.messageImg} src={avatar} alt="" />
      <div className={styles.messageContainer}>
        <h4>
          {chatName} <span>{dateTime}</span>
        </h4>
        <div className={styles.messageBox}>
          <div className={styles.messageInnerBox}>{message}</div>
        </div>
      </div>
    </div>
  );
};
export default GptMessage;

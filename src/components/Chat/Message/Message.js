import React, { useContext } from "react";
import styles from "./Message.module.scss";
import { EmojisContext } from "../../../context/EmojiContext";

export default function Message({
  chatName,
  message,
  avatar,
  reverse,
  dateTime,
}) {
  const { convertEmojis } = useContext(EmojisContext);
  const messageArr = convertEmojis(message);
  console.log("EmojisProvider");
  return (
    <div
      className={[styles.chatContainer, reverse && styles.alignRight].join(" ")}
    >
      {!reverse && <img className={styles.messageImg} src={avatar} alt="" />}
      <div
        className={[styles.messageContainer, reverse && styles.reverse].join(
          " "
        )}
      >
        <h4>
          {reverse && (
            <>
              <span>{dateTime}</span> {chatName}
            </>
          )}
          {!reverse && (
            <>
              {chatName} <span>{dateTime}</span>
            </>
          )}
        </h4>
        <div className={styles.messageBox}>
          <div className={styles.messageInnerBox}>{messageArr}</div>
        </div>
      </div>
      {reverse && <img className={styles.messageImg} src={avatar} alt="" />}
    </div>
  );
}

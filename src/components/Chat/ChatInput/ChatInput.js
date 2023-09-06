import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatInput.module.scss";
export default function ChatInput({
  chatFriend,
  sendMessage,
  selectedEmoji,
  onReset,
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (selectedEmoji !== "") {
      const startPos = inputRef.current.selectionStart;
      const endPos = inputRef.current.selectionEnd;
      inputRef.current.value =
        inputRef.current.value.substring(0, startPos) +
        selectedEmoji +
        inputRef.current.value.substring(endPos, inputRef.current.value.length);
      setInput(inputRef.current.value);
      onReset("");
    }
  }, [selectedEmoji, onReset]);

  return (
    <div
      className={styles.chatInput}
      onKeyDown={(e) => {
        if (input && e.key === "Enter") {
          sendMessage(input);
          setInput("");
        }
      }}
    >
      <input
        type="text"
        value={input}
        ref={inputRef || null}
        autoFocus
        placeholder={`消息@${chatFriend.name}`}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
    </div>
  );
}

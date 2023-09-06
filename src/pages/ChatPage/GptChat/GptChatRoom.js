import { useRef, useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import styles from "./GptChatRoom.module.scss";
import GptMessage from "./GptMessage";
import GptInput from "./GptInput";
import ReceivingMessage from "./ReceivingMessage";

// 发信日期
const convertDate = (sendTime) => {
  const date = new Date(sendTime);
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });
  return [year, month, day].join("-");
};

function GptChatRoom({ chatFriend, connectionId }) {
  const [firstRender, setFirstRender] = useState(true);
  const [messages, setMessages] = useState([]);
  const [sentMsg, setSentMsg] = useState("");
  const scrollRef = useRef([]);
  const userContext = useContext(UserContext);

  // 自动scroll
  useEffect(() => {
    if (firstRender) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      setFirstRender(false);
    } else {
      if (scrollRef.current.lastChild) {
        scrollRef.current.lastChild.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [messages, firstRender]);

  const sentMsgHandler = (message) => {
    setSentMsg(message);
  };

  return (
    <div className={styles.chatRoomContainer}>
      <div className={styles.chatHeader}>
        <img src={chatFriend.avatar} alt="" />
        <h2>{chatFriend.name}</h2>
        <div className={styles.buttonContainer}>
          <button>上下文关联</button>
          <button>重置关联</button>
        </div>
      </div>
      <div className={styles.chatArea} ref={scrollRef}>
        {messages
          .sort((a, b) => (a.sendTime > b.sendTime ? 1 : -1))
          .map((message) => {
            return (
              <GptMessage
                message={message.message}
                chatName={
                  !message.isQuestion
                    ? userContext.userState.userName
                    : chatFriend.name
                }
                avatar={
                  !message.isQuestion
                    ? userContext.userState.avatar
                    : chatFriend.avatar
                }
                dateTime={convertDate(message.sendTime)}
                key={message.messageId}
              />
            );
          })}
        {sentMsg !== "" && (
          <ReceivingMessage
            chatName={chatFriend.name}
            avatar={chatFriend.avatar}
            connectionId={connectionId}
            setMessages={setMessages}
            sentMsg={sentMsg}
            setSentMsg={setSentMsg}
          />
        )}
      </div>
      <div className={styles.chatInputContainer}>
        <GptInput
          name={chatFriend.name}
          onSend={sentMsgHandler}
          sentMsg={sentMsg}
          setSentMsg={setSentMsg}
        />
      </div>
    </div>
  );
}

export default GptChatRoom;

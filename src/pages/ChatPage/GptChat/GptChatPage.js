import React, { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import avatar from "../../../assets/avatar.png";
import styles from "./GptChatPage.module.scss";
import TopNav from "../TopNav/TopNav";
import ChatList from "../../../components/ChatList/ChatList";
import LoadChatRoomSpinner from "../../../components/Spinner/LoadChatRoomSpinner/LoadChatRoomSpinner";
import GptChatRoom from "./GptChatRoom";
import { getConnectionId } from "../../../api/gpt";

// 有token auth后移除
import { UserContext } from "../../../context/UserContext";

function GptChatPage() {
  const [loading, setLoading] = useState(false);
  const [isMemory, setIsMemory] = useState(false);
  const [connectionId, setConnectionId] = useState("");
  const { socket, friendState } = useOutletContext();

  // 有token auth后移除
  const { userState } = useContext(UserContext);
  const { userId } = userState;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getConnectionId({
        userId,
        isMemory,
      });
      console.log(response);
      setConnectionId(response.uuid);
      setLoading(false);
    })();
  }, [isMemory, userId]);

  const chatFriend = { name: "GPT", avatar };
  return (
    <div className={styles.flexRowContainer}>
      <ChatList friendState={friendState} socket={socket} />
      <div className={styles.flexColumnContainer}>
        <TopNav chatFriend={chatFriend} />
        <div className={styles.chatContainer}>
          {loading && <LoadChatRoomSpinner />}
          {!loading && (
            <GptChatRoom chatFriend={chatFriend} connectionId={connectionId} />
          )}
        </div>
      </div>
    </div>
  );
}

export default GptChatPage;

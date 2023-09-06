import React, { useState } from "react";
import styles from "./GroupChatList.module.scss";
import Friend from "../../../components/Chat/Friend/Friend";
export default function GroupChatList({ currentGroupMembers, socket }) {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className={styles.groupChatListContainer}>
      <div className={styles.searchBar}>
        <input
          type="text"
          value={searchInput}
          placeholder="寻找或开始新的对话"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>
      <div className={styles.memberList}>
        {currentGroupMembers
          .filter((member) => {
            return member.name.includes(searchInput);
          })
          .sort((a, b) => (a.onlineStatus === "online" ? -1 : 1))
          .map((member) => {
            return (
              <Friend
                name={member.name}
                onlineStatus={"online"}
                notification={0}
                friendId={member.id}
                avatar={member.avatar}
                key={member.id}
              />
            );
          })}
      </div>
    </div>
  );
}

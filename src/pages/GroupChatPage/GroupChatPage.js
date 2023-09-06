import React from 'react';
import styles from './GroupChatPage.module.scss';
import LoadChatRoomSpinner from '../../components/Spinner/LoadChatRoomSpinner/LoadChatRoomSpinner';
import TopNav from './TopNav/TopNav';
import { useParams, useOutletContext } from 'react-router-dom';
import GroupChatList from './GroupChatList/GroupChatList';

export default function GroupChatPage() {
  const { socket, groupState } = useOutletContext();
  const groupId = parseInt(useParams().groupId);
  const currentGroup = groupState.groups.filter((group) => {
    return group.groupId === groupId;
  })[0];

  return (
    <div className={styles.flexRowContainer}>
      <GroupChatList
        currentGroupMembers={currentGroup.members}
        socket={socket}
      />
      {/* <div className={styles.flexColumnContainer}>
        <TopNav chatFriend={chatFriend} setShowVideo={setShowVideo} />
        <div className={styles.chatContainer}>
          {!loaded && <LoadChatRoomSpinner />}
          {loaded && (
            <ChatRoom
              chatFriend={chatFriend}
              socket={socket}
              messages={chatState.messages}
              sendMessage={sendMessage}
              chatId={chatId}
            />
          )}
          <RightSideMenu
            onlineStatus='online'
            disable={false}
            chatFriend={chatFriend}
          />
        </div>
      </div> */}
    </div>
  );
}

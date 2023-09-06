import React, { useEffect, useState, useContext } from 'react';
import styles from './FriendPage.module.scss';
import { useOutletContext } from 'react-router-dom';
import FriendsStatus from '../FriendPage/FriendsStatus/FriendsStatus';
import TopNav from './TopNav/TopNav';
import RightSideMenu from '../../components/RightSideMenu/RightSideMenu';
import { UserContext } from '../../context/UserContext';
import ChatList from '../../components/ChatList/ChatList';

export default function FriendPage() {
  const [currentType, setCurrentType] = useState('在线');
  const { friendState, socket, friendDispatch, chatDispatch } =
    useOutletContext();
  const userContext = useContext(UserContext);

  useEffect(() => {
    chatDispatch({ type: 'clearMessages' });
    if (socket.readyState === 1) {
      socket.send(
        JSON.stringify({
          type: 6,
          sendId: userContext.userState.userId,
          activeChatBoxData: {
            onOtherPage: true,
            other: 'other',
          },
        })
      );
      console.log({
        type: 6,
        sendId: userContext.userState.userId,
        activeChatBoxData: {
          onOtherPage: true,
          other: 'other',
        },
      });
    }
  }, [chatDispatch, socket, userContext.userState.userId]);

  return (
    <>
      <div className={styles.flexRowContainer}>
        <ChatList friendState={friendState} socket={socket} />
        <div className={styles.flexColumnContainer}>
          <TopNav
            currentType={currentType}
            setCurrentType={setCurrentType}
            friendState={friendState}
          />
          <div className={styles.friendContainer}>
            <FriendsStatus
              socket={socket}
              currentType={currentType}
              friendState={friendState}
              friendDispatch={friendDispatch}
            />
            <RightSideMenu disable />
          </div>
        </div>
      </div>
    </>
  );
}

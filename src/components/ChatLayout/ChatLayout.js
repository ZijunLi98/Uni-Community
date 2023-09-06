import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from 'react';
import styles from './ChatLayout.module.scss';
import { Outlet } from 'react-router-dom';
import { initWebsocket } from '../../api/websocket';
import { toast } from 'react-toastify';
import LoadPageSpinner from '../Spinner/LoadPageSpinner/LoadPageSpinner';
import useFriendReducer from '../../hooks/useFriendReducer';
import useChatReducer from '../../hooks/useChatReducer';
import useGroupChatReducer from '../../hooks/useGroupChatReducer';
import { useTabNotificationHook } from '../../hooks/useTabNotificationHook';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import MessageSound from '../../assets/Message-notification.mp3';
import { UserContext } from '../../context/UserContext';
import { VideoContext } from '../../context/VideoContext';
import IncomingCallNotificationPortal from '../IncomingCallNotification/IncomingCallNotification';
import VideoChatPage from '../../pages/VideoChatPage/VideoChatPage';
import SideNavigation from '../../components/SideNavigation/SideNavigation';

export default function ChatLayout() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState();
  const userContext = useContext(UserContext);
  const videoContext = useContext(VideoContext);
  const [chatState, chatDispatch] = useChatReducer();
  const [friendState, friendDispatch] = useFriendReducer();
  const { initialise: friendInitialise, loaded: friendLoaded } = friendState;
  const [showNotification, clearNotification] = useTabNotificationHook();
  const [showIncomingCallNotification, setShowIncomingCallNotification] =
    useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [play, { stop }] = useSound(MessageSound);
  const disconnect = useRef(null);
  const heartBeatMessageId = useRef();
  const [groupState, groupDispatch] = useGroupChatReducer();
  const { initialise: groupInitialise } = groupState;

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      clearNotification();
      navigate('/login');
    }
  }, [clearNotification, navigate]);

  window.onbeforeunload = function () {
    localStorage.removeItem('access_token');
    socket.close();
  };

  if (friendInitialise && !friendLoaded) {
    //init
    const array = [];
    friendState.friends.forEach((friend) => {
      array.push(friend.id);
    });
    const message = array.join(':');
    const data = {
      type: '1',
      sendId: userContext.userState.userId,
      sendName: userContext.userState.userName,
      message,
    };
    const ws = initWebsocket(data);
    console.log('jianlilianjie');
    if (friendState.friends.length === 0) {
      ws.onmessage = function (event) {
        var message = event.data;
        console.log(message);
        setSocket(ws);
        friendDispatch({ type: 'loaded' });
      };
    } else {
      ws.onmessage = function (event) {
        var message = JSON.parse(event.data);
        if (message.wsType === 'FriendStatus') {
          friendDispatch({ type: 'onlineStatus', message });
          friendDispatch({ type: 'loaded' });
          setSocket(ws);
        }
      };
    }
  }
  useEffect(() => {
    if (socket) {
      socket.onmessage = function (event) {
        var message = JSON.parse(event.data);
        console.log(message);
        if (message.wsType === 'FriendStatus') {
          friendDispatch({ type: 'onlineStatus', message });
        } else if (message.message === 'addFriend') {
          friendDispatch({ type: 'addFriend', message });
        } else if (message.wsType === 'FriendReqAccept') {
          toast.success('A friend has accepted your request!', {
            theme: 'colored',
          });
          friendDispatch({ type: 'addFriendConfirm', message });
        } else if (message.wsType === 'chatMessage') {
          if (chatState.chatUserId !== message.data.sendId) {
            const playSound = new Promise((resolve) => {
              resolve(play());
            });
            playSound.then(() => {
              setTimeout(() => {
                stop();
              }, 1000);
            });
            friendDispatch({ type: 'messageNotification', message });
            showNotification();
          } else {
            chatDispatch({
              type: 'addMessage',
              message: message.data,
              chatId: chatState.chatUserId,
            });
          }
        } else if (message.wsType === 'callUser') {
          videoContext.videoDispatch({ type: 'callUser', message });
          setShowIncomingCallNotification(true);
        } else if (message.wsType === 'callAccepted') {
          videoContext.videoDispatch({ type: 'callAccepted', message });
          videoContext.videoState.peer.signal(message.data.message);
        } else if (message.wsType === 'hangUp') {
          videoContext.videoDispatch({ type: 'endCall' });
        } else if (message.wsType === 'keepAlive') {
          if (
            heartBeatMessageId.current.toString() === message.data.messageId
          ) {
            disconnect.current = 1;
          }
        }
      };
    }
  }, [
    chatDispatch,
    chatState,
    friendDispatch,
    play,
    showNotification,
    socket,
    stop,
    videoContext,
  ]);

  const waitOneSecond = useCallback(
    (count) => {
      return new Promise((resolve) => {
        count++;
        const id = Date.now();
        heartBeatMessageId.current = id;
        socket.send(
          JSON.stringify({
            type: 9,
            sendId: userContext.userState.userId,
            message: 'ping',
            messageId: Date.now(),
          })
        );
        setTimeout(() => {
          if (disconnect.current !== 1) {
            resolve(count);
          } else {
            resolve(0);
          }
        }, [2000]);
      });
    },
    [socket, userContext.userState.userId]
  );

  useEffect(() => {
    let heartBeatInterval = null;
    let count = 0;
    if (socket) {
      heartBeatInterval = setInterval(async () => {
        while (count < 3) {
          count = await waitOneSecond(count);
          if (count === 0) {
            console.log('该轮成功');
            break;
          }
        }
        if (disconnect.current !== 1) {
          console.log('心跳失效重新创建连接');
          if (friendInitialise && friendLoaded) {
            const array = [];
            if (friendState.friends) {
              friendState.friends.forEach((friend) => {
                array.push(friend.id);
              });
            }
            const message = array.join(':');
            const data = {
              type: '1',
              sendId: userContext.userState.userId,
              sendName: userContext.userState.userName,
              message,
            };
            socket.close();
            const ws = initWebsocket(data);
            setSocket(ws);
          }
        }
        disconnect.current = null;
      }, [10000]);
    }
    return () => {
      clearInterval(heartBeatInterval);
    };
  }, [
    friendInitialise,
    friendLoaded,
    friendState.friends,
    socket,
    userContext.userState.userId,
    userContext.userState.userName,
    waitOneSecond,
  ]);

  useEffect(() => {
    let notify = false;
    friendState.friends.forEach((friend) => {
      if (friend.notification > 0) {
        notify = true;
      }
    });
    if (!notify) {
      clearNotification();
    }
  }, [clearNotification, friendState.friends]);

  if (!friendInitialise || !friendLoaded || !groupInitialise) {
    return <LoadPageSpinner />;
  }

  return (
    <div className={styles.friendPageContainer}>
      {showIncomingCallNotification && (
        <IncomingCallNotificationPortal
          setShowIncomingCallNotification={setShowIncomingCallNotification}
          setShowVideo={setShowVideo}
          friendState={friendState}
          socket={socket}
        />
      )}
      {showVideo && (
        <VideoChatPage
          socket={socket}
          setShowVideo={setShowVideo}
          friendState={friendState}
        />
      )}
      <SideNavigation groupState={groupState} />

      <div className={styles.rightSection}>
        <Outlet
          context={{
            friendState,
            socket,
            friendDispatch,
            chatDispatch,
            chatState,
            showVideo,
            setShowVideo,
            groupDispatch,
            groupState,
          }}
        />
      </div>
    </div>
  );
}

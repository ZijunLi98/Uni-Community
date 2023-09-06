import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'simple-peer';
import styles from './VideoChatPage.module.scss';
import { UserContext } from '../../context/UserContext';
import { VideoContext } from '../../context/VideoContext';
import { CgClose } from 'react-icons/cg';
import { BsFillMicFill } from 'react-icons/bs';
import { BsFillMicMuteFill } from 'react-icons/bs';
import { BsCameraVideoFill } from 'react-icons/bs';
import { BsCameraVideoOffFill } from 'react-icons/bs';
import { RxSpeakerLoud } from 'react-icons/rx';
import { RxSpeakerOff } from 'react-icons/rx';
import WaitingCallUI from '../../components/WaitingCallUI/WaitingCallUI';
import Ring from '../../assets/ringtone-126505.mp3';
import useSound from 'use-sound';

export default function VideoChatPage({ socket, setShowVideo, friendState }) {
  const userContext = useContext(UserContext);
  const videoContext = useContext(VideoContext);
  const chatId = useRef(useParams().chatId);
  const [play, { stop }] = useSound(Ring);

  console.log('videoChatPage');
  const [stream, setStream] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const { videoDispatch, videoState } = videoContext;
  const { receivingCall, callerId, callAccepted, callEnded, data } = videoState;

  const chatFriend = friendState.friends.filter((friend) => {
    return friend.id === parseInt(chatId.current);
  })[0];

  const leaveCall = useCallback(
    (activelyLeaveCall) => {
      videoDispatch({ type: 'clear' });
      connectionRef.current.destroy();
      stream.getTracks().forEach((track) => {
        if (track.readyState === 'live') {
          track.stop();
        }
      });
      if (activelyLeaveCall) {
        const data = {
          type: '11',
          sendId: userContext.userState.userId,
          receiverId: callerId || chatId.current,
          sendTime: Date.now(),
        };
        socket.send(JSON.stringify(data));
      }
      stop();
      setShowVideo(false);
    },
    [
      callerId,
      setShowVideo,
      socket,
      stop,
      stream,
      userContext.userState.userId,
      videoDispatch,
    ]
  );

  const callUser = useCallback(
    (id) => {
      play();
      const peer = new Peer({
        initiator: true,
        config: {
          iceServers: [
            {
              url: 'turn:relay1.expressturn.com:3478',
              credential: 'OhaY7BP1DtFdzX6Y',
              username: 'ef02EQFNM7MSG73H53',
            },
          ],
        },
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (data) => {
        socket.send(
          JSON.stringify({
            type: 7,
            sendId: userContext.userState.userId,
            receiverId: id,
            message: data,
            sendTime: Date.now(),
            sendName: userContext.userState.userName,
          })
        );
      });

      peer.on('stream', (stream) => {
        stop();
        userVideo.current.srcObject = stream;
      });

      videoDispatch({ type: 'setPeerOnCall', peer: peer });

      connectionRef.current = peer;
    },
    [
      play,
      socket,
      stop,
      stream,
      userContext.userState.userId,
      userContext.userState.userName,
      videoDispatch,
    ]
  );

  const answerCall = useCallback(
    (id) => {
      videoDispatch({ type: 'justAcceptCall' });
      const peer = new Peer({
        initiator: false,
        config: {
          iceServers: [
            {
              url: 'turn:relay1.expressturn.com:3478',
              credential: 'OhaY7BP1DtFdzX6Y',
              username: 'ef02EQFNM7MSG73H53',
            },
          ],
        },
        trickle: false,
        stream: stream,
      });
      peer.on('signal', (data) => {
        //把signal再发回给caller
        socket.send(
          JSON.stringify({
            type: 8,
            sendId: userContext.userState.userId,
            receiverId: id,
            message: data,
            sendTime: Date.now(),
            sendName: userContext.userState.userName,
          })
        );
      });
      peer.on('stream', (stream) => {
        userVideo.current.srcObject = stream;
      });
      peer.signal(data);
      connectionRef.current = peer;
    },
    [
      data,
      socket,
      stream,
      userContext.userState.userId,
      userContext.userState.userName,
      videoDispatch,
    ]
  );

  function muteMic() {
    stream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsMuteSelfMic(!isMuteSelfMic);
  }

  function muteCam() {
    stream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsMuteSelfCam(!isMuteSelfCam);
  }

  useEffect(() => {
    const constraints = {
      audio: true,
      video: true,
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      setStream(stream);
    });
  }, []);

  useEffect(() => {
    if (callEnded) {
      leaveCall(false);
    }
  }, [leaveCall, callEnded]);

  useEffect(() => {
    if (stream && !callAccepted) {
      myVideo.current.srcObject = stream;
      if (receivingCall) {
        answerCall(callerId);
      } else {
        if (chatId.current) {
          callUser(chatId.current);
        }
      }
    }
  }, [stream, answerCall, callUser, receivingCall, callerId, callAccepted]);

  const [isMuteSelfCam, setIsMuteSelfCam] = useState(false);
  const [isMuteSelfMic, setIsMuteSelfMic] = useState(false);
  const [isMuteSpeaker, setIsMuteSpeaker] = useState(false);

  return (
    <div className={styles.videoChatContainer}>
      <div className={styles.videoContainer}>
        <div className={styles.containers}>
          {stream && (
            <video
              ref={myVideo}
              autoPlay
              muted
              className={styles.videoPlayer}
            />
          )}
          {stream &&
            (callAccepted ? (
              <video ref={userVideo} autoPlay className={styles.videoPlayer} />
            ) : (
              chatFriend && (
                <div className={styles.waiting}>
                  <WaitingCallUI avatar={chatFriend.avatar} />
                </div>
              )
            ))}
        </div>
        <div className={styles.btnContainer}>
          <button
            onClick={() => {
              leaveCall(true);
            }}
            className={styles.closeBtn}
          >
            <CgClose />
          </button>
          <button onClick={muteCam} className={styles.camBtn}>
            {!isMuteSelfCam ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
          </button>
          <button onClick={muteMic} className={styles.micBtn}>
            {!isMuteSelfMic ? <BsFillMicFill /> : <BsFillMicMuteFill />}
          </button>
          <button
            onClick={() => {
              userVideo.current.muted = !userVideo.current.muted;
              setIsMuteSpeaker(!isMuteSpeaker);
            }}
            className={styles.speakerBtn}
          >
            {!isMuteSpeaker ? <RxSpeakerLoud /> : <RxSpeakerOff />}
          </button>
        </div>
      </div>
    </div>
  );
}

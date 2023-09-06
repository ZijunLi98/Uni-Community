import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./ChannelItemCard.module.scss";
import MemberNum from "./MemberNum";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { useState } from "react";
import { enrolGroup } from "../../../api/groups";
import { getGroupsById } from "../../../api/groups";
import { useOutletContext } from "react-router-dom";

function ChannelItemCard({ group }) {
  const { groupDispatch } = useOutletContext();
  const [isMore, setIsMore] = useState(false);
  const navigate = useNavigate();
  const {
    groupName,
    groupId,
    membersNum,
    groupAvatar,
    groupBackground,
    groupIntro,
    isEnrolled,
  } = group;
  const [Enrolled, setEnrolled] = useState(isEnrolled);

  const enrolHandler = async () => {
    const data = {
      groupId,
    };

    const response = await enrolGroup(data);
    if (response !== null && response.respCode === "051") {
      setEnrolled(true);
      const response = await getGroupsById();
      groupDispatch({ type: "updateGroups", groups: response.data });
      toast.success("You have successfully join the group!", {
        theme: "colored",
      });
    } else {
      navigate("/login");
    }
  };

  const isMoreHandler = () => {
    setIsMore((prevState) => (prevState = !prevState));
  };

  return (
    <div className={`${styles.cardContainer} ${isMore && styles.isMore}`}>
      <div
        className={`${styles.backgroundImgContainer} ${
          isMore && styles.isMore
        }`}
      >
        <div className={styles.backgroundInnerContainer}>
          <img src={groupBackground} alt="backgroundImg" />
        </div>
        <div className={styles.channelImgContainer}>
          <img src={groupAvatar} alt="channelImg" />
        </div>
      </div>
      <div className={styles.outterContainer}>
        <div className={styles.contextContainer}>
          <div
            className={`${styles.moreBtnContainer} ${isMore && styles.isMore}`}
            onClick={isMoreHandler}
          >
            {isMore ? (
              <MdOutlineKeyboardArrowDown />
            ) : (
              <MdOutlineKeyboardArrowUp />
            )}
          </div>
          <h1 className={styles.groupTitle}>{groupName}</h1>
          <div
            className={`${styles.groupDescription} ${isMore && styles.isMore}`}
          >
            {groupIntro}
          </div>
          <div className={styles.infoContainer}>
            <MemberNum membersNum={membersNum} isOnline />
            <MemberNum membersNum={membersNum} />
          </div>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <button
          className={`${styles.joinButton} ${Enrolled && styles.disabled}`}
          onClick={enrolHandler}
          disabled={Enrolled}
        >
          {Enrolled ? "已加入" : "加入群组"}
        </button>
      </div>
    </div>
  );
}

export default ChannelItemCard;

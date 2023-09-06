import styles from "./MemberNum.module.scss";

function MemberNum({ membersNum, isOnline }) {
  return (
    <div className={styles.memberNumContainer}>
      <div
        className={`${styles.dotOffline} ${isOnline && styles.isGreen}`}
      ></div>
      <div className={styles.members}>
        {membersNum} {isOnline ? "Online" : "Members"}
      </div>
    </div>
  );
}

export default MemberNum;

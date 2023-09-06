import styles from "./DiscoverFooter.module.scss";
import discoverFooterIcon from "../../../assets/discoverFooterIcon.svg";

// import emojis, { convertEmojis } from "../../../hooks/useEmojis";
function DiscoverFooter({ onMore }) {
  // const paragraph = "interesting more [3]communities out here![2]";


  // const output = convertEmojis(paragraph);
  return (
    <div className={styles.footerContainer}>
      <div className={styles.iconContainer}>
        <img src={discoverFooterIcon} alt="" />
      </div>
      <h1 onClick={onMore} className={styles.content}>
        Get more communities out here! 👍👍👍
      </h1>
    </div>
  );
}

export default DiscoverFooter;

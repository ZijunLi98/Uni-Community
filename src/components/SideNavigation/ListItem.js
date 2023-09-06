import { useState } from "react";
import styles from "./ListItem.module.scss";

const ListItem = ({ icon, isActive, name }) => {
  const [noticeShown, setNotiveShown] = useState(false);

  return (
    <div className={styles.listItem}>
      <div className={styles.pill} style={{ marginLeft: isActive && 0 }}>
        {isActive && <span className={styles.span}></span>}
      </div>
      <div
        className={`${styles.listItemWrapper} ${isActive && styles.isActive}`}
        onMouseEnter={() => setNotiveShown(true)}
        onMouseLeave={() => setNotiveShown(false)}
      >
        <div className={styles.wrapper}>{icon}</div>
      </div>
      {noticeShown && (
        <div className={styles.itemNameNotice}>
          <div className={styles.noticeContainer}>
            <p>{name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListItem;

import styles from "./NavItem.module.scss";

function NavItem({ avatar, name, isActive, onClick }) {
  return (
    <div className={styles.itemOutter} onClick={onClick}>
      <div className={`${styles.item} ${isActive && styles.active}`}>
        <div className={styles.avatarContainer}>
          <img src={avatar} alt={name} />
        </div>
        <div className={styles.content}>
          <div className={styles.nameContainer}>
            <div className={styles.name}>{name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavItem;

import styles from "./EmojiTable.module.scss";
import { useState, useContext, useRef, useEffect } from "react";
import { EmojisContext } from "../../context/EmojiContext";

function EmojiTable({ onSelect }) {
  const [randNum, setrandNum] = useState(1);
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { emojis, counter } = useContext(EmojisContext);
  const wrapperRef = useRef();
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  return (
    <div className={styles.EmojiContainer} ref={wrapperRef}>
      <div
        onMouseEnter={() => {
          setrandNum(Math.floor(Math.random() * counter));
          setIsHover(true);
        }}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => setIsOpen((prevState) => (prevState = !prevState))}
      >
        <img
          className={`${styles.openBtn} ${isHover && styles.isHover}`}
          src={emojis[randNum].src}
          alt=""
        />
      </div>

      <div className={`${styles.emojiTableWrapper} ${isOpen && styles.isOpen}`}>
        <div className={styles.scroller}>
          <ul className={styles.emojiList}>
            {Object.values(emojis).map((el) => {
              return (
                <li
                  className={styles.emojiItem}
                  key={`L-${el.stringCode}`}
                  id={el.stringCode}
                  onClick={(e) => {
                    onSelect(e.currentTarget.id);
                    setIsOpen(false);
                  }}
                >
                  <img src={el.src} key={el.stringCode} alt="" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EmojiTable;

import styles from "./DiscoverHeader.module.scss";
import headerCover from "../../../assets/discoverHeaderCover.svg";
import { useEffect, useState } from "react";
function DiscoverHeader({ onSearch, courseCode }) {
  const [courseInput, setCourseInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(courseInput);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [courseInput, onSearch]);

  useEffect(() => {
    setCourseInput(courseCode);
  }, [courseCode]);

  return (
    <div className={styles.searchHeader}>
      <img className={styles.headerCover} alt="headerImage" src={headerCover} />
      <div className={styles.headerContentWrapper}>
        <div className={styles.headerContent}>
          <h1>在UQcommunity找到你的课程群组</h1>
          <h2>找到并加入你参加的课程，和同一门课的同学一起交流和分享吧！</h2>
          <div className={styles.container}>
            <div className={styles.searchBox}>
              <div className={styles.innerWrapper}>
                <input
                  value={courseInput}
                  onChange={(e) => {
                    setCourseInput(e.target.value);
                  }}
                  type="text"
                  placeholder="输入您的课程名"
                  maxLength="100"
                  className={styles.inputField}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscoverHeader;

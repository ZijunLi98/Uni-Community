import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DiscoverMain.module.scss";
import { getGroups } from "../../api/groups";
import DiscoverHeader from "./DiscoverLayout/DiscoverHeader";
import ChannelItemCard from "./ChannelCard.js/ChannelItemCard";
import GroupsLoading from "./ChannelCard.js/GroupsLoading";
import DiscoverFooter from "./DiscoverLayout/DiscoverFooter";

function DiscoverMain({ groupsState, groupsStateDispatch }) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { courseCode, currentCategory, pageNum } = groupsState;
  const navigate = useNavigate();

  const searchGroups = useCallback(
    async (pageNum = 1) => {
      setIsLoading(true);
      const data = {
        pageNum,
        courseCode: courseCode || "",
        categoryId: currentCategory || "",
      };

      const response = await getGroups(data);

      if (response !== null && response.respCode === "051") {
        if (response.data.length !== 0) {
          groupsStateDispatch({ type: "moreGroups" });
        }
        setIsLoading(false);
        return response.data;
      } else {
        navigate("/login");
        return;
      }
    },
    [groupsStateDispatch, navigate, courseCode, currentCategory]
  );

  useEffect(() => {
    (async () => {
      const groups = await searchGroups();
      setGroups(groups);
    })();
  }, [searchGroups]);

  const searchHandler = useCallback(
    (courseCode) => {
      groupsStateDispatch({ type: "searchByName", courseCode });
    },
    [groupsStateDispatch]
  );

  const showMoreGroupsHandler = async () => {
    const newGroups = await searchGroups(pageNum);
    setGroups((prevState) => {
      return prevState.concat(newGroups);
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.scroller}>
        <div className={styles.viewWrapper}>
          <DiscoverHeader onSearch={searchHandler} courseCode={courseCode} />
          <div className={styles.guideListContainer}>
            <h2 className={styles.listTopic}>Popular Groups</h2>
            <div className={styles.guideListGrid}>
              {pageNum !== 1 &&
                groups.map((el) => (
                  <ChannelItemCard key={el.groupId} group={el} />
                ))}
              {isLoading && <GroupsLoading />}
            </div>
          </div>
          <DiscoverFooter onMore={showMoreGroupsHandler} />
        </div>
      </div>
    </div>
  );
}

export default DiscoverMain;

import React, { useState } from "react";
import styles from "./SideNavigation.module.scss";
import ListItem from "./ListItem";
import GuideSeparator from "./GuideSeparator";
import { FaDiscord, FaCompass } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";

// const dummyData = [
//   {
//     icon: (
//       <img src="https://uqchat-image.oss-cn-qingdao.aliyuncs.com/1/user1avatar1679390883124.jpeg" />
//     ),
//     url: "/friends",
//     background: "blue",
//     key: 1,
//     name: "ziqi's room",
//   },
//   {
//     icon: (
//       <img
//         src="	https://uqchat-image.oss-cn-qingdao.aliyuncs.com/27/user27avatar1679489739038.x-icon
//       "
//       />
//     ),
//     url: "/friends",
//     background: "blue",
//     key: 2,
//     name: "wendy's room",
//   },
// ];

export default function SideNavigation({ groupState }) {
  const [current, setCurrent] = useState("friends");
  const discordIcon = (
    <FaDiscord className={styles.icon} size="28px" color="rgb(219,222,225)" />
  );
  const addIcon = (
    <IoAdd className={styles.icon} size="28px" color="rgb(35,165,89)" />
  );

  const compassIcon = (
    <FaCompass className={styles.icon} size="28px" color="rgb(35,165,89)" />
  );

  return (
    <div className={styles.sideNavigationContainer}>
      <Link to="/friends" onClick={() => setCurrent("friends")}>
        <ListItem
          icon={discordIcon}
          isActive={current === "friends"}
          name="Direct Messages"
        ></ListItem>
      </Link>
      <GuideSeparator />
      {groupState.groups.map((group) => {
        return (
          <Link
            to={`/chat/group/${group.groupId}`}
            key={group.groupId}
            onClick={() => setCurrent(group.groupId)}
          >
            <ListItem
              icon={<img src={`${group.groupAvatar}`} alt="img" />}
              isActive={current === group.groupId}
              name={group.groupName}
            ></ListItem>
          </Link>
        );
      })}
      {/* {dummyData.map((el) => (
        <Link to={el.url} onClick={() => setCurrent(el.key)} key={el.key}>
          <ListItem
            icon={el.icon}
            isActive={current === el.key}
            name={el.name}
          ></ListItem>
        </Link>
      ))} */}
      {/* <Link to="/gpt-test" onClick={() => setCurrent("guide")}> */}
      <ListItem icon={addIcon} name="Test GPT"></ListItem>
      {/* </Link> */}
      <Link to="/guide-discovery" onClick={() => setCurrent("guide")}>
        <ListItem
          icon={compassIcon}
          isActive={current === "guide"}
          name="Explore Public Servers"
        ></ListItem>
      </Link>
      <GuideSeparator />
    </div>
  );
}

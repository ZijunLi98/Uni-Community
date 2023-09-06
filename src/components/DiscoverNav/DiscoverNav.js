import compass from "../../assets/compass.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategory } from "../../api/category";
import styles from "./DiscoverNav.module.scss";
import NavItem from "./NavItem";
import Me from "../Chat/Me/Me";

function DiscoverNav({ onSet }) {
  const [current, setCurrent] = useState("主页");
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const response = await getCategory();
      if (response !== null && response.data !== null) {
        setCategory(response.data);
      } else {
        navigate("/login");
        return;
      }
    })();
  }, [navigate]);

  return (
    <>
      <div className={styles.discoverNavContainer}>
        <div className={styles.navContainer}>
          <h2>发现</h2>
          <NavItem
            avatar={compass}
            name="主页"
            isActive={current === "主页"}
            onClick={() => {
              setCurrent("主页");
              onSet({ type: "changeCategory", categoryId: "" });
            }}
          />
          {category.map((el) => (
            <NavItem
              avatar={el.categoryAvatar}
              name={el.categoryName}
              key={el.id}
              isActive={current === el.id}
              onClick={() => {
                setCurrent(el.id);
                onSet({ type: "changeCategory", categoryId: el.id });
              }}
            />
          ))}
        </div>
        <Me />
      </div>
    </>
  );
}

export default DiscoverNav;

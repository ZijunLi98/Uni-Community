import DiscoverNav from "../../components/DiscoverNav/DiscoverNav";
import DiscoverMain from "../../components/DiscoverMain/DiscoverMain";
import styles from "./GuideDiscoveryPage.module.scss";
import { useReducer } from "react";

const initialState = { currentCategory: "", pageNum: 1, courseCode: "" };

const reducer = (state, action) => {
  console.log(action.type);
  if (action.type === "changeCategory") {
    return { currentCategory: action.categoryId, pageNum: 1, courseCode: "" };
  }
  if (action.type === "moreGroups") {
    return { ...state, pageNum: state.pageNum + 1 };
  }
  if (action.type === "searchByName") {
    return { ...state, courseCode: action.courseCode };
  }
};

export default function GuideDiscoveryPage() {
  const [groupsState, dispatch] = useReducer(reducer, initialState);

  return (
    <div className={styles.discoveryContainer}>
      <DiscoverNav onSet={dispatch} />
      <DiscoverMain
        groupsState={groupsState}
        groupsStateDispatch={dispatch}
      />
    </div>
  );
}

import { useEffect, useReducer, useContext } from "react";
import { getGroupsById } from "../api/groups";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function useGroupChatReducer() {
  const initialValue = {
    groups: [],
    initialise: false,
  };
  const userContext = useContext(UserContext);
  const reducerFunction = (state, action) => {
    const prevState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
      case "initialiseGroup":
        return {
          ...state,
          groups: action.groups,
          initialise: true,
        };
      case "updateGroups":
        return {
          ...state,
          groups: action.groups,
        };
      case "loaded":
        return { ...state, loaded: true };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducerFunction, initialValue);
  const userId = userContext.userState.userId;
  const navigate = useNavigate();
  useEffect(() => {
    const data = { id: userId };
    console.log("test");
    if (!state.initialise) {
      getGroupsById().then((res) => {
        dispatch({ type: "initialiseGroup", groups: res.data });
      });
    }
  }, [navigate, state.initialise, userId]);

  return [state, dispatch];
}

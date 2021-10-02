const debateState = {
  value: "",
};

const debateReducer = (state = debateState, action) => {
  switch (action.type) {
    case "INIT_STATE":
      return {
        ...state,
      };

    case "CREATE_DEBATE":
      return {
        ...state,
        newDebate: action.payload,
      };

    case "VIEW_DEBATE":
      return {
        ...state,
        debateList: action.payload,
      };

    case "VIEW_FOLLOWERS":
      return {
        ...state,
        followerList: action.payload,
      };

    case "CHECK_FOLLOW":
      return {
        ...state,
        checkFollowed: action.payload,
      };

    case "FOLLOW_USER":
      return {
        ...state,
        followUser: action.payload,
      };

    case "PRIVATE-PROPOSAL":
      return {
        ...state,
      };

    case "VIEW_PRIVATE_PROPOSALS":
      return {
        ...state,
        proposalList: action.payload,
      };

    case "ERROR_PRIVATE_MESSAGE":
      return {
        ...state,
        errorMessage: action.payload,
      };

    case "PRIVATE_PROPOSAL":
      return {
        ...state,
        privateResponse: action.payload,
      };

    case "DEBATE_INFO":
      return {
        ...state,
        singleDebate: action.payload,
      };

    case "EDIT_DEBATE":
      return {
        ...state,
        updatedDebate: action.payload,
      };

    case "DELETE_DEBATE":
      return {
        ...state,
      };

    case "FOLLOWERS_COUNT":
      return {
        ...state,
        followersCount: action.payload,
      };

    case "VIDEO_LIST":
      return {
        ...state,
        videoStreamList: action.payload,
      };

    case "USER_VIDEO_LIST":
      return {
        ...state,
        uploadedVideoList: action.payload,
      };

    case "ERR_USER_VIDEO_LIST":
      return {
        ...state,
        errorMsg: action.payload,
      };

    case "WATCH_COUNT":
      return {
        ...state,
      };

    case "VOTE_COMMENT":
      return {
        ...state,
        currentVotes: action.payload,
      };

    case "GET_DEBATE":
      return {
        ...state,
        debateData: action.payload,
      };

    case "JOIN_DEBATE":
      return {
        ...state,
      };

    case "ONCLOSE_REMOVE_DEBATE":
      return {
        ...state,
        closedValue: action.payload,
      };
    case "INITIAL_VAL":
      return {
        ...state,
        reload: "currentPage",
      };

    case "PUBLIC_TO_PRIVATE":
      return {
        ...state,
        updatedDebate: action.payload,
      };

    case "UNFOLLOW":
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default debateReducer;

const userState = {
  name: 'karan',
  userProfileInfo: {},
  image: '',
  id: '',
  userList: [],
};

const userReducer = (state = userState, action) => {
  switch (action.type) {
    case 'GET_USER_PROFILE':
      //console.log(action.payload.val);
      //action.payload.name = action.payload.val;

      return {
        ...state,
        userProfileInfo: action.payload,
      };

    case 'IMAGE':
      //console.log(action.payload.val);
      //action.payload.name = action.payload.val;

      return {
        ...state,
        image: action.payload,
      };

    case 'ADD_USER':
      return {
        ...state,
        userInfo: action.payload,
      };

    case 'ALL_USERS':
      return {
        ...state,
        userList: action.payload,
      };

    case 'CONNECT_USER':
      return {
        ...state,
        id: action.payload,
      };

    case 'IS_LOGIN':
      return {
        ...state,
        loginInfo: action.payload,
      };

    case 'SEARCH_RESULT':
      return {
        ...state,
        searchList: action.payload,
      };

    case 'VERIFY':
      return {
        ...state,
      };

    case 'EDIT_USER':
      return {
        ...state,
        editUser: action.payload,
      };

    case 'FORGOT_PSW':
      return {
        ...state,
      };

    case 'SET_NEW_PSW':
      return {
        ...state,
      };

    case 'LOGOUT':
      return {
        ...state,
      };

    case 'CHECK_SAVEUSER':
      return {
        ...state,
        checkSaveUser: action.payload,
      };

    case 'USER_STATUS':
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default userReducer;

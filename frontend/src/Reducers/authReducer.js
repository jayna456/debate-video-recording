const iState = {
  userName: "",
  name: "",
  email: null,
  mobile: null,
  termsCondition: "",
  dob: "",
  password: "",
  confpass: "",
  isReg: false,
  logemail: "",
  logpass: "",
  isLogin: false,
  forgotEmail: "",
  invalidEmail: "",
  loggedIn: false,
  token: "",
};

const authReducer = (state = iState, action) => {
  switch (action.type) {
    case "GET_REGFORM":
      //console.log(action.payload.val);
      //action.payload.name = action.payload.val;

      return {
        ...state,
        [action.payload.name]: action.payload.val,
      };

    case "IS_REGISTER":
      return {
        ...state,
        isReg: action.payload,
      };
    case "MOBILE_EMPTY":
      return {
        ...state,
        mobile: action.payload,
      };

    case "EMAIL_EMPTY":
      return {
        ...state,
        email: action.payload,
      };
    case "GET_LOGINFORM":
      return {
        ...state,
        [action.payload.name]: action.payload.val,
      };

    case "IS_LOGIN":
      return {
        ...state,
        isLogin: action.payload,
      };

    case "FORGOTEMAIL_INPUT":
      return {
        ...state,

        forgotEmail: action.payload,
      };
    case "INVALID_EMAIL":
      return {
        ...state,
        invalidEmail: action.payload,
      };
    case "CHANGE_LOGEDIN":
      console.log("chnage login stte" + action.payload);
      return {
        ...state,
        loggedIn: action.payload,
      };

    case "CHANGE_LOGOUT":
      return {
        ...state,
        loggedIn: action.payload,
      };

    case "LOGIN_DATA":
      return {
        ...state,
        loggedInData: action.payload,
      };

    case "FACEBOOK_DATA":
      return {
        ...state,
        facebookData: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;

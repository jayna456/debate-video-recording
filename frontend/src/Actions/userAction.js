import swal from "sweetalert";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const handleRegisterInput = (event) => {
  return (dispatch) => {
    let name = event.target.name;
    let val = event.target.value;

    let formValue = { name: name, val: val };

    // console.log(formValue);
    dispatch({ type: "GET_REGFORM", payload: formValue });
  };
};

export const handleLoginInput = (event) => {
  return (dispatch) => {
    let name = event.target.name;
    let val = event.target.value;

    let formValue = { name: name, val: val };

    dispatch({ type: "GET_LOGINFORM", payload: formValue });
  };
};

export const submitRegisterHandlar = (bodyData, props) => {
  return async (dispatch) => {
    //console.log("req.body to pass", bodyData);

    const result = await fetch(
      `${process.env.REACT_APP_API_URL}user/register`,
      {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resultData = result.json();

    resultData
      .then((data) => {
        if (data.code === 200) {
          toast.success(
            "Your account created successfully, Link is sent for verification! Please verify your account"
          );

          setInterval(() => {
            window.location.reload();
          }, 3000);
        } else if (data.code === 409) {
          swal("Info!", "Already register using this email id!", "info");
          setInterval(() => {
            window.location.reload();
          }, 2000);
        }
        else if (data.code === 500) {
          swal("Info!", "Successfully register but something went wrong while sending verification code to the entered email", "info")
          .then(() => {
            window.location.reload();
          });
        }
        else {
          swal("Error!", "Somthing want wrong,Please try again!", "error");
          setInterval(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("err... ", err);
      });
  };
};

export const getUserProfileInfo = (id) => {
  return async (dispatch) => {
    console.log("getProfile info");

    const result = await fetch(
      `${process.env.REACT_APP_API_URL}user/getProfileInfo?id=${id}`
    );
    const resultData = result.json();

    resultData
      .then((data) => {
        if (data.code === 200) {
          console.log("data.data", data.data);
          dispatch({ type: "GET_USER_PROFILE", payload: data.data });
        }
      })
      .catch((err) => {
        console.log("err... ", err);
      });
  };
};

const checkMimeType = (event) => {
  // gettting file object
  let files = event.target.files;

  // define message container

  let err = "";

  //list allow mime type

  const types = ["image/png", "image/jpeg", "image/gif"];

  // loop access array
  for (let x = 0; x < files.length; x++) {
    // compare file type doesn't match

    if (types.every((type) => files[x].type !== type))
      // create err msg and assign to container
      err += files[x].type + " is not supported formate \n\n  ";
    // Assign msg to error
  }

  if (err !== "") {
    // if message is not same old massage that mean has error

    event.target.value = null;

    //console.log(err);

    return false;
  }

  // for (let z = 0; z < err.length; z++) {
  //   // Loop created toast msg
  //   console.log(err);
  //   this.setState({ chkMimeType: err });
  //   event.target.value = null;
  //   //toast.error(err[z]);
  // }

  return true;
};

export const onImageChange = (event, id) => {
  return async (dispatch) => {
    console.log("fn called");
    if (event.target.files && event.target.files[0]) {
      //checkMimeType(event);

      if (checkMimeType(event)) {
        let fileInfo = event.target.files[0];
        let imageData = new FormData();
        const userId = id;
        imageData.append("profilePic", fileInfo);
        imageData.append("userId", userId);
        let reader = new FileReader();

        reader.onload = (e) => {
          dispatch({
            type: "IMAGE",
            payload: e.target.result,
          });

          const imageUrlInfo = { profilePic: e.target.result, userId: userId };
          fetch(`${process.env.REACT_APP_API_URL}user/editProfileImg1`, {
            method: "post",
            body: JSON.stringify(imageUrlInfo),
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((messages) => {
              console.log(messages.code);
              console.log(messages);
              if (messages.code === 200) {
                swal("Success!", "Image Updated successfully", "success").then(
                  (data1) => {
                    window.location.reload();
                  }
                );
              } else {
                swal(
                  "Error!",
                  "Some thing want wrong,Please try again!",
                  "success"
                );
              }
            });
        };
        reader.readAsDataURL(event.target.files[0]);
      } else {
        swal(
          "Info!",
          "Please upload only png,jpeg,jpg formate image and image size should be less then 60KB",
          "info"
        );
      }
    }
  };
};

export const loginSubmit = (data) => {
  return async (dispatch) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}user/login`, data)
      .then((result) => {
        if (result.data.code === 200) {
          dispatch({
            type: "IS_LOGIN",
            payload: {
              data: result.data.data,
              authToken: result.data.authToken,
            },
          });

          localStorage.setItem("debateAccountToken", result.data.authToken);
          localStorage.setItem("email", result.data.data.email);
          localStorage.setItem("id", result.data.data.id);
          toast.success("Logged in successfully");

          setInterval(() => {
            // props.history.push("/");
            window.location.replace("/");
          }, 3000);
        } else {
          toast.error("Email or password wrong!!");
        }
      })
      .catch((err) => {
        console.log("error .. ", err);
        toast.error("Somethihng went wrong!!");
        setInterval(() => {
          window.location.reload();
        }, 3000);
      });
  };
};

export const storeSocalInfo = (data, props) => {
  return async (dispatch) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}user/socialLogin`, data)
      .then((result) => {
        console.log("result.. ", result);
        if (result.data.code === 200) {
          dispatch({
            type: "FACEBOOK_DATA",
            payload: {
              data: result.data.data,
              authToken: result.data.authToken,
              accessToken: result.data.accessToken,
            },
          });

          localStorage.setItem("treadingAccountToken", result.data.authToken);
          localStorage.setItem("name", result.data.data.firstName);
          localStorage.setItem("profilepic", result.data.data.profilePic);
          localStorage.setItem("id", result.data.data._id);
          // props.history.push(`/profile/${result.data.data._id}`);
          // props.history.push("/");
        } else {
          dispatch({
            type: "ERROR",
          });
        }
      })
      .catch((err) => {
        console.log("error in social... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const searchDebeate = (data) => {
  return (dispatch) => {
    console.log("dispatch... ", data);

    axios
      .post(`${process.env.REACT_APP_API_URL}debate/searchDebeate`, data)
      .then((result) => {
        console.log("searcch result.data... ", result.data);
        if (result.data.code === 200) {
          dispatch({
            type: "SEARCH_RESULT",
            payload: result.data.data,
          });
        }
      })
      .catch((err) => {
        console.log("err... ", err);
        dispatch({
          type: "ERROR",
        });
      });
  };
};

export const verifyUser = (data) => {
  return (dispatch) => {
    console.log("verify data.. ", data);

    axios
      .put(`${process.env.REACT_APP_API_URL}user/verifyUser`, data)
      .then((result) => {
        console.log("result.data... ", result.data);
        if (result.data.code === 200) {
          dispatch({
            type: "VERIFY",
          });

          swal("Info!", "You are verified!", "success").then((value) => {
            window.location.replace("/login");
          });
        } else {
          toast.error(result.data.messages);
        }
      })
      .catch((err) => {
        console.log("err... ", err);
        dispatch({
          type: "ERROR",
        });

        toast.error("Something went wrong!!");
      });
  };
};

export const editProfile = (data) => {
  return (dispatch) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}user/editPersonalProfile`, data)
      .then((result) => {
        console.log("result.data ", result.data);
        if (result.data.code === 200) {
          dispatch({
            type: "EDIT_USER",
            payload: result.data.data,
          });
          swal("Success!", result.data.message, "success");
        } else {
          dispatch({
            type: "EDIT_USER",
            payload: result.data.message,
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const forgotPassword = (data) => {
  return (dispatch) => {
    console.log("forgot psw.. ");

    axios
      .put(`${process.env.REACT_APP_API_URL}user/forgotPassword`, data)
      .then((result) => {
        console.log("result.data for forgot psw.. ", result.data);
        dispatch({
          type: "FORGOT_PSW",
        });

        if(result.data.code === 200) {
          swal(
            "Info",
            "Link send to your registered mail. Please check it!!",
            "info"
          );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const setNewPassword = (data) => {
  return (dispatch) => {
    console.log("forgot psw.. ");

    axios
      .put(`${process.env.REACT_APP_API_URL}user/setNewPassword`, data)
      .then((result) => {
        console.log("result.data for forgot psw.. ", result.data);
        dispatch({
          type: "SET_NEW_PSW",
        });

        swal("Info", result.data.message, "info").then((data1) => {
          window.location.replace("/login");
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    console.log("log out api called");
    const data = {
      id: localStorage.getItem("id"),
    };

    axios
      .put(`${process.env.REACT_APP_API_URL}user/logout`, data)
      .then((result) => {
        console.log("result logged out... ", result.data);

        dispatch({
          type: "LOGOUT",
        });
      })
      .catch((err) => {
        console.log("error.. ", err);
      });
  };
};

export const checkUser = () => {
  return (dispatch) => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }user/checkSaveUser?id=${localStorage.getItem("id")}`
      )
      .then((result) => {
        console.log("result logged out... ", result.data);

        if (result.data.code === 200) {
          dispatch({
            type: "CHECK_SAVEUSER",
            payload: result.data.data,
          });
        }
      })
      .catch((err) => {
        console.log("error.. ", err);
      });
  };
};

export const changeUserStatus = (data) => {
  return (dispatch) => {
    axios.patch(`${process.env.REACT_APP_API_URL}user/makeStatusActive`,data)
    .then((result) => {
      if(result.data.code === 200) {
        dispatch({
          type: "USER_STATUS"
        })
      }
    })
    .catch((error) => {
      console.log('error in updating.. ',error);
    })
  }
}
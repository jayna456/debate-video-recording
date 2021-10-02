export const searchData = (event) => {
  return async (dispatch) => {
    console.log("call" + event.target.value);

    const bodyData = { searchData: event.target.value };
    dispatch({ type: "SEARCH_VAL", payload: event.target.value });
    const result = await fetch(`${process.env.REACT_APP_API_URL}searchUsers`, {
      method: "POST",
      body: JSON.stringify(bodyData),
      headers: { "Content-Type": "application/json" },
    });

    if (result) {
      let resultData = await result.json();

      //   console.log(resultData);
      //   console.log(resultData.code);
      if (resultData) {
        if (resultData.code === 200) {
          dispatch({ type: "SEARCH_INFO", payload: resultData });
        }
      }
      //   if (resultData) {
      //     resultData
      //       .then((response) => {
      //         if (response.code == 200) {
      //           console.log("this.state.searchResultData", resultData);
      //         }
      //       })
      //       .catch((err) => {
      //         console.log("error... ", err);
      //       });
      //   }
    } else {
      console.log("no result found");
    }
  };
};

export const hideData = () => {
  console.log("hide data fn called");
  return async (dispatch) => {
    dispatch({ type: "HIDE_DATA", payload: "" });
  };
};

import React, {useState, useEffect} from "react";
import "../../assets/css/premium.css";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageSidebar from "../LandingPageSidebar";
import {useHistory} from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import swal from "sweetalert";
import {getUserProfileInfo} from "../../Actions/userAction";
import {useDispatch, useSelector} from "react-redux";

function Premium() {
  let history = useHistory();
  const [price, setprice] = useState("");
  const [user, setUser] = useState({});

  const dispatch = useDispatch();
  const stateUser = useSelector(state => state.user);

  useEffect(() => {
    if (stateUser) {
      if (stateUser.userProfileInfo) {
        setUser(stateUser.userProfileInfo);
      }
    }
  }, [stateUser]);

  useEffect(() => {
    console.log(
      "process.env.STRIPE_PUBLISHABLE_KEY ",
      process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
    );
    axios
      .get(`${process.env.REACT_APP_API_URL}payment/listPrice`)
      .then(result => {
        console.log("result...", result);
        if (result.data.code === 200) {
          console.log(
            "sucess response ",
            result.data.data.data[result.data.data.data.length - 1].unit_amount
          );
          setprice(
            result.data.data.data[result.data.data.data.length - 1].unit_amount
          );
        } else {
          swal("Error", result.data.message, "error");
        }
      })
      .catch(error => {
        console.log("error in private proposal... ", error);
        swal("Error", "Something went wrong!!", "error");
      });

    dispatch(getUserProfileInfo(localStorage.getItem("id")));
  }, []);

  const sendToLogin = () => {
    if (!localStorage.getItem("debateAccountToken")) {
      swal({
        title: "Want a premium account?",
        text: "Please, first do register or login",
        icon: "warning",
        dangerMode: false,
      }).then(willDelete => {
        if (willDelete) {
          history.push("/login");
        }
      });
    }
  };

  const makePayment = async token => {
    swal({
      title: "please wait!",
      text: "payment is in process",
      icon: "warning",
      timer: 20000,
      showConfirmButton: false,
      showCancelButton: false,
      closeOnClickOutside: false,
      className: "not-button",
    });
    console.log("payment... ", token);
    console.log("baseURL..", process.env.REACT_APP_API_URL);
    console.log("id:", localStorage.getItem("id"));
    if (localStorage.getItem("id")) {
      var data = {
        userId: localStorage.getItem("id"),
        token: token.id,
      };
      axios
        .post(`${process.env.REACT_APP_API_URL}payment/buyPremiumPayment`, data)
        .then(result => {
          console.log("result...", result);
          if (result.data.code === 200) {
            swal({
              title: "Payment is done successfully",
              text: "Enjoy premium facility",
              icon: "success",
              closeOnClickOutside: false,
              dangerMode: false,
            }).then(willDelete => {
              if (willDelete) {
                history.push("/");
              }
            });
          } else {
            swal("Error", result.data.message, "error");
          }
        })
        .catch(error => {
          console.log("error in private proposal... ", error);
          swal("Error", "Something went wrong!!", "error");
        });
    } else {
      swal("Error", "first do login for subscription!!", "error");
    }
  };

  const displayMessage = () => {
    if (user.premium) {
      return swal({
        title: "Info",
        text: "You already have this features!",
        icon: "info",
        dangerMode: false,
      });
    }
  };

  return (
    <div>
      <LandingPageHeader />
      <LandingPageSidebar />
      <div className="premium_container d-flex" style={{marginTop: "65px"}}>
        <div className="sub_premium_container">
          <div className="premium_title">Pieramo Free</div>
          <div className="price">
            <span>$ 0.00</span>/ per month
          </div>
          <div className="package_included">
            <div className="package_singles">
              <i className="fas fa-check"></i> Debate for free
            </div>
            <div className="package_singles not_available">
              <i className="fas fa-check"></i> Ad free
            </div>
            <div className="package_singles not_available">
              <i className="fas fa-check"></i> Download debates
            </div>
            <div className="package_singles not_available">
              <i className="fas fa-check"></i> pieramo premium sign
            </div>
            <div className="package_singles not_available">
              <i className="fas fa-check"></i> High priority to proposals
            </div>
          </div>
        </div>
        <div className="sub_premium_container">
          <div className="premium_title">
            Pieramo Premium
            <img src={`../../assets/images/logo.png`} height="15" width="15" />
          </div>
          <div className="price">
            <span>$ 129.00</span>/ per month
          </div>
          <div className="package_included">
            <div className="package_singles">
              <i className="fas fa-check"></i> Debate for free
            </div>
            <div className="package_singles">
              <i className="fas fa-check"></i> Ad free
            </div>
            <div className="package_singles">
              <i className="fas fa-check"></i> Download debates
            </div>
            <div className="package_singles">
              <i className="fas fa-check"></i> pieramo premium sign
            </div>
            <div className="package_singles">
              <i className="fas fa-check"></i> High priority to proposals
            </div>
          </div>
          {user.premium ? (
            <button
              className="buy_premium"
              style={{
                display: localStorage.getItem("debateAccountToken")
                  ? ""
                  : "none",
              }}
              onClick={displayMessage}>
              Buy premium
            </button>
          ) : (
            <StripeCheckout
              name="payment"
              token={makePayment}
              // shippingAddress
              // billingAddress={false}
              stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
              amount={price}
              email={localStorage.getItem("email")}>
              <button
                className="buy_premium"
                style={{
                  display: localStorage.getItem("debateAccountToken")
                    ? ""
                    : "none",
                }}>
                Buy premium
              </button>
            </StripeCheckout>
          )}

          <button
            className="buy_premium"
            onClick={sendToLogin}
            style={{
              display: localStorage.getItem("debateAccountToken") ? "none" : "",
            }}>
            Buy premium
          </button>
        </div>
      </div>
    </div>
  );
}

export default Premium;

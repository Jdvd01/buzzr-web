import React, { useContext, useEffect } from "react";
import "../../styles/home.css";
import { Context } from "../store/appContext";
import Login from "../component/Login.jsx";
import Register from "../component/Register.jsx";
import { Helmet } from "react-helmet";
import ChannelChat from "../component/channelChat.jsx"
import { useNavigate } from "react-router";

export const Home = () => {
  const { store } = useContext(Context);
  let navegar = useNavigate()

  useEffect(() =>{
    {store.token.length > 0 ? (
      navegar("/channelchat/Welcome")
    ) : ""}
  }, [])

  return (
    <>
      {store.token == "" ? (
        <div>
          <Helmet title="BuzzrApp"></Helmet>
          <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
            <div className="col-md-5 p-lg-5 mx-auto my-5">
              <h1 className="display-4 font-weight-normal">BuzzrApp</h1>
              <p className="lead font-weight-normal">
                Buzzr is project management tool and a Messaging App all in one.
                Chat, keep things organized, assign and automate tasks.
              </p>
              <Login />
              <Register />
            </div>
            <div className="product-device box-shadow d-none d-md-block">
              <p className="dialog-02">Are you on Buzzr?</p>
              <br className="mt-1"></br>
              <p className="dialog-03">Hey Buzzrs!</p>
              <br className="mt-1"></br>
              <p className="dialog-02">BuzzrApp is so fast!</p>
            </div>
            <div className="product-device product-device-2 box-shadow d-none d-md-block"></div>
          </div>
          <div className="container marketing">
            <hr className="featurette-divider" />

            <div className="row featurette">
              <div className="col-md-7">
                <h2 className="featurette-heading fw-normal lh-1">
                  Buzzr is the ultimate
                  <span className="text-muted"> Workspace</span>
                </h2>
                <p className="lead">
                  Buzzr is an instant messaging platform that not only allows
                  you to have direct communication with the members of your work
                  team, but also makes it easy to assign tasks and keep track of
                  them. What characterizes Buzzr is the "Buzz" method, a method
                  in which team leaders can send the message to other Buzzr
                  users through an email created from the same app. In this way,
                  team leaders can highlight the most relevant information and
                  ensure that it doesn't get lost in a sea of messages. Once the
                  team leader has sent the Buzz, the recipient will receive a
                  Pop-Up via Buzzr as a reminder that there is a pending
                  conversation or task.
                </p>
              </div>
              <div className="col-md-5">
                <img src="https://picsum.photos/id/201/500/500" />
              </div>
            </div>

            <hr className="featurette-divider" />
          </div>
        </div>
      ) : (
        <ChannelChat name="Welcome" />
      )}
    </>
  );
};

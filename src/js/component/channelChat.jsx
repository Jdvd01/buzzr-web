import React from 'react';
import { useState } from 'react';
import io from "socket.io-client";
import { useParams } from "react-router";
import { useEffect, useContext, useRef } from 'react';
import { Context } from '../store/appContext';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";


const endPoint = process.env.ENDPOINT;
let socket = io.connect(`${endPoint}`);

const ChannelChat = () => {
    const { store, actions } = useContext(Context)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([""])
    let params = useParams()

    const listInnerRef = useRef(null);

    const handleKeyDown = (event) => {
        if (event.key == "Enter") {
            socket.emit("channel", { "msg": message, "channel": params.name, "username": store.userInfo.username });
            setMessage("");
        }
    }

    const handleClick = () => {
        if (message !== "") {
            socket.emit("channel", { "msg": message, "channel": params.name, "username": store.userInfo.username });
            setMessage("");
        } else {
            alert("Please Add A Message");
        }
    }

    const getMessages = (channel) => {
        socket.on("mensaje", (msg) => {
            setMessages([...messages, msg])
        })
        if (!store.isLogin) {
            actions.handleIsLogin()
        } else {
            actions.handleMessages(channel)
        }
        actions.handleChannelUsers(channel)
        listInnerRef.current.scrollIntoView(null)
    }

    useEffect(() => {
        socket.emit("join", { "channel": params.name })
        getMessages(params.name);
    }, [messages])

    return (
        <>
            <div>
                <Helmet title={params.name}>
                    <style>{'body {background-color: rgba(33,37,41);}'}</style>
                    <style>{'footer {color: white;}'}</style>
                </Helmet>

                <div className="channel_title">
                    <h3 className="m-0">Channel: {params.name}</h3>
                </div>

                <div className='channel_view'>

                    <div className='col-2 channels_and_users'>
                        <ul>
                            <li>Channels</li>
                            {store.channels.map((channel) => {
                                return (
                                    <li key={channel.id}><Link onClick={() => { getMessages(channel.name) }} to={`/channelchat/${channel.name}`}>{channel.name}</Link></li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className='bg-dark col-8 chat_body'>
                        <ul>
                            <li>Titulo del chat: {params.name}</li>
                            {store.messages.length > 0 &&
                                store.messages.map((msg) => {
                                    return (
                                        <div key={Math.random() + Math.random()}>
                                            {store.userInfo.username == msg.username ?
                                                <li
                                                    key={msg.id}
                                                    className="my_messages">
                                                    {msg.username}: <br />
                                                    {msg.msg} <span className='justify-content-end'>{msg.date}</span>
                                                </li>
                                                :
                                                <li key={msg.id} className="other_messages">
                                                    {msg.username}: <br />
                                                    {msg.msg}, {msg.date}
                                                </li>
                                            }
                                        </div>
                                    )
                                })}
                            <div id='final' ref={listInnerRef}></div>
                        </ul>
                    </div>
                    <div className='col-2 channels_and_users'>
                        <ul >
                            <li>Users</li>
                            {store.channelUsers.map((user) => {
                                return (
                                    <li key={user.id}><Link to={`/privatechat/${user.username}`}>{user.username}</Link></li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='channel_view'>
                <div className="col-2"></div>
                <div className='col-8 d-flex justify-content-center align-items-end'>
                    <input
                        value={message}
                        name="message"
                        onChange={(e) => { setMessage(e.target.value) }}
                        onKeyDown={(e) => { handleKeyDown(e) }}
                        type="text" className='chat_input col-10 mt-4'
                    ></input>
                    <button type='button' className='send_button btn btn-outline-primary' onClick={() => {
                        handleClick()
                    }}><i className="far fa-paper-plane"></i></button>
                </div>
                <div className="col-2"></div>
            </div>
        </>
    );
};

export default ChannelChat;
import React, { useState, useEffect, useRef } from 'react';
import * as signalR from "@microsoft/signalr";
import Picker from 'emoji-picker-react';
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

export default function ChatPageMasur() {
    const friendID = 2; // آی‌دی طرف مقابل
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [connection, setConnection] = useState(null);
    const chatBoxRef = useRef(null);
    const lastMessageRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY3VzdG9tZXIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIxIiwiZXhwIjoxNzI1NTI3MDc1fQ.6VGf_B-nRbORQNyOV6a-jfODn_loAqcWEmQ1d__UQLA"; // اینجا توکن JWT خود را جایگزین کنید
    
    useEffect(() => {
        setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    }, []);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://chat.micapi.ir/chatHub", {
                accessTokenFactory: () => token, // ارسال توکن احراز هویت
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        newConnection.start()
            .then(() => {
                console.log("Connected to SignalR Hub");

                newConnection.on("ReceiveMessage", (msg) => {
                    console.log('ReceiveMessage msg: ', msg);
                    setMessages((prevMessages) => [...prevMessages, msg]);
                });
            })
            .catch(err => console.error("Connection failed: ", err));

        setConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [token]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && connection) {
            connection.invoke("SendMessage", friendID.toString(), message)
                .catch(err => console.error("SendMessage failed: ", err));

            setMessage('');
        }
    };

    const onEmojiClick = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
        }
    };

    const convertTimestampToTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    return (
        <div className='bg-green-900 h-screen p-2 pt-10 md:p-10 overflow-hidden'>
            <div className='text-center mb-3 text-gray-300 font-bold text-lg'>صفحه چت مشتری</div>
            <section className='h-full flex flex-col'>
                <div ref={chatBoxRef} className='bg-gray-300 h-full rounded-md overflow-y-auto p-2 md:p-7 mb-20 md:mb-16'>
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div key={index} className="flex justify-between items-start ">
                                {msg.userId === String(friendID) ? (
                                    <div className={`flex py-2 ml-5 break-words overflow-hidden`}>
                                        <div className={`bg-green-300 px-2 pb-6 py-1 rounded-xl rounded-br-none shadow-md relative min-w-16 w-full`}>
                                            <span className='text-sm md:text-xl whitespace-pre-wrap break-words'>{msg.content}</span>
                                            <span className='absolute bottom-0 right-1 text-gray-500 text-sm'>{convertTimestampToTime(msg.timestamp)}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`flex justify-end w-full py-2 ml-5 break-words overflow-hidden`}>
                                        <div className={`bg-blue-300 px-2 pb-6 py-1 rounded-xl rounded-bl-none shadow-md relative min-w-16 w-fit`}>
                                            <span className='text-sm md:text-xl whitespace-pre-wrap break-words'>{msg.content}</span>
                                            <span className='absolute bottom-0 left-1 text-gray-500 text-sm'>{convertTimestampToTime(msg.timestamp)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className='flex justify-center items-center h-full text-gray-500 select-none'>هیچ پیامی موجود نیست</div>
                    )}
                    <div ref={lastMessageRef}></div>
                </div>
                <div className="fixed left-0 right-0 bottom-0 p-2 bg-green-950">
                    <form className='flex gap-3 relative' onSubmit={sendMessage}>
                        <button className='text-sky-500 w-16 h-16 rounded-full flex justify-center items-center text-[45px]'>
                            <IoMdSend />
                        </button>
                        <div className="relative w-full h-16">
                            <textarea
                                className='w-full h-16 p-5 outline-none opacity-80 focus:opacity-100 rounded-md'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="پیام خود را بنویسید..."
                                onKeyDown={handleKeyDown}
                                rows={1}
                            />
                            <button type="button" className='absolute left-0 top-0 bottom-0 my-auto px-5' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                <BsEmojiSmile className='text-2xl hover:text-yellow-800' />
                            </button>
                        </div>

                        {showEmojiPicker && (
                            <div ref={emojiPickerRef} className='absolute bottom-16'>
                                <Picker searchDisabled onEmojiClick={onEmojiClick} />
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
}

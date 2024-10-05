import React, { useState, useEffect, useRef } from 'react';
import * as signalR from "@microsoft/signalr";
import Picker from 'emoji-picker-react';
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdLogOut, IoMdSend } from "react-icons/io";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import UsersMenuList from './UsersMenuList';
import { FaBars } from 'react-icons/fa';


const chatList = [
    { id: 12563, name: 'محمد', image: '/favicon.ico' },
    { id: 652426, name: 'علی', image: '/favicon.ico' },
    { id: 69595, name: 'رضا', image: '/favicon.ico' },
    { id: 98589, name: 'نرگس', image: '/favicon.ico' },
    { id: 9859, name: 'ملیکا', image: '/favicon.ico' },
]


export default function ChatPageMasur() {
    const router = useRouter()
    const userId = 2;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [connection, setConnection] = useState(null);
    const chatBoxRef = useRef(null);
    const lastMessageRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [token, setToken] = useState(null);
    const [openMenu, setOpenMenu] = useState(true); // باز کردن منوی لیست کاربران


    useEffect(() => {
        setIsMobile(/Mobi|Android/i.test(navigator.userAgent));

        const userToken = Cookies.get('token');
        setToken(userToken);
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

                newConnection.invoke("JoinChat", 123)
                    .then(() => console.log("Joined Chat :)"))
                    .catch(err => console.error("JoinChat failed: ", err));
            })
            .catch(err => console.error("Connection failed: ", err));

        setConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [token]);

    useEffect(() => {
        console.log("messages", messages);
    }, [messages]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiPickerRef]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && connection) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;


            connection.invoke("SendMessage", 123, String(userId), message)
                .catch(err => console.error("SendMessage failed: ", err));

            setMessage('');
        }
    };

    const onEmojiClick = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (isMobile) {
                if (!e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                }
            } else if (!e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
            }
        }
    };

    const convertTimestampToTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const logoutHandler = () => {
        Cookies.remove('token')
        router.push('/')
    }

    const openUserMenuHandler = () => {
        setOpenMenu(prev => !prev)
    }

    return (
        <section className='relative flex'>
            <div className='bg-gray-800 h-screen p-2 pt-14 overflow-hidden w-full'>
                <div className='mb-2 text-gray-300 font-bold text-lg grid grid-cols-3 items-center'>
                    <div>
                        <button className='bg-red-600 hover:bg-red-700 text-white p-1 rounded-sm' onClick={logoutHandler}>
                            <IoMdLogOut className='text-3xl' />
                        </button>
                    </div>
                    <h1 className='text-center text-sm sm:text-lg'>صفحه چت مشتری</h1>
                    <div className='flex justify-end'>
                        <button onClick={openUserMenuHandler}>
                            <FaBars className='text-3xl' />
                        </button>
                    </div>
                </div>
                <section className='h-full flex flex-col relative'>
                    <div ref={chatBoxRef} className='bg-gray-300 h-full rounded-md overflow-y-auto p-2 md:p-7 mb-3'>
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div key={index} className="flex justify-between items-start ">
                                    {msg.userId === String(userId) ? (
                                        <div className={`flex py-2 ml-5 break-words overflow-hidden`}>
                                            <div className={`bg-green-300 md:ml-20 lg:ml-52 pl-6 pr-10 pb-6 py-2 rounded-3xl rounded-br-none shadow-md relative min-w-16 w-full ${index === messages.length - 1 && 'pm-animation'}`}>
                                                <span className='text-sm md:text-xl whitespace-pre-wrap break-words'>{msg.content}</span>
                                                <span className='absolute bottom-0 right-1 text-gray-500 text-sm'>{convertTimestampToTime(msg.timestamp)}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`flex justify-end w-full py-2 ml-5 break-words overflow-hidden`}>
                                            <div className={`bg-blue-300 md:mr-20 lg:mr-52 pr-6 pl-10 pb-6 py-1 rounded-3xl rounded-bl-none shadow-md relative min-w-16 w-fit ${index === messages.length - 1 && 'pm-animation'}`}>
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
                    <div className="sticky left-0 right-0 bottom-0 p-2 bg-gray-900">
                        <form
                            className='flex gap-3 relative'
                            onSubmit={sendMessage}
                        >
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
                                    <Picker
                                        searchDisabled
                                        onEmojiClick={onEmojiClick}
                                        disableSkinTonePicker
                                        pickerStyle={{ width: 'auto', height: 'auto' }}
                                    />
                                </div>
                            )}
                        </form>
                    </div>
                </section>
            </div>

            {/* منوی لیست کاربران */}
            <UsersMenuList openMenu={openMenu} chatList={chatList} />
        </section>
    );
}

import React, { useState } from 'react'
import { getLoginRespons } from '@/Functions/getLoginRespons';
import { useRouter } from 'next/router';

export default function Login() {

    const [username, setUsername] = useState('customer')
    const [password, setPassword] = useState('123')
    const router = useRouter()

    const submitLoginHandler = async (e) => {
        e.preventDefault();

        const isUser = await getLoginRespons(username, password)

        if (isUser === 1) {
            router.push('/customer-chat')
        }
        if (isUser === 2) {
            router.push('/massor-chat')
        }
    };


    return (
        <div className='bg-gray-800 h-screen flex justify-center items-start sm:items-center p-3'>
            <div className='bg-gray-200 p-2 rounded-md shadow-md w-full sm:w-[400px]'>
                <h1 className='text-center font-bold'>ورود به حساب کاربری</h1>
                <form className='mt-5 grid gap-2' onSubmit={submitLoginHandler}>
                    <input
                        dir='ltr'
                        type="text"
                        className='w-full rounded-md outline-none p-3 text-center placeholder:text-start focus:bg-green-100'
                        placeholder='نام کاربری'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        dir='ltr'
                        type="password"
                        className='w-full rounded-md outline-none p-3 text-center placeholder:text-start focus:bg-green-100'
                        placeholder='رمز عبور'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className='bg-gray-800 hover:bg-gray-900 rounded-md text-white p-3 mt-5'>ورود به صفحه چت</button>
                </form>
            </div>
        </div>
    )
}

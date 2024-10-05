import Image from 'next/image'
import React from 'react'

export default function UsersMenuList({ openMenu, chatList }) {
    return (
        <div className={`h-screen w-[400px] bg-gray-300 overflow-y-auto transition-all ${openMenu ? 'block' : 'hidden'}`}>
            <div className='py-2 text-center font-bold'>
                لیست چت های شما
            </div>

            <section className=''>
                {chatList && chatList.map(item => (
                    <button className='w-full bg-gray-100 hover:bg-gray-200 transition-all p-3 flex items-center gap-5 border-b' key={item.id}>
                        <Image src={item.image} width={50} height={50} alt='userImage' />
                        <div className="text-start">
                            <div className='font-bold'>{item.name}</div>
                            <div className='text-sm text-gray-400'>قسمت نمایش اخرین پیام کاربر</div>
                        </div>
                    </button>
                ))}
            </section>
        </div>
    )
}

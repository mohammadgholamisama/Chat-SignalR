import { toast } from "react-toastify";
import apiClient from "@/axios/axiosConfig";
import Cookies from 'js-cookie';

export const getLoginRespons = async (username, password) => {

    try {
        const response = await apiClient.get(`/api/Auth/login?username=${username}&password=${password}`)
        console.log('response: ', response);


        if (response.status === 200) {
            const token = response.data; // فرض کنید توکن در داده‌های پاسخ به صورت { token: '...' } قرار دارد
            Cookies.set('token', token);

            toast.success('با موفقیت وارد شدید', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.error('خطا در ورود', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        if (username === 'customer') {
            return 1
        }
        if (username === 'massor') {
            return 2
        }
    } catch (error) {
        console.error("Error during login:", error);
        toast.error('خطا در ورود', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
};
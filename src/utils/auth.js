import { http } from './http';
/**
 * 检查用户登录状态
 * @returns Promise<boolean> 返回是否已登录
 */
export const checkLoginStatus = async () => {
    try {
        const response = await http.post('/m/admin/auth/isLogin');
        console.info(response);
        if (response.code === 0 || response.code === 200) {
            return response.data.login;
        }
        return false;
    }
    catch (error) {
        console.error('检查登录状态失败:', error);
        return false;
    }
};
/**
 * 清除本地存储的用户信息
 */
export const clearUserInfo = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
};
/**
 * 获取本地存储的token
 */
export const getToken = () => {
    return localStorage.getItem('token');
};
/**
 * 获取本地存储的用户信息
 */
export const getUserInfo = () => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
        try {
            return JSON.parse(userInfoStr);
        }
        catch (error) {
            console.error('解析用户信息失败:', error);
            return null;
        }
    }
    return null;
};

/**
 * 检查用户登录状态
 * @returns Promise<boolean> 返回是否已登录
 */
export declare const checkLoginStatus: () => Promise<boolean>;
/**
 * 清除本地存储的用户信息
 */
export declare const clearUserInfo: () => void;
/**
 * 获取本地存储的token
 */
export declare const getToken: () => string | null;
/**
 * 获取本地存储的用户信息
 */
export declare const getUserInfo: () => any;

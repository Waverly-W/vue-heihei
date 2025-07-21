import { http } from './http'

// 登录状态响应接口
interface LoginStatusResp {
  login: boolean
  loginId: any
}

interface BizResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 检查用户登录状态
 * @returns Promise<boolean> 返回是否已登录
 */
export const checkLoginStatus = async (): Promise<boolean> => {
  try {
    const response: BizResponse<LoginStatusResp> = await http.post('/m/admin/auth/isLogin')
    console.info(response)
    if (response.code === 0 || response.code === 200) {
      return response.data.login
    }
    
    return false
  } catch (error) {
    console.error('检查登录状态失败:', error)
    return false
  }
}

/**
 * 清除本地存储的用户信息
 */
export const clearUserInfo = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
}

/**
 * 获取本地存储的token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

/**
 * 获取本地存储的用户信息
 */
export const getUserInfo = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr)
    } catch (error) {
      console.error('解析用户信息失败:', error)
      return null
    }
  }
  return null
}
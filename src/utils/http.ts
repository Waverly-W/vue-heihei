import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

class HttpService {
  private instance: AxiosInstance;

  constructor() {
    console.log('API Base URL:', baseURL); // 添加这行来打印基础URL
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        // 添加CORS相关头
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH'
      },
      // 添加这个配置来处理CORS
      withCredentials: false
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 在这里可以添加token等认证信息
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        // 可以统一处理响应数据
        return response.data;
      },
      (error) => {
        // 统一错误处理
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // 处理未授权错误
              break;
            case 403:
              // 处理禁止访问错误
              break;
            case 404:
              // 处理未找到错误
              break;
            case 500:
              // 处理服务器错误
              break;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // GET请求
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  // POST请求
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  // PUT请求
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  // DELETE请求
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  // PATCH请求
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }
}

export const http = new HttpService();

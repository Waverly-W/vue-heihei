import { createRouter, createWebHistory } from 'vue-router';
import { checkLoginStatus, clearUserInfo } from '../utils/auth';

// 简单的登录状态缓存
let loginStatusCache: { isLoggedIn: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30秒缓存

// 清除登录状态缓存的函数
export const clearLoginStatusCache = () => {
  loginStatusCache = null;
  console.log('登录状态缓存已清除');
};

// 导入视图组件
import HomeView from '../views/HomeView.vue'; // 首页视图
import PuzzleManagement from '../views/PuzzleManagement.vue'; // 谜题管理视图
import ReviewCenter from '../views/ReviewCenter.vue'; // 审核中心视图
import Reports from '../views/Reports.vue'; // 数据报告视图
import Settings from '../views/Settings.vue'; // 系统设置视图
import EditPuzzle from '../views/EditPuzzle.vue';
import CreatePuzzle from '../views/CreatePuzzle.vue';
import EnumManagement from '../views/EnumManagement.vue'; // 枚举管理视图
import GeneralSettings from '../views/GeneralSettings.vue'; // 通用设置视图
import UserSettings from '../views/UserSettings.vue'; // 用户设置视图
import Login from '../views/Login.vue'; // 登录视图

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '用户登录',
        requiresAuth: false // 登录页面不需要认证
      }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: '/puzzles',
      meta: {
        requiresAuth: true // 主页需要认证
      },
      children: [
        {
          path: 'puzzles',
          name: 'puzzle-management',
          component: PuzzleManagement,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'reviews',
          name: 'review-center',
          component: ReviewCenter,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'reports',
          name: 'reports',
          component: Reports,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: Settings,
          redirect: '/settings/general',
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: 'general',
              name: 'GeneralSettings',
              component: GeneralSettings,
              meta: {
                title: '通用设置',
                requiresAuth: true
              }
            },
            {
              path: 'enum-management',
              name: 'EnumManagement',
              component: EnumManagement,
              meta: {
                title: '枚举管理',
                requiresAuth: true
              }
            },
            {
              path: 'user-settings',
              name: 'UserSettings',
              component: UserSettings,
              meta: {
                title: '用户设置',
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: 'edit/:id',
          name: 'edit',
          component: EditPuzzle,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'create',
          name: 'create-puzzle',
          component: CreatePuzzle,
          meta: {
            requiresAuth: true
          }
        },
      ],
    },
  ],
});

// 路由守卫 - 检查登录状态
router.beforeEach(async (to, from, next) => {
  console.log('路由守卫检查:', to.path, '需要认证:', to.meta.requiresAuth);
  
  // 如果目标路由不需要认证，直接通过
  if (to.meta.requiresAuth === false) {
    next();
    return;
  }

  // 如果目标路由需要认证或者没有明确设置requiresAuth（默认需要认证）
  if (to.meta.requiresAuth !== false) {
    // 先检查本地是否有token
    const token = localStorage.getItem('token');
    
    if (!token) {
      // 没有token，直接跳转到登录页
      console.log('没有token，跳转到登录页面');
      clearUserInfo();
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    try {
      let isLoggedIn = false;
      
      // 检查缓存
      const now = Date.now();
      if (loginStatusCache && (now - loginStatusCache.timestamp) < CACHE_DURATION) {
        isLoggedIn = loginStatusCache.isLoggedIn;
        console.log('使用缓存的登录状态:', isLoggedIn);
      } else {
        // 缓存过期或不存在，重新检查
        isLoggedIn = await checkLoginStatus();
        loginStatusCache = { isLoggedIn, timestamp: now };
        console.log('重新检查登录状态:', isLoggedIn);
      }
      
      if (isLoggedIn) {
        // 已登录，允许访问
        console.log('用户已登录，允许访问');
        next();
      } else {
        // 服务器端未登录，清除本地存储和缓存并跳转到登录页
        console.log('服务器端未登录，跳转到登录页面');
        loginStatusCache = null;
        clearUserInfo();
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
      }
    } catch (error) {
      // 检查登录状态失败，清除缓存并跳转到登录页
      console.error('检查登录状态失败:', error);
      loginStatusCache = null;
      clearUserInfo();
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    // 默认允许访问
    next();
  }
});

export default router;

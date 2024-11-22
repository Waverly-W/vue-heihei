import { createRouter, createWebHistory } from 'vue-router';

// 导入视图组件
import HomeView from '../views/HomeView.vue'; // 首页视图
import PuzzleManagement from '../views/PuzzleManagement.vue'; // 谜题管理视图
import ReviewCenter from '../views/ReviewCenter.vue'; // 审核中心视图
import Reports from '../views/Reports.vue'; // 数据报告视图
import Settings from '../views/Settings.vue'; // 系统设置视图

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView, // 首页
    },
    {
      path: '/puzzles',
      name: 'puzzle-management',
      component: PuzzleManagement, // 谜题管理
    },
    {
      path: '/reviews',
      name: 'review-center',
      component: ReviewCenter, // 审核中心
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports, // 数据报告
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings, // 系统设置
    },
  ],
});

export default router;

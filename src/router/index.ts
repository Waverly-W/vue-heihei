import { createRouter, createWebHistory } from 'vue-router';

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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: '/puzzles',
      children: [
        {
          path: 'puzzles',
          name: 'puzzle-management',
          component: PuzzleManagement,
        },
        {
          path: 'reviews',
          name: 'review-center',
          component: ReviewCenter,
        },
        {
          path: 'reports',
          name: 'reports',
          component: Reports,
        },
        {
          path: 'settings',
          name: 'Settings',
          component: Settings,
          redirect: '/settings/general',
          children: [
            {
              path: 'general',
              name: 'GeneralSettings',
              component: GeneralSettings,
              meta: {
                title: '通用设置'
              }
            },
            {
              path: 'enum-management',
              name: 'EnumManagement',
              component: EnumManagement,
              meta: {
                title: '枚举管理'
              }
            },
            {
              path: 'user-settings',
              name: 'UserSettings',
              component: UserSettings,
              meta: {
                title: '用户设置'
              }
            }
          ]
        },
        {
          path: 'edit/:id',
          name: 'edit',
          component: EditPuzzle
        },
        {
          path: 'create',
          name: 'create-puzzle',
          component: CreatePuzzle
        },
      ],
    },
  ],
});

export default router;

<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="header-content">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
        </div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          class="nav-menu"
        >
          <a-menu-item key="puzzles">
            <template #icon><FileTextOutlined /></template>
            <router-link to="/puzzles">题目管理</router-link>
          </a-menu-item>
          <a-menu-item key="reviews">
            <template #icon><AuditOutlined /></template>
            <router-link to="/reviews">审核中心</router-link>
          </a-menu-item>
          <a-menu-item key="reports">
            <template #icon><BarChartOutlined /></template>
            <router-link to="/reports">报表统计</router-link>
          </a-menu-item>
          <a-menu-item key="settings">
            <template #icon><SettingOutlined /></template>
            <router-link to="/settings">系统设置</router-link>
          </a-menu-item>
        </a-menu>
      </div>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <div class="site-layout-content">
        <RouterView />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Vue Heihei 2024 Created by You
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  FileTextOutlined,
  AuditOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons-vue';

const selectedKeys = ref<string[]>(['puzzles']);
const route = useRoute();

const currentPage = computed(() => {
  const pathMap: { [key: string]: string } = {
    '/puzzles': '题目管理',
    '/reviews': '审核中心',
    '/reports': '报表统计',
    '/settings': '系统设置'
  };
  return pathMap[route.path] || 'Home';
});
</script>

<style scoped>
.layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.site-layout-content {
  flex: 1;
  padding: 32px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
}

.ant-layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 88px 24px 24px !important;
}

.header {
  position: fixed;
  z-index: 1;
  width: 100%;
  padding: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 24px;
}

.nav-menu {
  flex: 1;
  background: transparent;
  border-bottom: none;
  justify-content: flex-end;
}

.nav-menu :deep(.ant-menu-item) {
  padding: 0 24px;
  margin: 0 4px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-menu :deep(.ant-menu-item:hover) {
  color: #1890ff;
  transform: scale(1.05);
}

.nav-menu :deep(.ant-menu-item-selected) {
  color: #1890ff;
  font-weight: 500;
  transform: scale(1.05);
}

.nav-menu :deep(.ant-menu-item::after) {
  display: none;
}

.nav-menu :deep(.ant-menu-item a) {
  color: inherit;
  margin-left: 8px;
}

.nav-menu :deep(.anticon) {
  font-size: 16px;
  vertical-align: middle;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-menu :deep(.ant-menu-item:hover .anticon) {
  transform: scale(1.1);
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.ant-layout-footer {
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
  padding: 24px;
}

@media (max-width: 768px) {
  .ant-layout-content {
    padding: 72px 16px 16px !important;
  }

  .site-layout-content {
    padding: 16px;
  }

  .header-content {
    padding: 0 16px;
  }

  .nav-menu :deep(.ant-menu-item) {
    padding: 0 12px;
    margin: 0 2px;
  }
}
</style>

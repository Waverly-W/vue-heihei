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
        <div class="user-info">
          <a-dropdown>
            <div class="user-avatar-wrapper">
              <a-avatar v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" />
              <a-avatar v-else style="color: #f56a00; background-color: #fde3cf">
                {{ avatarChar }}
              </a-avatar>
              <span>{{ displayName }}</span>
              <DownOutlined />
            </div>
            <template #overlay>
              <a-menu @click="handleUserMenuClick">
                <a-menu-item key="settings">
                  <template #icon>
                    <SettingOutlined />
                  </template>
                  用户设置
                </a-menu-item>
                <a-menu-item key="logout" danger>
                  <template #icon>
                    <LogoutOutlined />
                  </template>
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  FileTextOutlined,
  AuditOutlined,
  BarChartOutlined,
  SettingOutlined,
  DownOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { clearUserInfo } from '../utils/auth';
import { http } from '../utils/http';

const route = useRoute();
const router = useRouter();

// 用户信息
const userInfo = ref({
  nickname: '',
  avatarUrl: '',
  role: '',
  level: 0
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await http.post('/m/admin/auth/userInfo');
    if (response.code === 0 || response.code === 200) {
      userInfo.value = response.data;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

// 获取用户显示名称
const displayName = computed(() => {
  return userInfo.value.nickname || '管理员';
});

// 获取头像字符
const avatarChar = computed(() => {
  const name = userInfo.value.nickname || '管理员';
  return name.charAt(0).toUpperCase();
});

// 根据当前路由计算激活的菜单项
const selectedKeys = computed(() => {
  const path = route.path;
  
  if (path.startsWith('/puzzles')) {
    return ['puzzles'];
  } else if (path.startsWith('/reviews')) {
    return ['reviews'];
  } else if (path.startsWith('/reports')) {
    return ['reports'];
  } else if (path.startsWith('/settings')) {
    return ['settings'];
  }
  
  return ['puzzles'];
});

// 处理用户菜单点击
const handleUserMenuClick = ({ key }: { key: string }) => {
  if (key === 'settings') {
    router.push('/settings/user-settings')
  } else if (key === 'logout') {
    clearUserInfo()
    message.success('已退出登录')
    router.push('/login')
  }
};

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo();
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

.user-info {
  margin-left: 24px;
}

.user-avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
  color: rgba(0, 0, 0, 0.85);
}

.user-avatar-wrapper:hover {
  background-color: rgba(0, 0, 0, 0.04);
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
  
  .user-info {
    margin-left: 16px;
  }
  
  .user-avatar-wrapper span {
    display: none;
  }
}
</style>



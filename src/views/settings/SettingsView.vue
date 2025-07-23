<template>
  <div class="settings-container">
    <a-row :gutter="16">
      <a-col :span="4">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          style="height: 100%"
          @select="handleMenuSelect"
        >
          <a-menu-item key="general">
            <template #icon>
              <SettingOutlined />
            </template>
            通用设置
          </a-menu-item>
          <a-menu-item key="user-settings">
            <template #icon>
              <UserOutlined />
            </template>
            用户设置
          </a-menu-item>
          <a-menu-item key="enum">
            <template #icon>
              <OrderedListOutlined />
            </template>
            枚举管理
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col :span="20">
        <router-view></router-view>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { SettingOutlined, OrderedListOutlined, UserOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 根据当前路由计算激活的菜单项
const selectedKeys = computed(() => {
  const path = route.path
  if (path.includes('enum-management')) {
    return ['enum']
  } else if (path.includes('user-settings')) {
    return ['user-settings']
  } else {
    return ['general']
  }
})

// 处理菜单选择
const handleMenuSelect = ({ key }: { key: string }) => {
  if (key === 'enum') {
    router.push('/settings/enum-management')
  } else if (key === 'user-settings') {
    router.push('/settings/user-settings')
  } else {
    router.push('/settings/general')
  }
}
</script>

<style scoped>
.settings-container {
  padding: 24px;
}
</style>

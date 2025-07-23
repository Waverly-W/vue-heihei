<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>{{ isLogin ? '用户登录' : '用户注册' }}</h2>
      </div>
      
      <a-form
        :model="formData"
        :rules="rules"
        @finish="handleSubmit"
        layout="vertical"
        class="login-form"
      >
        <a-form-item label="登录标识" name="openid">
          <a-input
            v-model:value="formData.openid"
            placeholder="请输入登录标识"
            size="large"
          />
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="formData.password"
            placeholder="请输入密码"
            size="large"
          />
        </a-form-item>

        <template v-if="!isLogin">
          <a-form-item label="用户昵称" name="nickname">
            <a-input
              v-model:value="formData.nickname"
              placeholder="请输入用户昵称"
              size="large"
            />
          </a-form-item>

          <a-form-item label="头像URL" name="avatarUrl">
            <a-input
              v-model:value="formData.avatarUrl"
              placeholder="请输入头像URL（可选）"
              size="large"
            />
          </a-form-item>
        </template>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
          >
            {{ isLogin ? '登录' : '注册' }}
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login-footer">
        <a-button type="link" @click="toggleMode">
          {{ isLogin ? '没有账号？立即注册' : '已有账号？立即登录' }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import { http } from '../../utils/http'
import { clearLoginStatusCache } from '../../router/index'

const router = useRouter()
const route = useRoute()

// 表单模式切换
const isLogin = ref(true)

// 加载状态
const loading = ref(false)

// 表单数据
const formData = reactive({
  openid: '',
  password: '',
  nickname: '',
  avatarUrl: ''
})

// 表单验证规则
const rules = {
  openid: [
    { required: true, message: '请输入登录标识', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  nickname: [
    { required: !isLogin.value, message: '请输入用户昵称', trigger: 'blur' }
  ]
}

// 切换登录/注册模式
const toggleMode = () => {
  isLogin.value = !isLogin.value
  // 清空表单数据
  Object.keys(formData).forEach(key => {
    formData[key as keyof typeof formData] = ''
  })
}

// 处理表单提交
const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (isLogin.value) {
      // 登录逻辑
      await handleLogin()
    } else {
      // 注册逻辑
      await handleRegister()
    }
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理登录
const handleLogin = async () => {
  try {
    const payload = {
      openid: formData.openid,
      password: formData.password
    }
    
    console.log('发送登录请求:', payload)
    const response = await http.post('/m/admin/auth/login', payload)
    console.log('登录响应数据:', response)
    
    if (response.code === 200 || response.code === 0) {
      const { token, nickname, avatarUrl, role } = response.data
      
      // 存储用户信息到本地存储
      localStorage.setItem('token', token)
      localStorage.setItem('userInfo', JSON.stringify({
        nickname,
        avatarUrl,
        role,
        openid: formData.openid
      }))
      
      console.log('用户信息已存储到本地')
      
      // 清除登录状态缓存，确保路由守卫重新检查
      clearLoginStatusCache()
      
      message.success('登录成功')
      
      // 获取重定向路径，如果没有则跳转到主页
      const redirectPath = route.query.redirect as string || '/'
      console.log('当前路由查询参数:', route.query)
      console.log('准备跳转到:', redirectPath)
      
      // 直接跳转，不需要延迟
      try {
        await router.push(redirectPath)
        console.log('跳转完成到:', redirectPath)
      } catch (routerError) {
        console.error('路由跳转失败:', routerError)
        // 如果跳转失败，尝试跳转到主页
        try {
          await router.push('/')
          console.log('跳转到主页成功')
        } catch (homeError) {
          console.error('跳转到主页也失败:', homeError)
          // 强制刷新页面
          window.location.href = '/'
        }
      }
    } else {
      message.error(response.message || '登录失败')
    }
  } catch (error: any) {
    console.error('登录错误:', error)
    message.error(error.response?.data?.message || '登录失败，请检查网络连接')
  }
}

// 处理注册
const handleRegister = async () => {
  try {
    const payload = {
      openid: formData.openid,
      password: formData.password,
      nickname: formData.nickname,
      avatarUrl: formData.avatarUrl
    }
    
    const response = await http.post('/m/admin/auth/register', payload)
    console.log('注册响应数据:', response)
    
    if (response.code === 200 || response.code === 0) {
      message.success('注册成功，请登录')
      // 切换到登录模式
      isLogin.value = true
      // 保留openid和password，清空其他字段
      const { openid, password } = formData
      Object.keys(formData).forEach(key => {
        formData[key as keyof typeof formData] = ''
      })
      formData.openid = openid
      formData.password = password
    } else {
      message.error(response.message || '注册失败')
    }
  } catch (error: any) {
    console.error('注册错误:', error)
    message.error(error.response?.data?.message || '注册失败，请检查网络连接')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.login-form {
  margin-bottom: 20px;
}

.login-footer {
  text-align: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #333;
}

:deep(.ant-input-affix-wrapper),
:deep(.ant-input) {
  border-radius: 8px;
}

:deep(.ant-btn-primary) {
  border-radius: 8px;
  height: 45px;
  font-size: 16px;
  font-weight: 500;
}

:deep(.ant-btn-link) {
  color: #667eea;
  font-weight: 500;
}

:deep(.ant-btn-link:hover) {
  color: #764ba2;
}
</style>
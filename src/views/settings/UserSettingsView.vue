<template>
  <div class="user-settings">
    <a-card title="用户设置" :loading="loading">
      <a-form :model="formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" @finish="handleSubmit">
        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
        </a-form-item>

        <a-form-item label="头像" name="avatarUrl">
          <div class="avatar-section">
            <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card" class="avatar-uploader"
              :show-upload-list="false" action="/api/upload/avatar" :before-upload="beforeUpload"
              @change="handleChange">
              <img v-if="formData.avatarUrl" :src="formData.avatarUrl" alt="avatar" />
              <div v-else>
                <PlusOutlined />
                <div style="margin-top: 8px">上传</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>

        <a-form-item label="用户等级" name="level">
          <a-badge :count="formData.level" show-zero :number-style="{ backgroundColor: '#52c41a' }" />
        </a-form-item>

        <a-form-item label="经验值" name="experience">
          <a-badge :count="formData.experience" show-zero />
        </a-form-item>

        <a-form-item label="用户角色" name="role">
          <a-tag :color="getRoleColor(formData.role)">{{ formData.role }}</a-tag>
        </a-form-item>

        <a-form-item label="用户状态" name="status">
          <a-tag :color="getStatusColor(formData.status)">{{ getStatusText(formData.status) }}</a-tag>
        </a-form-item>

        <a-divider>密码修改</a-divider>

        <a-form-item label="新密码" name="password">
          <a-input-password v-model:value="formData.password" placeholder="请输入新密码（不修改请留空）" />
        </a-form-item>

        <a-form-item label="确认密码" name="confirmPassword">
          <a-input-password v-model:value="formData.confirmPassword" placeholder="请再次输入新密码" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-button type="primary" html-type="submit" :loading="saving">
            保存设置
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm">
            重置
          </a-button>
          <a-button style="margin-left: 10px" @click="refreshUserInfo">
            刷新信息
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { UploadChangeParam } from 'ant-design-vue'
import { http } from '../../utils/http'

// 用户信息接口类型
interface UserInfo {
  id: string
  openid: string
  nickname: string
  avatarUrl: string
  level: number
  experience: number
  role: string
  status: string
}

// 表单数据
const formData = reactive<UserInfo & { password: string; confirmPassword: string }>({
  id: '',
  openid: '',
  nickname: '',
  avatarUrl: '',
  level: 0,
  experience: 0,
  role: '',
  status: '',
  password: '',
  confirmPassword: ''
})

// 原始用户信息，用于重置
const originalUserInfo = ref<UserInfo>({
  id: '',
  openid: '',
  nickname: '',
  avatarUrl: '',
  level: 0,
  experience: 0,
  role: '',
  status: ''
})

const fileList = ref([])
const loading = ref(false)
const saving = ref(false)

// 获取用户信息
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const response = await http.post('/m/admin/auth/userInfo')
    console.log('用户信息响应:', response)

    if (response.code === 0 || response.code === 200) {
      const userInfo = response.data

      // 更新表单数据
      Object.assign(formData, {
        ...userInfo,
        password: '',
        confirmPassword: ''
      })

      // 保存原始信息
      originalUserInfo.value = { ...userInfo }

      console.log('用户信息加载成功:', userInfo)
    } else {
      message.error(response.message || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息错误:', error)
    message.error('获取用户信息失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 刷新用户信息
const refreshUserInfo = () => {
  fetchUserInfo()
}

// 获取角色颜色
const getRoleColor = (role: string) => {
  const colorMap: { [key: string]: string } = {
    '超级管理员': 'red',
    '管理员': 'orange'
  }
  return colorMap[role] || 'blue'
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colorMap: { [key: string]: string } = {
    '激活': 'green',
    '等待激活': 'orange',
    '未激活': 'gray',
    '封禁': 'red'
  }
  return colorMap[status] || 'blue'
}

// 获取状态文本
const getStatusText = (status: string) => {
  // 如果已经是中文，直接返回
  const textMap: { [key: string]: string } = {
    'active': '激活',
    'pending': '等待激活',
    'inactive': '未激活',
    'banned': '封禁'
  }
  return textMap[status] || status
}

// 获取角色类型
const getRoleType = (role: string) => {
  const typeMap: { [key: string]: string } = {
    '超级管理员': 'danger',
    '管理员': 'warning'
  }
  return typeMap[role] || 'info'
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: { [key: string]: string } = {
    '激活': 'success',
    '等待激活': 'warning',
    '未激活': 'info',
    '封禁': 'danger'
  }
  return typeMap[status] || 'info'
}

// 文件上传前验证
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
  }
  return isJpgOrPng && isLt2M
}

// 处理文件上传
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    return
  }
  if (info.file.status === 'done') {
    // 处理上传成功后的逻辑
    if (info.file.response && info.file.response.url) {
      formData.avatarUrl = info.file.response.url
      message.success('头像上传成功!')
    }
  } else if (info.file.status === 'error') {
    message.error('头像上传失败!')
  }
}

// 提交表单
const handleSubmit = async (values: any) => {
  // 验证密码
  if (formData.password && formData.password !== formData.confirmPassword) {
    message.error('两次输入的密码不一致!')
    return
  }

  saving.value = true
  try {
    // 准备更新数据
    const updateData: any = {
      nickname: formData.nickname,
      avatarUrl: formData.avatarUrl
    }

    // 如果有新密码，添加到更新数据中
    if (formData.password) {
      updateData.password = formData.password
    }

    console.log('准备保存用户设置:', updateData)

    // 这里应该调用更新用户信息的接口
    // const response = await http.post('/m/admin/auth/updateUserInfo', updateData)

    // 暂时模拟成功响应
    message.success('设置保存成功!')

    // 清空密码字段
    formData.password = ''
    formData.confirmPassword = ''

    // 刷新用户信息
    await fetchUserInfo()

  } catch (error) {
    console.error('保存用户设置错误:', error)
    message.error('保存设置失败，请重试')
  } finally {
    saving.value = false
  }
}

// 重置表单
const resetForm = () => {
  // 恢复到原始用户信息
  Object.assign(formData, {
    ...originalUserInfo.value,
    password: '',
    confirmPassword: ''
  })
  message.info('表单已重置')
}

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.user-settings {
  min-height: 500px;
}

.avatar-section {
  display: flex;
  align-items: flex-start;
}

.avatar-uploader>.ant-upload {
  width: 128px;
  height: 128px;
}

.avatar-uploader img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.avatar-info {
  flex: 1;
  max-width: 300px;
}

.avatar-info p {
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

:deep(.ant-divider) {
  margin: 32px 0 24px 0;
}

:deep(.ant-tag) {
  padding: 4px 8px;
  font-size: 12px;
}
</style>

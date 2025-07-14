<template>
  <div class="user-settings">
    <a-card title="用户设置">
      <a-form
        :model="formData"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        @finish="handleSubmit"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formData.username" placeholder="请输入用户名" />
        </a-form-item>
        
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formData.email" placeholder="请输入邮箱地址" />
        </a-form-item>
        
        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
        </a-form-item>
        
        <a-form-item label="头像" name="avatar">
          <a-upload
            v-model:file-list="fileList"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <PlusOutlined />
              <div style="margin-top: 8px">上传</div>
            </div>
          </a-upload>
        </a-form-item>
        
        <a-form-item label="修改密码" name="password">
          <a-input-password v-model:value="formData.password" placeholder="请输入新密码" />
        </a-form-item>
        
        <a-form-item label="确认密码" name="confirmPassword">
          <a-input-password v-model:value="formData.confirmPassword" placeholder="请再次输入新密码" />
        </a-form-item>
        
        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-button type="primary" html-type="submit">
            保存设置
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'

const formData = reactive({
  username: 'admin',
  email: 'admin@example.com',
  nickname: '管理员',
  password: '',
  confirmPassword: ''
})

const fileList = ref([])
const imageUrl = ref('')

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

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    return
  }
  if (info.file.status === 'done') {
    // 这里应该处理上传成功后的逻辑
    imageUrl.value = info.file.response.url
    message.success('头像上传成功!')
  }
}

const handleSubmit = (values: any) => {
  if (formData.password && formData.password !== formData.confirmPassword) {
    message.error('两次输入的密码不一致!')
    return
  }
  
  // 这里可以添加保存用户设置的逻辑
  console.log('保存用户设置:', values)
  message.success('设置保存成功!')
}

const resetForm = () => {
  formData.username = 'admin'
  formData.email = 'admin@example.com'
  formData.nickname = '管理员'
  formData.password = ''
  formData.confirmPassword = ''
  message.info('表单已重置')
}
</script>

<style scoped>
.user-settings {
  min-height: 500px;
}

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style> 
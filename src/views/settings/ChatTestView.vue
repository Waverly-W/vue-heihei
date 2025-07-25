<template>
  <div class="chat-test-container">
    <div class="chat-app">
      <!-- 侧边栏：对话列表 -->
      <div class="sidebar">
        <a-button
          type="primary"
          block
          class="new-chat-btn"
          @click="createNewConversation"
          :loading="isCreatingConversation"
        >
          <template #icon>
            <PlusOutlined />
          </template>
          新建对话
        </a-button>

        <div class="conversation-list">
          <div
            v-for="conversation in conversations"
            :key="conversation.id"
            class="conversation-item"
            :class="{ active: conversation.id === currentConversationId }"
            @click="selectConversation(conversation.id)"
          >
            <div class="conversation-title">{{ conversation.title }}</div>
            <div class="conversation-meta">
              {{ conversation.messageCount }} 条消息 ·
              {{ formatDate(conversation.updatedAt) }}
            </div>
          </div>

          <a-empty
            v-if="conversations.length === 0 && !isLoadingConversations"
            description="暂无对话记录"
            :image="Empty.PRESENTED_IMAGE_SIMPLE"
          />
        </div>
      </div>

      <!-- 主聊天区域 -->
      <div class="chat-main">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <h3 class="conversation-title">
            {{ currentConversation?.title || '选择或创建对话' }}
          </h3>
          <div class="chat-actions">
            <a-button
              size="small"
              @click="exportConversation"
              :disabled="!currentConversationId"
            >
              <template #icon>
                <ExportOutlined />
              </template>
              导出
            </a-button>
            <a-button
              size="small"
              danger
              @click="deleteConversation"
              :disabled="!currentConversationId"
            >
              <template #icon>
                <DeleteOutlined />
              </template>
              删除
            </a-button>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="message-list" ref="messageListRef">
          <div
            v-for="message in currentMessages"
            :key="message.id"
            class="message"
            :class="`message-${message.role}`"
          >
            <div class="message-header">
              <span class="message-role">
                <UserOutlined v-if="message.role === 'user'" />
                <RobotOutlined v-else-if="message.role === 'assistant'" />
                <SettingOutlined v-else />
                {{ getRoleName(message.role) }}
              </span>
              <span class="message-time">{{ formatTime(message.createdAt) }}</span>
            </div>
            <div class="message-content" v-html="formatContent(message.content)"></div>
            <div v-if="message.status === 'PENDING'" class="message-loading">
              <a-spin size="small" /> 正在输入...
            </div>
          </div>

          <div v-if="!currentConversationId" class="welcome-message">
            <a-empty description="请选择或创建一个对话开始聊天" />
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-controls">
            <a-checkbox v-model:checked="useStreamMode">
              流式响应
            </a-checkbox>
            <a-select
              v-model:value="chatType"
              style="width: 120px; margin-left: 12px;"
              size="small"
            >
              <a-select-option value="GENERAL_CHAT">通用对话</a-select-option>
              <a-select-option value="GAME_CHAT">游戏对话</a-select-option>
            </a-select>
          </div>

          <div class="input-box">
            <a-textarea
              v-model:value="messageInput"
              placeholder="输入消息..."
              :rows="3"
              :disabled="isLoading"
              @keypress="handleKeyPress"
            />
            <a-button
              type="primary"
              @click="sendMessage"
              :loading="isLoading"
              :disabled="!messageInput.trim()"
            >
              <template #icon>
                <SendOutlined />
              </template>
              发送
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { message, Empty } from 'ant-design-vue'
import {
  PlusOutlined,
  ExportOutlined,
  DeleteOutlined,
  UserOutlined,
  RobotOutlined,
  SettingOutlined,
  SendOutlined
} from '@ant-design/icons-vue'
import { http } from '@/utils/http'
import { fetchEventSource } from '@microsoft/fetch-event-source'

// 接口类型定义
interface ChatMessage {
  id: string
  conversationId: string
  role: 'system' | 'user' | 'assistant'
  content: string
  sequence: number
  createdAt: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  responseTime?: number
  errorMessage?: string
}

interface Conversation {
  id: string
  userId: string
  title: string
  type: string
  status: string
  model: string
  systemPrompt: string
  createdAt: string
  updatedAt: string
  messageCount: number
  lastMessageAt: string
  messages: ChatMessage[]
}

interface AiChatResponse {
  conversationId: string
  userMessageId: string
  assistantMessageId: string
  content: string
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL'
  errorMessage?: string
  responseTime: number
  isLast: boolean
  sequence: number
}

// 响应式数据
const conversations = ref<Conversation[]>([])
const currentConversationId = ref<string | null>(null)
const currentConversation = ref<Conversation | null>(null)
const currentMessages = ref<ChatMessage[]>([])
const messageInput = ref('')
const useStreamMode = ref(false)
const chatType = ref<'GENERAL_CHAT' | 'GAME_CHAT'>('GENERAL_CHAT')
const isLoading = ref(false)
const isCreatingConversation = ref(false)
const isLoadingConversations = ref(false)
const messageListRef = ref<HTMLElement>()

// 用户ID（从本地存储或认证系统获取）
const userId = ref('user-' + Date.now())

// 组件挂载时初始化
onMounted(() => {
  loadConversations()
})

// 加载对话列表
const loadConversations = async () => {
  try {
    isLoadingConversations.value = true
    const response = await http.get('/ai/chat/conversations', {
      params: {
        userId: userId.value,
        pageNum: 1,
        pageSize: 50
      }
    })

    if (response.code === 200) {
      conversations.value = response.data.rows
    } else {
      const errorMessage = response.message || '服务器返回错误'
      message.error('加载对话列表失败: ' + errorMessage)
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || '网络请求失败'
    message.error('加载对话列表失败: ' + errorMessage)
  } finally {
    isLoadingConversations.value = false
  }
}

// 创建新对话
const createNewConversation = async () => {
  try {
    isCreatingConversation.value = true
    const response = await http.post('/ai/chat/conversation', {
      userId: userId.value,
      type: chatType.value,
      title: '新对话',
      systemPrompt: '你是一个友善、有帮助的AI助手。请用中文回答用户的问题，保持礼貌和专业。'
    })

    if (response.code === 200) {
      const newConversation = response.data
      conversations.value.unshift(newConversation)
      selectConversation(newConversation.id)
      message.success('创建对话成功')
    } else {
      const errorMessage = response.message || '服务器返回错误'
      message.error('创建对话失败: ' + errorMessage)
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || '网络请求失败'
    message.error('创建对话失败: ' + errorMessage)
  } finally {
    isCreatingConversation.value = false
  }
}

// 选择对话
const selectConversation = async (conversationId: string) => {
  try {
    const response = await http.get(`/ai/chat/conversation/${conversationId}`)

    if (response.code === 200) {
      currentConversationId.value = conversationId
      currentConversation.value = response.data
      currentMessages.value = response.data.messages || []

      // 滚动到底部
      await nextTick()
      scrollToBottom()
    } else {
      const errorMessage = response.message || '服务器返回错误'
      message.error('加载对话失败: ' + errorMessage)
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || '网络请求失败'
    message.error('加载对话失败: ' + errorMessage)
  }
}

// 发送消息
const sendMessage = async () => {
  const content = messageInput.value.trim()
  if (!content || isLoading.value) return

  const tempMessage = content
  isLoading.value = true

  // 添加用户消息到界面
  addMessageToUI('user', tempMessage)

  try {
    if (useStreamMode.value) {
      await sendStreamMessage(tempMessage)
    } else {
      await sendNormalMessage(tempMessage)
    }
    // 只有在成功发送后才清空输入框
    messageInput.value = ''
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message || '未知错误'
    message.error('发送消息失败: ' + errorMessage)
  } finally {
    isLoading.value = false
  }
}

// 发送普通消息
const sendNormalMessage = async (content: string) => {
  try {
    const response = await http.post('/ai/chat/send', {
      conversationId: currentConversationId.value,
      userId: userId.value,
      message: content,
      type: chatType.value,
      stream: false
    })

    if (response.code === 200) {
      const data = response.data as AiChatResponse
      currentConversationId.value = data.conversationId

      // 添加AI回复到界面
      addMessageToUI('assistant', data.content)

      // 更新对话列表
      await loadConversations()
    } else {
      const errorMessage = response.message || '服务器返回错误'
      throw new Error(errorMessage)
    }
  } catch (error: any) {
    // 重新抛出错误，保持错误信息
    if (error.response?.data?.message) {
      throw new Error(error.response.message)
    } else if (error.message) {
      throw error
    } else {
      throw new Error('网络请求失败')
    }
  }
}

// 发送流式消息
const sendStreamMessage = async (content: string) => {
  try {
    // 创建AI消息占位符
    addMessageToUI('assistant', '', 'PENDING')
    const assistantMessageIndex = currentMessages.value.length - 1
    let fullContent = ''

    // 创建中止控制器
    const controller = new AbortController()

    await fetchEventSource('/api/ai/chat/send/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationId: currentConversationId.value,
        userId: userId.value,
        message: content,
        type: chatType.value,
        stream: true
      }),
      signal: controller.signal,

      // 连接打开时的回调
      onopen: async (response) => {
        console.log('SSE connection opened:', response.status)
        if (response.ok) {
          return // 连接成功
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          // 客户端错误，不重试
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        } else {
          // 服务器错误，可能重试
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      },

      // 接收到消息时的回调
      onmessage: async (event) => {
        console.log('Received SSE message:', event.data)

        try {
          const data = JSON.parse(event.data) as AiChatResponse
          console.log('Parsed SSE data:', data)

          // 累积内容
          fullContent += data.content
          console.log('Updated fullContent:', fullContent)

          // 实时更新消息内容
          if (assistantMessageIndex >= 0 && currentMessages.value[assistantMessageIndex]) {
            currentMessages.value[assistantMessageIndex].content = fullContent
            currentMessages.value[assistantMessageIndex].status = 'SUCCESS'
            console.log('Updated message at index:', assistantMessageIndex)

            // 实时滚动到底部
            await nextTick()
            scrollToBottom()
          }

          // 更新对话ID
          if (data.conversationId) {
            currentConversationId.value = data.conversationId
          }

          // 检查是否是最后一条消息
          if (data.isLast) {
            console.log('Stream completed, updating conversations')
            // 更新对话列表
            await loadConversations()
          }
        } catch (e) {
          console.error('Parse SSE message error:', e, 'Event data:', event.data)
        }
      },

      // 连接关闭时的回调
      onclose: () => {
        console.log('SSE connection closed')
      },

      // 发生错误时的回调
      onerror: (error) => {
        console.error('SSE error:', error)
        throw error
      }
    })
  } catch (error: any) {
    console.error('Stream message error:', error)
    // 重新抛出错误，保持错误信息
    if (error.message) {
      throw error
    } else {
      throw new Error('流式请求失败')
    }
  }
}

// 添加消息到UI
const addMessageToUI = (role: 'user' | 'assistant' | 'system', content: string, status: 'PENDING' | 'SUCCESS' | 'FAILED' = 'SUCCESS') => {
  const message: ChatMessage = {
    id: 'temp-' + Date.now(),
    conversationId: currentConversationId.value || '',
    role,
    content,
    sequence: currentMessages.value.length + 1,
    createdAt: new Date().toISOString(),
    status
  }

  currentMessages.value.push(message)

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })

  return message
}

// 滚动到底部
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

// 删除对话
const deleteConversation = async () => {
  if (!currentConversationId.value) return

  try {
    const response = await http.delete(`/ai/chat/conversation/${currentConversationId.value}`, {
      params: { userId: userId.value }
    })

    if (response.code === 200) {
      // 从列表中移除
      conversations.value = conversations.value.filter(c => c.id !== currentConversationId.value)

      // 清空当前对话
      currentConversationId.value = null
      currentConversation.value = null
      currentMessages.value = []

      message.success('删除对话成功')
    } else {
      const errorMessage = response.message || '服务器返回错误'
      message.error('删除对话失败: ' + errorMessage)
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || '网络请求失败'
    message.error('删除对话失败: ' + errorMessage)
  }
}

// 导出对话
const exportConversation = () => {
  if (!currentConversation.value || currentMessages.value.length === 0) {
    message.warning('没有可导出的消息')
    return
  }

  const content = currentMessages.value.map(msg => {
    const time = formatTime(msg.createdAt)
    const role = getRoleName(msg.role)
    return `[${time}] ${role}: ${msg.content}`
  }).join('\n\n')

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${currentConversation.value.title}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  message.success('导出成功')
}

// 键盘事件处理
const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 格式化时间
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取角色名称
const getRoleName = (role: string) => {
  const roleNames: Record<string, string> = {
    'user': '用户',
    'assistant': 'AI助手',
    'system': '系统'
  }
  return roleNames[role] || role
}

// 格式化消息内容
const formatContent = (content: string) => {
  return content
    .replace(/\n/g, '<br>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}
</script>

<style scoped>
.chat-test-container {
  padding: 0;
  height: calc(100vh - 120px);
}

.chat-app {
  display: flex;
  height: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

/* 侧边栏样式 */
.sidebar {
  width: 300px;
  min-width: 300px;
  max-width: 300px;
  background: #fafafa;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.new-chat-btn {
  margin: 16px;
  margin-bottom: 8px;
  height: 40px;
  width: calc(100% - 32px);
  max-width: calc(100% - 32px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  box-sizing: border-box;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.new-chat-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px 16px;
  box-sizing: border-box;
}

.conversation-item {
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #e8e8e8;
  transition: all 0.2s;
}

.conversation-item:hover {
  background: #f0f0f0;
  border-color: #d9d9d9;
}

.conversation-item.active {
  background: #e6f7ff;
  border-color: #1890ff;
}

.conversation-title {
  font-weight: 500;
  margin-bottom: 4px;
  color: #262626;
}

.conversation-meta {
  font-size: 12px;
  color: #8c8c8c;
}

/* 主聊天区域样式 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.chat-header .conversation-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

/* 消息列表样式 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #ffffff;
}

.message {
  margin-bottom: 20px;
  max-width: 80%;
  display: flex;
  flex-direction: column;
}

.message-user {
  margin-left: auto;
  align-items: flex-end;
}

.message-assistant {
  margin-right: auto;
  align-items: flex-start;
}

.message-system {
  margin: 0 auto;
  max-width: 60%;
  align-items: center;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #8c8c8c;
}

.message-role {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-user .message-content {
  background: #1890ff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-assistant .message-content {
  background: #f6f6f6;
  color: #262626;
  border: 1px solid #e8e8e8;
  border-bottom-left-radius: 4px;
}

.message-system .message-content {
  background: #fff7e6;
  color: #d46b08;
  border: 1px solid #ffd591;
  text-align: center;
  font-style: italic;
}

.message-loading {
  margin-top: 8px;
  font-size: 12px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  gap: 8px;
}

.welcome-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 输入区域样式 */
.input-area {
  padding: 20px;
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
}

.input-controls {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.input-box {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-box :deep(.ant-input) {
  border-radius: 8px;
  resize: vertical;
  min-height: 60px;
  flex: 1;
}

.input-box .ant-btn {
  height: 60px;
  padding: 0 24px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 280px;
    min-width: 280px;
    max-width: 280px;
  }

  .new-chat-btn {
    margin: 12px;
    margin-bottom: 6px;
    width: calc(100% - 24px);
    max-width: calc(100% - 24px);
    height: 36px;
    font-size: 13px;
  }

  .conversation-list {
    padding: 6px 12px 12px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 260px;
    min-width: 260px;
    max-width: 260px;
  }

  .new-chat-btn {
    margin: 10px;
    margin-bottom: 5px;
    width: calc(100% - 20px);
    max-width: calc(100% - 20px);
    height: 34px;
    font-size: 12px;
  }

  .conversation-list {
    padding: 5px 10px 10px;
  }
}
</style>

# AI对话前端开发接口文档

## 📋 概述

本文档为前端开发者提供完整的AI对话功能实现指南，包括所有API接口、数据结构、交互流程和最佳实践。基于此文档，前端可以构建一个功能完整、体验流畅的AI对话页面。

## 🌐 基础配置

### API基础信息
- **基础URL**: `http://localhost:8080`
- **内容类型**: `application/json`
- **字符编码**: `UTF-8`
- **认证方式**: 当前版本无需认证（测试环境）

### 响应格式
所有接口都返回统一的响应格式：
```typescript
interface ApiResponse<T> {
  code: number;        // 状态码：200成功，其他为错误
  message: string;     // 响应消息
  data: T;            // 响应数据
}
```

## 📡 核心API接口

### 1. 创建对话会话
**接口**: `POST /api/ai/chat/conversation`

**请求参数**:
```typescript
interface CreateConversationRequest {
  userId: string;          // 必填，用户ID
  type: 'GENERAL_CHAT' | 'GAME_CHAT';  // 必填，对话类型
  title?: string;          // 可选，对话标题
  systemPrompt?: string;   // 可选，系统提示词
  gameRecordId?: string;   // 可选，游戏记录ID（游戏对话时使用）
}
```

**响应数据**:
```typescript
interface ConversationResponse {
  id: string;              // 对话会话ID
  userId: string;          // 用户ID
  title: string;           // 对话标题
  type: string;            // 对话类型
  gameRecordId?: string;   // 游戏记录ID
  status: string;          // 对话状态：ACTIVE, ARCHIVED, DELETED
  model: string;           // AI模型
  systemPrompt: string;    // 系统提示词
  createdAt: string;       // 创建时间
  updatedAt: string;       // 更新时间
  messageCount: number;    // 消息总数
  lastMessageAt: string;   // 最后消息时间
  messages: ChatMessageResponse[];  // 消息列表
}
```

**使用示例**:
```javascript
async function createConversation(userId, type, title) {
  const response = await fetch('/api/ai/chat/conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      type,
      title: title || '新对话'
    })
  });
  
  const result = await response.json();
  if (result.code === 200) {
    return result.data;
  } else {
    throw new Error(result.message);
  }
}
```

### 2. 发送消息（普通模式）
**接口**: `POST /api/ai/chat/send`

**请求参数**:
```typescript
interface AiChatRequest {
  conversationId?: string;  // 可选，对话会话ID，为空则创建新会话
  userId: string;           // 必填，用户ID
  message: string;          // 必填，用户消息内容
  type: 'GENERAL_CHAT' | 'GAME_CHAT';  // 必填，对话类型
  gameRecordId?: string;    // 可选，游戏记录ID
  stream?: boolean;         // 可选，是否流式响应
  model?: string;           // 可选，AI模型
  systemPrompt?: string;    // 可选，系统提示词
  title?: string;           // 可选，对话标题
  contextLimit?: number;    // 可选，上下文消息数量限制
}
```

**响应数据**:
```typescript
interface AiChatResponse {
  conversationId: string;      // 对话会话ID
  userMessageId: string;       // 用户消息ID
  assistantMessageId: string;  // AI回复消息ID
  content: string;             // AI回复内容
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';  // 响应状态
  errorMessage?: string;       // 错误信息
  responseTime: number;        // 响应时间（毫秒）
  isLast: boolean;            // 是否为最后一块数据
  sequence: number;           // 消息序号
}
```

**使用示例**:
```javascript
async function sendMessage(conversationId, userId, message, type) {
  const response = await fetch('/api/ai/chat/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      conversationId,
      userId,
      message,
      type,
      stream: false
    })
  });
  
  const result = await response.json();
  if (result.code === 200) {
    return result.data;
  } else {
    throw new Error(result.message);
  }
}
```

### 3. 发送消息（流式模式）
**接口**: `POST /api/ai/chat/send/stream`

**请求参数**: 同普通模式

**响应格式**: Server-Sent Events (text/event-stream)

**使用示例**:
```javascript
function sendMessageStream(conversationId, userId, message, type, onMessage, onComplete, onError) {
  const requestBody = {
    conversationId,
    userId,
    message,
    type,
    stream: true
  };

  fetch('/api/ai/chat/send/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    function readStream() {
      return reader.read().then(({ done, value }) => {
        if (done) {
          onComplete();
          return;
        }
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              onMessage(data);
              
              if (data.isLast) {
                onComplete();
                return;
              }
            } catch (e) {
              console.error('解析SSE数据失败:', e);
            }
          }
        }
        
        return readStream();
      });
    }
    
    return readStream();
  })
  .catch(error => {
    onError(error);
  });
}
```

### 4. 获取对话会话详情
**接口**: `GET /api/ai/chat/conversation/{conversationId}`

**使用示例**:
```javascript
async function getConversation(conversationId) {
  const response = await fetch(`/api/ai/chat/conversation/${conversationId}`);
  const result = await response.json();
  
  if (result.code === 200) {
    return result.data;
  } else {
    throw new Error(result.message);
  }
}
```

### 5. 获取用户对话列表
**接口**: `GET /api/ai/chat/conversations`

**查询参数**:
```typescript
interface ConversationListParams {
  userId: string;      // 必填，用户ID
  type?: string;       // 可选，对话类型过滤
  pageNum?: number;    // 可选，页码，默认1
  pageSize?: number;   // 可选，每页条数，默认10
}
```

**响应数据**:
```typescript
interface PageResponse<T> {
  rows: T[];           // 数据列表
  total: number;       // 总记录数
  pageNum: number;     // 当前页码
  pageSize: number;    // 每页条数
}
```

**使用示例**:
```javascript
async function getUserConversations(userId, type, pageNum = 1, pageSize = 10) {
  const params = new URLSearchParams({
    userId,
    pageNum: pageNum.toString(),
    pageSize: pageSize.toString()
  });
  
  if (type) {
    params.append('type', type);
  }
  
  const response = await fetch(`/api/ai/chat/conversations?${params}`);
  const result = await response.json();
  
  if (result.code === 200) {
    return result.data;
  } else {
    throw new Error(result.message);
  }
}
```

### 6. 删除对话会话
**接口**: `DELETE /api/ai/chat/conversation/{conversationId}`

**使用示例**:
```javascript
async function deleteConversation(conversationId, userId) {
  const response = await fetch(`/api/ai/chat/conversation/${conversationId}?userId=${userId}`, {
    method: 'DELETE'
  });
  
  const result = await response.json();
  if (result.code !== 200) {
    throw new Error(result.message);
  }
}
```

### 7. 归档对话会话
**接口**: `PUT /api/ai/chat/conversation/{conversationId}/archive`

**使用示例**:
```javascript
async function archiveConversation(conversationId, userId) {
  const response = await fetch(`/api/ai/chat/conversation/${conversationId}/archive?userId=${userId}`, {
    method: 'PUT'
  });
  
  const result = await response.json();
  if (result.code !== 200) {
    throw new Error(result.message);
  }
}
```

### 8. 更新对话标题
**接口**: `PUT /api/ai/chat/conversation/{conversationId}/title`

**使用示例**:
```javascript
async function updateConversationTitle(conversationId, title, userId) {
  const params = new URLSearchParams({
    title,
    userId
  });
  
  const response = await fetch(`/api/ai/chat/conversation/${conversationId}/title?${params}`, {
    method: 'PUT'
  });
  
  const result = await response.json();
  if (result.code !== 200) {
    throw new Error(result.message);
  }
}
```

## 📊 数据结构定义

### 消息对象
```typescript
interface ChatMessageResponse {
  id: string;              // 消息ID
  conversationId: string;  // 对话会话ID
  role: 'system' | 'user' | 'assistant';  // 消息角色
  content: string;         // 消息内容
  sequence: number;        // 消息序号
  createdAt: string;       // 创建时间
  status: 'PENDING' | 'SUCCESS' | 'FAILED';  // 消息状态
  responseTime?: number;   // 响应时间
  errorMessage?: string;   // 错误信息
}
```

### 对话类型
```typescript
enum ConversationType {
  GENERAL_CHAT = 'GENERAL_CHAT',  // 通用对话
  GAME_CHAT = 'GAME_CHAT'         // 游戏对话
}
```

### 对话状态
```typescript
enum ConversationStatus {
  ACTIVE = 'ACTIVE',       // 活跃
  ARCHIVED = 'ARCHIVED',   // 已归档
  DELETED = 'DELETED'      // 已删除
}
```

## 🎨 前端实现建议

### 1. 页面结构设计
```html
<div class="chat-container">
  <!-- 侧边栏：对话列表 -->
  <div class="sidebar">
    <div class="conversation-list">
      <!-- 对话列表项 -->
    </div>
    <button class="new-chat-btn">新建对话</button>
  </div>
  
  <!-- 主聊天区域 -->
  <div class="chat-main">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <h3 class="conversation-title">对话标题</h3>
      <div class="chat-actions">
        <button class="archive-btn">归档</button>
        <button class="delete-btn">删除</button>
      </div>
    </div>
    
    <!-- 消息列表 -->
    <div class="message-list">
      <!-- 消息项 -->
    </div>
    
    <!-- 输入区域 -->
    <div class="input-area">
      <textarea class="message-input" placeholder="输入消息..."></textarea>
      <div class="input-actions">
        <label>
          <input type="checkbox" class="stream-toggle"> 流式响应
        </label>
        <button class="send-btn">发送</button>
      </div>
    </div>
  </div>
</div>
```

### 2. 状态管理
```javascript
class ChatState {
  constructor() {
    this.currentUserId = 'user-001';
    this.currentConversationId = null;
    this.conversations = [];
    this.currentMessages = [];
    this.isLoading = false;
    this.isStreaming = false;
  }
  
  // 设置当前对话
  setCurrentConversation(conversationId) {
    this.currentConversationId = conversationId;
    this.loadConversationMessages(conversationId);
  }
  
  // 添加消息
  addMessage(message) {
    this.currentMessages.push(message);
    this.renderMessages();
  }
  
  // 更新流式消息
  updateStreamMessage(messageId, content) {
    const message = this.currentMessages.find(m => m.id === messageId);
    if (message) {
      message.content += content;
      this.renderMessages();
    }
  }
}
```

### 3. 消息渲染
```javascript
function renderMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${message.role}`;
  
  const roleNames = {
    'user': '用户',
    'assistant': 'AI助手',
    'system': '系统'
  };
  
  messageDiv.innerHTML = `
    <div class="message-header">
      <span class="message-role">${roleNames[message.role]}</span>
      <span class="message-time">${formatTime(message.createdAt)}</span>
    </div>
    <div class="message-content">${formatContent(message.content)}</div>
    ${message.status === 'PENDING' ? '<div class="message-loading">正在输入...</div>' : ''}
  `;
  
  return messageDiv;
}

function formatContent(content) {
  // 处理换行、链接、代码块等格式
  return content
    .replace(/\n/g, '<br>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
```

### 4. 流式响应处理
```javascript
class StreamHandler {
  constructor(messageContainer) {
    this.messageContainer = messageContainer;
    this.currentStreamMessage = null;
  }
  
  startStream(conversationId, userId, message, type) {
    // 添加用户消息
    this.addUserMessage(message);
    
    // 创建AI消息占位符
    this.currentStreamMessage = this.createStreamMessage();
    
    // 开始流式请求
    sendMessageStream(
      conversationId,
      userId,
      message,
      type,
      (data) => this.onStreamData(data),
      () => this.onStreamComplete(),
      (error) => this.onStreamError(error)
    );
  }
  
  onStreamData(data) {
    if (this.currentStreamMessage) {
      this.currentStreamMessage.content += data.content;
      this.updateMessageContent(this.currentStreamMessage);
    }
  }
  
  onStreamComplete() {
    if (this.currentStreamMessage) {
      this.currentStreamMessage.status = 'SUCCESS';
      this.updateMessageStatus(this.currentStreamMessage);
    }
    this.currentStreamMessage = null;
  }
  
  onStreamError(error) {
    if (this.currentStreamMessage) {
      this.currentStreamMessage.status = 'FAILED';
      this.currentStreamMessage.errorMessage = error.message;
      this.updateMessageStatus(this.currentStreamMessage);
    }
    this.currentStreamMessage = null;
  }
}
```

### 5. 错误处理
```javascript
class ErrorHandler {
  static handle(error, context = '') {
    console.error(`${context}:`, error);
    
    let message = '操作失败';
    if (error.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    // 显示错误提示
    this.showError(message);
  }
  
  static showError(message) {
    // 实现错误提示UI
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 3000);
  }
}
```

## 🎯 完整实现示例

### 主要功能类
```javascript
class AiChatApp {
  constructor() {
    this.state = new ChatState();
    this.streamHandler = new StreamHandler(document.querySelector('.message-list'));
    this.init();
  }
  
  async init() {
    await this.loadConversations();
    this.bindEvents();
  }
  
  async loadConversations() {
    try {
      const result = await getUserConversations(this.state.currentUserId);
      this.state.conversations = result.rows;
      this.renderConversationList();
    } catch (error) {
      ErrorHandler.handle(error, '加载对话列表失败');
    }
  }
  
  async createNewConversation() {
    try {
      const conversation = await createConversation(
        this.state.currentUserId,
        'GENERAL_CHAT',
        '新对话'
      );
      
      this.state.conversations.unshift(conversation);
      this.state.setCurrentConversation(conversation.id);
      this.renderConversationList();
    } catch (error) {
      ErrorHandler.handle(error, '创建对话失败');
    }
  }
  
  async sendMessage(message, useStream = false) {
    if (!message.trim()) return;
    
    try {
      this.state.isLoading = true;
      
      if (useStream) {
        this.streamHandler.startStream(
          this.state.currentConversationId,
          this.state.currentUserId,
          message,
          'GENERAL_CHAT'
        );
      } else {
        const response = await sendMessage(
          this.state.currentConversationId,
          this.state.currentUserId,
          message,
          'GENERAL_CHAT'
        );
        
        // 添加用户消息和AI回复
        this.state.addMessage({
          role: 'user',
          content: message,
          createdAt: new Date().toISOString()
        });
        
        this.state.addMessage({
          role: 'assistant',
          content: response.content,
          createdAt: new Date().toISOString(),
          status: response.status
        });
      }
    } catch (error) {
      ErrorHandler.handle(error, '发送消息失败');
    } finally {
      this.state.isLoading = false;
    }
  }
  
  bindEvents() {
    // 新建对话按钮
    document.querySelector('.new-chat-btn').addEventListener('click', () => {
      this.createNewConversation();
    });
    
    // 发送消息按钮
    document.querySelector('.send-btn').addEventListener('click', () => {
      const input = document.querySelector('.message-input');
      const useStream = document.querySelector('.stream-toggle').checked;
      this.sendMessage(input.value, useStream);
      input.value = '';
    });
    
    // 回车发送
    document.querySelector('.message-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.querySelector('.send-btn').click();
      }
    });
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new AiChatApp();
});
```

## 🎨 样式建议

### CSS样式框架
```css
.chat-container {
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.sidebar {
  width: 300px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.conversation-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background: #e9ecef;
}

.conversation-item.active {
  background: #007bff;
  color: white;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 20px;
  max-width: 80%;
}

.message-user {
  margin-left: auto;
  background: #007bff;
  color: white;
  border-radius: 18px 18px 4px 18px;
  padding: 12px 16px;
}

.message-assistant {
  background: #f8f9fa;
  border-radius: 18px 18px 18px 4px;
  padding: 12px 16px;
}

.input-area {
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

.message-input {
  width: 100%;
  min-height: 60px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  resize: vertical;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.send-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer;
}

.send-btn:hover {
  background: #0056b3;
}

.send-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}
```

## 🚀 部署和优化

### 性能优化建议
1. **虚拟滚动**: 对于大量消息的对话，使用虚拟滚动优化性能
2. **消息缓存**: 缓存已加载的消息，避免重复请求
3. **懒加载**: 按需加载对话历史
4. **防抖处理**: 对输入和搜索功能添加防抖

### 用户体验优化
1. **加载状态**: 显示加载动画和进度
2. **错误重试**: 提供错误重试机制
3. **离线支持**: 缓存重要数据支持离线查看
4. **响应式设计**: 适配移动端设备

### 安全考虑
1. **输入验证**: 前端验证用户输入
2. **XSS防护**: 正确转义用户内容
3. **CSRF保护**: 添加CSRF令牌
4. **内容过滤**: 过滤敏感内容

## 📱 移动端适配

### 响应式布局
```css
@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: 200px;
    order: 2;
  }

  .chat-main {
    order: 1;
    height: calc(100vh - 200px);
  }

  .conversation-list {
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }

  .conversation-item {
    min-width: 150px;
    margin-right: 10px;
    margin-bottom: 0;
  }
}
```

### 触摸优化
```javascript
// 添加触摸滑动支持
class TouchHandler {
  constructor(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.bindEvents();
  }

  bindEvents() {
    this.element.addEventListener('touchstart', (e) => {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    });

    this.element.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const deltaX = endX - this.startX;
      const deltaY = endY - this.startY;

      // 检测滑动手势
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.onSwipeRight();
        } else {
          this.onSwipeLeft();
        }
      }
    });
  }

  onSwipeRight() {
    // 右滑显示侧边栏
    document.querySelector('.sidebar').classList.add('show');
  }

  onSwipeLeft() {
    // 左滑隐藏侧边栏
    document.querySelector('.sidebar').classList.remove('show');
  }
}
```

## 🔧 高级功能实现

### 1. 消息搜索
```javascript
class MessageSearch {
  constructor(chatApp) {
    this.chatApp = chatApp;
    this.searchResults = [];
    this.currentIndex = 0;
  }

  search(keyword) {
    if (!keyword.trim()) {
      this.clearSearch();
      return;
    }

    this.searchResults = this.chatApp.state.currentMessages.filter(message =>
      message.content.toLowerCase().includes(keyword.toLowerCase())
    );

    this.highlightResults(keyword);
    this.showSearchNavigation();
  }

  highlightResults(keyword) {
    const messageElements = document.querySelectorAll('.message-content');
    messageElements.forEach(element => {
      const text = element.textContent;
      const highlightedText = text.replace(
        new RegExp(keyword, 'gi'),
        `<mark>$&</mark>`
      );
      element.innerHTML = highlightedText;
    });
  }

  nextResult() {
    if (this.searchResults.length === 0) return;

    this.currentIndex = (this.currentIndex + 1) % this.searchResults.length;
    this.scrollToResult();
  }

  previousResult() {
    if (this.searchResults.length === 0) return;

    this.currentIndex = this.currentIndex === 0
      ? this.searchResults.length - 1
      : this.currentIndex - 1;
    this.scrollToResult();
  }

  scrollToResult() {
    const message = this.searchResults[this.currentIndex];
    const messageElement = document.querySelector(`[data-message-id="${message.id}"]`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
```

### 2. 消息导出
```javascript
class MessageExporter {
  static exportToText(messages, conversationTitle) {
    const content = messages.map(message => {
      const time = new Date(message.createdAt).toLocaleString();
      const role = message.role === 'user' ? '用户' : 'AI助手';
      return `[${time}] ${role}: ${message.content}`;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    this.downloadFile(blob, `${conversationTitle}.txt`);
  }

  static exportToJSON(conversation) {
    const content = JSON.stringify(conversation, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    this.downloadFile(blob, `${conversation.title}.json`);
  }

  static exportToMarkdown(messages, conversationTitle) {
    let content = `# ${conversationTitle}\n\n`;

    messages.forEach(message => {
      const time = new Date(message.createdAt).toLocaleString();
      const role = message.role === 'user' ? '👤 用户' : '🤖 AI助手';
      content += `## ${role} (${time})\n\n${message.content}\n\n---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    this.downloadFile(blob, `${conversationTitle}.md`);
  }

  static downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
```

---

**文档版本**: v1.0
**更新时间**: 2025-07-25
**适用版本**: AI Chat API v1.0

## 📞 技术支持

如有问题，请参考：
1. API接口文档：`AI_CHAT_API_GUIDE.md`
2. 后端修复报告：`AI_CHAT_STREAM_FIX.md`
3. 测试页面示例：`http://localhost:8080/ai-chat-test.html`

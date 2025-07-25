# AI对话前端快速开始指南

## 🚀 5分钟快速集成

### 1. 基础HTML结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI对话</title>
    <link rel="stylesheet" href="chat.css">
</head>
<body>
    <div class="chat-app">
        <!-- 侧边栏 -->
        <div class="sidebar">
            <button class="new-chat-btn">+ 新对话</button>
            <div class="conversation-list" id="conversationList"></div>
        </div>
        
        <!-- 主聊天区 -->
        <div class="chat-main">
            <div class="chat-header">
                <h3 id="chatTitle">选择或创建对话</h3>
                <div class="chat-actions">
                    <button id="exportBtn">导出</button>
                    <button id="deleteBtn">删除</button>
                </div>
            </div>
            
            <div class="message-container" id="messageContainer"></div>
            
            <div class="input-area">
                <div class="input-controls">
                    <label>
                        <input type="checkbox" id="streamToggle"> 流式响应
                    </label>
                </div>
                <div class="input-box">
                    <textarea id="messageInput" placeholder="输入消息..." rows="3"></textarea>
                    <button id="sendBtn">发送</button>
                </div>
            </div>
        </div>
    </div>
    
    <script src="chat.js"></script>
</body>
</html>
```

### 2. 核心CSS样式
```css
/* chat.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    height: 100vh;
    overflow: hidden;
}

.chat-app {
    display: flex;
    height: 100vh;
}

.sidebar {
    width: 300px;
    background: #f8f9fa;
    border-right: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
}

.new-chat-btn {
    margin: 15px;
    padding: 12px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
}

.conversation-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 15px;
}

.conversation-item {
    padding: 12px;
    margin-bottom: 8px;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid #e9ecef;
    transition: all 0.2s;
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

.chat-header {
    padding: 15px 20px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-actions button {
    margin-left: 10px;
    padding: 6px 12px;
    border: 1px solid #e9ecef;
    background: white;
    border-radius: 4px;
    cursor: pointer;
}

.message-container {
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
    padding: 12px 16px;
    border-radius: 18px 18px 4px 18px;
}

.message-assistant {
    background: #f8f9fa;
    padding: 12px 16px;
    border-radius: 18px 18px 18px 4px;
    border: 1px solid #e9ecef;
}

.message-system {
    background: #fff3cd;
    padding: 8px 12px;
    border-radius: 8px;
    font-style: italic;
    text-align: center;
    margin: 10px auto;
    max-width: 60%;
}

.input-area {
    padding: 20px;
    border-top: 1px solid #e9ecef;
}

.input-controls {
    margin-bottom: 10px;
}

.input-box {
    display: flex;
    gap: 10px;
}

#messageInput {
    flex: 1;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 12px;
    resize: vertical;
    min-height: 60px;
}

#sendBtn {
    padding: 12px 24px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

#sendBtn:disabled {
    background: #6c757d;
    cursor: not-allowed;
}

.loading {
    opacity: 0.6;
}

.error {
    color: #dc3545;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    padding: 8px 12px;
    border-radius: 4px;
    margin: 10px 0;
}
```

### 3. 核心JavaScript代码
```javascript
// chat.js
class SimpleAiChat {
    constructor() {
        this.apiBase = 'http://localhost:8080/api/ai/chat';
        this.userId = 'user-' + Date.now(); // 简单的用户ID生成
        this.currentConversationId = null;
        this.conversations = [];
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadConversations();
    }
    
    bindEvents() {
        // 新建对话
        document.querySelector('.new-chat-btn').addEventListener('click', () => {
            this.createNewConversation();
        });
        
        // 发送消息
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });
        
        // 回车发送
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 删除对话
        document.getElementById('deleteBtn').addEventListener('click', () => {
            if (this.currentConversationId) {
                this.deleteConversation(this.currentConversationId);
            }
        });
        
        // 导出对话
        document.getElementById('exportBtn').addEventListener('click', () => {
            if (this.currentConversationId) {
                this.exportConversation();
            }
        });
    }
    
    async createNewConversation() {
        try {
            const response = await fetch(`${this.apiBase}/conversation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.userId,
                    type: 'GENERAL_CHAT',
                    title: '新对话'
                })
            });
            
            const result = await response.json();
            if (result.code === 200) {
                this.conversations.unshift(result.data);
                this.selectConversation(result.data.id);
                this.renderConversationList();
            }
        } catch (error) {
            this.showError('创建对话失败: ' + error.message);
        }
    }
    
    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        const useStream = document.getElementById('streamToggle').checked;
        
        if (!message || this.isLoading) return;
        
        input.value = '';
        this.isLoading = true;
        document.getElementById('sendBtn').disabled = true;
        
        // 添加用户消息到界面
        this.addMessage('user', message);
        
        try {
            if (useStream) {
                await this.sendStreamMessage(message);
            } else {
                await this.sendNormalMessage(message);
            }
        } catch (error) {
            this.showError('发送消息失败: ' + error.message);
        } finally {
            this.isLoading = false;
            document.getElementById('sendBtn').disabled = false;
        }
    }
    
    async sendNormalMessage(message) {
        const response = await fetch(`${this.apiBase}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId: this.currentConversationId,
                userId: this.userId,
                message: message,
                type: 'GENERAL_CHAT'
            })
        });
        
        const result = await response.json();
        if (result.code === 200) {
            this.addMessage('assistant', result.data.content);
            this.currentConversationId = result.data.conversationId;
        } else {
            throw new Error(result.message);
        }
    }
    
    async sendStreamMessage(message) {
        const response = await fetch(`${this.apiBase}/send/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId: this.currentConversationId,
                userId: this.userId,
                message: message,
                type: 'GENERAL_CHAT',
                stream: true
            })
        });
        
        if (!response.ok) throw new Error('Stream request failed');
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessageElement = this.addMessage('assistant', '');
        let fullContent = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.substring(6));
                        fullContent += data.content;
                        assistantMessageElement.textContent = fullContent;
                        
                        if (data.conversationId) {
                            this.currentConversationId = data.conversationId;
                        }
                        
                        if (data.isLast) return;
                    } catch (e) {
                        console.error('Parse SSE error:', e);
                    }
                }
            }
        }
    }
    
    addMessage(role, content) {
        const container = document.getElementById('messageContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${role}`;
        messageDiv.textContent = content;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
        
        return messageDiv;
    }
    
    async loadConversations() {
        try {
            const response = await fetch(`${this.apiBase}/conversations?userId=${this.userId}`);
            const result = await response.json();
            
            if (result.code === 200) {
                this.conversations = result.data.rows;
                this.renderConversationList();
            }
        } catch (error) {
            console.error('Load conversations failed:', error);
        }
    }
    
    renderConversationList() {
        const list = document.getElementById('conversationList');
        list.innerHTML = '';
        
        this.conversations.forEach(conv => {
            const item = document.createElement('div');
            item.className = 'conversation-item';
            if (conv.id === this.currentConversationId) {
                item.classList.add('active');
            }
            
            item.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px;">${conv.title}</div>
                <div style="font-size: 12px; color: #666;">
                    ${conv.messageCount} 条消息 · ${new Date(conv.updatedAt).toLocaleDateString()}
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.selectConversation(conv.id);
            });
            
            list.appendChild(item);
        });
    }
    
    async selectConversation(conversationId) {
        try {
            const response = await fetch(`${this.apiBase}/conversation/${conversationId}`);
            const result = await response.json();
            
            if (result.code === 200) {
                this.currentConversationId = conversationId;
                this.renderMessages(result.data.messages);
                document.getElementById('chatTitle').textContent = result.data.title;
                this.renderConversationList(); // 更新选中状态
            }
        } catch (error) {
            this.showError('加载对话失败: ' + error.message);
        }
    }
    
    renderMessages(messages) {
        const container = document.getElementById('messageContainer');
        container.innerHTML = '';
        
        messages.forEach(msg => {
            this.addMessage(msg.role, msg.content);
        });
    }
    
    async deleteConversation(conversationId) {
        if (!confirm('确定要删除这个对话吗？')) return;
        
        try {
            const response = await fetch(`${this.apiBase}/conversation/${conversationId}?userId=${this.userId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            if (result.code === 200) {
                this.conversations = this.conversations.filter(c => c.id !== conversationId);
                this.renderConversationList();
                
                if (this.currentConversationId === conversationId) {
                    this.currentConversationId = null;
                    document.getElementById('messageContainer').innerHTML = '';
                    document.getElementById('chatTitle').textContent = '选择或创建对话';
                }
            }
        } catch (error) {
            this.showError('删除对话失败: ' + error.message);
        }
    }
    
    exportConversation() {
        const messages = Array.from(document.querySelectorAll('.message')).map(el => {
            const role = el.classList.contains('message-user') ? '用户' : 'AI助手';
            return `${role}: ${el.textContent}`;
        }).join('\n\n');
        
        const blob = new Blob([messages], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '对话记录.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    showError(message) {
        const container = document.getElementById('messageContainer');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        container.appendChild(errorDiv);
        container.scrollTop = container.scrollHeight;
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new SimpleAiChat();
});
```

## 🎯 使用说明

1. **保存文件**: 将上述代码分别保存为 `index.html`、`chat.css`、`chat.js`
2. **启动后端**: 确保AI对话后端服务运行在 `http://localhost:8080`
3. **打开页面**: 在浏览器中打开 `index.html`
4. **开始对话**: 点击"新对话"按钮，输入消息即可开始AI对话

## 🔧 自定义配置

### 修改API地址
```javascript
// 在 SimpleAiChat 构造函数中修改
this.apiBase = 'https://your-api-domain.com/api/ai/chat';
```

### 修改用户ID
```javascript
// 使用固定用户ID
this.userId = 'your-user-id';

// 或从登录系统获取
this.userId = getCurrentUserId();
```

### 添加认证
```javascript
// 在所有fetch请求中添加认证头
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getAuthToken()
}
```

这个快速开始指南提供了一个完整可用的AI对话界面，包含所有核心功能。前端开发者可以基于此代码快速构建自己的AI对话应用。

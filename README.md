```markdown
# 海龟汤谜题管理系统

## 项目简介

海龟汤谜题管理系统是一个支持谜题输入、审核、激活和停用的管理工具，致力于为系统管理员和内容创作者提供高效、用户友好的管理平台。系统结合AI技术，支持结构化输入与单框输入模式，同时通过AI评分机制对谜题质量进行评估。

## 技术栈

- **框架**: Vue 3
- **组件库**: Ant Design Vue
- **状态管理**: Pinia
- **网络请求**: Axios
- **实时通信**: WebSocket
- **路由**: Vue Router
- **构建工具**: Vite

## 功能特点

1. **谜题管理**
   - 支持结构化表单和AI驱动的单框输入两种模式。
   - 提供谜题的创建、编辑、审核、激活、停用与软删除功能。
   - 自动保存谜题版本，支持回滚。

2. **AI驱动功能**
   - 单框输入：用户输入自由文本，AI解析为结构化内容。
   - AI评分：对谜题的逻辑性、趣味性、难度和多样性等维度进行评分。

3. **谜题列表与筛选**
   - 展示谜题列表，支持按状态、难度、主题、创建者等条件筛选。
   - 快速查看谜题详情，包括评分和编辑记录。

4. **版本控制**
   - 保存每次修改的版本记录。
   - 支持版本回滚，保证内容的安全性与可追溯性。

## 项目结构

```plaintext
src/
├── assets/             # 静态资源
├── components/         # 全局组件
├── views/              # 页面组件
│   ├── Home.vue        # 谜题管理首页
│   ├── Create.vue      # 新建谜题页面
│   ├── Details.vue     # 谜题详情页面
├── store/              # Pinia状态管理
├── router/             # Vue Router路由配置
├── api/                # 接口请求封装
├── utils/              # 工具函数
├── App.vue             # 主应用入口
└── main.js             # 入口文件
```

## 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/your-repo-name/turtle-soup-management.git
cd turtle-soup-management
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发环境

```bash
npm run dev
```

访问开发环境：[http://localhost:5173](http://localhost:5173)

## 构建与部署

### 1. 构建项目

```bash
npm run build
```

### 2. 部署静态资源

将 `dist/` 目录下的文件上传至你的服务器或部署平台。

## 主要依赖

- Vue 3
- Pinia
- Vue Router
- Ant Design Vue
- Axios

## 接口设计

### 示例接口

#### 获取谜题列表

**URL**: `/api/puzzles`  
**方法**: GET  
**参数**: 
- `status` (string) - 状态过滤
- `difficulty` (number) - 难度过滤
- `theme` (string) - 主题过滤

**返回示例**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "一个人在餐厅点了一碗汤，吃完后报警",
      "difficulty": 3,
      "status": "active",
      "theme": "悬疑",
      "score": {
        "logic": 90,
        "fun": 85,
        "difficulty": 70,
        "diversity": 80,
        "total": 81
      }
    }
  ]
}
```

#### 提交新谜题

**URL**: `/api/puzzles`  
**方法**: POST  
**参数**:
```json
{
  "title": "谜题标题",
  "difficulty": 3,
  "theme": "悬疑",
  "prompt_text": "汤面",
  "solution_text": "汤底",
  "key_points": ["关键点1", "关键点2"]
}
```

**返回示例**:
```json
{
  "message": "创建成功",
  "id": 2
}
```

## 版本历史

### v1.0.0
- 初始版本，包含核心功能：
  - 谜题的结构化与AI输入
  - 谜题列表筛选与详情查看
  - AI评分机制

## TODO

- 优化AI解析的准确性。
- 增加多语言支持。
- 提供更友好的移动端适配。

## 贡献指南

欢迎提交问题或贡献代码！请在提交前确保代码通过以下命令进行检查：

```bash
npm run lint
npm run test
```

## 许可证

MIT License
```
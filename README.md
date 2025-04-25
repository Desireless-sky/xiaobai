# 小紫——AI女友

这是一个基于DeepSeek API的智能AI女友项目，具有以下特点：

- 智能对话系统
- 情绪识别和响应
- 用户偏好记忆
- 美观的用户界面
- 安全的用户认证

## 项目结构

```
.
├── backend/           # 后端API服务
├── frontend/         # 前端界面
└──  database/         # 数据库相关文件
```

## 安装说明

1. 克隆项目
2. 安装后端依赖：
   ```bash
   conda create --name aigirl python=3.10
   conda activate aigirl
   pip install -r requirements.txt
   ```
3. 配置环境变量：
   - 创建 `.env` 文件
   - 添加必要的配置（如API密钥等）

## 运行项目

1. 启动后端服务：
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. 启动前端服务：
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 技术栈

- 后端：FastAPI, SQLAlchemy
- 前端：React, TailwindCSS
- 数据库：PostgreSQL
- AI：DeepSeek API

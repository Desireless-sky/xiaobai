<div align="center">
 <img alt="logo" height="300px" src="frontend\public\ai-girl.png">
</div>

<h1 align="center">小白</h1>

<p align="center">
    <img alt="GitHub" src="https://img.shields.io/github/license/Desireless-sky/xiaobai">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/Desireless-sky/xiaobai">
    <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/Desireless-sky/xiaobai?include_prereleases">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Desireless-sky/xiaobai">
</p>
<p align="center">
    <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/Desireless-sky/xiaobai">
    <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/Desireless-sky/xiaobai">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/Desireless-sky/xiaobai?style=social">
</p>


## 小白——AI女友

这是一个基于DeepSeek API的智能AI女友项目，具有以下特点：

- 智能对话系统
- 情绪识别和响应
- 用户偏好记忆
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

4. 配置deepseek api:
   - 前往 [deepseek api接口](https://platform.deepseek.com/api_keys)
   - 创建新的api
   - 在deepseek.py 中添加api
   ![deepseek](img\1.png )
   ```bash
   .
   ├── backend/           
      └── deepseek.py #deepseek模块
   ```
## 运行项目

1. 启动后端服务：
   ```bash
   cd backend
   conda activate aigirl
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

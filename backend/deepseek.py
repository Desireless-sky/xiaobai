import os
import requests
from dotenv import load_dotenv

load_dotenv()

# 从环境变量获取API密钥
DEEPSEEK_API_KEY = "sk-650434dac25e4a8ba00c2f1076b78aa9"  # 直接使用API密钥
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

def get_ai_response(message: str, user_preferences: dict = None) -> str:
    """
    调用DeepSeek API获取AI响应
    """
    if not DEEPSEEK_API_KEY:
        return "抱歉，AI服务暂时不可用"

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    # 构建提示词
    system_prompt = "你是一个温柔体贴的AI女友，要关心用户的情绪，记住用户的喜好。"
    if user_preferences:
        system_prompt += f"\n用户的偏好：{user_preferences}"

    data = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        "temperature": 0.7,
        "max_tokens": 1000
    }

    try:
        print(f"正在调用DeepSeek API，使用密钥: {DEEPSEEK_API_KEY[:10]}...")  # 只打印密钥的前10个字符
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=data)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"DeepSeek API调用失败: {str(e)}")
        if hasattr(e, 'response'):
            print(f"API响应: {e.response.text}")
        return "抱歉，我现在无法回应，请稍后再试" 
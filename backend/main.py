from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from datetime import datetime
from sqlalchemy.orm import Session
import models
import database
import deepseek
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 加载环境变量
load_dotenv()

app = FastAPI(title="AI女友API")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 对话模型
class Message(BaseModel):
    content: str
    timestamp: Optional[str] = None

# 历史记录响应模型
class HistoryResponse(BaseModel):
    messages: List[dict]

# 路由
@app.get("/chat/history")
async def get_chat_history(db: Session = Depends(database.get_db)):
    try:
        # 从数据库获取历史消息
        messages = db.query(models.Message).order_by(models.Message.timestamp).all()
        history = []
        
        for msg in messages:
            # 添加用户消息
            history.append({
                "content": msg.content,
                "is_user": True,
                "timestamp": msg.timestamp.isoformat()
            })
            
            # 如果存在AI回复，也添加到历史记录中
            if msg.response:
                history.append({
                    "content": msg.response,
                    "is_user": False,
                    "timestamp": msg.timestamp.isoformat()
                })
        
        return {"messages": history}
    except Exception as e:
        logger.error(f"获取历史记录时发生错误: {str(e)}")
        raise HTTPException(status_code=500, detail="获取历史记录失败")

@app.delete("/chat/history")
async def clear_chat_history(db: Session = Depends(database.get_db)):
    try:
        # 删除所有历史消息
        db.query(models.Message).delete()
        db.commit()
        return {"message": "历史记录已清除"}
    except Exception as e:
        logger.error(f"清除历史记录时发生错误: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="清除历史记录失败")

@app.post("/chat/")
async def send_message(message: Message, db: Session = Depends(database.get_db)):
    try:
        logger.info(f"收到消息: {message.content}")
        
        # 保存消息到数据库
        db_message = models.Message(
            content=message.content,
            user_id=1,  # 使用默认用户ID
            timestamp=datetime.utcnow()
        )
        db.add(db_message)
        
        # 获取AI响应
        ai_response = deepseek.get_ai_response(message.content)
        
        # 保存AI响应到数据库
        db_message.response = ai_response
        db.commit()
        
        logger.info(f"AI响应: {ai_response}")
        return {"message": "消息发送成功", "response": ai_response}
    except Exception as e:
        logger.error(f"处理消息时发生错误: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="处理消息失败，请稍后重试")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
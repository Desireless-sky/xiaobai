import database
import models
from passlib.context import CryptContext

# 密码加密
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    # 创建数据库表
    models.Base.metadata.create_all(bind=database.engine)
    
    # 创建数据库会话
    db = database.SessionLocal()
    
    try:
        # 检查是否已存在默认用户
        default_user = db.query(models.User).filter(models.User.email == "test@example.com").first()
        if not default_user:
            # 创建默认用户
            hashed_password = pwd_context.hash("123456")
            default_user = models.User(
                username="test",
                email="test@example.com",
                hashed_password=hashed_password,
                preferences={"favorite_color": "蓝色", "hobby": "读书"}
            )
            db.add(default_user)
            db.commit()
            print("默认用户创建成功！")
            print("邮箱: test@example.com")
            print("密码: 123456")
        else:
            print("默认用户已存在！")
            print("邮箱: test@example.com")
            print("密码: 123456")
    except Exception as e:
        print(f"创建默认用户时出错: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("创建数据库表...")
    init_db()
    print("数据库表创建完成！") 
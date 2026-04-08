# backend/tests/test_chat.py
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine
import pytest

client = TestClient(app)

# 每次测试前清空并重建数据库，保证测试环境干净
@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def get_auth_headers(username, password):
    """辅助函数：注册、登录并获取 Token Header"""
    client.post("/auth/register", json={"username": username, "password": password})
    res = client.post("/auth/login", json={"username": username, "password": password})
    token = res.json().get("access_token")
    return {"Authorization": f"Bearer {token}"}

def test_read_sessions():
    """测试：携带 Token 读取会话接口"""
    headers = get_auth_headers("testuser1", "pass123")
    response = client.get("/api/chat/sessions", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_chat_operations():
    """测试：完整的添加好友、发消息、拉取记录流程"""
    headers_a = get_auth_headers("userA", "pass123")
    headers_b = get_auth_headers("userB", "pass123") # userB 是第二个注册的，ID应为 2
    
    # 1. userA 添加 userB 为好友
    res_add = client.post("/api/chat/friends/add?friend_id=2", headers=headers_a)
    assert res_add.status_code == 200
    conv_id = res_add.json().get("conversation_id")
    
    # 2. 获取好友列表
    res_friends = client.get("/api/chat/friends", headers=headers_a)
    assert res_friends.status_code == 200
    assert len(res_friends.json()) == 1
    
    # 3. 发送消息
    res_send = client.post(f"/api/chat/messages/send?conversation_id={conv_id}&content=hello_world", headers=headers_a)
    assert res_send.status_code == 200
    
    # 4. 获取历史消息
    res_msgs = client.get(f"/api/chat/messages?conversation_id={conv_id}", headers=headers_a)
    assert res_msgs.status_code == 200
    assert len(res_msgs.json()) == 1
    assert res_msgs.json()[0]["content"] == "hello_world"
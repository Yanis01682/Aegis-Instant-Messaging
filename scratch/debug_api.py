import httpx

BASE = "https://backend-dyno-whatthedogdoing.app.spring26b.secoder.net"

# Step 1: Login
login_res = httpx.post(f"{BASE}/auth/login", data={"username": "zzy", "password": "000000"})
print(f"Login status: {login_res.status_code}")
if login_res.status_code != 200:
    print(login_res.text)
    exit(1)

token = login_res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Step 2: Call sessions
sess_res = httpx.get(f"{BASE}/api/chat/sessions", headers=headers)
print(f"\nSessions status: {sess_res.status_code}")
print(f"Sessions body: {sess_res.text[:3000]}")

# Step 3: Call friends
friends_res = httpx.get(f"{BASE}/api/chat/friends", headers=headers)
print(f"\nFriends status: {friends_res.status_code}")
print(f"Friends body: {friends_res.text[:3000]}")


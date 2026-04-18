#!/bin/bash

echo "🦜 Taiwan Wild Birds — 啟動中..."

# 檢查 .env
if [ ! -f server/.env ]; then
  cp server/.env.example server/.env
  echo "⚠️  已建立 server/.env，請填入 MONGO_URI 與 JWT_SECRET 後重新執行"
  exit 1
fi

# 安裝依賴
echo "📦 安裝後端依賴..."
cd server && npm install --silent
cd ..

echo "📦 安裝前端依賴..."
cd client && npm install --silent
cd ..

# 同時啟動前後端
echo "🚀 啟動服務..."
(cd server && npm run dev) &
(cd client && npm run dev) &

echo "✅ 後端：http://localhost:5000"
echo "✅ 前端：http://localhost:5173"

wait

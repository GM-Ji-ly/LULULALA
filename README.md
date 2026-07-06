# ✨ AI 廣告文案生成器

利用 OpenAI GPT 一鍵生成 5 則繁體中文廣告文案的 SaaS 應用程式，基於 **Next.js App Router + TypeScript + Tailwind CSS** 建構。

## 功能特色

- 📝 **產品資訊表單** — 填寫產品名稱、描述、目標受眾、主要賣點、語氣風格、投放平台、廣告目標
- 🤖 **AI 一鍵生成** — 呼叫 OpenAI API 同時生成 5 則不同風格的廣告文案
- 📋 **結構化文案** — 每則文案包含 Headline（標題）、Body（內文）、CTA（行動呼籲）
- 📋 **一鍵複製** — 點擊即可複製完整文案
- ⚠️ **錯誤處理** — 友善的錯誤提示訊息

## 技術架構

```
app/
  page.tsx              # 主頁面（表單 + 結果卡片）
  layout.tsx            # 根佈局
  globals.css           # 全域樣式
  api/
    generate/
      route.ts          # API Route：呼叫 OpenAI 生成文案
lib/
  openai.ts             # OpenAI 客戶端初始化
.env.example            # 環境變數範本
```

## 快速開始

### 1. 安裝相依套件

```bash
npm install
```

### 2. 設定環境變數

```bash
cp .env.example .env.local
```

編輯 `.env.local`，填入你的 OpenAI API Key：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

> 前往 [OpenAI Platform](https://platform.openai.com/api-keys) 取得 API Key

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000)

### 4. 建置正式版本

```bash
npm run build
npm run start
```

## 環境變數

| 變數名稱         | 說明                 | 必填 |
| --------------- | -------------------- | ---- |
| `OPENAI_API_KEY` | OpenAI API 金鑰      | ✅   |

## 部署至 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. 將專案推送至 GitHub
2. 在 Vercel 匯入專案
3. 在 Vercel 環境變數設定 `OPENAI_API_KEY`
4. 部署完成 🎉

## 授權

MIT

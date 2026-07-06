import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export interface AdCopyInput {
  productName: string;
  description: string;
  audience: string;
  sellingPoints: string;
  tone: string;
  platform: string;
  goal: string;
}

export interface AdCopy {
  headline: string;
  body: string;
  cta: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AdCopyInput = await req.json();

    const { productName, description, audience, sellingPoints, tone, platform, goal } = body;

    if (!productName || !description) {
      return NextResponse.json(
        { error: "產品名稱和描述為必填欄位。" },
        { status: 400 }
      );
    }

    const prompt = `你是一位專業的廣告文案撰寫師，擅長撰寫繁體中文廣告文案。
請根據以下產品資訊，生成 5 則不同風格的廣告文案。

產品資訊：
- 產品名稱：${productName}
- 產品描述：${description}
- 目標受眾：${audience || "一般大眾"}
- 主要賣點：${sellingPoints || "無特別說明"}
- 語氣風格：${tone || "專業親切"}
- 投放平台：${platform || "社群媒體"}
- 廣告目標：${goal || "提升品牌知名度"}

請以 JSON 格式回覆，格式如下（只回傳 JSON，不要有其他文字）：
{
  "copies": [
    {
      "headline": "吸引眼球的標題（20字以內）",
      "body": "廣告內文（50-100字）",
      "cta": "行動呼籲按鈕文字（10字以內）"
    }
  ]
}

請確保：
1. 每則文案風格各異
2. 全部使用繁體中文
3. 符合 ${platform || "社群媒體"} 平台特性
4. 語氣為${tone || "專業親切"}
5. 強調目標：${goal || "提升品牌知名度"}`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AI 未能生成廣告文案，請稍後再試。" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content) as { copies: AdCopy[] };

    return NextResponse.json({ copies: parsed.copies });
  } catch (error: unknown) {
    console.error("Generate API error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "回應格式錯誤，請稍後再試。" },
        { status: 500 }
      );
    }

    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 429
    ) {
      return NextResponse.json(
        { error: "API 請求次數已達上限，請稍後再試。" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "生成廣告文案時發生錯誤，請稍後再試。" },
      { status: 500 }
    );
  }
}

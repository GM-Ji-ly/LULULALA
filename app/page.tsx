"use client";

import { useState } from "react";
import type { AdCopy, AdCopyInput } from "./api/generate/route";

const TONE_OPTIONS = ["專業親切", "幽默風趣", "溫暖感性", "直接有力", "文藝優雅", "年輕活潑"];
const PLATFORM_OPTIONS = ["Facebook", "Instagram", "LINE", "YouTube", "Google 廣告", "電子報", "官網"];
const GOAL_OPTIONS = ["提升品牌知名度", "促進購買轉換", "增加網站流量", "累積粉絲追蹤", "推廣活動優惠", "產品上市宣傳"];

const defaultForm: AdCopyInput = {
  productName: "",
  description: "",
  audience: "",
  sellingPoints: "",
  tone: "專業親切",
  platform: "Facebook",
  goal: "提升品牌知名度",
};

function CopyCard({ copy, index }: { copy: AdCopy; index: number }) {
  const [copied, setCopied] = useState(false);

  const fullText = `【${copy.headline}】\n\n${copy.body}\n\n👉 ${copy.cta}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support the Clipboard API (e.g. older Safari/iOS WebView)
      const textarea = document.createElement("textarea");
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          文案 #{index + 1}
        </span>
        <button
          onClick={handleCopy}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
            copied
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {copied ? "✓ 已複製" : "一鍵複製"}
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          Headline
        </p>
        <p className="text-lg font-bold text-gray-900 leading-snug">{copy.headline}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          Body
        </p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{copy.body}</p>
      </div>

      <div className="mt-auto pt-3 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          CTA
        </p>
        <span className="inline-block bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          {copy.cta}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState<AdCopyInput>(defaultForm);
  const [copies, setCopies] = useState<AdCopy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCopies([]);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "發生未知錯誤，請稍後再試。");
        return;
      }

      setCopies(data.copies);
    } catch {
      setError("網路連線異常，請確認網路後再試。");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            ✨ AI 廣告文案生成器
          </h1>
          <p className="mt-3 text-gray-500 text-base">
            填寫產品資訊，AI 一鍵生成 5 則繁體中文廣告文案
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label htmlFor="productName" className={labelClass}>
                產品名稱 <span className="text-red-500">*</span>
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                required
                placeholder="例：LULULALA 保濕精華液"
                value={form.productName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Audience */}
            <div>
              <label htmlFor="audience" className={labelClass}>
                目標受眾
              </label>
              <input
                id="audience"
                name="audience"
                type="text"
                placeholder="例：25-35 歲注重保養的女性"
                value={form.audience}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className={labelClass}>
                產品描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                placeholder="例：添加 5 種天然植萃成分，深層補水保濕，改善乾燥脫皮問題，適合敏感肌使用。"
                value={form.description}
                onChange={handleChange}
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Selling Points */}
            <div className="md:col-span-2">
              <label htmlFor="sellingPoints" className={labelClass}>
                主要賣點
              </label>
              <input
                id="sellingPoints"
                name="sellingPoints"
                type="text"
                placeholder="例：天然成分、敏感肌適用、72小時持效保濕"
                value={form.sellingPoints}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Tone */}
            <div>
              <label htmlFor="tone" className={labelClass}>
                語氣風格
              </label>
              <select
                id="tone"
                name="tone"
                value={form.tone}
                onChange={handleChange}
                className={inputClass}
              >
                {TONE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div>
              <label htmlFor="platform" className={labelClass}>
                投放平台
              </label>
              <select
                id="platform"
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className={inputClass}
              >
                {PLATFORM_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Goal */}
            <div className="md:col-span-2">
              <label htmlFor="goal" className={labelClass}>
                廣告目標
              </label>
              <select
                id="goal"
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className={inputClass}
              >
                {GOAL_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-10 py-3 rounded-xl shadow transition-all text-base min-w-[180px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  生成中…
                </span>
              ) : (
                "🚀 生成廣告文案"
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {copies.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              生成結果（{copies.length} 則）
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {copies.map((copy, i) => (
                <CopyCard key={i} copy={copy} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import BgmPlayer from "./bgm-player";

const siteUrl = "https://hoshikuzu-note-blog.netlify.app";
const siteDescription = "小星的中文个人博客，记录插画创作、独立游戏、音乐歌单与闪闪发光的生活日常。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "星屑手记｜小星的插画、游戏与生活博客",
    template: "%s｜星屑手记",
  },
  description: siteDescription,
  applicationName: "星屑手记",
  authors: [{ name: "小星", url: siteUrl }],
  creator: "小星",
  publisher: "星屑手记",
  category: "个人博客",
  keywords: ["星屑手记", "小星", "个人博客", "插画", "二次元", "独立游戏", "音乐", "生活随笔"],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "星屑手记",
    title: "星屑手记｜小星的插画、游戏与生活博客",
    description: siteDescription,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "星屑手记——把闪闪发光的日常收藏起来" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "星屑手记｜小星的插画、游戏与生活博客",
    description: siteDescription,
    images: ["/og.png"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "星屑手记",
      alternateName: "HOSHIKUZU NOTE",
      url: siteUrl,
      description: siteDescription,
      inLanguage: "zh-CN",
      publisher: { "@id": `${siteUrl}/#author` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#author`,
      name: "小星",
      url: `${siteUrl}/#about`,
      description: "自由插画师、游戏爱好者与生活记录者。",
      knowsAbout: ["插画", "二次元文化", "独立游戏", "音乐", "生活随笔"],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <BgmPlayer />
      </body>
    </html>
  );
}

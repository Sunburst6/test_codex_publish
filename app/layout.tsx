import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"星屑手记｜小星的个人博客",description:"记录插画、游戏与闪闪发光的日常。"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}

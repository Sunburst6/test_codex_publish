"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { posts } from "./posts";
import CoverArt from "./cover-art";

const cats = ["全部", "日常", "绘画", "游戏", "音乐"];

export default function Home() {
  const [cat, setCat] = useState("全部");
  const [dark, setDark] = useState(false);
  const shown = cat === "全部" ? posts : posts.filter((post) => post.category === cat);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [cat]);

  function moveVisual(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    visualRef.current?.style.setProperty("--pointer-x", `${x * 12}px`);
    visualRef.current?.style.setProperty("--pointer-y", `${y * 12}px`);
  }

  return (
    <main className={dark ? "site dark" : "site"}>
      <nav className="nav shell entrance entrance-nav" aria-label="主导航">
        <a className="brand" href="#top"><span className="brand-mark">星</span><span className="brand-name">星屑手记<small>HOSHIKUZU NOTE</small></span></a>
        <div className="nav-right"><div className="links"><a href="#top">首页</a><a href="#stories">文章</a><a href="#about">关于</a></div><button className="theme" onClick={() => setDark(!dark)} aria-label="切换主题"><span>{dark ? "日" : "夜"}</span></button></div>
      </nav>

      <header className="hero shell" id="top">
        <div className="hero-copy entrance entrance-copy">
          <p className="eyebrow"><span>ISSUE 06</span> WELCOME TO MY LITTLE UNIVERSE</p>
          <h1>把闪闪发光的<br /><em>日常</em>，收藏起来。</h1>
          <p className="lead">你好，我是小星。这里记录画画、游戏与生活碎片。<br />愿你在我的小小宇宙里，找到片刻好心情。</p>
          <div className="actions"><a className="primary-action" href="#stories">开始阅读 <span>↗</span></a><a className="text-action" href="#about">认识一下 <span>→</span></a></div>
          <div className="current-note"><span className="status-dot" /><div><small>CURRENTLY MAKING</small><p>正在画一张关于夏夜的插画</p></div></div>
        </div>

        <div className="visual-frame entrance entrance-visual" ref={visualRef} onPointerMove={moveVisual} onPointerLeave={() => { visualRef.current?.style.setProperty("--pointer-x", "0px"); visualRef.current?.style.setProperty("--pointer-y", "0px"); }} aria-label="夏夜窗边阅读的插画">
          <div className="frame-bar"><span>SCENE / 006</span><span>21:08 JST</span></div>
          <div className="art"><i className="moon" /><i className="star star-a">✦</i><i className="star star-b">·</i><div className="window" /><div className="girl"><div className="hair" /><div className="face"><i /><i /></div><div className="body" /><div className="book">星<small>NOTE</small></div></div><div className="art-caption"><span>夏夜观察日志</span><p>「今日も、世界は温柔的蓝色。」</p></div></div>
        </div>
      </header>

      <section className="stories shell" id="stories">
        <div className="section-heading" data-reveal><div><p className="eyebrow">LATEST STORIES</p><h2>最近更新</h2></div><p>沿着时间的轨迹，拾起散落的故事。</p></div>
        <div className="story-tools" data-reveal><div className="filters" aria-label="文章分类">{cats.map((item) => <button key={item} className={cat === item ? "on" : ""} onClick={() => setCat(item)} aria-pressed={cat === item}>{item}</button>)}</div><span className="story-count">{String(shown.length).padStart(2, "0")} ARTICLES</span></div>
        <div className="grid">{shown.map((post, index) => { const postIndex = posts.indexOf(post); return <article key={`${cat}-${post.slug}`} data-reveal style={{ "--reveal-delay": `${index % 3 * 90}ms` } as React.CSSProperties}><Link className="article-link" href={`/posts/${post.slug}`}><div className={`cover c${(postIndex % 6) + 1}`}><CoverArt index={postIndex} symbol={post.symbol} /><small>{String(postIndex + 1).padStart(2, "0")}</small></div><div className="card"><div className="meta"><b>{post.category}</b><time>2026.{post.date}</time></div><h3>{post.title}</h3><p>{post.excerpt}</p><footer><small>{post.readTime} MIN READ</small><span className="read-more">阅读全文 <i>↗</i></span></footer></div></Link></article>; })}</div>
      </section>

      <section className="about shell" id="about" data-reveal>
        <div className="about-intro"><p className="eyebrow">ABOUT THE AUTHOR</p><h2>嗨，我是<br />小星星。</h2><div className="avatar"><span>✦</span><div><i /><i /></div></div></div>
        <div className="about-copy"><p className="about-lead">自由插画师 / 游戏爱好者 / 重度甜食党。</p><p>喜欢蓝紫色的天空、纸张的气味，和一切能让平凡日子变得可爱的事物。</p><div className="tags"><span># 插画</span><span># ACG</span><span># 独立游戏</span><span># 猫咪</span></div></div>
        <blockquote>“希望我的文字，<br />能成为你路过时的一颗小星星。”<small>— XIAOXING</small></blockquote>
      </section>

      <footer className="foot shell"><a className="brand" href="#top"><span className="brand-mark">星</span><span className="brand-name">星屑手记<small>HOSHIKUZU NOTE</small></span></a><p>© 2026 小星 · MADE WITH ♥ AND STARDUST</p><div className="socials"><a href="#top" aria-label="微博">微</a><a href="#top" aria-label="哔哩哔哩">B</a><a href="mailto:hello@example.com" aria-label="邮箱">邮</a></div></footer>
    </main>
  );
}

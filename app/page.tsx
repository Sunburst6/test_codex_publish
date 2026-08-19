"use client";
import {useState} from "react";
const posts=[
 ["日常","在晚风抵达之前","夏末的云像融化的汽水。带上相机，去收集城市里那些发光的缝隙。","☁","08.18"],
 ["绘画","我的蓝色系上色笔记","从固有色到环境光，记录一次清透二次元插画的完整配色过程。","✦","08.12"],
 ["游戏","像素世界漫游指南","最近沉迷的独立游戏，以及藏在小小像素里的巨大浪漫。","◆","08.05"],
 ["音乐","适合雨天循环的歌","戴上耳机，把世界的音量调低一点。这是我的七月私人歌单。","♪","07.28"],
 ["日常","一人份的夏日祭","没有烟花也没关系，西瓜、风铃与窗外的暮色足以组成节日。","花","07.20"],
 ["绘画","画画卡住时，我会做什么","灵感不会消失，它只是偶尔躲起来。分享五个找回手感的小练习。","◎","07.11"]];
const cats=["全部","日常","绘画","游戏","音乐"];
export default function Home(){const [cat,setCat]=useState("全部"),[dark,setDark]=useState(false);const shown=cat==="全部"?posts:posts.filter(p=>p[0]===cat);return <main className={dark?"site dark":"site"}>
 <nav className="nav shell"><a className="brand" href="#top"><b>星</b><span>星屑手记<small>HOSHIKUZU NOTE</small></span></a><div className="links"><a href="#top">首页</a><a href="#stories">文章</a><a href="#about">关于</a></div><button className="theme" onClick={()=>setDark(!dark)} aria-label="切换主题">{dark?"☀":"☾"}</button></nav>
 <header className="hero shell" id="top"><div><p className="eyebrow">✦ WELCOME TO MY LITTLE UNIVERSE</p><h1>把闪闪发光的<br/><em>日常</em>，收藏起来。</h1><p className="lead">你好，我是小星。这里记录画画、游戏与生活碎片。<br/>愿你在我的小小宇宙里，找到片刻好心情。</p><div className="actions"><a href="#stories">开始阅读　→</a><a href="#about">认识一下 ↗</a></div><p className="status">● CURRENTLY：正在画一张关于夏夜的插画</p></div>
 <div className="art"><i className="moon"/><i className="star a">✦</i><i className="star b">✧</i><div className="window"/><div className="girl"><div className="hair"/><div className="face"><i/><i/></div><div className="body"/><div className="book">星<small>NOTE</small></div></div><p>「今日も、世界は温柔的蓝色。」</p></div></header>
 <section className="stories shell" id="stories"><div className="heading"><div><p className="eyebrow">LATEST STORIES</p><h2>最近更新 <em>✦</em></h2></div><p>沿着时间的轨迹，拾起散落的故事。</p></div><div className="filters">{cats.map(c=><button key={c} className={cat===c?"on":""} onClick={()=>setCat(c)}>{c}</button>)}</div><div className="grid">{shown.map((p,i)=><article key={p[1]}><div className={`cover c${(posts.indexOf(p)%6)+1}`}><span>{p[3]}</span><small>0{posts.indexOf(p)+1}</small><i/></div><div className="card"><div className="meta"><b>{p[0]}</b><time>2026.{p[4]}</time></div><h3>{p[1]}</h3><p>{p[2]}</p><footer><small>{4+i} MIN READ</small><button aria-label={`阅读${p[1]}`}>↗</button></footer></div></article>)}</div></section>
 <section className="about shell" id="about"><div className="avatar"><span>✦</span><div><i/><i/></div></div><div><p className="eyebrow">ABOUT THE AUTHOR</p><h2>嗨，我是小星。</h2><p>自由插画师 / 游戏爱好者 / 重度甜食党。喜欢蓝紫色的天空、纸张的气味，和一切能让平凡日子变得可爱的事物。</p><div className="tags"><span># 插画</span><span># ACG</span><span># 独立游戏</span><span># 猫咪</span></div></div><blockquote>“希望我的文字，<br/>能成为你路过时的一颗小星星。”<small>— XIAOXING</small></blockquote></section>
 <div className="foot shell"><a className="brand" href="#top"><b>星</b><span>星屑手记<small>HOSHIKUZU NOTE</small></span></a><p>© 2026 小星 · MADE WITH ♥ AND STARDUST</p><div>微　 B　 邮</div></div>
 </main>}

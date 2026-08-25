import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "../../posts";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const title = `${post.title}｜星屑手记`;
  return {
    title,
    description: post.excerpt,
    openGraph: { title, description: post.excerpt, type: "article", images: [] },
    twitter: { card: "summary", title, description: post.excerpt, images: [] },
  };
}

export default async function PostPage({ params }: PageProps) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const currentIndex = posts.indexOf(post);
  const nextPost = posts[(currentIndex + 1) % posts.length];

  return (
    <main className="site article-site">
      <nav className="nav shell" aria-label="文章导航">
        <Link className="brand" href="/"><span className="brand-mark">星</span><span className="brand-name">星屑手记<small>HOSHIKUZU NOTE</small></span></Link>
        <Link className="back-link" href="/#stories"><span>←</span> 返回文章列表</Link>
      </nav>

      <article className="post-shell">
        <header className="post-header">
          <div className="post-kicker"><span>{post.category}</span><time>2026.{post.date}</time><span>{post.readTime} MIN READ</span></div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className={`post-cover c${currentIndex + 1}`}><span>{post.symbol}</span><i /><small>HOSHIKUZU NOTE / {String(currentIndex + 1).padStart(2, "0")}</small></div>
        </header>

        <div className="post-layout">
          <aside className="post-aside"><span>WRITTEN BY</span><strong>小星</strong><p>自由插画师<br />生活观察者</p></aside>
          <div className="post-body">
            <p className="post-intro">{post.intro}</p>
            {post.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
            {post.quote && <blockquote className="post-quote">“{post.quote}”</blockquote>}
          </div>
        </div>
      </article>

      <section className="next-story shell">
        <div><p className="eyebrow">CONTINUE READING</p><h2>下一篇</h2></div>
        <Link href={`/posts/${nextPost.slug}`}><span>{nextPost.category} · 2026.{nextPost.date}</span><strong>{nextPost.title}</strong><i>↗</i></Link>
      </section>

      <footer className="foot shell"><Link className="brand" href="/"><span className="brand-mark">星</span><span className="brand-name">星屑手记<small>HOSHIKUZU NOTE</small></span></Link><p>© 2026 小星 · MADE WITH ♥ AND STARDUST</p><Link className="back-link" href="/#stories">全部文章 →</Link></footer>
    </main>
  );
}

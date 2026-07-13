import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://127.0.0.1:8000/api";

async function getPage(slug: string) {
  const response = await fetch(`${API_BASE}/governance/public-pages/${slug}/`, {
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Failed to load page");
  return response.json();
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) notFound();

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <iconify-icon icon="lucide:arrow-left" />
          Back to home
        </Link>
        <article className={styles.card}>
          <div className={styles.eyebrow}>Boulot Man CMS</div>
          <h1 className={styles.title}>{page.title}</h1>
          {page.excerpt ? <p className={styles.excerpt}>{page.excerpt}</p> : null}
          <div className={styles.metaRow}>
            {page.is_published ? <span className={`${styles.badge} ${styles.badgeOrange}`}>Published</span> : null}
            {page.show_in_footer ? <span className={styles.badge}>Footer page</span> : null}
          </div>
          {page.content ? <div className={styles.content}>{page.content}</div> : <div className={styles.empty}>This page has no content yet.</div>}
        </article>
      </div>
    </main>
  );
}

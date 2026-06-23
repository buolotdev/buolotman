"use client";

import { useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import styles from "./content.module.css";
import adminStyles from "../admin.module.css";

type CategoryNode = {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  parent?: number | null;
  description?: string;
  is_active?: boolean;
  order?: number;
  subcategories?: CategoryNode[];
};

type CmsPage = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  is_published?: boolean;
  show_in_footer?: boolean;
  sort_order?: number;
};

type CategoryForm = {
  id: number | null;
  name: string;
  slug: string;
  icon: string;
  description: string;
  parent_id: number | null;
  is_active: boolean;
  order: number;
};

type PageForm = {
  id: number | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  is_published: boolean;
  show_in_footer: boolean;
  sort_order: number;
};

const EMPTY_CATEGORY: CategoryForm = {
  id: null,
  name: "",
  slug: "",
  icon: "",
  description: "",
  parent_id: null,
  is_active: true,
  order: 0,
};

const EMPTY_PAGE: PageForm = {
  id: null,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  is_published: false,
  show_in_footer: true,
  sort_order: 0,
};

type TabKey = "categories" | "pages";

export default function AdminContentPage() {
  const [tab, setTab] = useState<TabKey>("categories");
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(EMPTY_CATEGORY);
  const [pageForm, setPageForm] = useState<PageForm>(EMPTY_PAGE);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = useFetch(() => api.getCategories(), []);
  const { data: pagesData, loading: pagesLoading, refetch: refetchPages } = useFetch(() => api.getCmsPages(), []);

  const categories = toArray(categoriesData) as CategoryNode[];
  const pages = useMemo(() => (Array.isArray(pagesData) ? (pagesData as CmsPage[]) : []), [pagesData]);

  const flatCategories = useMemo(() => {
    const items: CategoryNode[] = [];
    const walk = (list: CategoryNode[] = []) => {
      list.forEach((item) => {
        items.push(item);
        if (item.subcategories?.length) walk(item.subcategories);
      });
    };
    walk(categories);
    return items;
  }, [categories]);

  const parentOptions = useMemo(
    () => flatCategories.filter((item) => item.id !== categoryForm.id),
    [flatCategories, categoryForm.id]
  );

  const sortedPages = useMemo(() => {
    return [...pages].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.title.localeCompare(b.title));
  }, [pages]);

  const resetMessage = () => setMessage(null);

  const startNewCategory = (parentId: number | null = null) => {
    setCategoryForm({ ...EMPTY_CATEGORY, parent_id: parentId });
    setTab("categories");
    resetMessage();
  };

  const startEditCategory = (category: CategoryNode) => {
    setCategoryForm({
      id: category.id,
      name: category.name || "",
      slug: category.slug || "",
      icon: category.icon || "",
      description: category.description || "",
      parent_id: typeof category.parent === "number" ? category.parent : null,
      is_active: Boolean(category.is_active ?? true),
      order: Number(category.order || 0),
    });
    setTab("categories");
    resetMessage();
  };

  const startNewPage = () => {
    setPageForm(EMPTY_PAGE);
    setTab("pages");
    resetMessage();
  };

  const startEditPage = (page: CmsPage) => {
    setPageForm({
      id: page.id,
      title: page.title || "",
      slug: page.slug || "",
      excerpt: page.excerpt || "",
      content: page.content || "",
      is_published: Boolean(page.is_published),
      show_in_footer: Boolean(page.show_in_footer ?? true),
      sort_order: Number(page.sort_order || 0),
    });
    setTab("pages");
    resetMessage();
  };

  const saveCategory = async () => {
    if (!categoryForm.name.trim()) {
      setMessage("Category name is required.");
      return;
    }

    setSaving(true);
    resetMessage();
    try {
      const payload = {
        name: categoryForm.name.trim(),
        slug: categoryForm.slug.trim(),
        icon: categoryForm.icon.trim(),
        description: categoryForm.description.trim(),
        parent_id: categoryForm.parent_id,
        is_active: categoryForm.is_active,
        order: categoryForm.order,
      };

      if (categoryForm.id) {
        await api.updateCategory(categoryForm.id, payload);
      } else {
        await api.createCategory(payload);
      }

      await refetchCategories();
      setCategoryForm(EMPTY_CATEGORY);
      setMessage("Category saved and reflected on the public site.");
    } catch (err: any) {
      setMessage(err?.message || "Could not save category.");
    } finally {
      setSaving(false);
    }
  };

  const savePage = async () => {
    if (!pageForm.title.trim() || !pageForm.slug.trim()) {
      setMessage("Page title and slug are required.");
      return;
    }

    setSaving(true);
    resetMessage();
    try {
      const payload = {
        title: pageForm.title.trim(),
        slug: pageForm.slug.trim(),
        excerpt: pageForm.excerpt.trim(),
        content: pageForm.content,
        is_published: pageForm.is_published,
        show_in_footer: pageForm.show_in_footer,
        sort_order: pageForm.sort_order,
      };

      if (pageForm.id) {
        await api.updateCmsPage(pageForm.id, payload);
      } else {
        await api.createCmsPage(payload);
      }

      await refetchPages();
      setPageForm(EMPTY_PAGE);
      setMessage("Page saved and published pages will show on the frontend.");
    } catch (err: any) {
      setMessage(err?.message || "Could not save page.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm("Delete this category? This will affect tasks and the public category lists.")) return;
    try {
      await api.deleteCategory(id);
      await refetchCategories();
      if (categoryForm.id === id) setCategoryForm(EMPTY_CATEGORY);
      setMessage("Category deleted.");
    } catch (err: any) {
      setMessage(err?.message || "Could not delete category.");
    }
  };

  const deletePage = async (id: number) => {
    if (!window.confirm("Delete this page?")) return;
    try {
      await api.deleteCmsPage(id);
      await refetchPages();
      if (pageForm.id === id) setPageForm(EMPTY_PAGE);
      setMessage("Page deleted.");
    } catch (err: any) {
      setMessage(err?.message || "Could not delete page.");
    }
  };

  return (
    <div className={adminStyles.dashboardBody}>
      <div className={adminStyles.pageHeader}>
        <div className={adminStyles.headerContent}>
          <h1>Content Management</h1>
          <p>Manage categories and public pages. Changes show up on the frontend without hard-coded content.</p>
        </div>
      </div>

      <div className={styles.pageShell}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>CMS Control</h2>
              <p className={styles.panelCopy}>Use categories for discovery and pages for public content like policies, guides, and help pages.</p>
            </div>
            <div className={styles.tabBar} role="tablist" aria-label="Content management tabs">
              <button type="button" className={`${styles.tabButton} ${tab === "categories" ? styles.tabButtonActive : ""}`} onClick={() => setTab("categories")}>
                Categories
              </button>
              <button type="button" className={`${styles.tabButton} ${tab === "pages" ? styles.tabButtonActive : ""}`} onClick={() => setTab("pages")}>
                Pages
              </button>
            </div>
          </div>

          {message ? (
            <div className={styles.footerNote} style={{ marginBottom: 16, borderColor: "rgba(255,69,0,0.18)" }}>
              <strong>Notice</strong>
              <div className={styles.helpText} style={{ marginTop: 6 }}>{message}</div>
            </div>
          ) : null}

          <div className={styles.sectionGrid}>
            <section className={styles.panel} style={{ padding: 18, boxShadow: "none" }}>
              {tab === "categories" ? (
                <>
                  <div className={styles.panelHeader} style={{ marginBottom: 12 }}>
                    <div>
                      <h3 className={styles.panelTitle} style={{ fontSize: 18 }}>Categories</h3>
                      <p className={styles.panelCopy}>These categories power the homepage, search, post-task flow, and category dropdowns.</p>
                    </div>
                    <div className={styles.toolbar}>
                      <button type="button" className={styles.buttonGhost} onClick={() => refetchCategories()}>
                        Refresh
                      </button>
                      <button type="button" className={styles.buttonSecondary} onClick={() => startNewCategory(null)}>
                        + New Category
                      </button>
                    </div>
                  </div>

                  {categoriesLoading ? (
                    <div className={styles.emptyState}>Loading categories...</div>
                  ) : categories.length === 0 ? (
                    <div className={styles.emptyState}>No categories yet. Add the first one.</div>
                  ) : (
                    <div className={styles.list}>
                      {categories.map((category) => (
                        <CategoryTree
                          key={category.id}
                          category={category}
                          level={0}
                          selectedId={categoryForm.id}
                          onEdit={startEditCategory}
                          onDelete={deleteCategory}
                          onAddChild={startNewCategory}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.panelHeader} style={{ marginBottom: 12 }}>
                    <div>
                      <h3 className={styles.panelTitle} style={{ fontSize: 18 }}>Pages</h3>
                      <p className={styles.panelCopy}>Published pages are shown publicly in the frontend footer and at /pages/your-slug.</p>
                    </div>
                    <div className={styles.toolbar}>
                      <button type="button" className={styles.buttonGhost} onClick={() => refetchPages()}>
                        Refresh
                      </button>
                      <button type="button" className={styles.buttonSecondary} onClick={startNewPage}>
                        + New Page
                      </button>
                    </div>
                  </div>

                  {pagesLoading ? (
                    <div className={styles.emptyState}>Loading pages...</div>
                  ) : sortedPages.length === 0 ? (
                    <div className={styles.emptyState}>No pages yet. Create one for privacy, terms, help, or any public content.</div>
                  ) : (
                    <div className={styles.list}>
                      {sortedPages.map((page) => {
                        const active = pageForm.id === page.id;
                        return (
                          <article key={page.id} className={`${styles.treeItem} ${active ? styles.treeItemActive : ""}`}>
                            <div className={styles.treeRow}>
                              <div>
                                <div className={styles.treeTitle}>{page.title}</div>
                                <div className={styles.treeMeta}>/{page.slug}</div>
                                {page.excerpt ? <div className={styles.treeMeta}>{page.excerpt}</div> : null}
                                <div className={styles.badgeRow}>
                                  <span className={`${styles.badge} ${page.is_published ? styles.badgeOrange : styles.badgeBlue}`}>
                                    {page.is_published ? "Published" : "Draft"}
                                  </span>
                                  {page.show_in_footer ? <span className={`${styles.badge} ${styles.badgeBlue}`}>Footer link</span> : null}
                                  <span className={`${styles.badge} ${styles.badgeBlue}`}>Order {page.sort_order || 0}</span>
                                </div>
                              </div>
                              <div className={styles.toolbar}>
                                <button type="button" className={styles.buttonGhost} onClick={() => startEditPage(page)}>
                                  Edit
                                </button>
                                <button type="button" className={styles.buttonDanger} onClick={() => deletePage(page.id)}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>

            <section className={styles.panel} style={{ padding: 18, boxShadow: "none" }}>
              {tab === "categories" ? (
                <div className={styles.formGrid}>
                  <div>
                    <h3 className={styles.panelTitle} style={{ fontSize: 18 }}>{categoryForm.id ? "Edit Category" : "Create Category"}</h3>
                    <p className={styles.panelCopy}>Any category you save here updates the public website immediately after reload.</p>
                  </div>

                  <Field label="Name" value={categoryForm.name} onChange={(value) => setCategoryForm((current) => ({ ...current, name: value }))} />
                  <Field label="Slug" value={categoryForm.slug} onChange={(value) => setCategoryForm((current) => ({ ...current, slug: value }))} helperText="Keep it URL-safe. Leave blank to reuse the name if you prefer." />
                  <Field label="Icon" value={categoryForm.icon} onChange={(value) => setCategoryForm((current) => ({ ...current, icon: value }))} helperText="Optional icon key or short label." />
                  <Field
                    label="Description"
                    value={categoryForm.description}
                    onChange={(value) => setCategoryForm((current) => ({ ...current, description: value }))}
                    textarea
                  />
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Parent category</span>
                    <select
                      className={styles.select}
                      value={categoryForm.parent_id ?? ""}
                      onChange={(e) =>
                        setCategoryForm((current) => ({
                          ...current,
                          parent_id: e.target.value ? Number(e.target.value) : null,
                        }))
                      }
                    >
                      <option value="">None</option>
                      {parentOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className={styles.switchRow}>
                    <label className={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={categoryForm.is_active}
                        onChange={(e) => setCategoryForm((current) => ({ ...current, is_active: e.target.checked }))}
                      />
                      Active
                    </label>
                  </div>

                  <Field
                    label="Sort order"
                    value={String(categoryForm.order)}
                    onChange={(value) => setCategoryForm((current) => ({ ...current, order: Number(value || 0) }))}
                    helperText="Lower numbers appear first."
                  />

                  <div className={styles.toolbar}>
                    <button type="button" className={styles.buttonPrimary} onClick={saveCategory} disabled={saving}>
                      {saving ? "Saving..." : "Save Category"}
                    </button>
                    <button type="button" className={styles.buttonGhost} onClick={() => setCategoryForm(EMPTY_CATEGORY)}>
                      Reset
                    </button>
                  </div>

                  <div className={styles.footerNote}>
                    <strong>Frontend sync</strong>
                    <div className={styles.helpText} style={{ marginTop: 6 }}>
                      The home page, search page, and post-task flow read categories from the backend, so changes show up without hard-coded data.
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.formGrid}>
                  <div>
                    <h3 className={styles.panelTitle} style={{ fontSize: 18 }}>{pageForm.id ? "Edit Page" : "Create Page"}</h3>
                    <p className={styles.panelCopy}>Use pages for public content like terms, privacy, guides, FAQs, or other CMS pages.</p>
                  </div>

                  <Field label="Title" value={pageForm.title} onChange={(value) => setPageForm((current) => ({ ...current, title: value }))} />
                  <Field label="Slug" value={pageForm.slug} onChange={(value) => setPageForm((current) => ({ ...current, slug: value }))} helperText="This becomes the public URL: /pages/your-slug" />
                  <Field label="Excerpt" value={pageForm.excerpt} onChange={(value) => setPageForm((current) => ({ ...current, excerpt: value }))} />
                  <Field
                    label="Content"
                    value={pageForm.content}
                    onChange={(value) => setPageForm((current) => ({ ...current, content: value }))}
                    textarea
                    helperText="Write the content that will appear on the public page."
                  />

                  <div className={styles.switchRow}>
                    <label className={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={pageForm.is_published}
                        onChange={(e) => setPageForm((current) => ({ ...current, is_published: e.target.checked }))}
                      />
                      Published
                    </label>
                    <label className={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={pageForm.show_in_footer}
                        onChange={(e) => setPageForm((current) => ({ ...current, show_in_footer: e.target.checked }))}
                      />
                      Show in footer
                    </label>
                  </div>

                  <Field
                    label="Sort order"
                    value={String(pageForm.sort_order)}
                    onChange={(value) => setPageForm((current) => ({ ...current, sort_order: Number(value || 0) }))}
                    helperText="Lower numbers appear earlier in public lists."
                  />

                  <div className={styles.toolbar}>
                    <button type="button" className={styles.buttonPrimary} onClick={savePage} disabled={saving}>
                      {saving ? "Saving..." : "Save Page"}
                    </button>
                    <button type="button" className={styles.buttonGhost} onClick={() => setPageForm(EMPTY_PAGE)}>
                      Reset
                    </button>
                  </div>

                  <div className={styles.footerNote}>
                    <strong>Frontend sync</strong>
                    <div className={styles.helpText} style={{ marginTop: 6 }}>
                      Published pages are fetched by the footer and the public `/pages/[slug]` route.
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryTree({
  category,
  level,
  selectedId,
  onEdit,
  onDelete,
  onAddChild,
}: {
  category: CategoryNode;
  level: number;
  selectedId: number | null;
  onEdit: (category: CategoryNode) => void;
  onDelete: (id: number) => void;
  onAddChild: (parentId: number | null) => void;
}) {
  return (
    <div className={level > 0 ? styles.indent : undefined}>
      <article className={`${styles.treeItem} ${selectedId === category.id ? styles.treeItemActive : ""}`}>
        <div className={styles.treeRow}>
          <div>
            <div className={styles.treeTitle}>
              {category.name}
              {category.is_active === false ? <span className={`${styles.badge} ${styles.badgeBlue}`}>Inactive</span> : null}
            </div>
            <div className={styles.treeMeta}>/{category.slug}</div>
            {category.description ? <div className={styles.treeMeta}>{category.description}</div> : null}
            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.badgeBlue}`}>Order {category.order || 0}</span>
              {category.parent ? <span className={`${styles.badge} ${styles.badgeOrange}`}>Child category</span> : <span className={`${styles.badge} ${styles.badgeOrange}`}>Root category</span>}
            </div>
          </div>
          <div className={styles.toolbar}>
            {level === 0 ? (
              <button type="button" className={styles.buttonGhost} onClick={() => onAddChild(category.id)}>
                + Subcategory
              </button>
            ) : null}
            <button type="button" className={styles.buttonGhost} onClick={() => onEdit(category)}>
              Edit
            </button>
            <button type="button" className={styles.buttonDanger} onClick={() => onDelete(category.id)}>
              Delete
            </button>
          </div>
        </div>
      </article>

      {category.subcategories?.length ? (
        <div className={styles.list} style={{ marginTop: 10 }}>
          {category.subcategories.map((sub) => (
            <CategoryTree
              key={sub.id}
              category={sub}
              level={level + 1}
              selectedId={selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  helperText?: string;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {textarea ? (
        <textarea className={styles.textarea} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={styles.input} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {helperText ? <span className={styles.helpText}>{helperText}</span> : null}
    </label>
  );
}

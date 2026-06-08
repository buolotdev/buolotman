"use client";

import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

type Category = {
  id: number | string;
  name: string;
};

export default function AdminContentPage() {
  const { data: categoriesData, loading } = useFetch(() => api.getCategories(), []);
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  return (
    <main style={{ padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b" }}>Admin dashboard</p>
            <h1 style={{ margin: "4px 0 0" }}>Content Management</h1>
          </div>
          <Link href="/dashboard/admin" style={{ color: "#0f172a" }}>Back to dashboard</Link>
        </header>

        <section style={{ background: "#fff", borderRadius: 20, padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>Categories</h2>
          {loading ? (
            <p>Loading categories...</p>
          ) : categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {categories.map((category) => {
                const item = category as Category;
                return <li key={item.id}>{item.name}</li>;
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

"use client";

import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import styles from "./admin-verification.module.css";

export default function AdminVerificationPage() {
  const toast = useToast();
  const dialog = useDialog();
  const { data: pendingUsers, loading: pendingLoading, refetch: refetchPending } = useFetch(() => api.adminListUsers({ verified: "false" }), []);

  return (
    <div className={styles.dashboardBody}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1>Verification Requests</h1>
          <p>Review submitted documents to verify identity and professional credentials.</p>
        </div>
      </div>

      <div className={styles.toolbarFilters}>
        <div className={styles.filterDropdown}>
          Status: Pending Review <iconify-icon icon="lucide:chevron-down" />
        </div>
        <div className={styles.filterDropdown}>
          Role: All <iconify-icon icon="lucide:chevron-down" />
        </div>
        <div className={styles.filterDropdown}>
          Sort by: Newest First <iconify-icon icon="lucide:chevron-down" />
        </div>
      </div>

      <div style={{ padding: pendingLoading ? 60 : 24 }}>
        {pendingLoading ? (
          <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading...</p>
        ) : pendingUsers && pendingUsers.length > 0 ? (
          <div style={{ display: "grid", gap: 12 }}>
            {pendingUsers.map((u: any) => (
              <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div>
                  <strong>{`${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username}</strong>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{u.username} • {u.role} • {u.country || "—"}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={async () => {
                      try {
                        await api.adminVerifyUser(u.id);
                        refetchPending();
                        toast.success("User approved", `${u.first_name || u.username} is now verified.`);
                      } catch (err: any) { toast.error("Approval failed", err?.message); }
                    }}
                    style={{ padding: "8px 16px", background: "#16a34a", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={async () => {
                      const ok = await dialog.confirm({
                        title: "Reject verification?",
                        message: `This will suspend ${u.first_name || u.username}. They will lose access immediately.`,
                        confirmText: "Reject & Suspend",
                        variant: "danger",
                      });
                      if (!ok) return;
                      try {
                        await api.adminSuspendUser(u.id, "suspend");
                        refetchPending();
                        toast.warning("User rejected", `${u.first_name || u.username} has been suspended.`);
                      } catch (err: any) { toast.error("Rejection failed", err?.message); }
                    }}
                    style={{ padding: "8px 16px", background: "#dc2626", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
            <iconify-icon icon="lucide:shield-check" style={{ fontSize: 48, marginBottom: 16, display: "block", opacity: 0.4 }} />
            <p>Verification queue is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./TaskBoard.module.css";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { SkeletonBlock } from "./skeleton/Skeleton";
import { useRouter } from "next/navigation";

export default function TaskBoard() {
  const router = useRouter();
  const { data: tasksData, loading, error, refetch } = useFetch(() => api.getTasks(), []);
  
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleApply = (task: any) => {
    setSelectedTask(task);
    setShowSuccess(false);
    setSubmitError(null);
    setAmount("");
    setMessage("");
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    setShowSuccess(false);

    try {
      await api.submitBid(selectedTask.id, {
        amount: parseFloat(amount),
        message: message,
      });
      setShowSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit proposal. You may have already applied.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tasks = Array.isArray(tasksData) ? tasksData : (tasksData?.results || []);

  return (
    <div>
      {/* SEARCH BAR */}
      <section className={styles.searchBar}>
        <div className={styles.searchGrid}>
          <input placeholder="Find tasks near you" />
          <select>
            <option>All</option>
            <option>Open only</option>
          </select>
          <select><option>Rwanda</option></select>
          <select><option>Kigali</option></select>
          <select>
            <option>All Categories</option>
            <option>Software & IT</option>
            <option>Construction</option>
            <option>Electrical</option>
            <option>Cleaning</option>
            <option>Logistics</option>
          </select>
          <button className={styles.searchBtn}>Search</button>
        </div>
      </section>

      {/* FILTER PANEL */}
      <section className={styles.filterPanel}>
        <input placeholder="Max Budget" />
        <select><option>Onsite</option><option>Remote</option></select>
        <select><option>Flexible</option><option>Programmed</option><option>Urgent</option></select>
        <select><option>Open</option><option>Assigned</option><option>Completed</option></select>
        <select><option>Any Date</option><option>Today</option><option>This Week</option></select>
        <select><option>Any Category</option></select>
      </section>

      {/* TASK GRID */}
      {loading ? (
        <div className={styles.taskGrid}>
           <SkeletonBlock height="200px" />
           <SkeletonBlock height="200px" />
           <SkeletonBlock height="200px" />
        </div>
      ) : error ? (
        <p>Error loading tasks: {error}</p>
      ) : tasks.length === 0 ? (
        <p style={{textAlign: 'center', padding: '40px', color: '#666'}}>No tasks available at the moment.</p>
      ) : (
        <div className={styles.taskGrid}>
          {tasks.map((task: any) => (
            <div key={task.id} className={styles.taskCard}>
              <div className={styles.taskHeader}>
                <div style={{width: 50, height: 50, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <iconify-icon icon="lucide:briefcase" style={{fontSize: 24, color: '#666'}}></iconify-icon>
                </div>
                <div>
                  <h3 className={styles.taskTitle}>{task.title}</h3>
                  <p className={styles.taskMeta}>
                    <iconify-icon icon="lucide:clock" className={styles.metaIcon}></iconify-icon>
                    {new Date(task.created_at).toLocaleDateString()}
                    <span style={{ margin: "0 6px" }}>&bull;</span>
                    <iconify-icon icon="lucide:map-pin" className={styles.metaIcon}></iconify-icon>
                    {task.location || 'Remote'}
                  </p>
                </div>
              </div>
              <div className={styles.tags}>
                <span className={`${styles.tag} ${styles.tagFlexible}`}>{task.status}</span>
                {task.category?.name && <span className={styles.tag}>{task.category.name}</span>}
              </div>
              <div className={styles.taskFooter}>
                <span className={styles.taskPrice}>{task.budget_max ? `${task.budget_max} XOF` : 'Negotiable'}</span>
                <button className={styles.applyBtn} onClick={() => handleApply(task)}>Apply</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedTask && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={closeModal}>&times;</button>
            
            <div className={styles.modalHeader}>
              <div style={{width: 72, height: 72, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <iconify-icon icon="lucide:briefcase" style={{fontSize: 32, color: '#666'}}></iconify-icon>
              </div>
              <div>
                <h2 className={styles.modalTitle}>{selectedTask.title}</h2>
                <p className={styles.modalClient}>
                  <iconify-icon icon="lucide:user" style={{ fontSize: 16 }}></iconify-icon>
                  Posted by {selectedTask.client?.first_name || 'Client'}
                </p>
              </div>
            </div>

            <div className={styles.modalBlock}>
              <label>Description</label>
              <p>{selectedTask.description || "No description provided."}</p>
            </div>

            <div className={styles.modalBlock}>
              <label>Location</label>
              <p>{selectedTask.location || "Remote"}</p>
            </div>

            <div className={styles.modalBlock}>
              <label>Date & Urgency</label>
              <p>{new Date(selectedTask.created_at).toLocaleDateString()} - <strong style={{ color: '#c0392b' }}>{selectedTask.status}</strong></p>
            </div>

            <div className={styles.modalBlock}>
              <label>Budget</label>
              <p><strong>{selectedTask.budget_min} - {selectedTask.budget_max} XOF</strong></p>
            </div>

            <form className={styles.actionBox} onSubmit={submitApplication}>
              <input 
                type="number" 
                placeholder="Your Proposed Price (XOF)" 
                required 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <textarea 
                rows={3} 
                placeholder="Why are you the best fit for this task? Include details of your experience." 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
              {submitError && <p style={{ color: '#e74c3c', fontWeight: 600, marginTop: '8px' }}>{submitError}</p>}
              {showSuccess && <p style={{ color: '#1aa260', fontWeight: 600, marginTop: '8px' }}>Application sent successfully!</p>}
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./TaskBoard.module.css";

// MOCK DATA GENERATOR
const generateTasks = () => {
  const tasks = [];
  const urgencies = ["URGENT", "FLEXIBLE", "PROGRAMMED"];
  for (let i = 1; i <= 24; i++) {
    const urgency = urgencies[i % 3];
    let tagClass = styles.tagUrgent;
    if (urgency === "FLEXIBLE") tagClass = styles.tagFlexible;
    if (urgency === "PROGRAMMED") tagClass = styles.tagProgrammed;

    let urgencyText = "Today before 6PM";
    if (urgency === "FLEXIBLE") urgencyText = "Anytime";
    if (urgency === "PROGRAMMED") urgencyText = "Before Sunday";

    tasks.push({
      id: i,
      title: `Service Task ${i}`,
      client: "Sarah Jenkins",
      posted: `Posted ${i} hours ago`,
      urgency,
      tagClass,
      urgencyText,
      price: `$${300 + i * 10}`,
      avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
      description: "Looking for an experienced technician to help with this task. Must have own tools and be able to complete the work efficiently. Please provide a quote if you need more than the budget.",
      location: "Kigali, Rwanda",
      date: "August 20, 2026",
      status: "Open"
    });
  }
  return tasks;
};

const TASKS = generateTasks();

export default function TaskBoard() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleApply = (task: any) => {
    setSelectedTask(task);
    setShowSuccess(false);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

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
      <div className={styles.taskGrid}>
        {TASKS.map((task) => (
          <div key={task.id} className={styles.taskCard}>
            <div className={styles.taskHeader}>
              <Image src={task.avatar} alt="Client" width={50} height={50} className={styles.clientPic} />
              <div>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                <p className={styles.taskMeta}>
                  <iconify-icon icon="lucide:clock" className={styles.metaIcon}></iconify-icon>
                  {task.posted}
                  <span style={{ margin: "0 6px" }}>&bull;</span>
                  <iconify-icon icon="lucide:map-pin" className={styles.metaIcon}></iconify-icon>
                  {task.location}
                </p>
              </div>
            </div>
            <div className={styles.tags}>
              <span className={`${styles.tag} ${task.tagClass}`}>{task.urgency}</span>
              <span className={styles.tag}>{task.urgencyText}</span>
            </div>
            <div className={styles.taskFooter}>
              <span className={styles.taskPrice}>{task.price}</span>
              <button className={styles.applyBtn} onClick={() => handleApply(task)}>Apply</button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
        <button className={styles.pageBtn}>2</button>
        <button className={styles.pageBtn}>3</button>
      </div>

      {/* MODAL */}
      {selectedTask && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={closeModal}>&times;</button>
            
            <div className={styles.modalHeader}>
              <Image src={selectedTask.avatar} alt="Client" width={72} height={72} />
              <div>
                <h2 className={styles.modalTitle}>{selectedTask.title}</h2>
                <p className={styles.modalClient}>
                  <iconify-icon icon="lucide:user" style={{ fontSize: 16 }}></iconify-icon>
                  Posted by {selectedTask.client}
                </p>
              </div>
            </div>

            <div className={styles.modalBlock}>
              <label>Description</label>
              <p>{selectedTask.description}</p>
            </div>

            <div className={styles.modalBlock}>
              <label>Location</label>
              <p>{selectedTask.location}</p>
            </div>

            <div className={styles.modalBlock}>
              <label>Date & Urgency</label>
              <p>{selectedTask.date} - <strong style={{ color: '#c0392b' }}>{selectedTask.urgency}</strong></p>
            </div>

            <div className={styles.modalBlock}>
              <label>Budget</label>
              <p><strong>{selectedTask.price}</strong></p>
            </div>

            <div className={styles.modalMap}>
              {/* Map Placeholder */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <iconify-icon icon="lucide:map" style={{ fontSize: 32 }}></iconify-icon>
                <span>Interactive Map View</span>
              </div>
            </div>

            <form className={styles.actionBox} onSubmit={submitApplication}>
              <input type="number" placeholder="Your Proposed Price ($)" required />
              <textarea rows={3} placeholder="Why are you the best fit for this task? Include details of your experience." required></textarea>
              <button type="submit">Submit Application</button>
              {showSuccess && <p style={{ color: '#1aa260', fontWeight: 600, marginTop: '8px' }}>Application sent successfully!</p>}
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

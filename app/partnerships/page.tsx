"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

export default function PartnershipsPage() {
  const router = useRouter();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Live tasks data for slider
  const { data: liveTasksData, error: liveTasksError } = useFetch(
    () => api.getTasks({ sort: "newest", limit: "6" }),
    []
  );

  const tasks = liveTasksData?.results || [];

  const [liveTaskIndex, setLiveTaskIndex] = useState(0);

  useEffect(() => {
    if (tasks.length === 0) return;
    const interval = setInterval(() => {
      setLiveTaskIndex((prev) => (prev + 1) % tasks.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchRole) params.set("type", searchRole.toLowerCase());
    if (searchLocation) params.set("location", searchLocation);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div style={{ background: "#f4f6fa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1>
              Join Africa’s growing workforce marketplace and collaborate with a trusted
              platform connecting professionals, businesses, and communities at scale.
            </h1>

            <p>
              Search live service requests posted by clients around you and get hired securely.
            </p>

            <form className={styles.heroSearch} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="What service are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select value={searchRole} onChange={(e) => setSearchRole(e.target.value)}>
                <option value="">Who are you searching for?</option>
                <option value="technician">Technicians</option>
                <option value="company">Companies</option>
                <option value="client">Clients</option>
              </select>

              <select value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}>
                <option value="">Select location</option>
                <option value="Kigali">Kigali</option>
                <option value="Gasabo">Gasabo</option>
                <option value="Remote">Remote</option>
                <option value="Global">Global</option>
              </select>

              <button type="submit">Search</button>
            </form>

            <div className={styles.heroButtons}>
              <Link href="/search" className={styles.btnPrimary}>
                Find Tasks
              </Link>
              <Link href="/signup?role=technician" className={styles.btnOutline}>
                Post Your Service
              </Link>
            </div>
          </div>

          <div className={styles.taskSlider}>
            <div className={styles.sliderHeader}>
              🔴 Live requests on Boulot Man
            </div>
            <div className={styles.taskWindow}>
              <div
                className={styles.taskTrack}
                style={{
                  transform: `translateX(-${liveTaskIndex * 100}%)`,
                  width: `${tasks.length > 0 ? tasks.length * 100 : 100}%`,
                }}
              >
                {tasks.length > 0 ? (
                  tasks.map((task: any) => (
                    <div
                      className={styles.taskCard}
                      key={task.id}
                      style={{ width: `${100 / tasks.length}%` }}
                    >
                      <div className={styles.taskHeader}>
                        <div className={styles.taskUser}>
                          <img
                            src={
                              task.client?.avatar_url ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                task.client?.first_name || "User"
                              )}&background=001F3F&color=fff`
                            }
                            alt="User avatar"
                            className={styles.taskAvatar}
                          />
                          <span className={styles.taskTitle}>{task.title}</span>
                        </div>
                        <span className={styles.taskPrice}>
                          {task.budget ? `${task.budget} XOF` : "Quote required"}
                        </span>
                      </div>

                      <div className={styles.taskMeta}>
                        📍 {task.location || "Remote"} &bull; {task.budget_type === "fixed" ? "Fixed Price" : "Hourly Rate"}
                      </div>

                      <p className={styles.taskDesc}>
                        {task.description || "No description provided for this job."}
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "40px 26px", color: "#6b7a90", textAlign: "center", width: "100%" }}>
                    {liveTasksError ? "Failed to load live requests." : "Loading live requests..."}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.taskCta}>
              <Link href="/search">
                See more people looking for services around you &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

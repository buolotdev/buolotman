"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function PartnershipsPage() {
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Live tasks data for slider
  const { data: liveTasksData, error: liveTasksError } = useFetch(
    () => api.getTasks({ sort: "newest", limit: "8" }),
    []
  );

  const tasks = liveTasksData?.results || [];

  const [liveTaskIndex, setLiveTaskIndex] = useState(0);

  useEffect(() => {
    if (tasks.length === 0) return;
    const interval = setInterval(() => {
      setLiveTaskIndex((prev) => {
        const count = tasks.length;
        if (count === 0) return 0;
        return (prev + 1) % count;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (searchRole) params.set("type", searchRole.toLowerCase());
    if (searchLocation) params.set("location", searchLocation);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleApplyClick = (e: React.MouseEvent, taskId: number) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login?next=" + encodeURIComponent(`/dashboard/technician/tasks/${taskId}`));
      } else {
        router.push(`/dashboard/technician/tasks/${taskId}`);
      }
    }
  };

  return (
    <div id="homepage-screen">
      <Header />

      <section id="hero" className="bm-main-hero">
        <div className="bm-main-hero-grid">
          <div>
            <h1>
              Join Africa’s growing workforce marketplace and collaborate with a trusted
              platform connecting professionals, businesses, and communities at scale.
            </h1>

            <p>
              Search live service requests posted by clients around you and get hired securely.
            </p>

            <form className="bm-main-search" onSubmit={handleSearchSubmit}>
              <div className="bm-main-search-field">
                <input
                  className="bm-main-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {!isSearchFocused && !searchQuery && (
                  <div className="bm-main-search-marquee">
                    <span>
                      What service do you offer or are you looking for? e.g Electrical installation, Web development, Plumbing, Solar systems, CCTV installation, Mobile apps
                    </span>
                  </div>
                )}
              </div>

              <select value={searchRole} onChange={(e) => setSearchRole(e.target.value)}>
                <option value="">Who are you searching for?</option>
                <option value="technician">Technicians</option>
                <option value="company">Companies</option>
                <option value="client">Clients</option>
              </select>

              <select value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}>
                <option value="Global">Global</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
                <option value="Ivory Coast">Ivory Coast</option>
                <option value="Cameroon">Cameroon</option>
              </select>

              <button type="submit">Search</button>
            </form>

            <div className="bm-main-cta">
              <Link href="/search" className="bm-main-cta-provider" style={{ textDecoration: "none" }}>
                Find Tasks
              </Link>
              <Link href="/signup?role=technician" className="bm-main-cta-post" style={{ textDecoration: "none" }}>
                Post Your Service
              </Link>
            </div>
          </div>

          <div className="bm-main-live-box">
            <h4>🔴 Live Tasks</h4>
            <div className="bm-main-task-window">
              <div
                className="bm-main-task-track"
                style={{ transform: `translateY(-${liveTaskIndex * 85}px)` }}
              >
                {tasks.length > 0 ? (
                  [...tasks, ...tasks].map((task: any, i: number) => (
                    <div className="bm-main-task" key={`${task.id}-${i}`}>
                      <div className="bm-main-task-top">
                        <div className="bm-main-task-user">
                          <img
                            src={
                              task.client?.avatar_url ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                task.client?.first_name || "User"
                              )}&background=001F3F&color=fff`
                            }
                            alt="User"
                          />
                          <div className="bm-main-task-title">{task.title}</div>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => handleApplyClick(e, task.id)}
                          className="bm-main-task-apply"
                          style={{ textDecoration: "none" }}
                        >
                          Apply
                        </a>
                      </div>
                      <div className="bm-main-task-meta">
                        📍 {task.location || "Remote"} &bull; {task.budget_type === "fixed" ? "Fixed" : "Hourly"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "20px", color: "#64748b" }}>
                    {liveTasksError ? "Failed to load live requests." : "Loading tasks..."}
                  </div>
                )}
              </div>
            </div>
            <div className="bm-main-live-cta">
              <Link href="/find-tasks" style={{ textDecoration: "none" }}>
                See more people finding services around you &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

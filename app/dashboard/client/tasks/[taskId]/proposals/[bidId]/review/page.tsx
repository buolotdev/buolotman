"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";

const feedbackOptions = [
  "Professional",
  "Punctual",
  "High Quality Work",
  "Great Communication",
  "Went Above & Beyond",
] as const;

const computeFirstName = (bid: any) => {
  const name = bid?.bidder || "";
  return name ? name.split(" ")[0] : "";
};

export default function ProposalReviewPage({ params }: { params: Promise<{ taskId: string; bidId: string }> }) {
  const { taskId, bidId } = use(params);
  const toast = useToast();

  const { data: task, loading: taskLoading } = useFetch(() => api.getTask(Number(taskId)), [taskId]);
  const { data: bidsData, loading: bidLoading } = useFetch(() => api.getTaskBids(Number(taskId)), [taskId]);

  const bid = useMemo(() => {
    if (!bidsData) return null;
    const list = Array.isArray(bidsData) ? bidsData : bidsData?.results || [];
    return list.find((b: any) => String(b.id) === bidId) || null;
  }, [bidsData, bidId]);

  const { data: prof, loading: profLoading } = useFetch(
    () => (bid?.technician ? api.getUserProfile(Number(bid.technician)) : Promise.resolve(null)),
    [bid]
  );

  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loading = taskLoading || bidLoading || profLoading;

  const acceptedBid = useMemo(() => {
    if (!bidsData) return null;
    const list = Array.isArray(bidsData) ? bidsData : bidsData?.results || [];
    return list.find((b: any) => b.status === "accepted") || null;
  }, [bidsData]);
  const lockedToAcceptedBid = Boolean(acceptedBid && String((acceptedBid as any).id) !== bidId);

  if (!loading && (!task || !bid)) notFound();
  if (lockedToAcceptedBid) {
    return (
      <main className={styles.page}>
        <div className={styles.logoBar}>
          <Link href="/" className={styles.logoLink} aria-label="Boulot Man home">
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={280} height={72} className={styles.logoImage} priority />
          </Link>
        </div>
        <div className={styles.shell}>
          <section className={styles.successCard}>
            <h2>Proposal already accepted</h2>
            <p>This task already has a hired professional. Review is only available for the accepted proposal.</p>
            <div className={styles.successActions}>
              <Link href={`/dashboard/client/tasks/${task?.id}/proposals`} className={styles.secondaryButton}>
                View accepted proposal
              </Link>
              <Link href={`/dashboard/client/tasks/${task?.id}`} className={styles.primaryButton}>
                Back to task
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const firstName = computeFirstName(bid);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.logoBar}>
          <Link href="/" className={styles.logoLink} aria-label="Boulot Man home">
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={280} height={72} className={styles.logoImage} priority />
          </Link>
        </div>
        <div className={styles.shell}>
          <SkeletonBlock style={{ width: "40%", height: 24, marginBottom: 16 }} />
          <SkeletonBlock style={{ width: "60%", height: 16 }} />
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className={styles.page}>
        <div className={styles.logoBar}>
          <Link href="/" className={styles.logoLink} aria-label="Boulot Man home">
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={280} height={72} className={styles.logoImage} priority />
          </Link>
        </div>

        <section className={styles.successCard}>
          <span className={styles.successBadge}>Review submitted</span>
          {firstName ? <h1>Thanks for rating {firstName}</h1> : <h1>Thanks for your review</h1>}
          <p>
            {(bid as any)?.bidder
              ? `Your feedback helps other clients evaluate ${(bid as any).bidder} and keeps the marketplace trustworthy.`
              : "Your feedback helps the marketplace stay trustworthy."}
          </p>

          <div className={styles.successSummary}>
            <div>
              <span>Rating</span>
              <strong>{rating}/5</strong>
            </div>
            <div>
              <span>Highlights</span>
              <strong>{selectedTags.length}</strong>
            </div>
            <div>
              <span>Task</span>
              <strong>{task?.title}</strong>
            </div>
          </div>

          <div className={styles.successActions}>
            <Link href={`/dashboard/client/tasks/${task?.id}`} className={styles.secondaryButton}>
              Back to task
            </Link>
            <Link href="/dashboard/client/messages" className={styles.primaryButton}>
              Open messages
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.warning("Select rating", "Please choose a star rating first.");
      return;
    }
    setSubmitting(true);
    try {
      if (prof?.role === "COMPANY" && prof.company_id) {
        await api.addCompanyReview(Number(prof.company_id), {
          rating,
          text: comments,
          service: task?.title || "",
        });
      }
      toast.success("Review submitted", "Thank you for your feedback.");
      setSubmitted(true);
    } catch (err: any) {
      toast.error("Submission failed", err?.message || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.logoBar}>
        <Link href="/" className={styles.logoLink} aria-label="Boulot Man home">
          <Image src="/boulotman-logo.png" alt="Boulot Man" width={280} height={72} className={styles.logoImage} priority />
        </Link>
      </div>

      <div className={styles.shell}>
        <div className={styles.header}>
          <Link href={`/dashboard/client/tasks/${task?.id}`} className={styles.backLink}>
            Back to task
          </Link>
          <h1 className={styles.title}>Rate your experience</h1>
          <p className={styles.subtitle}>Your feedback helps maintain trust in the Boulot Man community.</p>
        </div>

        <section className={styles.card}>
          <div className={styles.proHeader}>
            <div className={styles.proAvatar}>{(bid as any)?.initials || ""}</div>
            <div className={styles.proMeta}>
              <strong>{(bid as any)?.bidder || ""}</strong>
              <span>{(bid as any)?.profile?.title || ""}</span>
            </div>
          </div>

          <div className={styles.taskSummary}>
            <div className={styles.summaryIcon}>
              <iconify-icon icon="lucide:check-circle" />
            </div>
            <div className={styles.summaryText}>
              <strong>{task?.title}</strong>
              <span>Completed review for this accepted proposal</span>
            </div>
          </div>

          <div className={styles.ratingSection}>
            <div className={styles.ratingCopy}>
              {firstName ? <h2>How would you rate {firstName}&apos;s work?</h2> : <h2>How would you rate this work?</h2>}
              <p>Select a rating, choose what stood out, and leave optional comments.</p>
            </div>

            <div className={styles.stars} role="radiogroup" aria-label={firstName ? `Rate ${firstName}` : "Rate this work"}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  className={`${styles.starButton} ${value <= rating ? styles.starButtonActive : ""}`}
                  onClick={() => setRating(value)}
                >
                  <iconify-icon icon="lucide:star" />
                </button>
              ))}
            </div>

            <p className={styles.ratingValue}>{rating === 5 ? "Excellent work" : rating === 4 ? "Very good" : rating === 3 ? "Good" : rating === 2 ? "Needs improvement" : rating === 1 ? "Poor experience" : "Select a rating"}</p>
          </div>

          <div className={styles.feedbackSection}>
            <label className={styles.feedbackLabel}>{firstName ? `What did you like about ${firstName}?` : "What stood out?"}</label>
            <div className={styles.tags}>
              {feedbackOptions.map((tag) => {
                const active = selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    className={`${styles.tag} ${active ? styles.tagActive : ""}`}
                    aria-pressed={active}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <label htmlFor="review-comments" className={styles.feedbackLabel}>
              Additional comments
            </label>
            <textarea
              id="review-comments"
              className={styles.textarea}
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              placeholder={firstName ? `Share details about your experience working with ${firstName}...` : "Share details about your experience..."}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={handleSubmitReview} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit review"}
            </button>
            <Link href={`/dashboard/client/tasks/${task?.id}`} className={styles.skipLink}>
              Skip for now
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

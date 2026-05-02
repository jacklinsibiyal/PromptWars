"use client";

import { useEffect } from "react";
import styles from "./IssueModal.module.css";
import type { Issue } from "@/lib/types";

interface IssueModalProps {
  issue: Issue;
  onClose: () => void;
}

const typeIcons: Record<string, string> = {
  bug: "🐛",
  feature: "✨",
  task: "📌",
  story: "📖",
  epic: "🏔️",
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  backlog:     { label: "Backlog",     color: "#6b7280", bg: "rgba(107,114,128,0.15)" },
  todo:        { label: "To Do",       color: "#74b9ff", bg: "rgba(116,185,255,0.15)" },
  in_progress: { label: "In Progress", color: "#fdcb6e", bg: "rgba(253,203,110,0.15)" },
  in_review:   { label: "In Review",   color: "#a29bfe", bg: "rgba(162,155,254,0.15)" },
  done:        { label: "Done",        color: "#00b894", bg: "rgba(0,184,148,0.15)" },
};

const priorityConfig: Record<string, { icon: string; label: string; color: string }> = {
  critical: { icon: "🔴", label: "Critical", color: "var(--color-priority-critical)" },
  high:     { icon: "🟠", label: "High",     color: "var(--color-priority-high)" },
  medium:   { icon: "🟡", label: "Medium",   color: "var(--color-priority-medium)" },
  low:      { icon: "🟢", label: "Low",      color: "var(--color-priority-low)" },
  none:     { icon: "⚪", label: "None",     color: "var(--color-priority-none)" },
};

const avatarColors = ["#6c5ce7", "#00cec9", "#e17055", "#00b894", "#fdcb6e", "#a29bfe"];

export default function IssueModal({ issue, onClose }: IssueModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const status = statusConfig[issue.status];
  const priority = priorityConfig[issue.priority];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <span className={styles.issueKeyBadge}>{issue.key}</span>
            <span className={styles.issueTypeBadge}>{typeIcons[issue.type]}</span>
          </div>
          <button id="modal-close" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            <h2 className={styles.issueTitle}>{issue.title}</h2>

            <div className={styles.descriptionLabel}>Description</div>
            <div className={styles.descriptionText}>
              {issue.description}
            </div>

            {issue.labels.length > 0 && (
              <div className={styles.labelsRow}>
                {issue.labels.map((label) => (
                  <span key={label} className={styles.label}>{label}</span>
                ))}
              </div>
            )}

            {/* Comments */}
            <div className={styles.commentsSection}>
              <div className={styles.commentsTitle}>
                Comments ({issue.commentCount})
              </div>
              <div className={styles.commentInputRow}>
                <div className={styles.commentAvatar}>AR</div>
                <textarea
                  id="comment-input"
                  className={styles.commentInput}
                  placeholder="Add a comment..."
                />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className={styles.sidePanel}>
            <div className={styles.detailGroup}>
              <div className={styles.detailLabel}>Status</div>
              <span
                className={styles.statusBadge}
                style={{ color: status.color, background: status.bg }}
              >
                {status.label}
              </span>
            </div>

            <div className={styles.detailGroup}>
              <div className={styles.detailLabel}>Priority</div>
              <span className={styles.priorityBadge}>
                {priority.icon} {priority.label}
              </span>
            </div>

            <div className={styles.detailDivider} />

            <div className={styles.detailGroup}>
              <div className={styles.detailLabel}>Assignee</div>
              {issue.assignee ? (
                <div className={styles.assigneeRow}>
                  <div
                    className={styles.assigneeAvatar}
                    style={{
                      background: avatarColors[parseInt(issue.assignee.id.slice(1)) % avatarColors.length],
                    }}
                  >
                    {issue.assignee.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className={styles.detailValue}>{issue.assignee.name}</span>
                </div>
              ) : (
                <span className={styles.detailValue} style={{ color: "var(--color-text-muted)" }}>
                  Unassigned
                </span>
              )}
            </div>

            <div className={styles.detailGroup}>
              <div className={styles.detailLabel}>Reporter</div>
              <div className={styles.assigneeRow}>
                <div
                  className={styles.assigneeAvatar}
                  style={{
                    background: avatarColors[parseInt(issue.reporter.id.slice(1)) % avatarColors.length],
                  }}
                >
                  {issue.reporter.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className={styles.detailValue}>{issue.reporter.name}</span>
              </div>
            </div>

            <div className={styles.detailDivider} />

            {issue.storyPoints !== null && (
              <div className={styles.detailGroup}>
                <div className={styles.detailLabel}>Story Points</div>
                <span className={styles.detailValue}>{issue.storyPoints}</span>
              </div>
            )}

            {issue.dueDate && (
              <div className={styles.detailGroup}>
                <div className={styles.detailLabel}>Due Date</div>
                <span className={styles.detailValue}>{issue.dueDate}</span>
              </div>
            )}

            <div className={styles.detailGroup}>
              <div className={styles.detailLabel}>Created</div>
              <span className={styles.detailValue} style={{ color: "var(--color-text-secondary)" }}>
                {issue.createdAt}
              </span>
            </div>

            <div className={styles.detailGroup}>
              <div className={styles.detailLabel}>Updated</div>
              <span className={styles.detailValue} style={{ color: "var(--color-text-secondary)" }}>
                {issue.updatedAt}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./IssueModal.module.css";
import type { Issue, IssueStatus, Priority, User } from "@/lib/types";

interface IssueModalProps {
  issueId: string;
  onClose: () => void;
  onUpdate?: () => void; // Refresh parent board
}

const typeIcons: Record<string, string> = {
  BUG: "🐛",
  FEATURE: "✨",
  TASK: "📌",
  STORY: "📖",
  EPIC: "🏔️",
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  BACKLOG:     { label: "Backlog",     color: "#6b7280", bg: "rgba(107,114,128,0.15)" },
  TODO:        { label: "To Do",       color: "#74b9ff", bg: "rgba(116,185,255,0.15)" },
  IN_PROGRESS: { label: "In Progress", color: "#fdcb6e", bg: "rgba(253,203,110,0.15)" },
  IN_REVIEW:   { label: "In Review",   color: "#a29bfe", bg: "rgba(162,155,254,0.15)" },
  DONE:        { label: "Done",        color: "#00b894", bg: "rgba(0,184,148,0.15)" },
};

const priorityConfig: Record<string, { icon: string; label: string; color: string }> = {
  CRITICAL: { icon: "🔴", label: "Critical", color: "var(--color-priority-critical)" },
  HIGH:     { icon: "🟠", label: "High",     color: "var(--color-priority-high)" },
  MEDIUM:   { icon: "🟡", label: "Medium",   color: "var(--color-priority-medium)" },
  LOW:      { icon: "🟢", label: "Low",      color: "var(--color-priority-low)" },
  NONE:     { icon: "⚪", label: "None",     color: "var(--color-priority-none)" },
};

export default function IssueModal({ issueId, onClose, onUpdate }: IssueModalProps) {
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchIssue = useCallback(async () => {
    try {
      const res = await fetch(`/api/issues/${issueId}`);
      const data = await res.json();
      if (data.issue) setIssue(data.issue);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIssue();
    fetchUsers();
    
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fetchIssue, onClose]);

  const handleUpdateField = async (field: string, value: any) => {
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        fetchIssue();
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/issues/${issueId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok) {
        setCommentText("");
        fetchIssue();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
          <div className="loadingSpinner" />
        </div>
      </div>
    );
  }

  if (!issue) return null;

  const status = statusConfig[issue.status] || statusConfig.BACKLOG;
  const priority = priorityConfig[issue.priority] || priorityConfig.MEDIUM;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <span className={styles.issueKeyBadge}>{issue.project?.key}-{issue.number}</span>
            <select 
              className={styles.typeSelect}
              value={issue.type}
              onChange={(e) => handleUpdateField("type", e.target.value)}
            >
              <option value="TASK">📌 Task</option>
              <option value="BUG">🐛 Bug</option>
              <option value="FEATURE">✨ Feature</option>
              <option value="STORY">📖 Story</option>
            </select>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.mainContent}>
            <input 
              className={styles.issueTitleInput}
              value={issue.title}
              onChange={(e) => setIssue({...issue, title: e.target.value})}
              onBlur={(e) => handleUpdateField("title", e.target.value)}
            />

            <div className={styles.descriptionLabel}>Description</div>
            <textarea 
              className={styles.descriptionTextarea}
              value={issue.description || ""}
              placeholder="Add a description..."
              onChange={(e) => setIssue({...issue, description: e.target.value})}
              onBlur={(e) => handleUpdateField("description", e.target.value)}
            />

            <div className={styles.commentsSection}>
              <div className={styles.commentsTitle}>Comments ({issue.comments?.length || 0})</div>
              <div className={styles.commentInputRow}>
                <textarea
                  className={styles.commentInput}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <button 
                  className={styles.sendCommentBtn}
                  onClick={handleAddComment}
                  disabled={submittingComment || !commentText.trim()}
                >
                  Post
                </button>
              </div>

              <div className={styles.commentList}>
                {issue.comments?.map((comment: any) => (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentAuthor}>{comment.user.name}</span>
                      <span className={styles.commentTime}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.commentContent}>{comment.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidePanel}>
            <div className={styles.detailGroup}>
              <div className={styles.detailLabel}>Status</div>
              <select 
                className={styles.fieldSelect}
                style={{ color: status.color, background: status.bg, borderColor: status.color }}
                value={issue.status}
                onChange={(e) => handleUpdateField("status", e.target.value)}
              >
                {Object.entries(statusConfig).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.detailGroup}>
              <div className={styles.detailLabel}>Priority</div>
              <select 
                className={styles.fieldSelect}
                value={issue.priority}
                onChange={(e) => handleUpdateField("priority", e.target.value)}
              >
                {Object.entries(priorityConfig).map(([key, val]) => (
                  <option key={key} value={key}>{val.icon} {val.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.detailDivider} />

            <div className={styles.detailGroup}>
              <div className={styles.detailLabel}>Assignee</div>
              <select 
                className={styles.fieldSelect}
                value={issue.assigneeId || ""}
                onChange={(e) => handleUpdateField("assigneeId", e.target.value || null)}
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.detailGroup}>
              <div className={styles.detailLabel}>Story Points</div>
              <input 
                type="number"
                className={styles.pointsInput}
                value={issue.storyPoints || ""}
                placeholder="-"
                onChange={(e) => handleUpdateField("storyPoints", parseInt(e.target.value) || null)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

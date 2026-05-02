"use client";

import { useState, useCallback } from "react";
import styles from "./Board.module.css";
import { getKanbanColumns, projects, sprints } from "@/lib/mock-data";
import type { Issue, Column, IssueStatus } from "@/lib/types";

interface BoardProps {
  projectId: string;
  onIssueClick: (issue: Issue) => void;
}

const typeIcons: Record<string, string> = {
  bug: "🐛",
  feature: "✨",
  task: "📌",
  story: "📖",
  epic: "🏔️",
};

const priorityConfig: Record<string, { icon: string; color: string }> = {
  critical: { icon: "🔴", color: "var(--color-priority-critical)" },
  high: { icon: "🟠", color: "var(--color-priority-high)" },
  medium: { icon: "🟡", color: "var(--color-priority-medium)" },
  low: { icon: "🟢", color: "var(--color-priority-low)" },
  none: { icon: "⚪", color: "var(--color-priority-none)" },
};

const avatarColors = ["#6c5ce7", "#00cec9", "#e17055", "#00b894", "#fdcb6e", "#a29bfe"];

export default function Board({ projectId, onIssueClick }: BoardProps) {
  const project = projects.find((p) => p.id === projectId);
  const activeSprint = sprints.find((s) => s.projectId === projectId && s.status === "active");

  const [columns, setColumns] = useState<Column[]>(() => getKanbanColumns(projectId));
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<IssueStatus | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, issue: Issue) => {
    setDraggedIssue(issue);
    e.dataTransfer.effectAllowed = "move";
    // Use a timeout so the dragging class applies after the drag image is created
    setTimeout(() => {
      const el = document.getElementById(`card-${issue.id}`);
      if (el) el.classList.add(styles.issueCardDragging);
    }, 0);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (draggedIssue) {
      const el = document.getElementById(`card-${draggedIssue.id}`);
      if (el) el.classList.remove(styles.issueCardDragging);
    }
    setDraggedIssue(null);
    setDragOverColumn(null);
  }, [draggedIssue]);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: IssueStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetColumnId: IssueStatus) => {
      e.preventDefault();
      if (!draggedIssue) return;

      setColumns((prev) =>
        prev.map((col) => {
          // Remove from source
          const filtered = col.issues.filter((i) => i.id !== draggedIssue.id);
          if (col.id === targetColumnId) {
            // Add to target
            return { ...col, issues: [...filtered, { ...draggedIssue, status: targetColumnId }] };
          }
          return { ...col, issues: filtered };
        })
      );

      setDraggedIssue(null);
      setDragOverColumn(null);
    },
    [draggedIssue]
  );

  return (
    <div className={styles.board}>
      {/* Board Header */}
      <div className={styles.boardHeader}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 className={styles.boardTitle}>
            {project?.icon} {project?.name ?? "Board"}
          </h1>
          {activeSprint && (
            <span className={styles.sprintBadge}>
              <span className={styles.sprintDot} />
              {activeSprint.name} · {activeSprint.completedCount}/{activeSprint.issueCount}
            </span>
          )}
        </div>
        <div className={styles.boardFilters}>
          <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>All Types</button>
          <button className={styles.filterBtn}>🐛 Bugs</button>
          <button className={styles.filterBtn}>✨ Features</button>
          <button className={styles.filterBtn}>👤 Assigned to me</button>
        </div>
      </div>

      {/* Columns */}
      <div className={styles.columnsContainer}>
        {columns.map((column) => (
          <div key={column.id} className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitleGroup}>
                <span className={styles.columnDot} style={{ background: column.color }} />
                <span className={styles.columnTitle}>{column.title}</span>
                <span className={styles.columnCount}>{column.issues.length}</span>
              </div>
              <button className={styles.columnAddBtn} title="Add issue">+</button>
            </div>

            <div
              className={`${styles.columnCards} ${dragOverColumn === column.id ? styles.columnDropzone : ""}`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {column.issues.map((issue, index) => (
                <div
                  key={issue.id}
                  id={`card-${issue.id}`}
                  className={styles.issueCard}
                  draggable
                  onDragStart={(e) => handleDragStart(e, issue)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onIssueClick(issue)}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className={styles.issueCardTop}>
                    <span className={styles.issueKey}>{issue.key}</span>
                    <span className={styles.issueType}>{typeIcons[issue.type]}</span>
                  </div>
                  <div className={styles.issueTitle}>{issue.title}</div>
                  {issue.labels.length > 0 && (
                    <div className={styles.issueLabels}>
                      {issue.labels.slice(0, 3).map((label) => (
                        <span key={label} className={styles.issueLabel}>{label}</span>
                      ))}
                    </div>
                  )}
                  <div className={styles.issueCardBottom}>
                    <div className={styles.issueCardMeta}>
                      <span className={styles.issuePriority}>
                        {priorityConfig[issue.priority].icon}
                      </span>
                      {issue.storyPoints && (
                        <span className={styles.issuePoints}>{issue.storyPoints} SP</span>
                      )}
                      <div className={styles.issueMetaIcons}>
                        {issue.commentCount > 0 && (
                          <span className={styles.issueMetaItem}>💬 {issue.commentCount}</span>
                        )}
                        {issue.attachmentCount > 0 && (
                          <span className={styles.issueMetaItem}>📎 {issue.attachmentCount}</span>
                        )}
                      </div>
                    </div>
                    {issue.assignee ? (
                      <div
                        className={styles.issueAssignee}
                        style={{ background: avatarColors[parseInt(issue.assignee.id.slice(1)) % avatarColors.length] }}
                        title={issue.assignee.name}
                      >
                        {issue.assignee.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    ) : (
                      <div className={styles.issueAssigneeNone} title="Unassigned">?</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

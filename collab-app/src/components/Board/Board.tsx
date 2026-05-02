"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./Board.module.css";
import type { Issue, Column, IssueStatus } from "@/lib/types";

interface BoardProps {
  projectId: string;
  onIssueClick: (issue: Issue) => void;
}

const typeIcons: Record<string, string> = {
  BUG: "🐛",
  FEATURE: "✨",
  TASK: "📌",
  STORY: "📖",
  EPIC: "🏔️",
};

const priorityConfig: Record<string, { icon: string; color: string }> = {
  CRITICAL: { icon: "🔴", color: "var(--color-priority-critical)" },
  HIGH: { icon: "🟠", color: "var(--color-priority-high)" },
  MEDIUM: { icon: "🟡", color: "var(--color-priority-medium)" },
  LOW: { icon: "🟢", color: "var(--color-priority-low)" },
  NONE: { icon: "⚪", color: "var(--color-priority-none)" },
};

const columnDefs: { id: IssueStatus; title: string; color: string }[] = [
  { id: "TODO", title: "To Do", color: "#74b9ff" },
  { id: "IN_PROGRESS", title: "In Progress", color: "#fdcb6e" },
  { id: "IN_REVIEW", title: "In Review", color: "#a29bfe" },
  { id: "DONE", title: "Done", color: "#00b894" },
];

export default function Board({ projectId, onIssueClick }: BoardProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<IssueStatus | null>(null);

  const fetchBoardData = useCallback(async () => {
    try {
      const res = await fetch(`/api/issues?projectId=${projectId}`);
      const data = await res.json();
      
      if (data.issues) {
        // Map issues into columns
        const newColumns = columnDefs.map(def => ({
          ...def,
          issues: data.issues.filter((i: any) => i.status === def.id)
        }));
        setColumns(newColumns);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  const handleDragStart = useCallback((e: React.DragEvent, issue: Issue) => {
    setDraggedIssue(issue);
    e.dataTransfer.effectAllowed = "move";
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

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetColumnId: IssueStatus) => {
      e.preventDefault();
      if (!draggedIssue || draggedIssue.status === targetColumnId) return;

      // Optimistic update
      setColumns((prev) =>
        prev.map((col) => {
          const filtered = col.issues.filter((i) => i.id !== draggedIssue.id);
          if (col.id === targetColumnId) {
            return { ...col, issues: [...filtered, { ...draggedIssue, status: targetColumnId }] };
          }
          return { ...col, issues: filtered };
        })
      );

      // API update
      try {
        await fetch(`/api/issues/${draggedIssue.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: targetColumnId }),
        });
      } catch (err) {
        console.error(err);
        fetchBoardData(); // Revert on failure
      }

      setDraggedIssue(null);
      setDragOverColumn(null);
    },
    [draggedIssue, fetchBoardData]
  );

  if (loading) return <div className={styles.boardLoading}>Loading Board...</div>;

  return (
    <div className={styles.board}>
      <div className={styles.boardHeader}>
        <h1 className={styles.boardTitle}>Project Board</h1>
        <div className={styles.boardFilters}>
          <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>All Issues</button>
          <button className={styles.filterBtn}>My Tasks</button>
        </div>
      </div>

      <div className={styles.columnsContainer}>
        {columns.map((column) => (
          <div key={column.id} className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitleGroup}>
                <span className={styles.columnDot} style={{ background: column.color }} />
                <span className={styles.columnTitle}>{column.title}</span>
                <span className={styles.columnCount}>{column.issues.length}</span>
              </div>
            </div>

            <div
              className={`${styles.columnCards} ${dragOverColumn === column.id ? styles.columnDropzone : ""}`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={() => setDragOverColumn(null)}
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
                    <span className={styles.issueType}>{typeIcons[issue.type] || "📌"}</span>
                  </div>
                  <div className={styles.issueTitle}>{issue.title}</div>
                  <div className={styles.issueCardBottom}>
                    <div className={styles.issueCardMeta}>
                      <span className={styles.issuePriority}>
                        {priorityConfig[issue.priority]?.icon || "⚪"}
                      </span>
                      {issue.storyPoints && (
                        <span className={styles.issuePoints}>{issue.storyPoints} SP</span>
                      )}
                    </div>
                    {issue.assignee ? (
                      <div className={styles.issueAssignee} title={issue.assignee.name}>
                        {issue.assignee.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    ) : (
                      <div className={styles.issueAssigneeNone}>?</div>
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

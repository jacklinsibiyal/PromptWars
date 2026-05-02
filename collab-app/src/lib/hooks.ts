// ============================================
// Data Fetching Hooks for TeamFlow
// ============================================

"use client";

import { useState, useEffect, useCallback } from "react";
import type { Issue, IssueStatus } from "@/lib/types";

// ── Generic fetch wrapper ──
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Projects ──
export function useProjects() {
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ projects: Record<string, unknown>[] }>("/api/projects")
      .then((data) => setProjects(data.projects))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading };
}

// ── Issues for a project ──
export function useIssues(projectId: string | null) {
  const [issues, setIssues] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!projectId) return;
    setLoading(true);
    apiFetch<{ issues: Record<string, unknown>[] }>(`/api/issues?projectId=${projectId}`)
      .then((data) => setIssues(data.issues))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { issues, loading, refresh };
}

// ── Update issue status (for drag-and-drop) ──
export async function updateIssueStatus(issueId: string, status: IssueStatus) {
  return apiFetch(`/api/issues/${issueId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: status.toUpperCase() }),
  });
}

// ── Create issue ──
export async function createIssue(data: {
  title: string;
  description?: string;
  type?: string;
  priority?: string;
  projectId: string;
  assigneeId?: string;
}) {
  return apiFetch<{ issue: Record<string, unknown> }>("/api/issues", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      type: data.type?.toUpperCase() || "TASK",
      priority: data.priority?.toUpperCase() || "MEDIUM",
    }),
  });
}

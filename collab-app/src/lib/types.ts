/* ============================================
   Type Definitions for TeamFlow
   ============================================ */

export type Priority = "critical" | "high" | "medium" | "low" | "none";
export type IssueType = "bug" | "feature" | "task" | "story" | "epic";
export type IssueStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "pm" | "developer";
}

export interface Project {
  id: string;
  name: string;
  key: string;         // e.g., "TF" for TeamFlow
  description: string;
  color: string;
  icon: string;
  memberCount: number;
  openIssues: number;
  completedIssues: number;
  updatedAt: string;
}

export interface Issue {
  id: string;
  key: string;          // e.g., "TF-123"
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  assignee: User | null;
  reporter: User;
  projectId: string;
  labels: string[];
  storyPoints: number | null;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  commentCount: number;
  attachmentCount: number;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "completed";
  issueCount: number;
  completedCount: number;
}

export interface Activity {
  id: string;
  user: User;
  action: string;
  target: string;
  projectKey: string;
  timestamp: string;
}

export interface Column {
  id: IssueStatus;
  title: string;
  color: string;
  issues: Issue[];
}

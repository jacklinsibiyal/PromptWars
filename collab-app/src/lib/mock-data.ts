/* ============================================
   Mock Data for TeamFlow MVP
   ============================================ */

import { User, Project, Issue, Sprint, Activity, Column } from "./types";

// ── Users ──
export const currentUser: User = {
  id: "u1",
  name: "Alex Rivera",
  email: "alex@teamflow.dev",
  avatar: "",
  role: "admin",
};

export const users: User[] = [
  currentUser,
  { id: "u2", name: "Sarah Chen", email: "sarah@teamflow.dev", avatar: "", role: "pm" },
  { id: "u3", name: "Marcus Johnson", email: "marcus@teamflow.dev", avatar: "", role: "developer" },
  { id: "u4", name: "Emily Park", email: "emily@teamflow.dev", avatar: "", role: "developer" },
  { id: "u5", name: "David Kim", email: "david@teamflow.dev", avatar: "", role: "developer" },
  { id: "u6", name: "Lisa Wang", email: "lisa@teamflow.dev", avatar: "", role: "pm" },
];

// ── Projects ──
export const projects: Project[] = [
  {
    id: "p1",
    name: "TeamFlow Platform",
    key: "TF",
    description: "Core platform development for TeamFlow collaboration tool",
    color: "#6c5ce7",
    icon: "⚡",
    memberCount: 6,
    openIssues: 24,
    completedIssues: 87,
    updatedAt: "2 hours ago",
  },
  {
    id: "p2",
    name: "Mobile App",
    key: "MA",
    description: "Native mobile application for iOS and Android",
    color: "#00cec9",
    icon: "📱",
    memberCount: 4,
    openIssues: 18,
    completedIssues: 42,
    updatedAt: "5 hours ago",
  },
  {
    id: "p3",
    name: "API Gateway",
    key: "AG",
    description: "Centralized API gateway and microservices orchestration",
    color: "#e17055",
    icon: "🔗",
    memberCount: 3,
    openIssues: 11,
    completedIssues: 63,
    updatedAt: "1 day ago",
  },
  {
    id: "p4",
    name: "Design System",
    key: "DS",
    description: "Shared component library and design tokens",
    color: "#fdcb6e",
    icon: "🎨",
    memberCount: 2,
    openIssues: 7,
    completedIssues: 31,
    updatedAt: "3 days ago",
  },
];

// ── Issues ──
export const issues: Issue[] = [
  {
    id: "i1", key: "TF-142", title: "Implement drag-and-drop for Kanban board",
    description: "Add smooth drag-and-drop functionality using HTML5 DnD API",
    type: "feature", status: "in_progress", priority: "high",
    assignee: users[2], reporter: users[1], projectId: "p1",
    labels: ["frontend", "ux"], storyPoints: 8,
    createdAt: "2025-04-28", updatedAt: "2025-04-30", dueDate: "2025-05-05",
    commentCount: 5, attachmentCount: 2,
  },
  {
    id: "i2", key: "TF-141", title: "Fix authentication token refresh flow",
    description: "Token refresh fails silently when the session expires during active use",
    type: "bug", status: "in_progress", priority: "critical",
    assignee: users[3], reporter: users[0], projectId: "p1",
    labels: ["backend", "auth", "urgent"], storyPoints: 5,
    createdAt: "2025-04-29", updatedAt: "2025-04-30", dueDate: "2025-05-01",
    commentCount: 8, attachmentCount: 0,
  },
  {
    id: "i3", key: "TF-140", title: "Add real-time notifications via WebSocket",
    description: "Implement WebSocket connection for live updates across the application",
    type: "feature", status: "todo", priority: "high",
    assignee: users[4], reporter: users[1], projectId: "p1",
    labels: ["backend", "realtime"], storyPoints: 13,
    createdAt: "2025-04-27", updatedAt: "2025-04-29", dueDate: "2025-05-10",
    commentCount: 3, attachmentCount: 1,
  },
  {
    id: "i4", key: "TF-139", title: "Design sprint velocity chart component",
    description: "Create a reusable chart component for sprint velocity tracking",
    type: "task", status: "todo", priority: "medium",
    assignee: users[0], reporter: users[1], projectId: "p1",
    labels: ["frontend", "analytics"], storyPoints: 5,
    createdAt: "2025-04-26", updatedAt: "2025-04-28", dueDate: "2025-05-08",
    commentCount: 2, attachmentCount: 0,
  },
  {
    id: "i5", key: "TF-138", title: "Optimize database queries for issue listing",
    description: "Slow queries on the issue list page with large datasets",
    type: "task", status: "in_review", priority: "high",
    assignee: users[2], reporter: users[0], projectId: "p1",
    labels: ["backend", "performance"], storyPoints: 8,
    createdAt: "2025-04-25", updatedAt: "2025-04-30", dueDate: null,
    commentCount: 4, attachmentCount: 1,
  },
  {
    id: "i6", key: "TF-137", title: "Add keyboard shortcuts for quick actions",
    description: "Implement global keyboard shortcuts for creating issues, searching, etc.",
    type: "feature", status: "backlog", priority: "low",
    assignee: null, reporter: users[1], projectId: "p1",
    labels: ["frontend", "a11y"], storyPoints: 3,
    createdAt: "2025-04-24", updatedAt: "2025-04-24", dueDate: null,
    commentCount: 1, attachmentCount: 0,
  },
  {
    id: "i7", key: "TF-136", title: "Setup CI/CD pipeline for staging environment",
    description: "Configure GitHub Actions for automated testing and deployment",
    type: "task", status: "done", priority: "high",
    assignee: users[4], reporter: users[0], projectId: "p1",
    labels: ["devops"], storyPoints: 5,
    createdAt: "2025-04-20", updatedAt: "2025-04-28", dueDate: "2025-04-27",
    commentCount: 6, attachmentCount: 3,
  },
  {
    id: "i8", key: "TF-135", title: "Create onboarding flow for new users",
    description: "Multi-step onboarding wizard with workspace setup",
    type: "story", status: "backlog", priority: "medium",
    assignee: null, reporter: users[5], projectId: "p1",
    labels: ["frontend", "ux", "onboarding"], storyPoints: 13,
    createdAt: "2025-04-22", updatedAt: "2025-04-22", dueDate: null,
    commentCount: 7, attachmentCount: 2,
  },
  {
    id: "i9", key: "MA-45", title: "Implement push notification handler",
    description: "Handle push notifications for iOS and Android",
    type: "feature", status: "in_progress", priority: "high",
    assignee: users[3], reporter: users[5], projectId: "p2",
    labels: ["mobile", "notifications"], storyPoints: 8,
    createdAt: "2025-04-28", updatedAt: "2025-04-30", dueDate: "2025-05-06",
    commentCount: 3, attachmentCount: 0,
  },
  {
    id: "i10", key: "MA-44", title: "Fix gesture navigation conflicts",
    description: "Swipe gestures conflict with system navigation on some Android devices",
    type: "bug", status: "todo", priority: "medium",
    assignee: users[4], reporter: users[3], projectId: "p2",
    labels: ["mobile", "android"], storyPoints: 3,
    createdAt: "2025-04-27", updatedAt: "2025-04-29", dueDate: null,
    commentCount: 2, attachmentCount: 1,
  },
];

// ── Sprints ──
export const sprints: Sprint[] = [
  {
    id: "s1", name: "Sprint 14", projectId: "p1",
    startDate: "2025-04-21", endDate: "2025-05-04",
    status: "active", issueCount: 12, completedCount: 7,
  },
  {
    id: "s2", name: "Sprint 15", projectId: "p1",
    startDate: "2025-05-05", endDate: "2025-05-18",
    status: "planning", issueCount: 4, completedCount: 0,
  },
  {
    id: "s3", name: "Sprint 13", projectId: "p1",
    startDate: "2025-04-07", endDate: "2025-04-20",
    status: "completed", issueCount: 15, completedCount: 14,
  },
];

// ── Activities ──
export const activities: Activity[] = [
  { id: "a1", user: users[2], action: "moved", target: "TF-142 to In Progress", projectKey: "TF", timestamp: "5 min ago" },
  { id: "a2", user: users[3], action: "commented on", target: "TF-141", projectKey: "TF", timestamp: "12 min ago" },
  { id: "a3", user: users[1], action: "created", target: "TF-143", projectKey: "TF", timestamp: "1 hour ago" },
  { id: "a4", user: users[4], action: "completed", target: "TF-136", projectKey: "TF", timestamp: "2 hours ago" },
  { id: "a5", user: users[0], action: "assigned", target: "MA-45 to Emily", projectKey: "MA", timestamp: "3 hours ago" },
  { id: "a6", user: users[5], action: "started sprint", target: "Sprint 14", projectKey: "TF", timestamp: "5 hours ago" },
  { id: "a7", user: users[3], action: "pushed fix for", target: "TF-138", projectKey: "TF", timestamp: "6 hours ago" },
  { id: "a8", user: users[2], action: "added label to", target: "TF-140", projectKey: "TF", timestamp: "8 hours ago" },
];

// ── Kanban Board Columns ──
export function getKanbanColumns(projectId: string): Column[] {
  const projectIssues = issues.filter((i) => i.projectId === projectId);
  return [
    { id: "backlog",     title: "Backlog",     color: "#6b7280", issues: projectIssues.filter((i) => i.status === "backlog") },
    { id: "todo",        title: "To Do",       color: "#74b9ff", issues: projectIssues.filter((i) => i.status === "todo") },
    { id: "in_progress", title: "In Progress", color: "#fdcb6e", issues: projectIssues.filter((i) => i.status === "in_progress") },
    { id: "in_review",   title: "In Review",   color: "#a29bfe", issues: projectIssues.filter((i) => i.status === "in_review") },
    { id: "done",        title: "Done",        color: "#00b894", issues: projectIssues.filter((i) => i.status === "done") },
  ];
}

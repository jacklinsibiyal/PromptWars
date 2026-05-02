// ============================================
// Database Seed Script
// Run: npm run db:seed
// ============================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Create Users ──
  const passwordHash = await bcrypt.hash("password123", 12);

  const alex = await prisma.user.upsert({
    where: { email: "alex@teamflow.dev" },
    update: {},
    create: {
      name: "Alex Rivera",
      email: "alex@teamflow.dev",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const sarah = await prisma.user.upsert({
    where: { email: "sarah@teamflow.dev" },
    update: {},
    create: {
      name: "Sarah Chen",
      email: "sarah@teamflow.dev",
      password: passwordHash,
      role: "PM",
    },
  });

  const marcus = await prisma.user.upsert({
    where: { email: "marcus@teamflow.dev" },
    update: {},
    create: {
      name: "Marcus Johnson",
      email: "marcus@teamflow.dev",
      password: passwordHash,
      role: "DEVELOPER",
    },
  });

  const emily = await prisma.user.upsert({
    where: { email: "emily@teamflow.dev" },
    update: {},
    create: {
      name: "Emily Park",
      email: "emily@teamflow.dev",
      password: passwordHash,
      role: "DEVELOPER",
    },
  });

  const david = await prisma.user.upsert({
    where: { email: "david@teamflow.dev" },
    update: {},
    create: {
      name: "David Kim",
      email: "david@teamflow.dev",
      password: passwordHash,
      role: "DEVELOPER",
    },
  });

  console.log("✅ Users created");

  // ── Create Workspace ──
  const workspace = await prisma.workspace.upsert({
    where: { slug: "teamflow-hq" },
    update: {},
    create: {
      name: "TeamFlow HQ",
      slug: "teamflow-hq",
      description: "Main workspace for TeamFlow development",
      members: {
        create: [
          { userId: alex.id, role: "OWNER" },
          { userId: sarah.id, role: "ADMIN" },
          { userId: marcus.id, role: "MEMBER" },
          { userId: emily.id, role: "MEMBER" },
          { userId: david.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log("✅ Workspace created");

  // ── Create Projects ──
  const tfProject = await prisma.project.upsert({
    where: { workspaceId_key: { workspaceId: workspace.id, key: "TF" } },
    update: {},
    create: {
      name: "TeamFlow Platform",
      key: "TF",
      description: "Core platform development for TeamFlow collaboration tool",
      color: "#6c5ce7",
      icon: "⚡",
      workspaceId: workspace.id,
    },
  });

  const maProject = await prisma.project.upsert({
    where: { workspaceId_key: { workspaceId: workspace.id, key: "MA" } },
    update: {},
    create: {
      name: "Mobile App",
      key: "MA",
      description: "Native mobile application for iOS and Android",
      color: "#00cec9",
      icon: "📱",
      workspaceId: workspace.id,
    },
  });

  console.log("✅ Projects created");

  // ── Create Labels ──
  const labelData = [
    { name: "frontend", color: "#74b9ff", projectId: tfProject.id },
    { name: "backend", color: "#00b894", projectId: tfProject.id },
    { name: "ux", color: "#fdcb6e", projectId: tfProject.id },
    { name: "auth", color: "#ff6b6b", projectId: tfProject.id },
    { name: "realtime", color: "#a29bfe", projectId: tfProject.id },
    { name: "performance", color: "#e17055", projectId: tfProject.id },
    { name: "devops", color: "#636e72", projectId: tfProject.id },
    { name: "urgent", color: "#ff4757", projectId: tfProject.id },
    { name: "mobile", color: "#00cec9", projectId: maProject.id },
  ];

  for (const label of labelData) {
    await prisma.label.upsert({
      where: { projectId_name: { projectId: label.projectId, name: label.name } },
      update: {},
      create: label,
    });
  }

  console.log("✅ Labels created");

  // ── Create Sprint ──
  const sprint = await prisma.sprint.create({
    data: {
      name: "Sprint 14",
      goal: "Complete Kanban board and auth flow",
      status: "ACTIVE",
      startDate: new Date("2025-04-21"),
      endDate: new Date("2025-05-04"),
      projectId: tfProject.id,
    },
  });

  console.log("✅ Sprint created");

  // ── Create Issues ──
  const issuesData = [
    {
      number: 1, title: "Implement drag-and-drop for Kanban board",
      description: "Add smooth drag-and-drop functionality using HTML5 DnD API",
      type: "FEATURE" as const, status: "IN_PROGRESS" as const, priority: "HIGH" as const,
      assigneeId: marcus.id, reporterId: sarah.id, projectId: tfProject.id,
      sprintId: sprint.id, storyPoints: 8,
    },
    {
      number: 2, title: "Fix authentication token refresh flow",
      description: "Token refresh fails silently when the session expires during active use",
      type: "BUG" as const, status: "IN_PROGRESS" as const, priority: "CRITICAL" as const,
      assigneeId: emily.id, reporterId: alex.id, projectId: tfProject.id,
      sprintId: sprint.id, storyPoints: 5,
    },
    {
      number: 3, title: "Add real-time notifications via WebSocket",
      description: "Implement WebSocket connection for live updates across the application",
      type: "FEATURE" as const, status: "TODO" as const, priority: "HIGH" as const,
      assigneeId: david.id, reporterId: sarah.id, projectId: tfProject.id,
      sprintId: sprint.id, storyPoints: 13,
    },
    {
      number: 4, title: "Design sprint velocity chart component",
      description: "Create a reusable chart component for sprint velocity tracking",
      type: "TASK" as const, status: "TODO" as const, priority: "MEDIUM" as const,
      assigneeId: alex.id, reporterId: sarah.id, projectId: tfProject.id,
      storyPoints: 5,
    },
    {
      number: 5, title: "Optimize database queries for issue listing",
      description: "Slow queries on the issue list page with large datasets",
      type: "TASK" as const, status: "IN_REVIEW" as const, priority: "HIGH" as const,
      assigneeId: marcus.id, reporterId: alex.id, projectId: tfProject.id,
      sprintId: sprint.id, storyPoints: 8,
    },
    {
      number: 6, title: "Add keyboard shortcuts for quick actions",
      description: "Implement global keyboard shortcuts for creating issues, searching, etc.",
      type: "FEATURE" as const, status: "BACKLOG" as const, priority: "LOW" as const,
      assigneeId: null, reporterId: sarah.id, projectId: tfProject.id,
      storyPoints: 3,
    },
    {
      number: 7, title: "Setup CI/CD pipeline for staging environment",
      description: "Configure GitHub Actions for automated testing and deployment",
      type: "TASK" as const, status: "DONE" as const, priority: "HIGH" as const,
      assigneeId: david.id, reporterId: alex.id, projectId: tfProject.id,
      sprintId: sprint.id, storyPoints: 5,
    },
    {
      number: 8, title: "Create onboarding flow for new users",
      description: "Multi-step onboarding wizard with workspace setup",
      type: "STORY" as const, status: "BACKLOG" as const, priority: "MEDIUM" as const,
      assigneeId: null, reporterId: sarah.id, projectId: tfProject.id,
      storyPoints: 13,
    },
  ];

  for (const issue of issuesData) {
    await prisma.issue.create({ data: issue });
  }

  console.log("✅ Issues created");

  // ── Create sample comments ──
  const firstIssue = await prisma.issue.findFirst({
    where: { projectId: tfProject.id, number: 1 },
  });

  if (firstIssue) {
    await prisma.comment.createMany({
      data: [
        { content: "I've started working on the DnD implementation using the HTML5 API.", issueId: firstIssue.id, userId: marcus.id },
        { content: "Make sure to add visual feedback during drag — opacity change and shadow.", issueId: firstIssue.id, userId: sarah.id },
        { content: "Good call. I'll also add a drop zone highlight when hovering over columns.", issueId: firstIssue.id, userId: marcus.id },
      ],
    });
  }

  console.log("✅ Comments created");

  // ── Activity log ──
  await prisma.activity.createMany({
    data: [
      { action: "moved to IN_PROGRESS", target: "TF-1", userId: marcus.id, projectId: tfProject.id },
      { action: "commented on", target: "TF-2", userId: emily.id, projectId: tfProject.id },
      { action: "created", target: "TF-8", userId: sarah.id, projectId: tfProject.id },
      { action: "completed", target: "TF-7", userId: david.id, projectId: tfProject.id },
    ],
  });

  console.log("✅ Activities created");
  console.log("\n🎉 Seed complete! You can log in with:");
  console.log("   Email: alex@teamflow.dev");
  console.log("   Password: password123\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

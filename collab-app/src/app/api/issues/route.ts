// ============================================
// Issues API — CRUD operations
// GET  /api/issues?projectId=xxx — List issues
// POST /api/issues              — Create issue
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ── GET: List issues for a project ──
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const assigneeId = searchParams.get("assigneeId");
    const sprintId = searchParams.get("sprintId");

    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    if (sprintId) where.sprintId = sprintId;

    const issues = await prisma.issue.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, image: true } },
        reporter: { select: { id: true, name: true, image: true } },
        labels: { include: { label: true } },
        _count: { select: { comments: true, attachments: true } },
      },
      orderBy: [{ status: "asc" }, { position: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST: Create a new issue ──
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, type, priority, projectId, assigneeId, sprintId, storyPoints, dueDate } = body;

    if (!title || !projectId) {
      return NextResponse.json(
        { error: "Title and projectId are required" },
        { status: 400 }
      );
    }

    // Get next issue number for this project
    const lastIssue = await prisma.issue.findFirst({
      where: { projectId },
      orderBy: { number: "desc" },
      select: { number: true },
    });
    const nextNumber = (lastIssue?.number ?? 0) + 1;

    const userId = (session.user as Record<string, unknown>).id as string;

    const issue = await prisma.issue.create({
      data: {
        number: nextNumber,
        title,
        description: description || null,
        type: type || "TASK",
        status: "BACKLOG",
        priority: priority || "MEDIUM",
        storyPoints: storyPoints || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        reporterId: userId,
        assigneeId: assigneeId || null,
        sprintId: sprintId || null,
      },
      include: {
        assignee: { select: { id: true, name: true, image: true } },
        reporter: { select: { id: true, name: true, image: true } },
        project: { select: { key: true } },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "created",
        target: `${issue.project.key}-${issue.number}`,
        userId,
        projectId,
      },
    });

    return NextResponse.json({ issue }, { status: 201 });
  } catch (error) {
    console.error("POST /api/issues error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

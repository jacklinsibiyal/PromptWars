// ============================================
// Issue Detail API
// GET    /api/issues/[id] — Get single issue
// PATCH  /api/issues/[id] — Update issue
// DELETE /api/issues/[id] — Delete issue
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ── GET: Single issue with full details ──
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true, image: true } },
        reporter: { select: { id: true, name: true, email: true, image: true } },
        project: { select: { id: true, name: true, key: true } },
        sprint: { select: { id: true, name: true, status: true } },
        labels: { include: { label: true } },
        comments: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
        _count: { select: { comments: true, attachments: true } },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json({ issue });
  } catch (error) {
    console.error("GET /api/issues/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── PATCH: Update issue fields ──
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Only allow updating specific fields
    const allowedFields = [
      "title", "description", "type", "status", "priority",
      "assigneeId", "sprintId", "storyPoints", "dueDate", "position",
    ];

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        if (field === "dueDate" && body[field]) {
          data[field] = new Date(body[field]);
        } else {
          data[field] = body[field];
        }
      }
    }

    const issue = await prisma.issue.update({
      where: { id },
      data,
      include: {
        assignee: { select: { id: true, name: true, image: true } },
        reporter: { select: { id: true, name: true, image: true } },
        project: { select: { key: true } },
      },
    });

    // Log status changes
    if (body.status) {
      const userId = (session.user as Record<string, unknown>).id as string;
      await prisma.activity.create({
        data: {
          action: `moved to ${body.status}`,
          target: `${issue.project.key}-${issue.number}`,
          userId,
          projectId: issue.projectId,
        },
      });
    }

    return NextResponse.json({ issue });
  } catch (error) {
    console.error("PATCH /api/issues/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── DELETE: Remove issue ──
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.issue.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/issues/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

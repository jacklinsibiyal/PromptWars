// ============================================
// Issue Comments API
// POST /api/issues/[id]/comments — Add comment
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: issueId } = await params;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const userId = (session.user as unknown as Record<string, unknown>).id as string;

    const comment = await prisma.comment.create({
      data: {
        content,
        issueId,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    // Log activity
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: { select: { key: true } } },
    });

    if (issue) {
      await prisma.activity.create({
        data: {
          action: "commented on",
          target: `${issue.project.key}-${issue.number}`,
          userId,
          projectId: issue.projectId,
        },
      });
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("POST /api/issues/[id]/comments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

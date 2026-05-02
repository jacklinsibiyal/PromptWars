// ============================================
// Projects API
// GET  /api/projects — List all projects for workspace
// POST /api/projects — Create a new project
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ── GET: List projects ──
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    const where: Record<string, unknown> = {};
    if (workspaceId) where.workspaceId = workspaceId;

    const projects = await prisma.project.findMany({
      where,
      include: {
        _count: {
          select: { issues: true, sprints: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST: Create project ──
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, key, description, color, icon, workspaceId } = body;

    if (!name || !key || !workspaceId) {
      return NextResponse.json(
        { error: "Name, key, and workspaceId are required" },
        { status: 400 }
      );
    }

    // Validate key format (2-5 uppercase letters)
    if (!/^[A-Z]{2,5}$/.test(key)) {
      return NextResponse.json(
        { error: "Project key must be 2-5 uppercase letters" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        key: key.toUpperCase(),
        description: description || null,
        color: color || "#6c5ce7",
        icon: icon || "📁",
        workspaceId,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

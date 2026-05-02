"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import Dashboard from "@/components/Dashboard/Dashboard";
import Board from "@/components/Board/Board";
import IssueModal from "@/components/IssueModal/IssueModal";
import type { Issue } from "@/lib/types";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activePage, setActivePage] = useState("dashboard");
  const [activeProject, setActiveProject] = useState<string | null>("p1");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Redirect to login if not authenticated
  if (status === "loading") {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading TeamFlow...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProject(projectId);
    setActivePage("board");
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const getBreadcrumbs = (): string[] => {
    switch (activePage) {
      case "dashboard": return ["TeamFlow", "Dashboard"];
      case "board": return ["TeamFlow", "Board"];
      case "my-issues": return ["TeamFlow", "My Issues"];
      case "sprints": return ["TeamFlow", "Sprints"];
      case "backlog": return ["TeamFlow", "Backlog"];
      default: return ["TeamFlow"];
    }
  };

  const getTitle = (): string => {
    switch (activePage) {
      case "dashboard": return "Dashboard";
      case "board": return "Board";
      case "my-issues": return "My Issues";
      case "sprints": return "Sprints";
      case "backlog": return "Backlog";
      default: return "TeamFlow";
    }
  };

  return (
    <div className={styles.appLayout}>
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        userName={session?.user?.name || "User"}
        userRole={(session?.user as Record<string, unknown>)?.role as string || "developer"}
        onSignOut={() => signOut({ callbackUrl: "/login" })}
      />

      <div className={styles.mainArea}>
        <Header
          title={getTitle()}
          breadcrumbs={getBreadcrumbs()}
          onCreateIssue={() => setShowCreateModal(true)}
        />

        <main className={styles.content}>
          {activePage === "dashboard" && (
            <Dashboard onSelectProject={handleSelectProject} />
          )}
          {activePage === "board" && activeProject && (
            <Board projectId={activeProject} onIssueClick={handleIssueClick} />
          )}
          {activePage === "my-issues" && (
            <div style={{ color: "var(--color-text-secondary)", paddingTop: "var(--space-8)" }}>
              <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "var(--space-2)" }}>My Issues</h2>
              <p>Your assigned issues will appear here. Navigate to a project board to see issues.</p>
            </div>
          )}
          {activePage === "sprints" && (
            <div style={{ color: "var(--color-text-secondary)", paddingTop: "var(--space-8)" }}>
              <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "var(--space-2)" }}>Sprints</h2>
              <p>Sprint management and velocity tracking coming soon.</p>
            </div>
          )}
          {activePage === "backlog" && (
            <div style={{ color: "var(--color-text-secondary)", paddingTop: "var(--space-8)" }}>
              <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "var(--space-2)" }}>Backlog</h2>
              <p>Backlog grooming and prioritization view coming soon.</p>
            </div>
          )}
        </main>
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}

      {/* Create Issue Modal */}
      {showCreateModal && (
        <div className={styles.createOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.createModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.createModalHeader}>
              <h2 className={styles.createModalTitle}>Create Issue</h2>
              <button
                id="create-modal-close"
                className={styles.createModalClose}
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.createModalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <input
                  id="create-issue-title"
                  type="text"
                  className={styles.formInput}
                  placeholder="What needs to be done?"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  id="create-issue-desc"
                  className={styles.formTextarea}
                  placeholder="Add more detail..."
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Type</label>
                  <select id="create-issue-type" className={styles.formSelect}>
                    <option value="task">📌 Task</option>
                    <option value="bug">🐛 Bug</option>
                    <option value="feature">✨ Feature</option>
                    <option value="story">📖 Story</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Priority</label>
                  <select id="create-issue-priority" className={styles.formSelect}>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                    <option value="low">🟢 Low</option>
                    <option value="none">⚪ None</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Project</label>
                  <select id="create-issue-project" className={styles.formSelect}>
                    <option value="p1">⚡ TeamFlow Platform</option>
                    <option value="p2">📱 Mobile App</option>
                    <option value="p3">🔗 API Gateway</option>
                    <option value="p4">🎨 Design System</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Assignee</label>
                  <select id="create-issue-assignee" className={styles.formSelect}>
                    <option value="">Unassigned</option>
                    <option value="u1">Alex Rivera</option>
                    <option value="u2">Sarah Chen</option>
                    <option value="u3">Marcus Johnson</option>
                    <option value="u4">Emily Park</option>
                    <option value="u5">David Kim</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.createModalFooter}>
              <button
                id="create-issue-cancel"
                className={styles.btnSecondary}
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                id="create-issue-submit"
                className={styles.btnPrimary}
                onClick={() => setShowCreateModal(false)}
              >
                Create Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

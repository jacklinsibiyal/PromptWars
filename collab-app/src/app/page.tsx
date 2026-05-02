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
import { useTheme } from "@/components/Providers/ThemeProvider";

export default function Home() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [activePage, setActivePage] = useState("dashboard");
  const [activeProject, setActiveProject] = useState<string | null>("p1");
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
    setSelectedIssueId(issue.id);
  };

  const handleBoardUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={styles.appLayout}>
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        userName={session?.user?.name || "User"}
        userRole={(session?.user as any)?.role || "developer"}
        onSignOut={() => signOut({ callbackUrl: "/login" })}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className={styles.mainArea}>
        <Header
          title={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
          breadcrumbs={["TeamFlow", activePage]}
          onCreateIssue={() => setShowCreateModal(true)}
        />

        <main className={styles.content}>
          {activePage === "dashboard" && (
            <Dashboard onSelectProject={handleSelectProject} />
          )}
          {activePage === "board" && activeProject && (
            <Board 
              key={`${activeProject}-${refreshKey}`}
              projectId={activeProject} 
              onIssueClick={handleIssueClick} 
            />
          )}
        </main>
      </div>

      {selectedIssueId && (
        <IssueModal 
          issueId={selectedIssueId} 
          onClose={() => setSelectedIssueId(null)} 
          onUpdate={handleBoardUpdate}
        />
      )}
    </div>
  );
}

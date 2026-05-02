"use client";

import styles from "./Sidebar.module.css";
import { projects } from "@/lib/mock-data";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  activeProject: string | null;
  onSelectProject: (projectId: string) => void;
  userName?: string;
  userRole?: string;
  onSignOut?: () => void;
  theme?: string;
  onToggleTheme?: () => void;
}

const mainNavItems = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "my-issues", icon: "📋", label: "My Issues" },
  { id: "board", icon: "🗂️", label: "Board" },
  { id: "sprints", icon: "🏃", label: "Sprints" },
];

export default function Sidebar({
  activePage,
  onNavigate,
  activeProject,
  onSelectProject,
  userName = "User",
  userRole = "developer",
  onSignOut,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>T</div>
        <span className={styles.logoText}>
          Team<span className={styles.logoTextAccent}>Flow</span>
        </span>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <div className={styles.navSectionTitle}>Navigation</div>
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activePage === item.id ? styles.navItemActive : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.navSection}>
          <div className={styles.navSectionTitle}>Projects</div>
          {projects.map((project) => (
            <button
              key={project.id}
              className={`${styles.navItem} ${activeProject === project.id ? styles.navItemActive : ""}`}
              onClick={() => onSelectProject(project.id)}
            >
              <span className={styles.projectDot} style={{ background: project.color }} />
              {project.name}
            </button>
          ))}
        </div>

        <div className={styles.navSection}>
          <button className={styles.navItem} onClick={onToggleTheme}>
            <span className={styles.navIcon}>{theme === "dark" ? "☀️" : "🌙"}</span>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          {onSignOut && (
            <button className={styles.navItem} onClick={onSignOut}>
              <span className={styles.navIcon}>🚪</span>
              Sign Out
            </button>
          )}
        </div>
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>{initials}</div>
          <div>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.userRole}>{userRole}</div>
          </div>
          <div className={styles.statusDot} />
        </div>
      </div>
    </aside>
  );
}

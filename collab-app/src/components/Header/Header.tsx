"use client";

import styles from "./Header.module.css";

interface HeaderProps {
  title: string;
  breadcrumbs?: string[];
  onCreateIssue: () => void;
}

export default function Header({ title, breadcrumbs = [], onCreateIssue }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.breadcrumb}>
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              {i > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className={styles.breadcrumbActive}>{crumb}</span>
              ) : (
                <span>{crumb}</span>
              )}
            </span>
          ))}
          {breadcrumbs.length === 0 && (
            <span className={styles.breadcrumbActive}>{title}</span>
          )}
        </div>
      </div>

      <div className={styles.headerCenter}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            id="global-search"
            type="text"
            className={styles.searchInput}
            placeholder="Search issues, projects, people..."
          />
          <span className={styles.searchShortcut}>⌘K</span>
        </div>
      </div>

      <div className={styles.headerRight}>
        <button id="btn-notifications" className={styles.headerBtn} title="Notifications">
          🔔
          <span className={styles.notificationDot} />
        </button>
        <button id="btn-create-issue" className={styles.createBtn} onClick={onCreateIssue}>
          <span>+</span>
          Create
        </button>
      </div>
    </header>
  );
}

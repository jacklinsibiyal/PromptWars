"use client";

import styles from "./Dashboard.module.css";
import { projects, activities, issues, sprints, users, currentUser } from "@/lib/mock-data";

interface DashboardProps {
  onSelectProject: (projectId: string) => void;
}

const stats = [
  { label: "Open Issues", value: 60, trend: "+12%", trendUp: true, icon: "📋", colorClass: "Purple" },
  { label: "In Progress", value: 14, trend: "+3", trendUp: true, icon: "⚡", colorClass: "Cyan" },
  { label: "Completed This Sprint", value: 7, trend: "+18%", trendUp: true, icon: "✅", colorClass: "Green" },
  { label: "Overdue", value: 3, trend: "-2", trendUp: false, icon: "⏰", colorClass: "Orange" },
];

const avatarColors = ["#6c5ce7", "#00cec9", "#e17055", "#00b894", "#fdcb6e", "#a29bfe"];

export default function Dashboard({ onSelectProject }: DashboardProps) {
  return (
    <div className={styles.dashboard}>
      {/* Greeting */}
      <div className={styles.greeting}>
        <h1 className={styles.greetingTitle}>
          Good morning, <span className={styles.greetingTitleAccent}>{currentUser.name.split(" ")[0]}</span> 👋
        </h1>
        <p className={styles.greetingSub}>
          You have <strong>5 issues</strong> assigned and <strong>2 due today</strong>.
          Sprint 14 ends in 4 days.
        </p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`${styles.statCard} ${styles[`statCard${stat.colorClass}` as keyof typeof styles]}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`${styles.statIcon} ${styles[`statIcon${stat.colorClass}` as keyof typeof styles]}`}>
              {stat.icon}
            </div>
            <div className={styles.statValue}>
              {stat.value}
              <span className={`${styles.statTrend} ${stat.trendUp ? styles.statTrendUp : styles.statTrendDown}`}>
                {stat.trendUp ? "↑" : "↓"} {stat.trend}
              </span>
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.contentGrid}>
        {/* Projects */}
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Projects</h2>
            <span className={styles.sectionLink}>View all →</span>
          </div>
          <div className={styles.projectsGrid}>
            {projects.map((project) => {
              const progress = Math.round(
                (project.completedIssues / (project.openIssues + project.completedIssues)) * 100
              );
              return (
                <div
                  key={project.id}
                  id={`dashboard-project-${project.id}`}
                  className={styles.projectCard}
                  onClick={() => onSelectProject(project.id)}
                >
                  <div className={styles.projectCardHeader}>
                    <div className={styles.projectIcon} style={{ background: `${project.color}20` }}>
                      {project.icon}
                    </div>
                    <div>
                      <div className={styles.projectName}>{project.name}</div>
                      <div className={styles.projectKey}>{project.key}</div>
                    </div>
                  </div>
                  <div className={styles.projectDesc}>{project.description}</div>
                  <div className={styles.projectFooter}>
                    <div className={styles.projectMembers}>
                      {users.slice(0, Math.min(project.memberCount, 4)).map((u, i) => (
                        <div
                          key={u.id}
                          className={styles.projectMemberAvatar}
                          style={{ background: avatarColors[i % avatarColors.length] }}
                        >
                          {u.name[0]}
                        </div>
                      ))}
                      {project.memberCount > 4 && (
                        <div
                          className={styles.projectMemberAvatar}
                          style={{ background: "var(--color-bg-active)" }}
                        >
                          +{project.memberCount - 4}
                        </div>
                      )}
                    </div>
                    <span className={styles.projectUpdated}>{project.updatedAt}</span>
                  </div>
                  <div className={styles.projectProgressBar}>
                    <div
                      className={styles.projectProgressFill}
                      style={{ width: `${progress}%`, background: project.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className={styles.activitySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <span className={styles.sectionLink}>All →</span>
          </div>
          <div className={styles.activityList}>
            {activities.map((activity, i) => (
              <div
                key={activity.id}
                className={styles.activityItem}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div
                  className={styles.activityAvatar}
                  style={{ background: avatarColors[i % avatarColors.length] }}
                >
                  {activity.user.name[0]}
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityText}>
                    <span className={styles.activityUser}>{activity.user.name}</span>{" "}
                    {activity.action}{" "}
                    <span className={styles.activityTarget}>{activity.target}</span>
                    <span className={styles.activityProjectBadge}>{activity.projectKey}</span>
                  </div>
                  <div className={styles.activityTime}>{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

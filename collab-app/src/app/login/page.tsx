"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "signup") {
        // Register first
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Registration failed");
          setLoading(false);
          return;
        }
      }

      // Sign in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <div className={styles.loginLogoIcon}>T</div>
            <span className={styles.loginLogoText}>
              Team<span className={styles.loginLogoAccent}>Flow</span>
            </span>
          </div>
          <h1 className={styles.loginTitle}>
            {tab === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className={styles.loginSubtitle}>
            {tab === "signin"
              ? "Sign in to continue to your workspace"
              : "Get started with TeamFlow for free"}
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.loginTabs}>
          <button
            id="tab-signin"
            className={`${styles.loginTab} ${tab === "signin" ? styles.loginTabActive : ""}`}
            onClick={() => { setTab("signin"); setError(""); }}
          >
            Sign In
          </button>
          <button
            id="tab-signup"
            className={`${styles.loginTab} ${tab === "signup" ? styles.loginTabActive : ""}`}
            onClick={() => { setTab("signup"); setError(""); }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className={styles.loginBody}>
          {error && <div className={styles.errorMsg}>{error}</div>}

          <form onSubmit={handleCredentialsSubmit}>
            {tab === "signup" && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="login-name">Full Name</label>
                <input
                  id="login-name"
                  type="text"
                  className={styles.formInput}
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className={styles.formInput}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className={styles.formInput}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Please wait..." : tab === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>or continue with</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Social Login */}
          <div className={styles.socialBtns}>
            <button
              id="login-google"
              className={styles.socialBtn}
              onClick={() => handleSocialLogin("google")}
            >
              <span className={styles.socialIcon}>🔵</span>
              Google
            </button>
            <button
              id="login-github"
              className={styles.socialBtn}
              onClick={() => handleSocialLogin("github")}
            >
              <span className={styles.socialIcon}>⚫</span>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

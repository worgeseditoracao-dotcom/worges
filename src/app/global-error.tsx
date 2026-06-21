"use client"

import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={styles.container}>
          <div style={styles.content}>
            <h1 style={styles.heading}>Algo deu errado</h1>
            <p style={styles.message}>
              {error.message || "Ocorreu um erro inesperado."}
            </p>
            <div style={styles.actions}>
              <button onClick={reset} style={styles.button}>
                Tentar novamente
              </button>
              <Link href="/" style={styles.link}>
                Voltar ao início
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "var(--bg-primary, #0f0f13)",
    padding: "1rem",
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
  content: {
    textAlign: "center",
    maxWidth: "420px",
  },
  heading: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "var(--text-primary, #f1f5f9)",
    margin: 0,
  },
  message: {
    fontSize: "1rem",
    color: "var(--text-secondary, #94a3b8)",
    marginTop: "0.75rem",
    marginBottom: "2rem",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    alignItems: "center",
  },
  button: {
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "var(--accent-cyan, #06b6d4)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.15s",
    width: "100%",
  },
  link: {
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "1px solid var(--border-color, #2d2d3d)",
    backgroundColor: "transparent",
    color: "var(--text-primary, #f1f5f9)",
    fontSize: "1rem",
    fontWeight: 500,
    textDecoration: "none",
    transition: "opacity 0.15s",
    width: "100%",
    textAlign: "center",
  },
}

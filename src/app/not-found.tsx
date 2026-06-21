import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.code}>404</h1>
        <p style={styles.message}>Página não encontrada</p>
        <Link href="/" style={styles.link}>
          Voltar ao início
        </Link>
      </div>
    </div>
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
  },
  content: {
    textAlign: "center",
  },
  code: {
    fontSize: "6rem",
    fontWeight: 800,
    color: "var(--accent-cyan, #06b6d4)",
    margin: 0,
    lineHeight: 1,
  },
  message: {
    fontSize: "1.25rem",
    color: "var(--text-secondary, #94a3b8)",
    marginTop: "1rem",
    marginBottom: "2rem",
  },
  link: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    backgroundColor: "var(--accent-cyan, #06b6d4)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    textDecoration: "none",
    transition: "opacity 0.15s",
  },
}

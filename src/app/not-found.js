import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      background: "#f8fafc",
      color: "#111827"
    }}>
      <div style={{
        textAlign: "center",
        maxWidth: "32rem",
        padding: "2rem",
        borderRadius: "1rem",
        background: "#ffffff",
        boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)"
      }}>
        <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", color: "#d3590b" }}>
          404
        </p>
        <h1 style={{ margin: "1rem 0", fontSize: "2rem" }}>Page non trouvée</h1>
        <p style={{ margin: "0 0 1.5rem", color: "#6b7280", lineHeight: 1.75 }}>
          La page que vous recherchez n’existe pas ou a été déplacée.
        </p>
        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.75rem",
          background: "#111827",
          color: "#ffffff",
          textDecoration: "none",
          fontWeight: 600
        }}>
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}

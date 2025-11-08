export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#F2F2F2",
        padding: "16px",
        marginTop: "40px",
        textAlign: "center",
        fontSize: "14px",
        color: "#444",
        borderTop: "1px solid #DADADA",
      }}
    >
      © {new Date().getFullYear()} Odisha Police. All Rights Reserved.
    </footer>
  );
}
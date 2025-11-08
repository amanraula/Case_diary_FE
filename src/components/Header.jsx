import policeLogo from "../assets/police_logo.png";
import govt_odisha from "../assets/govt_odisha.svg";
export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#0A2A66",
        height: "120px",                
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        color: "white",
        boxSizing: "border-box",
      }}
    >
      {/* Left emblem */}
      <img
        src={policeLogo}
        alt="Odisha Police"
        style={{
          height: "90px",
          width: "90px",
          objectFit: "contain",
        }}
      />

      {/* Center text */}
      <div style={{ textAlign: "center", lineHeight: "1.1" }}>
        <div
          style={{
            color: "#FFD85A",   // golden color
            fontSize: "55px",
            fontWeight: "700",
          }}
        >
          ODISHA POLICE
        </div>

        <div
          style={{
            color: "white",
            fontSize: "30px",
            fontWeight: "500",
            marginTop: "3px",
          }}
        >
          Digital Case Portal
        </div>
      </div>

      {/* Right Govt logo */}
      <img
        src={govt_odisha}
        style={{
          height: "55px",
          width: "55px",
          objectFit: "contain",
        }}
      />
    </header>
  );
}

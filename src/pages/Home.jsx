import Header from "../components/Header";
import Footer from "../components/Footer";
import policeIcon from "../assets/police_icon.png";
import citizenIcon from "../assets/citizen_icon.png";
import policeLogo from "../assets/police_logo.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Background Logo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${policeLogo})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "340px",
          opacity: 0.08,
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Section */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1A1A1A",
            marginBottom: "25px",
            marginTop: "20px",
          }}
        >
          Choose Login Type
        </h1>

        {/* Side Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            width: "100%",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {/* Police Login */}
          <button
            onClick={() => navigate("/police-login")}
            style={{
              flex: "1",
              minWidth: "150px",
              height: "140px",
              backgroundColor: "#FFD85A",
              color: "#1A1A1A",
              border: "none",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <img src={policeIcon} alt="Police" style={{ width: "45px" }} />
            Police Officer
          </button>

          {/* Citizen Login */}
          <button
            onClick={() => navigate("/citizen-login")}
            style={{
              flex: "1",
              minWidth: "150px",
              height: "140px",
              backgroundColor: "#FF9E3D",
              color: "#1A1A1A",
              border: "none",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <img src={citizenIcon} alt="Citizen" style={{ width: "45px" }} />
            Citizen
          </button>
        </div>

        {/* Achievements + Analytics */}
        <div
          style={{
            width: "100%",
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <button
            onClick={() => navigate("/achievements")}
            style={{
              padding: "16px",
              backgroundColor: "#EFEFEF",
              borderRadius: "12px",
              border: "1px solid #DADADA",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Achievements
          </button>

          <button
            onClick={() => navigate("/analytics")}
            style={{
              padding: "16px",
              backgroundColor: "#EFEFEF",
              borderRadius: "12px",
              border: "1px solid #DADADA",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

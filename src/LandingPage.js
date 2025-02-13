
import React from "react";

const LandingPage = () => {
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url('https://your-domain.com/owyn-landing-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "2rem",
      }}
    >
      <h1>Welcome to Owyn</h1>
    </div>
  );
};

export default LandingPage;

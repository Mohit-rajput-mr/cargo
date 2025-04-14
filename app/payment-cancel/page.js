export default function PaymentCancel() {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Outfit, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "3rem 4rem",
            borderRadius: "16px",
            boxShadow: "0 0 30px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", color: "#ff370a" }}>❌ Payment Cancelled!</h1>
          <p style={{ fontSize: "1.1rem", marginTop: "0.8rem", color: "#333" }}>
            Please check your bank account ensure if you have sufficient amount! 😬
          </p>
        </div>
      </div>
    );
  }
  
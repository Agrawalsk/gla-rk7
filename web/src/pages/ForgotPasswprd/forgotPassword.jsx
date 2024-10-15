import { useState } from "react";
import "./forgorpassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Handle forgot password form submission
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.status === 1) {
        setMessage(data.msg); // Success message
        setOtpSent(true); // OTP has been sent
        setIsVerificationMode(true); // Switch to verification mode
      } else {
        setError(data.msg); // Error message
      }
    } catch (err) {
        console.log(err);
        
      setError("An error occurred. Please try again later.");
    }
  };

  // Handle OTP verification
  const handleVerifyEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!verificationCode) {
      setError("Verification code is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/verifyemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();

      if (data.status === 1) {
        setMessage(data.msg); // Success message
        setIsResetMode(true); // Switch to password reset mode
      } else {
        setError(data.msg); // Error message
      }
    } catch (e) {
    console.log(e);
      setError("An error occurred. Please try again later.");
    }
  };

  // Handle password reset
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verificationCode, newPassword }),
      });

      const data = await response.json();
      console.log(data);
      
      if (data.status === 1) {
        setMessage(data.msg); // Success message
      } else {
        setError(data.msg); // Error message
      }
    } catch (err) {
        console.log(err);
        
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <section>
      {!isVerificationMode && !isResetMode && (
        <div className="container">
          <h2>Forgot Password</h2>
          <form onSubmit={handleForgotPasswordSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <button type="submit">Request Password Reset</button>
          </form>
          {otpSent && <p>OTP has been sent to your email. Please check your inbox.</p>}
        </div>
      )}

      {isVerificationMode && !isResetMode && (
        <div>
          <h2>Email Verification</h2>
          <form onSubmit={handleVerifyEmailSubmit}>
            <div>
              <label htmlFor="verificationCode">Verification Code:</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <button type="submit">Verify OTP</button>
          </form>
        </div>
      )}

      {isResetMode && (
        <div>
          <h2>Reset Password</h2>
          <form onSubmit={handleResetPasswordSubmit}>
            <div>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <button type="submit">Reset Password</button>
          </form>
        </div>
      )}
    </section>
  );
};

export default ForgotPassword;
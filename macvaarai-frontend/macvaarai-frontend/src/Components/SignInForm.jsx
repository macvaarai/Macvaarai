// src/Components/SignInForm.jsx
import React, { useState } from "react";
// import {
//   AuthenticationDetails,
//   CognitoUser,
// } from "amazon-cognito-identity-js";
// import UserPool from "../cognitoConfig";

const SignInForm = ({ onSwitch, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [step, setStep] = useState("signin"); // signin | forgot | reset | admin
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const ADMIN_KEYS = ["mac1001", "anbu1001", "bhai1001", "ai1001"];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple local development login (bypass Cognito)
    if (email && password) {
      localStorage.setItem("accessToken", btoa(`${email}:${password}`));
      localStorage.setItem("userEmail", email);
      setMsg("✅ Login successful!");
      onLogin();
      return;
    }

    try {
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const user = new CognitoUser({ Username: email, Pool: UserPool });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          setMsg("✅ Login successful!");
          localStorage.setItem("accessToken", data.getAccessToken().getJwtToken());
          onLogin();
        },
        onFailure: (err) => {
          setMsg(err.message || JSON.stringify(err));
        },
      });
    } catch (err) {
      setMsg("⚠️ Error: " + err.message);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) return setMsg("❌ Please enter your email.");
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    user.forgotPassword({
      onSuccess: () => {
        setMsg("📧 Code sent to your email.");
        setStep("reset");
      },
      onFailure: (err) => setMsg(err.message || JSON.stringify(err)),
    });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    user.confirmPassword(code, newPassword, {
      onSuccess: () => {
        setMsg("✅ Password reset successful. Please sign in.");
        setStep("signin");
      },
      onFailure: (err) => setMsg(err.message || JSON.stringify(err)),
    });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (ADMIN_KEYS.includes(adminKey.trim())) {
      localStorage.setItem("isAdmin", "true");
      setMsg("✅ Admin login successful!");
      onLogin();
    } else {
      setMsg("❌ Invalid Admin Key!");
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden fixed top-0 left-0">
      {/* 🔹 Fixed Header */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🏥</span>
        </div>
        <h1 className="text-3xl font-bold">❤️ Bharat Health-AI</h1>
        <p className="text-lg">AI Manager</p>
        <p className="text-sm text-gray-400">Powered by Macvaar AI</p>
        <p className="mt-2 text-lg font-semibold">Welcome to MacvaarAI</p>
      </div>

      {/* 🔹 Sign In Box */}
      <div className="bg-gray-900 p-6 rounded w-96 text-white mt-40">
        {step === "signin" && (
          <>
            <h2 className="text-xl font-bold mb-4">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 rounded bg-black border border-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 rounded bg-black border border-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
              >
                Sign In
              </button>
            </form>
            <p className="mt-2 text-sm text-gray-400">
              <button className="underline" onClick={() => setStep("forgot")}>
                Forgot Password?
              </button>
            </p>
            {msg && (
              <p className="mt-3 text-yellow-400 break-words max-h-16 overflow-y-auto">
                {msg}
              </p>
            )}
            <p className="mt-4 text-sm text-gray-400">
              New here?{" "}
              <button className="underline" onClick={onSwitch}>
                Create Account
              </button>
            </p>

            {/* 🔹 Admin Sign In Button */}
            <p className="mt-4 text-sm text-gray-400 text-center">
              Admin?{" "}
              <button className="underline" onClick={() => setStep("admin")}>
                Access Admin
              </button>
            </p>
          </>
        )}

        {step === "forgot" && (
          <>
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 rounded bg-black border border-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
              >
                Send Code
              </button>
            </form>
            <p className="mt-2 text-sm text-gray-400">
              <button className="underline" onClick={() => setStep("signin")}>
                Back to Sign In
              </button>
            </p>
            {msg && (
              <p className="mt-3 text-yellow-400 break-words max-h-16 overflow-y-auto">
                {msg}
              </p>
            )}
          </>
        )}

        {step === "reset" && (
          <>
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                placeholder="Enter code"
                className="w-full p-2 rounded bg-black border border-gray-600"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-2 rounded bg-black border border-gray-600"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
              >
                Reset Password
              </button>
            </form>
            <p className="mt-2 text-sm text-gray-400">
              <button className="underline" onClick={() => setStep("signin")}>
                Back to Sign In
              </button>
            </p>
            {msg && (
              <p className="mt-3 text-yellow-400 break-words max-h-16 overflow-y-auto">
                {msg}
              </p>
            )}
          </>
        )}

        {step === "admin" && (
          <>
            <h2 className="text-xl font-bold mb-4">Admin Access</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Enter Admin Key"
                className="w-full p-2 rounded bg-black border border-gray-600"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded"
              >
                Access Admin
              </button>
            </form>
            <p className="mt-2 text-sm text-gray-400">
              <button className="underline" onClick={() => setStep("signin")}>
                Back to Sign In
              </button>
            </p>
            {msg && (
              <p className="mt-3 text-yellow-400 break-words max-h-16 overflow-y-auto">
                {msg}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SignInForm;
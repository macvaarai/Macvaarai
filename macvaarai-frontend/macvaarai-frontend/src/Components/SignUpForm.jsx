// src/Components/SignUpForm.jsx
import React, { useState } from "react";
// import UserPool from "../cognitoConfig";
// import { CognitoUser } from "amazon-cognito-identity-js";

const SignUpForm = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [gender, setGender] = useState("");
  const [fullName, setFullName] = useState("");
  const [msg, setMsg] = useState("");
  const [step, setStep] = useState("signup");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const years = Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: "01", name: "January" },
    { value: "02", name: "February" },
    { value: "03", name: "March" },
    { value: "04", name: "April" },
    { value: "05", name: "May" },
    { value: "06", name: "June" },
    { value: "07", name: "July" },
    { value: "08", name: "August" },
    { value: "09", name: "September" },
    { value: "10", name: "October" },
    { value: "11", name: "November" },
    { value: "12", name: "December" },
  ];

  const getDaysInMonth = (y, m) => {
    if (!y || !m) return 31;
    return new Date(y, m, 0).getDate();
  };
  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMsg("❌ Passwords do not match");
      return;
    }
    if (!year || !month || !day) {
      setMsg("❌ Please select your full Date of Birth");
      return;
    }
    const dob = `${year}-${month}-${day}`;
    const attributes = [
      { Name: "birthdate", Value: dob },
      { Name: "gender", Value: gender },
      { Name: "name", Value: fullName },
    ];

    UserPool.signUp(email, password, attributes, null, (err) => {
      if (err) {
        if (err.code === "UsernameExistsException") {
          setMsg("❌ Email already exists with an account");
        } else {
          setMsg(err.message || JSON.stringify(err));
        }
      } else {
        setMsg("✅ Sign up successful! Check your email for OTP.");
        setStep("confirm");
      }
    });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    user.confirmRegistration(code, true, (err) => {
      if (err) {
        setMsg(err.message || JSON.stringify(err));
      } else {
        setMsg("🎉 Account confirmed! You can now sign in.");
        onSwitch();
      }
    });
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden fixed top-0 left-0">
      {/* 🔹 Logo */}
      <img
        src="/1.png"
        alt="Logo"
        className="absolute top-6 right-6 w-60 h-30 object-contain"
      />

      {/* 🔹 Header */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-2xl font-bold">❤️ Bharat Health-AI</h1>
        <p className="text-base">AI Manager</p>
        <p className="text-sm text-gray-400">Powered by Macvaar AI</p>
        <p className="mt-1 text-base font-semibold">Welcome to MacvaarAI</p>
      </div>

      {/* 🔹 Sign Up Card */}
      <div className="bg-gray-900 p-5 rounded w-[480px] text-white mt-44 text-sm">
        {step === "signup" && (
          <>
            <h2 className="text-base font-bold mb-3">Create Account</h2>
            <form onSubmit={handleSignUp} className="space-y-3">
              {/* Full Name + Gender */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-1/2 p-2 rounded bg-black border border-gray-600 text-sm"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <select
                  className="w-1/2 p-2 rounded bg-black border border-gray-600 text-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Date of Birth</label>
                <div className="flex space-x-2">
                  <select
                    className="flex-1 p-2 rounded bg-black border border-gray-600 text-sm"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  >
                    <option value="">Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <select
                    className="flex-1 p-2 rounded bg-black border border-gray-600 text-sm"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                  >
                    <option value="">Month</option>
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>{m.name}</option>
                    ))}
                  </select>
                  <select
                    className="flex-1 p-2 rounded bg-black border border-gray-600 text-sm"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    required
                  >
                    <option value="">Day</option>
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email + Password */}
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-1/2 p-2 rounded bg-black border border-gray-600 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="relative w-1/2">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full p-2 rounded bg-black border border-gray-600 pr-10 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-xs text-gray-400"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "View"}
                  </button>
                </div>
              </div>
              <small className="text-gray-400 text-xs block">
                Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 
                1 number, and 1 special character.
              </small>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full p-2 rounded bg-black border border-gray-600 pr-10 text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-xs text-gray-400"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? "Hide" : "View"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-sm"
              >
                Sign Up
              </button>
            </form>
          </>
        )}

        {step === "confirm" && (
          <>
            <h2 className="text-base font-bold mb-3">Confirm Your Account</h2>
            <form onSubmit={handleConfirm} className="space-y-3">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-2 rounded bg-black border border-gray-600 text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm"
              >
                Confirm
              </button>
            </form>
          </>
        )}

        {msg && <p className="mt-3 text-red-400 text-xs">{msg}</p>}

        {step === "signup" && (
          <p className="mt-4 text-xs text-gray-400">
            Already have an account?{" "}
            <button className="underline" onClick={onSwitch}>
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;

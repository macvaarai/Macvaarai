// src/Components/ProfilePage.jsx
import React, { useState, useEffect } from "react";
// import { CognitoUser } from "amazon-cognito-identity-js";
// import UserPool from "../cognitoConfig";

const ProfilePage = ({ email, onDelete }) => {
  const [userEmail, setUserEmail] = useState(email);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [msg, setMsg] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [passwords, setPasswords] = useState({ old: "", new1: "", new2: "" });
  const [show, setShow] = useState({ old: false, new1: false, new2: false });

  useEffect(() => {
    // Cognito integration removed - using localStorage auth instead
  }, [email]);

  const handleUpdate = () => {
    // Save to localStorage instead of Cognito
    localStorage.setItem("profileData", JSON.stringify({ userEmail, name, dob }));
    setMsg("✅ Profile updated");
  };

  const handleChangePassword = () => {
    if (passwords.new1 !== passwords.new2) {
      setMsg("❌ Passwords do not match");
      return;
    }
    // Save to localStorage
    localStorage.setItem("userPassword", passwords.new1);
    setMsg("✅ Password changed");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      localStorage.clear();
      window.location.href = "/";
      onDelete && onDelete();
    }
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center pt-20">
      {/* 🔹 Logo at the very top-right corner */}
      <img
        src="/1.png"
        alt="Logo"
        className="absolute top-6 right-4 w-40 h-30 object-contain"
      />

      <div className="p-6 w-[700px]">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>

        {/* --- 1. Update Profile --- */}
        {activeSection !== "update" ? (
          <button
            onClick={() => setActiveSection("update")}
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded mb-3"
          >
            Update Profile
          </button>
        ) : (
          <div className="space-y-4">
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full p-2 rounded bg-black border border-gray-600"
              placeholder="Email"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-black border border-gray-600"
              placeholder="Full Name"
            />
            {/* DOB dropdowns */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Date of Birth
              </label>
              <div className="flex space-x-2">
                <select
                  value={dob ? dob.split("-")[0] : ""}
                  onChange={(e) =>
                    setDob(
                      `${e.target.value}-${dob.split("-")[1] || ""}-${dob.split("-")[2] || ""}`
                    )
                  }
                  className="flex-1 p-2 rounded bg-black border border-gray-600"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  value={dob ? dob.split("-")[1] : ""}
                  onChange={(e) =>
                    setDob(
                      `${dob.split("-")[0] || ""}-${e.target.value}-${dob.split("-")[2] || ""}`
                    )
                  }
                  className="flex-1 p-2 rounded bg-black border border-gray-600"
                >
                  <option value="">Month</option>
                  {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={dob ? dob.split("-")[2] : ""}
                  onChange={(e) =>
                    setDob(
                      `${dob.split("-")[0] || ""}-${dob.split("-")[1] || ""}-${e.target.value}`
                    )
                  }
                  className="flex-1 p-2 rounded bg-black border border-gray-600"
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) =>
                    String(i + 1).padStart(2, "0")
                  ).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleUpdate}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setActiveSection(null)}
              className="w-full bg-gray-700 hover:bg-gray-800 py-2 rounded"
            >
              Close
            </button>
          </div>
        )}

        {/* --- 2. Change Password --- */}
        {activeSection !== "password" ? (
          <button
            onClick={() => setActiveSection("password")}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mb-3"
          >
            Change Password
          </button>
        ) : (
          <div className="space-y-3">
            {["old", "new1", "new2"].map((field) => (
              <div className="relative" key={field}>
                <input
                  type={show[field] ? "text" : "password"}
                  placeholder={
                    field === "old"
                      ? "Old Password"
                      : field === "new1"
                      ? "New Password"
                      : "Confirm New Password"
                  }
                  className="w-full p-2 rounded bg-black border border-gray-600 pr-12"
                  value={passwords[field]}
                  onChange={(e) =>
                    setPasswords({ ...passwords, [field]: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, [field]: !show[field] })}
                  className="absolute right-3 top-2 text-sm text-gray-400"
                >
                  {show[field] ? "Hide" : "View"}
                </button>
              </div>
            ))}
            <button
              onClick={handleChangePassword}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveSection(null)}
              className="w-full bg-gray-700 hover:bg-gray-800 py-2 rounded"
            >
              Close
            </button>
          </div>
        )}

        {/* --- 3. Delete Account --- */}
        <button
          onClick={handleDelete}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded mt-3"
        >
          Delete Account
        </button>

        {msg && <p className="mt-3 text-yellow-400">{msg}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;

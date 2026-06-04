import React from "react";

const SignOutButton = ({ onSignOut }) => {
  const handleSignOut = () => {
    // Clear tokens stored from SignIn
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");

    // Reset auth state in app
    if (onSignOut) onSignOut();

    // Optionally force reload to ProtectedRoute
    window.location.reload();
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </div>
  );
};

export default SignOutButton;

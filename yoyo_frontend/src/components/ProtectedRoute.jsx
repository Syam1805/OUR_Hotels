// src/components/ProtectedRoute.jsx
import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ element, role }) {
  const { user } = useAuth();

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn’t match → redirect home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected element
  return <>{element}</>;
}

ProtectedRoute.propTypes = {
  element: PropTypes.node.isRequired,
  role: PropTypes.string,
};

export default ProtectedRoute;

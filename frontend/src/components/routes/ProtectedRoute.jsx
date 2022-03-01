import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { isUserAuthenticated } from "../../guards/auth-guard";

const ProtectedRoute = ({ redirectRoute }) => {
  const auth = isUserAuthenticated();

  return auth ? <Outlet /> : <Navigate replace to={redirectRoute} />;
};

export default ProtectedRoute;

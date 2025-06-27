import React from "react";
import {  Outlet } from "react-router-dom";

export const AdminRouteGuard: React.FC = () => {
    const hasRole = !!localStorage.getItem("employeeRole");
    return hasRole ? <Outlet /> : <div style={{ padding: 40, textAlign: "center" }}><h2>Página no disponible</h2></div>;
};
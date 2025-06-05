// src/routes/AppRouter.tsx

import { Route, Routes } from "react-router-dom";

import Home from "../screens/Home";
import Menu from "../screens/Menu";

import Login from "../screens/Login";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Perfil from "../screens/Profile";
import { AdminLayout } from "../administracion-sistema/components/layout/AdminLayout";
import { ProductsPage } from "../administracion-sistema/pages/ProductsPage/ProductsPage";
import { SuppliesPage } from "../administracion-sistema/pages/SuppliesPage/SuppliesPage";
import { ClientsPage } from "../administracion-sistema/pages/ClientPage/ClientsPage";
import { EmployeesPage } from "../administracion-sistema/pages/EmployeesPage/EmployeesPage";
import { StatisticsPage } from "../administracion-sistema/pages/StatisticsPage/StattisticsPage";
import RegisterPage from "../screens/RegisterPage";

export function AppRouter() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Perfil />} />
                
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="supplies" element={<SuppliesPage />} />
                    <Route path="clients" element={<ClientsPage />} />
                    <Route path="employees" element={<EmployeesPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                </Route>

            </Routes>
            <Footer></Footer>
        </>
    );
}
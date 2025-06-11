// src/routes/AppRouter.tsx

import { Route, Routes } from "react-router-dom";

import Home from "../screens/Home";
import Menu from "../screens/MenuPages";

import Login from "../screens/Login";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Perfil from "../screens/Profile";
import RegisterPage from "../screens/RegisterPage";

import { AdminLayout } from "../administracion-sistema/components/layout/AdminLayout";
import { ProductsPage } from "../administracion-sistema/pages/ProductsPage/ProductsPage";
import { SuppliesPage } from "../administracion-sistema/pages/SuppliesPage/SuppliesPage";
import { CategoriesPage } from "../administracion-sistema/pages/CategoriesPage/CategoriesPage";
import { EmployeesPage } from "../administracion-sistema/pages/EmployeesPage/EmployeesPage";
import { StatisticsPage } from "../administracion-sistema/pages/StatisticsPage/StattisticsPage";
import { OrdersPage } from "../administracion-sistema/pages/Cash/CashOrdersPage";
import { KitchenOrdersPage } from "../administracion-sistema/pages/Kitchen/KitchenOrdersPage";
import { DeliveryOrdersPage } from "../administracion-sistema/pages/Delivery/DeliveryOrdersPage";

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
                    <Route path="category" element={<CategoriesPage />} />
                    <Route path="employees" element={<EmployeesPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="cash-orders" element={<OrdersPage />} />
                    <Route path="kitchen-orders" element={<KitchenOrdersPage />} />
                    <Route path="delivery-orders" element={<DeliveryOrdersPage />} />
                </Route>

            </Routes>
            <Footer></Footer>
        </>
    );
}
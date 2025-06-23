// src/routes/AppRouter.tsx

import { Route, Routes } from "react-router-dom";

import Home from "../cliente/screens/Home";

import Login from "../cliente/screens/Login";
import LoginEmployee from "../administracion-sistema/screens/LoginEmployee";
import Navbar from "../cliente/components/Navbar";
import Footer from "../cliente/components/Footer";
import Perfil from "../cliente/screens/Profile";
import { Orders } from "../cliente/screens/Orders";
import RegisterPage from "../cliente/screens/RegisterPage";

import { AdminLayout } from "../administracion-sistema/components/layout/AdminLayout";
import { ProductsPage } from "../administracion-sistema/screens/ProductsPage";
import { SalesPage } from "../administracion-sistema/screens/SalesPage";
import { SuppliesPage } from "../administracion-sistema/screens/SuppliesPage";
import { CategoriesPage } from "../administracion-sistema/screens/CategoriesPage";
import { EmployeesPage } from "../administracion-sistema/screens/EmployeesPage";
import { CashOrdersPage } from "../administracion-sistema/screens/CashOrdersPage";
import { KitchenOrdersPage } from "../administracion-sistema/screens/KitchenOrdersPage";
import { DeliveryOrdersPage } from "../administracion-sistema/screens/DeliveryOrdersPage";
import { OrderDashboard } from "../administracion-sistema/screens/OrdersDashboard";
import MenuPages from "../cliente/screens/MenuPages";

export function AppRouter() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/menu" element={<MenuPages />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/loginEmployee" element={<LoginEmployee />} />
                <Route path="/profile" element={<Perfil />} />
                <Route path="/ordenes" element={<Orders />} />

                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="sales" element={<SalesPage />} />
                    <Route path="supplies" element={<SuppliesPage />} />
                    <Route path="category" element={<CategoriesPage />} />
                    <Route path="employees" element={<EmployeesPage />} />
                    <Route path="orders" element={<OrderDashboard />} />
                    {/* <Route path="statistics" element={<StatisticsPage />} /> */}
                    <Route path="cash-orders" element={<CashOrdersPage />} />
                    <Route path="kitchen-orders" element={<KitchenOrdersPage />} />
                    <Route path="delivery-orders" element={<DeliveryOrdersPage />} />
                </Route>

            </Routes>
            <Footer></Footer>
        </>
    );
}
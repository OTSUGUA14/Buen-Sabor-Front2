// src/routes/AppRouter.tsx

import { Route, Routes } from "react-router-dom";
import { Outlet } from "react-router-dom"; // Necesario si usas un ClientLayout o el Outlet de AdminLayout

import Home from "../screens/Home";
import Menu from "../screens/Menu";

import Login from "../screens/Login";
import SignUp from "../screens/RegisterPage";
import Navbar from "../components/Navbar"; // Tu Navbar del cliente
import Footer from "../components/Footer"; // Tu Footer del cliente

// Importa ProductsPage, SuppliesPage y AdminLayout
import { ProductsPage } from '../administracion-sistema/pages/ProductsPage/ProductsPage';
import { SuppliesPage } from '../administracion-sistema/pages/SuppliesPage/SuppliesPage'; // <-- Importación de SuppliesPage
import { AdminLayout } from '../administracion-sistema/components/layout/AdminLayout'; // Importación de AdminLayout

// NOTA: Si no estás usando este ClientLayout en tu proyecto, la estructura de Routes será ligeramente diferente.
// Pero la clave es que Navbar y Footer están fuera de Routes para que apliquen globalmente.
// Si los quieres solo para el cliente, tendrías que envolver las rutas de cliente en un layout.

export function AppRouter() {
    return (
        <>
            {/* Navbar y Footer están aquí para que aparezcan en todas las páginas (cliente y admin) */}
            <Navbar />
            <Routes>
                {/* Rutas de cliente */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/registro" element={<SignUp />} />
                <Route path="/login" element={<Login />} />

                {/* RUTAS DE ADMINISTRACIÓN: Anidadas dentro de AdminLayout */}
                {/* La carpeta 'layout' está dentro de 'components' en 'administracion-sistema' */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="supplies" element={<SuppliesPage />} /> {/* <-- Aquí está la ruta de SuppliesPage */}
                </Route>

                {/* Puedes añadir una ruta catch-all para 404 si es necesario, debería ser la última */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
            <Footer></Footer>
        </>
    );
}
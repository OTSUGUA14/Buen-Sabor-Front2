import { Route, Routes } from "react-router-dom";

import Home from "../screens/Home";
import Menu from "../screens/Menu";

import Perfil from "../screens/Perfil";
import SignUp from "../screens/SignUp";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export function AppRouter() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="*" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/registro" element={<SignUp />} />
                <Route path="/perfil" element={<Perfil />} />
            </Routes>
            <Footer></Footer>
        </>
    );
}
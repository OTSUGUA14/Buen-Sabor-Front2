import { createContext, useContext, useState, useEffect } from "react";
import type { UserRegister } from "../types/UserData";

interface UserContextType {
    profile: UserRegister | null;
    setProfile: (profile: UserRegister | null) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType>({
    profile: null,
    setProfile: () => { },
    logout: () => { },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [profile, setProfileState] = useState<UserRegister | null>(null);

    // Cargar perfil desde localStorage al iniciar
    useEffect(() => {
        const stored = localStorage.getItem("profile");
        if (stored) {
            setProfileState(JSON.parse(stored));
        }
    }, []);

    // Guardar perfil en localStorage cuando cambia
    const setProfile = (profile: UserRegister | null) => {
        setProfileState(profile);
        if (profile) {
            localStorage.setItem("profile", JSON.stringify(profile));
        } else {
            localStorage.removeItem("profile");
        }
    };

    // Cerrar sesión
    const logout = () => {
        setProfile(null);
    };

    return (
        <UserContext.Provider value={{ profile, setProfile, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
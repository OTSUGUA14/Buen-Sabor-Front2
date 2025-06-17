import { createContext, useContext, useState, useEffect } from "react";
import type { UserRegister } from "../types/UserData";

interface UserContextType {
    profile: UserRegister | null;
    setProfile: (profile: UserRegister | null) => void;
    logout: () => void;
    updateProfile: (newData: Partial<UserRegister>) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
    profile: null,
    setProfile: () => {},
    logout: () => {},
    updateProfile: async () => {},
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

    // Función para actualizar el perfil
    const updateProfile = async (newData: Partial<UserRegister>) => {
        // Aquí deberías hacer la petición a tu backend si tienes uno.
        // Por ahora, solo actualiza localmente:
        setProfile(profile ? { ...profile, ...newData } : null);
    };

    // Cerrar sesión
    const logout = () => {
        setProfile(null);
    };

    return (
        <UserContext.Provider value={{ profile, setProfile, logout, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
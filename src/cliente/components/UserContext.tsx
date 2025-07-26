import { createContext, useContext, useState, useEffect } from "react";
import { updateUser } from '../services/Api';
import type { SimpleDomicile, UserRegister } from "../types/UserData";

interface UserContextType {
    profile: UserRegister | null;
    setProfile: (profile: UserRegister | null) => void;
    logout: () => void;
    updateProfile: (newData: Partial<UserRegister>) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
    profile: null,
    setProfile: () => { },
    logout: () => { },
    updateProfile: async () => { },
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
    const updateProfile = async (formData: any) => {
        if (!profile?.id) {
            console.error("Falta el ID del usuario.");
            return;
        }

        // ✅ Usar locationId del form (si está disponible) o el ID actual del domicilio
        let locationId: number = formData.locationId || 1;
        
        // Si no hay locationId en formData, obtenerlo del perfil actual
        if (!formData.locationId && profile.domiciles && profile.domiciles.length > 0) {
            const domicile = profile.domiciles[0];
            if (domicile && domicile.location) {
                const loc = domicile.location;
                if (typeof loc === "object" && loc !== null && "idlocation" in loc) {
                    locationId = (loc as any).idlocation;
                } else if (typeof loc === "number") {
                    locationId = loc;
                }
            }
        }

        const domicilio: SimpleDomicile = {
            street: formData.street,
            zipcode: formData.zipcode, // ✅ Enviar como zipcode (minúscula)
            number: Number(formData.number),
            location: locationId // ✅ Usar el locationId correcto
        };

        const updated = await updateUser(profile.id, {
            firstName: formData.name,
            lastName: formData.lastName,
            username: formData.username,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            password: formData.password,
            birthDate: profile.birthDate,
            domiciles: [domicilio]
        });
        setProfile(updated);
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
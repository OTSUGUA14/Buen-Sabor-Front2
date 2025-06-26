import { useState } from 'react';
import { useEffect } from 'react';
import { useUser } from '../../cliente/components/UserContext';
import '../styles/Profile.css';

const Profile = () => {

    const [showPassword, setShowPassword] = useState(false);

    const { profile, updateProfile } = useUser();
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        name: profile?.name || '',
        lastName: profile?.lastName || '',
        username: profile?.username || '',
        phoneNumber: profile?.phoneNumber || '',
        email: profile?.email || '',
        password: profile?.password || '',
    });

    useEffect(() => {
        if (profile) {
            setForm({
                name: profile.name || '',
                lastName: profile.lastName || '',
                username: profile.username || '',
                phoneNumber: profile.phoneNumber || '',
                email: profile.email || '',
                password: profile.password || '',
            });
        }
    }, [profile]);

    if (!profile) {
        return <div className="profile-container">Cargando perfil...</div>;
    }

    const avatarUrl = profile.userImage || "https://images.steamusercontent.com/ugc/18200902477657540315/C8CBD823EF42E1F4E8368E5D56A9FC289B18DA32/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false";
    const address = profile.domiciles && profile.domiciles.length > 0
        ? `${profile.domiciles[0].street} ${profile.domiciles[0].number},`
        : "No registrado";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setIsEditing(false);
        setForm({
            name: profile.name || '',
            lastName: profile?.lastName || '',
            username: profile?.username || '',
            phoneNumber: profile.phoneNumber || '',
            email: profile.email || '',
            password: profile?.password || '',
        });
    };

    const handleSave = async () => {
        // Aquí deberías llamar a tu API o contexto para actualizar el perfil
        await updateProfile(form); // Asegúrate de implementar esto en tu contexto
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <h1 className="profile-title">MIS DATOS PERSONALES</h1>
            <div className="profile-content">
                <div className="profile-avatar-section">
                    <div className="profile-avatar-circle">
                        <img src={avatarUrl} alt="Avatar de Usuario" className="profile-avatar-image" />
                    </div>
                </div>
                <div className="profile-details-section">
                    <div className="profile-detail-item">
                        <label className="profile-label">Nombre</label>
                        {isEditing ? (
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="profile-input"
                            />
                        ) : (
                            <p className="profile-value">{profile.name}</p>
                        )}
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Apellido</label>
                        {isEditing ? (
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                className="profile-input"
                            />
                        ) : (
                            <p className="profile-value">{profile.lastName}</p>
                        )}
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Nombre de usuario</label>
                        {isEditing ? (
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="profile-input"
                            />
                        ) : (
                            <p className="profile-value">{profile.username}</p>
                        )}
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Teléfono</label>
                        {isEditing ? (
                            <input
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                className="profile-input"
                            />
                        ) : (
                            <p className="profile-value">{profile.phoneNumber}</p>
                        )}
                    </div>
                    <div className="profile-detail-item">
                        <label className="profile-label">Correo Electrónico</label>
                        {isEditing ? (
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="profile-input"
                            />
                        ) : (
                            <p className="profile-value">{profile.email}</p>
                        )}
                    </div>
                    <div className="profile-detail-item">
                        <label className="profile-label">Contraseña</label>
                        {isEditing ? (
                            <div className="container-password-edit">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className='password-input'
                                />

                                <span onClick={() => setShowPassword(prev => !prev)} style={{ cursor: 'pointer' }}>
                                    <img
                                        src={showPassword ? 'public/icons/eye-on.svg' : 'public/icons/eye-off.svg'}
                                        alt={showPassword ? 'hide password' : 'show password'}
                                        style={{ filter: 'brightness(0) saturate(100%) invert(65%) sepia(85%) saturate(447%) hue-rotate(-13deg) brightness(105%) contrast(101%)' }}
                                    />
                                </span>
                            </div>
                        ) : (
                            <p className="profile-value">
                                {showPassword ? profile.password : '•'.repeat(profile.password.length)}
                                <span onClick={() => setShowPassword(prev => !prev)} style={{ cursor: 'pointer' }}>
                                    <img
                                        src={showPassword ? 'public/icons/eye-on.svg' : 'public/icons/eye-off.svg'}
                                        alt={showPassword ? 'hide password' : 'show password'}
                                    />
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="profile-detail-item">
                        <label className="profile-label">Dirección</label>
                        <p className="profile-value">{address}</p>
                    </div>
                </div>
            </div>
            {isEditing ? (
                <div className='buttons-container'>
                    <button className="profile-cancel-button" onClick={handleCancel}>Cancelar</button>
                    <button className="profile-save-button" onClick={handleSave}>Guardar</button>
                </div>
            ) : (
                <button className="profile-edit-button" onClick={handleEdit}>
                    Editar
                </button>
            )}
        </div>
    );
};

export default Profile;
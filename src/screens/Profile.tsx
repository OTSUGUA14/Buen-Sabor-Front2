import '../styles/Profile.css'; 

const Profile = () => {
    const userData = {
        name: 'Esteban Quito',
        phone: '+54 9 2619999999',
        email: 'estebanquito@gmail.com',
        password: '*************', 
        address: 'Las Heras 273, Mendoza',
        role: 'CAJERO', 
        avatar: 'URL_DE_LA_IMAGEN_DEL_AVATAR' 
    };

    return (
        <div className="profile-container">
            <h1 className="profile-title">MIS DATOS PERSONALES</h1>

            <div className="profile-content">
                <div className="profile-avatar-section">
                    <div className="profile-avatar-circle">
                        <img src="https://images.steamusercontent.com/ugc/18200902477657540315/C8CBD823EF42E1F4E8368E5D56A9FC289B18DA32/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false" alt="Avatar de Usuario" className="profile-avatar-image" />
                    </div>
                    <span className="profile-role">{userData.role}</span>
                </div>

                <div className="profile-details-section">
                    <div className="profile-detail-item">
                        <label className="profile-label">Nombre</label>
                        <p className="profile-value">{userData.name}</p>
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Teléfono</label>
                        <p className="profile-value">{userData.phone}</p>
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Correo Electrónico</label>
                        <p className="profile-value">{userData.email}</p>
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Contraseña</label>
                        <p className="profile-value">{userData.password}</p>
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Dirección</label>
                        <p className="profile-value">{userData.address}</p>
                    </div>
                </div>
            </div>

            <button className="profile-edit-button">
                <span className="profile-edit-icon">✏️</span> Editar
            </button>
        </div>
    );
};

export default Profile;
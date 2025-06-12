import { useUser } from '../components/UserContext';
import '../styles/Profile.css';


const Profile = () => {
    const { profile } = useUser();

    if (!profile) {
        return <div className="profile-container">Cargando perfil...</div>;
    }

    // Puedes ajustar el avatar y la dirección según los datos reales
    const avatarUrl = profile.userImage || "https://images.steamusercontent.com/ugc/18200902477657540315/C8CBD823EF42E1F4E8368E5D56A9FC289B18DA32/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false";
    const address = profile.domiciles && profile.domiciles.length > 0
        ? `${profile.domiciles[0].street} ${profile.domiciles[0].number}, ${profile.domiciles[0].location.name}, ${profile.domiciles[0].location.province.name}`
        : "No registrado";

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
                        <p className="profile-value">{profile.name}</p>
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Teléfono</label>
                        <p className="profile-value">{profile.phoneNumber}</p>
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Correo Electrónico</label>
                        <p className="profile-value">{profile.email}</p>
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Contraseña</label>
                        <p className="profile-value">*************</p>
                    </div>

                    <div className="profile-detail-item">
                        <label className="profile-label">Dirección</label>
                        <p className="profile-value">{address}</p>
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
import React from 'react';

const ProfilePopup = ({ profile, onClose }) => {
    if (!profile) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <h2>{profile.name}'s Profile</h2>
                <p><strong>Email:</strong> {profile.email}</p>

                <h3>Search History</h3>
                <ul>
                    {profile.searchHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>

                <h3>Rating History</h3>
                <ul>
                    {profile.ratingHistory.map((item, index) => (
                        <li key={index}>
                            {item.movie}: {item.rating} stars
                        </li>
                    ))}
                </ul>

                <h3>Update Profile</h3>
                <button style={styles.updateButton}>Edit Profile</button>

                <button onClick={onClose} style={styles.closeButton}>Close</button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        width: '400px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    updateButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    closeButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default ProfilePopup;

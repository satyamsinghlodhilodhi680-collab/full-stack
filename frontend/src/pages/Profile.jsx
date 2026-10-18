
import { useEffect, useState } from "react";
import { UserRound, LockKeyhole, Save } from "lucide-react";
import api from "../services/api";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [selectedPhoto, setSelectedPhoto] = useState(null);
const [uploadingPhoto, setUploadingPhoto] = useState(false);
const [photoMessage, setPhotoMessage] = useState("");
const [photoError, setPhotoError] = useState("");

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: ""
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await api.get("/auth/get-me");
                const currentUser = response.data.user;

                setUser(currentUser);
                setProfile({
                    firstName: currentUser.firstName || "",
                    lastName: currentUser.lastName || ""
                });
            } catch (error) {
                setProfileError(
                    error.response?.data?.message ||
                    "Profile load nahi hua. Please login karke try karo."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        setProfileMessage("");
        setProfileError("");

        if (!profile.firstName.trim() || !profile.lastName.trim()) {
            setProfileError("First name aur last name required hain.");
            return;
        }

        try {
            setSavingProfile(true);

            const response = await api.put("/auth/update-profile", {
                firstName: profile.firstName,
                lastName: profile.lastName
            });

            setUser(response.data.user);
            setProfileMessage(
                response.data.message || "Profile updated successfully."
            );
        } catch (error) {
            setProfileError(
                error.response?.data?.message ||
                "Profile update nahi hua. Dobara try karo."
            );
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswords((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        if (
            !passwords.currentPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
        ) {
            setPasswordError("Saare password fields fill karo.");
            return;
        }

        if (passwords.newPassword.length < 6) {
            setPasswordError(
                "New password kam se kam 6 characters ka hona chahiye."
            );
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError("New password aur confirm password match nahi karte.");
            return;
        }

        try {
            setChangingPassword(true);

            const response = await api.put("/auth/change-password", passwords);

            setPasswordMessage(
                response.data.message || "Password updated successfully."
            );

            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            setPasswordError(
                error.response?.data?.message ||
                "Password update nahi hua. Dobara try karo."
            );
        } finally {
            setChangingPassword(false);
        }
    };


    const handlePhotoUpload = async (e) => {
    e.preventDefault();

    setPhotoMessage("");
    setPhotoError("");

    if (!selectedPhoto) {
        setPhotoError("Pehle ek photo select karo.");
        return;
    }

    const formData = new FormData();
    formData.append("profilePhoto", selectedPhoto);

    try {
        setUploadingPhoto(true);

        const response = await api.post(
            "/profile-photo/upload",
            formData
        );

        if (response.data.user) {
            setUser(response.data.user);
        } else if (response.data.profilePhoto) {
            setUser((previous) => ({
                ...previous,
                profilePhoto: response.data.profilePhoto
            }));
        }

        setSelectedPhoto(null);
        setPhotoMessage(
            response.data.message || "Profile photo updated successfully."
        );
    } catch (error) {
        setPhotoError(
            error.response?.data?.message ||
            "Photo upload nahi hui. Dobara try karo."
        );
    } finally {
        setUploadingPhoto(false);
    }
};
    const inputStyle = {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        border: "1px solid var(--border-color, #d1d5db)",
        borderRadius: "9px",
        background: "var(--card-bg, #ffffff)",
        color: "var(--text-color, #1f2937)",
        fontSize: "15px",
        outlineOffset: "2px"
    };

    const labelStyle = {
        display: "block",
        marginBottom: "7px",
        fontSize: "14px",
        fontWeight: "600",
        color: "var(--text-color, #374151)"
    };

    const fieldStyle = {
        marginBottom: "18px"
    };

    const buttonStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "11px 18px",
        border: "none",
        borderRadius: "9px",
        background: "#15803d",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer"
    };

    if (loading) {
        return (
            <main style={{ maxWidth: "850px", margin: "40px auto", padding: "20px" }}>
                Profile load ho raha hai...
            </main>
        );
    }

    if (!user) {
        return (
            <main style={{ maxWidth: "850px", margin: "40px auto", padding: "20px" }}>
                <h2>Profile open nahi ho paya</h2>
                <p>{profileError || "Please login karke dobara try karo."}</p>
            </main>
        );
    }

    return (
        <main
            style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "32px 18px 50px",
                color: "var(--text-color, #1f2937)"
            }}
        >
            <div style={{ marginBottom: "26px" }}>
                <h1 style={{ margin: "0 0 8px", fontSize: "30px" }}>
                    My Profile
                </h1>
                <p style={{ margin: 0, opacity: 0.75 }}>
                    Apni personal information aur password manage karo.
                </p>
            </div>

            <section
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "22px",
                    marginBottom: "22px",
                    border: "1px solid var(--border-color, #e5e7eb)",
                    borderRadius: "16px",
                    background: "var(--card-bg, #ffffff)"
                }}
            >
               <div
    style={{
        width: "76px",
        height: "76px",
        flexShrink: 0,
        borderRadius: "50%",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        background: "#dcfce7",
        color: "#166534"
    }}
>
    {user.profilePhoto ? (
        <img
            src={user.profilePhoto}
            alt="Profile"
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
            }}
        />
    ) : (
        <UserRound size={34} />
    )}
</div>

                <div style={{ minWidth: 0 }}>
                    <h2 style={{ margin: "0 0 5px", fontSize: "21px" }}>
                        {user.firstName} {user.lastName}
                    </h2>
                    <p style={{ margin: "0 0 5px", overflowWrap: "anywhere" }}>
                        {user.email}
                    </p>
                    <span style={{ fontSize: "13px", opacity: 0.75 }}>
                        Role: {user.role}
                    </span>


                    <form onSubmit={handlePhotoUpload}>
    <div style={{ marginTop: "12px" }}>
        <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
                const file = e.target.files?.[0];

                setPhotoMessage("");
                setPhotoError("");

                if (!file) {
                    setSelectedPhoto(null);
                    return;
                }

                if (file.size > 2 * 1024 * 1024) {
                    setSelectedPhoto(null);
                    setPhotoError("Photo 2 MB se chhoti honi chahiye.");
                    e.target.value = "";
                    return;
                }

                setSelectedPhoto(file);
            }}
        />

        <button
            type="submit"
            style={{ ...buttonStyle, marginTop: "10px" }}
            disabled={!selectedPhoto || uploadingPhoto}
        >
            {uploadingPhoto ? "Uploading..." : "Change Photo"}
        </button>

        {photoMessage && (
            <p style={{ color: "#15803d" }}>{photoMessage}</p>
        )}

        {photoError && (
            <p style={{ color: "#dc2626" }}>{photoError}</p>
        )}
    </div>
</form>
                </div>
            </section>

            <section
                style={{
                    padding: "24px",
                    marginBottom: "22px",
                    border: "1px solid var(--border-color, #e5e7eb)",
                    borderRadius: "16px",
                    background: "var(--card-bg, #ffffff)"
                }}
            >
                <h2 style={{ display: "flex", alignItems: "center", gap: "9px", marginTop: 0 }}>
                    <UserRound size={21} /> Edit Profile
                </h2>

                {profileMessage && (
                    <p role="status" style={{ color: "#15803d" }}>
                        {profileMessage}
                    </p>
                )}

                {profileError && (
                    <p role="alert" style={{ color: "#dc2626" }}>
                        {profileError}
                    </p>
                )}

                <form onSubmit={handleProfileSubmit}>
                    <div style={fieldStyle}>
                        <label style={labelStyle} htmlFor="firstName">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleProfileChange}
                            autoComplete="given-name"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label style={labelStyle} htmlFor="lastName">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleProfileChange}
                            autoComplete="family-name"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label style={labelStyle} htmlFor="profileEmail">
                            Email (cannot be changed here)
                        </label>
                        <input
                            id="profileEmail"
                            value={user.email || ""}
                            style={{ ...inputStyle, opacity: 0.7 }}
                            readOnly
                        />
                    </div>

                    <button
                        type="submit"
                        style={buttonStyle}
                        disabled={savingProfile}
                    >
                        <Save size={17} />
                        {savingProfile ? "Saving..." : "Save Profile"}
                    </button>
                </form>
            </section>

            <section
                style={{
                    padding: "24px",
                    border: "1px solid var(--border-color, #e5e7eb)",
                    borderRadius: "16px",
                    background: "var(--card-bg, #ffffff)"
                }}
            >
                <h2 style={{ display: "flex", alignItems: "center", gap: "9px", marginTop: 0 }}>
                    <LockKeyhole size={21} /> Change Password
                </h2>

                {passwordMessage && (
                    <p role="status" style={{ color: "#15803d" }}>
                        {passwordMessage}
                    </p>
                )}

                {passwordError && (
                    <p role="alert" style={{ color: "#dc2626" }}>
                        {passwordError}
                    </p>
                )}

                <form onSubmit={handlePasswordSubmit}>
                    <div style={fieldStyle}>
                        <label style={labelStyle} htmlFor="currentPassword">
                            Current Password
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handlePasswordChange}
                            autoComplete="current-password"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label style={labelStyle} htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                            autoComplete="new-password"
                            minLength={6}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label style={labelStyle} htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                            autoComplete="new-password"
                            minLength={6}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={buttonStyle}
                        disabled={changingPassword}
                    >
                        <LockKeyhole size={17} />
                        {changingPassword ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Profile;

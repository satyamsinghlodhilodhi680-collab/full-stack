
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, MapPin, LogOut ,Sun,Moon ,Bell ,CheckCheck } from "lucide-react";
import api from "../services/api";
import { useTheme } from "../ThemeContext";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
const [notificationsOpen, setNotificationsOpen] = useState(false);
    
 const { theme, toggleTheme } = useTheme();


    const closeMenu = () => {
        setMenuOpen(false);
    };

   useEffect(() => {
    api.get("/auth/get-me")
        .then(async (response) => {
            setUser(response.data.user);

            try {
                const notificationResponse =
                    await api.get("/notifications");

                setNotifications(
                    notificationResponse.data.notifications || []
                );

                setUnreadCount(
                    notificationResponse.data.unreadCount || 0
                );
            } catch (error) {
                console.error("Notifications fetch failed:", error);
            }
        })
        .catch(() => {
            setUser(null);
        });
}, []);

    const loadNotifications = async () => {
    try {
        const response = await api.get("/notifications");

        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
        console.error("Notifications fetch failed:", error);
    }
};
const handleNotificationClick = async (notification) => {
    try {
        if (!notification.isRead) {
            await api.patch(
                `/notifications/${notification._id}/read`
            );

            setNotifications((previous) =>
                previous.map((item) =>
                    item._id === notification._id
                        ? { ...item, isRead: true }
                        : item
                )
            );

            setUnreadCount((count) => Math.max(0, count - 1));
        }

        setNotificationsOpen(false);
        navigate(notification.link || "/notices");
    } catch (error) {
        console.error("Notification update failed:", error);
    }
};

const handleMarkAllRead = async () => {
    try {
        await api.patch("/notifications/read-all");

        setNotifications((previous) =>
            previous.map((item) => ({
                ...item,
                isRead: true
            }))
        );

        setUnreadCount(0);
    } catch (error) {
        console.error("Mark all as read failed:", error);
    }
};

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            await api.post("/auth/logout");

            setUser(null);
            closeMenu();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout nahi hua. Please dobara try karo.");
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <header className="navbar">
            <div className="navbar-container">

              
{/* LOGO */}
<Link to="/" className="logo" onClick={closeMenu}>
    <img
        src="/logo.png"
        alt="Gao-Connect logo"
        className="logo-image"
    />

    <div className="logo-text">
        <strong>Gao-Connect</strong>
        <span>
            <MapPin size={12} />
            AMKHERIYA • DAMOH, M.P.
        </span>
    </div>
</Link>


                {/* DESKTOP NAVIGATION */}
               <nav className="desktop-nav">
    <Link to="/" onClick={closeMenu}>Home</Link>
    <Link to="/kisan" onClick={closeMenu}>Kisan</Link>
    <Link to="/notices" onClick={closeMenu}>Notices</Link>
    <Link to="/jobs" onClick={closeMenu}>Jobs</Link>
    <Link to="/marketplace" onClick={closeMenu}>Market</Link>
    <Link
    to="/my-applications"
    onClick={closeMenu}
>
     Applications
</Link>
    <Link to="/contact" onClick={closeMenu}>Contact</Link>
    <Link to="/events" onClick={closeMenu}>Events</Link>
    <Link to="/profile" onClick={closeMenu}>Profile</Link>
</nav>

                {/* DESKTOP ACTIONS */}
                <div className="nav-actions">


<div className="notification-wrapper">
    <button
        type="button"
        className="notification-btn"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        aria-label="Notifications"
        title="Notifications"
    >
        <Bell size={20} />

        {unreadCount > 0 && (
            <span className="notification-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
            </span>
        )}
    </button>

    {notificationsOpen && (
        <div className="notification-dropdown">
         
<div className="notification-header">
    <strong>Notifications</strong>

    <div className="notification-header-actions">
        <button
            type="button"
            onClick={loadNotifications}
            title="Refresh notifications"
        >
            <Bell size={16} />
        </button>

        <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            title="Mark all as read"
        >
            <CheckCheck size={16} />
            <span>Read all</span>
        </button>
    </div>
</div>


            {notifications.length === 0 ? (
                <p className="notification-empty">
                    No notifications yet.
                </p>
            ) : (
                <div className="notification-list">
                    {notifications.map((notification) => (
                        <button
                            type="button"
                            key={notification._id}
                            className={`notification-item ${
                                !notification.isRead ? "unread" : ""
                            }`}
                            onClick={() =>
                                handleNotificationClick(notification)
                            }
                        >
                            <span className="notification-item-title">
                                {notification.title}
                            </span>

                            <span className="notification-item-message">
                                {notification.message}
                            </span>

                            {!notification.isRead && (
                                <span className="notification-unread-label">
                                    New
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )}
</div>
<button
    type="button"
    className="theme-toggle"
    onClick={toggleTheme}
    aria-label={theme === "light" ? "Enable dark mode" : "Enable light mode"}
    title={theme === "light" ? "Dark Mode" : "Light Mode"}
>
    {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
</button>


                    <Link to="/complaints" className="nav-complaint">
                        समस्या बताएं
                    </Link>

                   
{user && (
    <div className="flex items-center gap-2">
        {user.profilePhoto ? (
           
<img
    src={user.profilePhoto}
    alt="Profile"
    title="View profile photo"
    onClick={() => window.open(user.profilePhoto, "_blank", "noopener,noreferrer")}
    className="h-9 w-9 rounded-full object-cover cursor-pointer"
/>

        ) : (
            <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
                {user.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>
        )}

        <span className="nav-user">
            Hi, {user.firstName}
        </span>
    </div>
)}

<button
    type="button"
    className="nav-logout"
    onClick={handleLogout}
    disabled={loggingOut}
>
    <LogOut size={16} />
    {loggingOut ? "Logging out..." : "Logout"}
</button>

                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={25} /> : <Menu size={25} />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (


                <div className="mobile-menu">


                    
<button
    type="button"
    className="mobile-theme-toggle"
    onClick={toggleTheme}
>
    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    {theme === "light" ? "Dark Mode" : "Light Mode"}
</button>

       {user && (
                        <p className="mobile-user">
                            👋 Welcome, {user.firstName}
                        </p>
                    )}

                    <Link to="/" onClick={closeMenu}>🏠 Home</Link>
                    <Link to="/kisan" onClick={closeMenu}>🌾 Kisan</Link>
                    <Link to="/notices" onClick={closeMenu}>📢 Notices</Link>
                    <Link to="/jobs" onClick={closeMenu}>💼 Jobs</Link>
                    <Link to="/events" onClick={closeMenu}>Events</Link>
                    <Link to="/marketplace" onClick={closeMenu}>🛒 Market</Link>
                    <Link to="/emergency" onClick={closeMenu}>🚨 Emergency</Link>
                    <Link to="/contact" onClick={closeMenu}>📞 Contact</Link>
                    
                    <Link to="/profile" onClick={closeMenu}>
    👤 My Profile
</Link>

<Link
    to="/my-applications"
    onClick={closeMenu}
>
    My Applications
</Link>
                    <Link
                        to="/complaints"
                        className="mobile-complaint"
                        onClick={closeMenu}
                    >
                        📝 समस्या बताएं
                    </Link>

                    <button
                        type="button"
                        className="mobile-logout"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        <LogOut size={16} />
                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            )}
        </header>
    );
}

export default Navbar;

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    Bell,
    CalendarDays,
    ArrowRight,
    Megaphone,
    Pin
} from "lucide-react";
import api from "../services/api";

function Notices() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotices = async () => {

            const location = useLocation();
const searchQuery = (location.state?.searchQuery || "").trim().toLowerCase();
            try {
                const response = await api.get("/notices");
                setNotices(response.data.notices || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Notices load nahi ho sake. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const formatDate = (createdAt) => {
        if (!createdAt) {
            return { date: "--", month: "---" };
        }

        const date = new Date(createdAt);

        const filteredNotices = notices.filter((notice) =>
    `${notice.title || ""} ${notice.description || ""} ${notice.category || ""}`
        .toLowerCase()
        .includes(searchQuery)
);

        return {
            date: date.getDate(),
            month: date
                .toLocaleString("en-US", { month: "short" })
                .toUpperCase()
        };
    };

    return (
        <>
            <Navbar />

            <main>
                <section className="notices-hero">
                    <div className="notices-hero-content">
                        <div className="notice-icon">
                            <Bell size={28} />
                        </div>

                        <span>AMKHERIYA DIGITAL NOTICE BOARD</span>

                        <h1>
                            गाँव की <strong>ताज़ा सूचनाएँ</strong>
                        </h1>

                        <p>
                            पंचायत, किसान और गाँव से जुड़ी महत्वपूर्ण
                            announcements अब एक ही जगह।
                        </p>
                    </div>
                </section>

                <section className="notices-page">
                    <div className="notices-heading">
                        <div>
                            <span>LATEST UPDATES</span>
                            <h2>Digital Notice Board</h2>
                        </div>

                        <div className="notice-status">
                            <span></span>
                            Live Updates
                        </div>
                    </div>

                    <div className="notices-list">
                        {loading && (
                            <p>Notices load ho rahe hain...</p>
                        )}

                        {error && (
                            <p role="alert">{error}</p>
                        )}

                        {!loading && !error && notices.length === 0 && (
                            <p>
                                Abhi koi notice available nahi hai.
                            </p>
                        )}

                        {!loading && !error && searchQuery && filteredNotices.length === 0 && (
    <p>Koi matching notice nahi mila. Dusra keyword try karo.</p>
)}

                        {!loading && !error && filteredNotices.map((notice) => {
                            const { date, month } = formatDate(
                                notice.createdAt
                            );

                            return (
                                <article
                                    className="notice-item"
                                    key={notice._id}
                                >
                                    <div className="notice-date-box">
                                        <strong>{date}</strong>
                                        <span>{month}</span>
                                    </div>

                                    <div className="notice-main">
                                        <div className="notice-meta">
                                            <span className="notice-category">
                                                {notice.category || "General"}
                                            </span>
                                        </div>

                                        <h3>{notice.title}</h3>

                                        <p>{notice.description}</p>

                                        <button
                                            type="button"
                                            className="read-notice"
                                            onClick={() => {
                                                alert(
                                                    `${notice.title}\n\n${notice.description}`
                                                );
                                            }}
                                        >
                                            पूरी सूचना देखें
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>

                                    <div className="notice-megaphone">
                                        <Megaphone size={21} />
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="notice-info">
                        <CalendarDays size={20} />

                        <div>
                            <strong>सूचना अपडेट होती रहेगी</strong>
                            <p>
                                Admin Panel से publish ki gayi notices
                                यहाँ दिखाई देंगी।
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Notices;
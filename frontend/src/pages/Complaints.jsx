
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import api from "../services/api";

function Complaints() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState("");

    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    const fetchMyComplaints = async () => {
        try {
            const response = await api.get("/complaints/my");

            if (response.data.success) {
                setComplaints(response.data.complaints);
            }
        } catch (error) {
            console.error("Fetch complaints error:", error);
        }
    };

    useEffect(() => {
        fetchMyComplaints();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitted(false);
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/complaints", {
                title: category,
                category: category,
                description: description
            });

            if (response.data.success) {
                setSubmitted(true);
                setCategory("");
                setDescription("");
                await fetchMyComplaints();
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Complaint submit nahi hui. Please login karke dobara try karein."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="page">
                <div className="page-header">
                    <span>📝 COMPLAINT</span>
                    <h1>अपनी समस्या बताएं</h1>
                    <p>
                        गाँव से जुड़ी समस्या हमें बताएं।
                    </p>
                </div>

                <form className="complaint-form" onSubmit={handleSubmit}>
                    <label>
                        आपका नाम
                        <input
                            type="text"
                            placeholder="अपना नाम लिखें"
                            required
                        />
                    </label>

                    <label>
                        मोबाइल नंबर
                        <input
                            type="tel"
                            placeholder="मोबाइल नंबर"
                            required
                        />
                    </label>

                    <label>
                        समस्या की category
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="Road">Road</option>
                            <option value="Water">Water</option>
                            <option value="Street Light">Street Light</option>
                            <option value="Cleanliness">Cleanliness</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>

                    <label>
                        समस्या
                        <textarea
                            rows="6"
                            placeholder="अपनी समस्या विस्तार से लिखें..."
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            required
                        />
                    </label>

                    <button
                        className="primary-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Complaint Submit करें"}
                    </button>

                    {submitted && (
                        <div className="success-message">
                            ✅ आपकी complaint successfully submit हो गई।
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}
                </form>

                <section className="my-complaints">
                    <h2>मेरी शिकायतें</h2>

                    {complaints.length === 0 ? (
                        <p>अभी आपने कोई complaint submit नहीं की है।</p>
                    ) : (
                        complaints.map((complaint) => (
                            <article
                                className="complaint-card"
                                key={complaint._id}
                            >
                                <h3>{complaint.title}</h3>
                                <p>{complaint.description}</p>
                                <p>
                                    <strong>Category:</strong> {complaint.category}
                                </p>
                                <p>
                                    <strong>Status:</strong> {complaint.status}
                                </p>
                            </article>
                        ))
                    )}
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Complaints;

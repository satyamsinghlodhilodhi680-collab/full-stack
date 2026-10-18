
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function ManageComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState("");

    const fetchComplaints = async () => {
        try {
            setError("");

            const response = await api.get("/complaints");

            if (response.data.success) {
                setComplaints(response.data.complaints);
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Complaints load nahi ho paayi."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleStatusChange = async (complaintId, status) => {
        try {
            setUpdatingId(complaintId);
            setError("");

            const response = await api.patch(
                `/complaints/${complaintId}/status`,
                { status }
            );

            if (response.data.success) {
                setComplaints((previousComplaints) =>
                    previousComplaints.map((complaint) =>
                        complaint._id === complaintId
                            ? { ...complaint, status }
                            : complaint
                    )
                );
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Complaint status update nahi hua."
            );
        } finally {
            setUpdatingId("");
        }
    };

    return (
        <main className="admin-page">
            <div className="dashboard">
                <Link to="/admin/dashboard">
                    ← Dashboard
                </Link>

                <h1>📝 Manage Complaints</h1>

                {error && (
                    <p className="error-message">
                        ❌ {error}
                    </p>
                )}

                <div className="admin-box">
                    {loading ? (
                        <p>Complaints load ho rahi hain...</p>
                    ) : complaints.length === 0 ? (
                        <p>Abhi koi complaint nahi hai.</p>
                    ) : (
                        complaints.map((complaint) => (
                            <div
                                className="complaint-item"
                                key={complaint._id}
                            >
                                <strong>{complaint.title}</strong>

                                <p>{complaint.description}</p>

                                <p>
                                    <strong>Category:</strong>{" "}
                                    {complaint.category}
                                </p>

                                <p>
                                    <strong>Submitted by:</strong>{" "}
                                    {complaint.createdBy
                                        ? `${complaint.createdBy.firstName || ""} ${complaint.createdBy.lastName || ""}`.trim()
                                        : "User details unavailable"}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {complaint.createdBy?.email || "Not available"}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {complaint.status}
                                </p>

                                <label>
                                    Update Status
                                    <select
                                        value={complaint.status}
                                        disabled={updatingId === complaint._id}
                                        onChange={(event) =>
                                            handleStatusChange(
                                                complaint._id,
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="Pending">
                                            Pending
                                        </option>
                                        <option value="In Progress">
                                            In Progress
                                        </option>
                                        <option value="Resolved">
                                            Resolved
                                        </option>
                                    </select>
                                </label>

                                {updatingId === complaint._id && (
                                    <p>Status update ho raha hai...</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}

export default ManageComplaints;

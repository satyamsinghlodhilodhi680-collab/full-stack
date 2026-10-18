import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Bell,
    Plus,
    Pencil,
    Trash2,
    Megaphone,
    FileText,
    X,
    LoaderCircle,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import api from "../services/api";

function ManageNotices() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("General");

    const [notices, setNotices] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const fetchNotices = async () => {
        try {
            const response = await api.get("/notices");
            setNotices(response.data.notices || []);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Notices load nahi ho sake."
            );
            setMessageType("error");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const showMessage = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategory("General");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!title.trim() || !description.trim()) {
            showMessage("Title and description are required.", "error");
            return;
        }

        try {
            setLoading(true);

            if (editingId) {
                const response = await api.put(`/notices/${editingId}`, {
                    title: title.trim(),
                    description: description.trim(),
                    category
                });

                showMessage(
                    response.data.message || "Notice updated successfully."
                );
            } else {
                const response = await api.post("/notices", {
                    title: title.trim(),
                    description: description.trim(),
                    category
                });

                showMessage(
                    response.data.message || "Notice created successfully."
                );
            }

            resetForm();
            await fetchNotices();
        } catch (error) {
            showMessage(
                error.response?.data?.message ||
                "Operation failed. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (notice) => {
        setEditingId(notice._id);
        setTitle(notice.title || "");
        setDescription(notice.description || "");
        setCategory(notice.category || "General");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Kya aap sach mein ye notice delete karna chahte hain?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);
            setMessage("");

            const response = await api.delete(`/notices/${id}`);

            showMessage(
                response.data.message || "Notice deleted successfully."
            );

            if (editingId === id) {
                resetForm();
            }

            await fetchNotices();
        } catch (error) {
            showMessage(
                error.response?.data?.message ||
                "Notice delete nahi hua.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (createdAt) => {
        if (!createdAt) return "Date unavailable";

        return new Date(createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100";

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

                {/* Header */}
                <header className="mb-8">
                    <Link
                        to="/admin/dashboard"
                        className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-green-700"
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </Link>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-700">
                                <Bell size={17} />
                                Gao-Connect Admin
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Notice Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                                Create, update and manage announcements for
                                your village community.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-white px-5 py-4 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                <Megaphone size={25} />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Total Notices
                                </p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {notices.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Status Message */}
                {message && (
                    <div
                        role="status"
                        className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
                            messageType === "error"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-green-200 bg-green-50 text-green-800"
                        }`}
                    >
                        {messageType === "error" ? (
                            <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        ) : (
                            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                        )}

                        <p className="flex-1 text-sm font-medium">
                            {message}
                        </p>

                        <button
                            type="button"
                            onClick={() => setMessage("")}
                            className="rounded-md p-1 transition hover:bg-black/5"
                            aria-label="Dismiss message"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5">

                    {/* Add / Edit Form */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
                        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                    {editingId ? (
                                        <Pencil size={21} />
                                    ) : (
                                        <Plus size={23} />
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        {editingId ? "Edit Notice" : "Create Notice"}
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {editingId
                                            ? "Update the selected announcement."
                                            : "Publish a new village announcement."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
                            <div>
                                <label
                                    htmlFor="notice-title"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Notice Title
                                </label>

                                <input
                                    id="notice-title"
                                    type="text"
                                    placeholder="Enter notice title"
                                    className={inputClass}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="notice-description"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="notice-description"
                                    rows={6}
                                    placeholder="Write the complete announcement..."
                                    className={`${inputClass} resize-y`}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                                <p className="mt-2 text-xs text-slate-400">
                                    Keep the information clear and easy to understand.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="notice-category"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Category
                                </label>

                                <select
                                    id="notice-category"
                                    className={inputClass}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="General">General</option>
                                    <option value="Panchayat">Panchayat</option>
                                    <option value="Village">Village</option>
                                    <option value="Kisan">Kisan</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle size={18} className="animate-spin" />
                                        Please wait...
                                    </>
                                ) : editingId ? (
                                    <>
                                        <Pencil size={18} />
                                        Update Notice
                                    </>
                                ) : (
                                    <>
                                        <Plus size={19} />
                                        Publish Notice
                                    </>
                                )}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Cancel Editing
                                </button>
                            )}
                        </form>
                    </section>

                    {/* Existing Notices */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Existing Notices
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Manage published announcements.
                                </p>
                            </div>

                            <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                {notices.length} total
                            </span>
                        </div>

                        <div className="space-y-4 p-4 sm:p-6">
                            {fetching ? (
                                <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500">
                                    <LoaderCircle size={20} className="animate-spin text-green-700" />
                                    Loading notices...
                                </div>
                            ) : notices.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-300 px-5 py-12 text-center">
                                    <FileText
                                        size={36}
                                        className="mx-auto mb-3 text-slate-300"
                                    />
                                    <h3 className="font-semibold text-slate-800">
                                        No notices yet
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Create your first notice using the form.
                                    </p>
                                </div>
                            ) : (
                                notices.map((notice) => (
                                    <article
                                        key={notice._id}
                                        className="rounded-xl border border-slate-200 p-4 transition hover:border-green-200 hover:shadow-sm sm:p-5"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                                <Megaphone size={20} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                        {notice.category || "General"}
                                                    </span>

                                                    <span className="text-xs text-slate-400">
                                                        {formatDate(notice.createdAt)}
                                                    </span>
                                                </div>

                                                <h3 className="mt-3 break-words text-base font-bold text-slate-900">
                                                    {notice.title}
                                                </h3>

                                                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                                                    {notice.description}
                                                </p>

                                                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(notice)}
                                                        disabled={loading}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50 disabled:opacity-50"
                                                    >
                                                        <Pencil size={15} />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(notice._id)}
                                                        disabled={loading}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        <Trash2 size={15} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <footer className="mt-8 text-center text-xs text-slate-400">
                    Gao-Connect · Village Notice Management
                </footer>
            </div>
        </main>
    );
}

export default ManageNotices;
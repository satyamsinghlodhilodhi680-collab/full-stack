
import { useEffect, useState } from "react";
import {
    CalendarDays,
    MapPin,
    Clock,
    Pencil,
    Trash2,
    Plus,
    X,
    Search,
    Filter,
    RefreshCw,
} from "lucide-react";

// Yahan apne existing API instance ka wahi import path rakho
// jo ManageNotices.jsx mein use ho raha hai.
import api from "../services/api";

const initialForm = {
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Gram Sabha",
};

const categories = [
    "Gram Sabha",
    "Village Meeting",
    "Health Camp",
    "Cultural",
    "Other",
];

function ManageEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(initialForm);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/events");
            setEvents(response.data.events || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Events load nahi ho paaye."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const filteredEvents = events.filter((event) => {
        const search = searchTerm.trim().toLowerCase();

        const matchesSearch =
            (event.title || "").toLowerCase().includes(search) ||
            (event.description || "").toLowerCase().includes(search) ||
            (event.location || "").toLowerCase().includes(search);

        const matchesCategory =
            selectedCategory === "All" ||
            event.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (event) => {
        setEditingId(event._id);

        setForm({
            title: event.title || "",
            description: event.description || "",
            date: event.date ? String(event.date).slice(0, 10) : "",
            time: event.time || "",
            location: event.location || "",
            category: event.category || "Gram Sabha",
        });

        setShowForm(true);
        setError("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            if (editingId) {
                await api.put(`/events/${editingId}`, form);
                setMessage("Event successfully update ho gaya.");
            } else {
                await api.post("/events", form);
                setMessage("Naya event successfully create ho gaya.");
            }

            setForm(initialForm);
            setEditingId(null);
            setShowForm(false);

            await fetchEvents();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Event save nahi ho paaya."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Kya tum sach mein is event ko delete karna chahte ho?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setMessage("");

            await api.delete(`/events/${id}`);

            setMessage("Event delete ho gaya.");
            await fetchEvents();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Event delete nahi ho paaya."
            );
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(initialForm);
        setError("");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold text-green-700">
                            Gao-Connect Admin
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                            Manage Events
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Village meetings, Gram Sabha aur health camps manage karo.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setForm(initialForm);
                            setEditingId(null);
                            setShowForm(true);
                            setError("");
                            setMessage("");
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
                    >
                        <Plus size={19} />
                        Create Event
                    </button>
                </div>

                {/* Success and Error Messages */}
                {message && (
                    <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        <span>{message}</span>
                        <button
                            type="button"
                            onClick={() => setMessage("")}
                            aria-label="Dismiss message"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Create / Edit Form */}
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                {editingId ? "Edit Event" : "Create New Event"}
                            </h2>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Close form"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Event Title
                                </label>

                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    placeholder="Gram Sabha Meeting"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Date
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Time
                                </label>

                                <input
                                    type="text"
                                    name="time"
                                    value={form.time}
                                    onChange={handleChange}
                                    required
                                    placeholder="10:00 AM"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Location
                                </label>

                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="Gram Panchayat Bhawan"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Event ke baare mein details..."
                                    className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Event"
                                    : "Save Event"}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Search and Filters */}
                <section className="mt-8">
                    <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                All Events
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Search aur category ke hisaab se events dekho.
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                            {filteredEvents.length} / {events.length} Events
                        </span>
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="event-search"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Search Events
                            </label>

                            <div className="relative">
                                <Search
                                    size={19}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="event-search"
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Title, description ya location..."
                                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="event-category"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Filter by Category
                            </label>

                            <div className="relative">
                                <Filter
                                    size={18}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <select
                                    id="event-category"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                >
                                    <option value="All">All Categories</option>

                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {(searchTerm || selectedCategory !== "All") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("All");
                            }}
                            className="mb-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            <X size={16} />
                            Clear Filters
                        </button>
                    )}

                    {/* Events List */}
                    {loading ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                            <RefreshCw
                                size={28}
                                className="mx-auto animate-spin text-green-700"
                            />
                            <p className="mt-3 text-gray-500">
                                Events load ho rahe hain...
                            </p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                            <CalendarDays
                                className="mx-auto text-gray-400"
                                size={40}
                            />

                            <h3 className="mt-3 font-bold text-gray-800">
                                Koi matching event nahi mila
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Search ya category filter badal kar dekho.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("All");
                                }}
                                className="mt-4 font-semibold text-green-700 hover:text-green-800"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {filteredEvents.map((event) => (
                                <article
                                    key={event._id}
                                    className="flex min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md sm:p-6"
                                >
                                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                                        <div className="min-w-0">
                                            <span className="inline-block max-w-full break-words rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                {event.category}
                                            </span>

                                            <h3 className="mt-3 break-words text-lg font-bold text-gray-900">
                                                {event.title}
                                            </h3>
                                        </div>

                                        <div className="flex shrink-0 gap-2 self-start">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(event)}
                                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                                                aria-label={`Edit ${event.title}`}
                                                title="Edit event"
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(event._id)}
                                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-700 transition hover:bg-red-100"
                                                aria-label={`Delete ${event.title}`}
                                                title="Delete event"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="mt-3 break-words text-sm leading-6 text-gray-600">
                                        {event.description}
                                    </p>

                                    <div className="mt-auto grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 mt-5 text-sm text-gray-600 sm:grid-cols-2">
                                        <span className="flex min-w-0 items-start gap-2">
                                            <CalendarDays
                                                size={16}
                                                className="mt-0.5 shrink-0"
                                            />
                                            <span className="break-words">
                                                {event.date
                                                    ? String(event.date).slice(0, 10)
                                                    : "Date not available"}
                                            </span>
                                        </span>

                                        <span className="flex min-w-0 items-start gap-2">
                                            <Clock
                                                size={16}
                                                className="mt-0.5 shrink-0"
                                            />
                                            <span className="break-words">
                                                {event.time || "Time not available"}
                                            </span>
                                        </span>

                                        <span className="flex min-w-0 items-start gap-2 sm:col-span-2">
                                            <MapPin
                                                size={16}
                                                className="mt-0.5 shrink-0"
                                            />
                                            <span className="break-words">
                                                {event.location || "Location not available"}
                                            </span>
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default ManageEvents;

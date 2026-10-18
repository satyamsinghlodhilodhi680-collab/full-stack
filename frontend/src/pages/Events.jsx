
import { useEffect, useState } from "react";
import api from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data.events || []);
      } catch (err) {
        console.error("Fetch events error:", err);
        setError(
          err.response?.data?.message ||
          "Events load nahi ho paaye. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-green-800">
          Village Events & Meetings
        </h1>

        <p className="mb-8 text-gray-600">
          Amkheriya Tikariya ke upcoming events aur Panchayat meetings.
        </p>

        {events.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No events available
            </h2>
            <p className="mt-2 text-gray-600">
              New village events ki details yahan dikhengi.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  {event.category}
                </span>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {event.title}
                </h2>

                <p className="mt-2 text-gray-600">
                  {event.description}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(event.date).toLocaleDateString("en-IN")}
                  </p>
                  <p>
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import Navbar from "../components/Navbar";
import MeetingCard from "../components/MeetingCard";
import type { Meeting } from "../types";

const Dashboard = () => {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/meetings");
      setMeetings(response.data.data);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch meetings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/meetings/${id}`);

      setMeetings((prev) =>
        prev.filter((meeting) => meeting.id !== id)
      );
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to delete meeting"
      );
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/meetings/edit/${id}`);
  };

  const filteredMeetings = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return meetings;

    return meetings.filter((meeting) =>
      [
        meeting.title,
        meeting.description,
        meeting.location,
        meeting.created_by_name,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(searchText)
        )
    );
  }, [meetings, search]);

  const upcomingMeetings = meetings.filter(
    (meeting) =>
      new Date(meeting.meeting_date) >= new Date()
  ).length;

  const todayMeetings = meetings.filter(
    (meeting) => {
      const meetingDate = new Date(meeting.meeting_date);
      const today = new Date();

      return (
        meetingDate.getFullYear() === today.getFullYear() &&
        meetingDate.getMonth() === today.getMonth() &&
        meetingDate.getDate() === today.getDate()
      );
    }
  ).length;

  return (
    <>
      <Navbar />

      <main className="dashboard">

        {/* Welcome Header */}
        <section className="dashboard-header">

          <div>
            <p className="dashboard-label">
              MEETING MANAGEMENT
            </p>

            <h1>Meetings</h1>

            <p className="dashboard-subtitle">
              Manage and organize your meetings in one place.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/meetings/create")
            }
          >
            <span>+</span>
            Create Meeting
          </button>

        </section>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">📅</div>

            <div>
              <p>Total Meetings</p>
              <h2>{meetings.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🕐</div>

            <div>
              <p>Upcoming</p>
              <h2>{upcomingMeetings}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>

            <div>
              <p>Today</p>
              <h2>{todayMeetings}</h2>
            </div>
          </div>

        </section>

        {/* Search */}
        <section className="meetings-toolbar">

          <div>
            <h2>All Meetings</h2>
            <p>
              {filteredMeetings.length} meeting
              {filteredMeetings.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </section>

        {/* Loading */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading meetings...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-state">
            <p>{error}</p>

            <button onClick={fetchMeetings}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredMeetings.length === 0 && (
            <div className="empty-state">

              <div className="empty-icon">
                📅
              </div>

              <h3>
                {search
                  ? "No meetings found"
                  : "No meetings yet"}
              </h3>

              <p>
                {search
                  ? "Try searching with a different keyword."
                  : "Create your first meeting to get started."}
              </p>

              {!search && (
                <button
                  className="primary-button"
                  onClick={() =>
                    navigate("/meetings/create")
                  }
                >
                  + Create Meeting
                </button>
              )}

            </div>
          )}

        {/* Meetings */}
        {!loading &&
          !error &&
          filteredMeetings.length > 0 && (
            <div className="meeting-grid">

              {filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

            </div>
          )}

      </main>
    </>
  );
};

export default Dashboard;
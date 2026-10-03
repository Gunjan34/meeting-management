import { useEffect, useState } from "react";
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

  const fetchMeetings = async () => {
    try {
      setLoading(true);

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

  return (
    <>
      <Navbar />

      <main className="dashboard">

        <div className="dashboard-header">

          <div>
            <h1>Meetings</h1>
            <p>Manage your meetings</p>
          </div>

          <button
            onClick={() =>
              navigate("/meetings/create")
            }
          >
            + Create Meeting
          </button>

        </div>

        {loading && (
          <p>Loading meetings...</p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          meetings.length === 0 && (
            <div className="empty-state">
              <h3>No meetings found</h3>
              <p>
                Create your first meeting.
              </p>
            </div>
          )}

        <div className="meeting-grid">

          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

        </div>

      </main>
    </>
  );
};

export default Dashboard;
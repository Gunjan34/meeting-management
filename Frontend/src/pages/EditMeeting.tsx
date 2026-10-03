import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/api";
import type { Meeting } from "../types";

const EditMeeting = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    meeting_date: "",
    start_time: "",
    end_time: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response =
          await api.get<{ data: Meeting }>(
            `/meetings/${id}`
          );

        const meeting = response.data.data;

        setForm({
          title: meeting.title,
          description: meeting.description || "",
          meeting_date: meeting.meeting_date,
          start_time: meeting.start_time.slice(0, 5),
          end_time: meeting.end_time.slice(0, 5),
          location: meeting.location || "",
        });

      } catch (error: any) {
        setError(
          error.response?.data?.message ||
          "Failed to fetch meeting"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await api.put(`/meetings/${id}`, form);

      navigate("/dashboard");

    } catch (error: any) {
      setError(
        error.response?.data?.message ||
        "Failed to update meeting"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading meeting...</p>;
  }

  return (
    <div className="page-container">

      <form
        className="meeting-form"
        onSubmit={handleSubmit}
      >

        <h1>Edit Meeting</h1>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <label>Title</label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Date</label>

        <input
          type="date"
          name="meeting_date"
          value={form.meeting_date}
          onChange={handleChange}
          required
        />

        <label>Start Time</label>

        <input
          type="time"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />

        <label>End Time</label>

        <input
          type="time"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />

        <label>Location</label>

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
        />

        <div className="form-actions">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Meeting"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditMeeting;
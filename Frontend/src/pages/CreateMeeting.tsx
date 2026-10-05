import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const CreateMeeting = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    meeting_date: "",
    start_time: "",
    end_time: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    setError("");
    setLoading(true);

    try {
      await api.post("/meetings", form);

      navigate("/dashboard");

    } catch (error: any) {
      setError(
        error.response?.data?.message ||
        "Failed to create meeting"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <form
        className="meeting-form"
        onSubmit={handleSubmit}
      >

        <h1>Create Meeting</h1>

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
          placeholder="Meeting title"
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Meeting description"
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
          placeholder="Conference Room"
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
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Meeting"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default CreateMeeting;
import type { Meeting } from "../types";

interface Props {
  meeting: Meeting;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const MeetingCard = ({ meeting, onEdit, onDelete }: Props) => {
  return (
    <div className="meeting-card">

      <h3>{meeting.title}</h3>

      <p>
        <strong>Description:</strong>{" "}
        {meeting.description || "No description"}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {meeting.meeting_date}
      </p>

      <p>
        <strong>Time:</strong>{" "}
        {meeting.start_time} - {meeting.end_time}
      </p>

      <p>
        <strong>Location:</strong>{" "}
        {meeting.location || "Not specified"}
      </p>

      {meeting.created_by_name && (
        <p>
          <strong>Created by:</strong>{" "}
          {meeting.created_by_name}
        </p>
      )}

      <div className="meeting-actions">
        <button onClick={() => onEdit(meeting.id)}>
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(meeting.id)}
        >
          Delete
        </button>
      </div>

    </div>
  );
};

export default MeetingCard;
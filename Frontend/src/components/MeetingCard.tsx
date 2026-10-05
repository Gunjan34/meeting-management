import type { Meeting } from "../types";

interface Props {
  meeting: Meeting;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const MeetingCard = ({
  meeting,
  onEdit,
  onDelete,
}: Props) => {

  const formattedDate = new Date(
    meeting.meeting_date
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="meeting-card">

      <div className="meeting-card-header">

        <div className="meeting-calendar">
          <span>📅</span>
        </div>

        <div className="meeting-title-wrapper">
          <h3>{meeting.title}</h3>

          <span className="meeting-status">
            Scheduled
          </span>
        </div>

      </div>

      <p className="meeting-description">
        {meeting.description ||
          "No description provided."}
      </p>

      <div className="meeting-details">

        <div className="meeting-detail">
          <span className="detail-icon">📅</span>

          <div>
            <small>Date</small>
            <strong>{formattedDate}</strong>
          </div>
        </div>

        <div className="meeting-detail">
          <span className="detail-icon">🕐</span>

          <div>
            <small>Time</small>
            <strong>
              {meeting.start_time.slice(0, 5)}
              {" - "}
              {meeting.end_time.slice(0, 5)}
            </strong>
          </div>
        </div>

        <div className="meeting-detail">
          <span className="detail-icon">📍</span>

          <div>
            <small>Location</small>
            <strong>
              {meeting.location ||
                "Not specified"}
            </strong>
          </div>
        </div>

      </div>

      {meeting.created_by_name && (
        <div className="meeting-created-by">

          <div className="user-avatar">
            {meeting.created_by_name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <small>Created by</small>
            <strong>
              {meeting.created_by_name}
            </strong>
          </div>

        </div>
      )}

      <div className="meeting-actions">

        <button
          className="edit-button"
          onClick={() =>
            onEdit(meeting.id)
          }
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() =>
            onDelete(meeting.id)
          }
        >
          Delete
        </button>

      </div>

    </article>
  );
};

export default MeetingCard;
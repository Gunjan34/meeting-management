export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Meeting {
  id: number;
  title: string;
  description: string | null;
  meeting_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  created_by: number;
  created_by_name?: string;
  created_at: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface MeetingResponse {
  success: boolean;
  message?: string;
  data: Meeting;
}
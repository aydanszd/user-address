import { ApiError } from "../errors/ApiError";
import { isUser, type User } from "../types/user";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getUsers(signal?: AbortSignal): Promise<User[]> {
  const response = await fetch(`${API_URL}/api/users`, { signal });

  if (!response.ok) {
    throw new ApiError(`Server error (${response.status})`, response.status);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError("Server returned invalid JSON.");
    }
    throw error;
  }

  if (!Array.isArray(data) || !data.every(isUser)) {
    throw new ApiError("Server returned an invalid users list.");
  }

  return data;
}

"use client";
import { useEffect, useState } from "react";
import { getUsers, API_URL } from "../api/users";
import UsersTable from "../components/UsersTable";
import { getErrorMessage } from "../errors/getErrorMessage";
import type { User } from "../types/user";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      setIsLoading(true);
      setError(null);

      try {
        setUsers(await getUsers(controller.signal));
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(requestError));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadUsers();

    return () => controller.abort();
  }, [retryCount]);

  return (
    <div className="p-8">
      <h1 className="mb-5 text-2xl font-bold">Users</h1>

      {isLoading ? (
        <p role="status">Loading users...</p>
      ) : error ? (
        <div role="alert" className="space-y-3">
          <p>Could not load users: {error}</p>
          <p className="text-sm text-gray-600">
            Make sure the backend is running at {API_URL}.
          </p>
          <button
            type="button"
            className="rounded border border-gray-400 px-4 py-2 hover:bg-gray-100"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Try again
          </button>
        </div>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  );
}
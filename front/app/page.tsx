"use client";

import { useEffect, useState } from "react";

type User = {
  id: number | string;
  name: string | null;
  surname: string | null;
  father_name: string | null;
  age: number | string | null;
  city: string | null;
  district: string | null;
  street: string | null;
};

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;

  const user = value as Record<string, unknown>;
  const isNullableString = (field: unknown) =>
    field === null || typeof field === "string";

  return (
    (typeof user.id === "number" || typeof user.id === "string") &&
    isNullableString(user.name) &&
    isNullableString(user.surname) &&
    isNullableString(user.father_name) &&
    (user.age === null ||
      typeof user.age === "number" ||
      typeof user.age === "string") &&
    isNullableString(user.city) &&
    isNullableString(user.district) &&
    isNullableString(user.street)
  );
}

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
        const response = await fetch("http://localhost:5000/api/users", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Server error (${response.status})`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isUser)) {
          throw new Error("Server returned an invalid users list.");
        }

        setUsers(data);
      } catch (requestError) {
        if (controller.signal.aborted) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load users."
        );
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
            Make sure the backend is running at http://localhost:5000.
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th scope="col" className="border p-3">ID</th>
                <th scope="col" className="border p-3">Name</th>
                <th scope="col" className="border p-3">Surname</th>
                <th scope="col" className="border p-3">Father Name</th>
                <th scope="col" className="border p-3">Age</th>
                <th scope="col" className="border p-3">City</th>
                <th scope="col" className="border p-3">District</th>
                <th scope="col" className="border p-3">Street</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="border p-3">{user.id}</td>
                  <td className="border p-3">{user.name ?? "-"}</td>
                  <td className="border p-3">{user.surname ?? "-"}</td>
                  <td className="border p-3">{user.father_name ?? "-"}</td>
                  <td className="border p-3">{user.age ?? "-"}</td>
                  <td className="border p-3">{user.city ?? "-"}</td>
                  <td className="border p-3">{user.district ?? "-"}</td>
                  <td className="border p-3">{user.street ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
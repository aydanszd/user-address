import type { User } from "../types/user";

type UsersTableProps = {
  users: User[];
};

export default function UsersTable({ users }: UsersTableProps) {
  return (
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
            <th scope="col" className="border p-3">Street</th>
            <th scope="col" className="border p-3">House number</th>
            <th scope="col" className="border p-3">Postal code</th>
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
              <td className="border p-3">{user.street ?? "-"}</td>
              <td className="border p-3">{user.house_number ?? "-"}</td>
              <td className="border p-3">{user.postal_code ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

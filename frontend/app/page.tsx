"use client";

import ProtectedRoute from "../component/protected-route";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Home</h1>

      {user ? (
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Kullanıcı Bilgileri:</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Full Name:</strong> {user.fullname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p className="text-red-500">Giriş yapılmadı.</p>
      )}
  <ProtectedRoute requireAuth>
    Protected Section
  </ProtectedRoute>
    </div>
  );
}

// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SeatMatrix } from '../types';
import { API_BASE_URL } from '../config';

interface Props {
  refreshKey: number;
}

const Dashboard: React.FC<Props> = ({ refreshKey }) => {
  const [seats, setSeats] = useState<SeatMatrix[]>([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get<SeatMatrix[]>(`${API_BASE_URL}/dashboard/seats`);
        // Ensure we always set an array
        setSeats(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch seats", err);
      }
    };
    fetchSeats();
  }, [refreshKey]); // This watches the refreshKey from App.tsx

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Live Seat Matrix</h2>
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2">Quota</th>
            <th className="p-2">Filled</th>
          </tr>
        </thead>
        <tbody>
          {/* The ?. prevents crashing if seats is null */}
          {seats?.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2 text-center">{s.quota_type}</td>
              <td className="p-2 text-center font-bold text-blue-600">{s.filled_seats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
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
          {/* Map through seats and calculate availability dynamically */}
          {/* The ?. prevents crashing if seats is null */}
          {seats?.map((s) => (
            <tr key={s.id} className="border-t hover:bg-slate-50 transition-colors">
              <td className="p-3 text-center font-medium text-slate-700">
                {s.quota_type}
              </td>
              <td className="p-3 text-center">
                {/* Verification Logic: Total Capacity minus Filled Seats */}
                <span className="font-bold text-green-600 text-lg">
                  {s.total_seats - s.filled_seats}
                </span>
                <span className="text-slate-400 text-xs ml-1 uppercase">Available</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
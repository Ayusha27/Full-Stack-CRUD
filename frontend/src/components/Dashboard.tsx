import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SeatMatrix, Program } from '../types';
import { API_BASE_URL } from '../config';

interface Props {
  refreshKey: number;
  programs: Program[]; 
}

const Dashboard: React.FC<Props> = ({ programs, refreshKey }) => {
  const [seats, setSeats] = useState<SeatMatrix[]>([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get<SeatMatrix[]>(`${API_BASE_URL}/dashboard/seats`);
        setSeats(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch seats", err);
      }
    };
    fetchSeats();
  }, [refreshKey]);

  // 2. Group the seats by program NAME and CAMPUS NAME
  const groupedSeats = seats?.reduce((acc, seat) => {
    // Look up the program from our fetched list using program_id
    const programInfo = programs.find(p => p.id === (seat as any).program_id);
    
    // Combine the program name and campus name if found
    const programLabel = programInfo 
      ? `${programInfo.name} - ${programInfo.institution_name}` 
      : ((seat as any).program_name || `Program ID: ${(seat as any).program_id}`);

    if (!acc[programLabel]) {
      acc[programLabel] = [];
    }
    acc[programLabel].push(seat);
    return acc;
  }, {} as Record<string, SeatMatrix[]>);

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
          {Object.entries(groupedSeats || {}).map(([programLabel, programSeats]) => (
            <React.Fragment key={programLabel}>
              
              {/* --- Program Header Row showing Name and Campus --- */}
              <tr className="bg-blue-50">
                <td 
                  colSpan={2} 
                  className="p-2 text-center text-xs font-bold text-blue-700 uppercase border-y border-blue-100"
                >
                  {programLabel}
                </td>
              </tr>

              {/* --- Seats specific to this program --- */}
              {programSeats.map((s) => (
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
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
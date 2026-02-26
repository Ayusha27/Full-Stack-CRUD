import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Applicant } from '../types';
import { API_BASE_URL } from '../config';

const StudentSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get<Applicant[]>(`${API_BASE_URL}/applicants/search?name=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: number) => {
  try {
    // This calls the confirm logic we wrote for the backend
    await axios.post(`${API_BASE_URL}/applicants/${id}/confirm`);
    alert("Admission Confirmed!");
    handleSearch(); // Refresh results
  } catch (error: any) {
    alert(error.response?.data?.detail || "Confirmation failed");
  }
};

const downloadPDF = (student: Applicant) => {
    const doc = new jsPDF();
    
    // Header styling
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("ADMITPRO ADMISSION LETTER", 20, 25);
    
    // Body styling
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Student Record Summary", 20, 60);
    doc.line(20, 62, 190, 62);
    
    // Information List (incrementing Y by 10 for each line)
    doc.setFontSize(12);
    doc.text(`Name: ${student.name}`, 20, 80);
    doc.text(`UID: ${student.admission_number || 'N/A'}`, 20, 90);
    doc.text(`Quota: ${student.quota_type}`, 20, 100);
    doc.text(`Program ID: ${student.program_id}`, 20, 110);
    doc.text(`Email: ${student.email}`, 20, 120); // Email at 120
    doc.text(`Status: Allocated`, 20, 130);      // Status moved to 130
    
    // Logic for Program Name
    const programName = student.program_id === 1 ? 'Computer Science' : 'Data Science';
    doc.text(`Program: ${programName}`, 20, 140);
    
    // Footer section
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Please contact the institution for further steps.", 20, 160);
    doc.text("This is a system-generated document and does not require a signature.", 20, 168);
    
    doc.save(`${student.name}_Admission.pdf`);
  };
  
return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Student Database</h3>
          <p className="text-slate-500 text-sm">Search and generate admission documents</p>
        </div>
      </div>

      {/* Search Input Field */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <input 
          type="text" 
          placeholder="Enter student name..." 
          className="flex-grow bg-transparent p-3 outline-none text-slate-700" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
        />
        <button onClick={handleSearch} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-xl font-bold transition-all">
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {/* Results List */}
      <div className="grid gap-3">
        {results.map((student, index) => (
          <div key={student.id || index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
            
            {/* 1. Student Info Section (The "Who") */}
            <div className="flex items-center space-x-4">
              {/* Avatar Icon */}
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 uppercase">
                {student.name.charAt(0)}
              </div>
              
              <div>
                <h4 className="font-bold text-slate-800">{student.name}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  {student.admission_number || "Allocation Pending"}
                </p>
              </div>
            </div>

            {/* 2. Action Buttons Section (The "What") */}
            <div className="flex space-x-2">
              {/* Show Confirm button only if they don't have an ID yet */}
              {!student.admission_number && (
                <button 
                  onClick={() => student.id && handleConfirm(student.id)}
                  className="text-xs font-black text-green-600 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                >
                  CONFIRM & PAY
                </button>
              )}
              
              {/* Show PDF button only after UID is generated */}
              {student.admission_number && (
                <button 
                  onClick={() => downloadPDF(student)} 
                  className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  DOWNLOAD PDF
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {results.length === 0 && !loading && query && (
          <p className="text-center text-slate-400 py-10">No students found matching "{query}"</p>
        )}
      </div>
    </div>
  );
};

export default StudentSearch;
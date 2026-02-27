import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Applicant, Program } from '../types';
import { API_BASE_URL } from '../config';

interface Props { onSuccess: () => void; programs: Program[]; }

const AdmissionForm: React.FC<Props> = ({ onSuccess, programs }) => {
  // 1. Initial State: Note we start program_id as 0 or empty until programs load
  const initialFormState: Applicant = {
    name: '',
    email: '',
    phone: '',
    category: 'GM',
    entry_type: 'Regular',
    quota_type: 'KCET',
    program_id: 0, 
    gender: 'Male',
    dob: '',
    address: '',
    marks_10th: 0,
    marks_12th: 0,
    parent_name: '',
    blood_group: 'O+',
    document_status: 'Pending',
    fee_paid: false
  };

  const [formData, setFormData] = useState<Applicant>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requiredFields = [
    'name', 'email', 'phone', 'category', 'entry_type', 'quota_type', 'program_id',
    'gender', 'dob', 'address', 'marks_10th', 'marks_12th', 'parent_name', 'blood_group'
  ];
  const isFormValid = requiredFields.every(field => {
    const value = (formData as any)[field];
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return !isNaN(value) && value !== 0;
    return value !== undefined && value !== null;
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.program_id === 0) return alert("Please select a program");

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/allocate/`, formData);
      setFormData({ ...initialFormState, program_id: programs[0]?.id || 0 });
      onSuccess();
      alert("Student Allocated Successfully!");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="bg-blue-600 px-8 py-5">
        <h2 className="text-xl font-bold text-white">Student Application Form</h2>
        <p className="text-blue-100 text-xs">Enter details to allocate a new seat</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* --- SECTION 1: TARGET PROGRAM --- */}
        <div className="md:col-span-2 space-y-1 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300">
          <label className="text-xs font-bold text-blue-600 uppercase">Select Program & Campus <span className="text-red-600">*</span></label>
          <select
            name="program_id"
            value={formData.program_id}
            onChange={handleChange}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0} disabled>Select the program</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>
                [{p.code}] {p.name} - {p.campus_name} ({p.course_type})
              </option>
            ))}
          </select>
        </div>

        {/* --- SECTION 2: PERSONAL DETAILS --- */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Full Name <span className="text-red-600">*</span></label>
          <input name="name" value={formData.name} placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Email <span className="text-red-600">*</span></label>
          <input name="email" value={formData.email} type="email" placeholder="xyz@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Phone <span className="text-red-600">*</span></label>
          <input name="phone" value={formData.phone} placeholder="10-digit number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Category <span className="text-red-600">*</span></label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="GM">General Merit (GM)</option>
            <option value="SC">Scheduled Caste (SC)</option>
            <option value="ST">Scheduled Tribe (ST)</option>
            <option value="OBC">Other Backward Classes (OBC)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth <span className="text-red-600">*</span></label>
          <input name="dob" value={formData.dob} type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Gender <span className="text-red-600">*</span></label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Quota Type <span className="text-red-600">*</span></label>
          <select name="quota_type" value={formData.quota_type} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange}>
            <option value="KCET">KCET</option>
            <option value="COMEDK">COMEDK</option>
            <option value="Management">Management</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Parent/Guardian Name <span className="text-red-600">*</span></label>
          <input name="parent_name" value={formData.parent_name} placeholder="Father/Mother Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        {/* --- SECTION 3: ACADEMICS --- */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">10th Marks (%) <span className="text-red-600">*</span></label>
          <input name="marks_10th" type="number" step="0.01" value={formData.marks_10th} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">12th Marks (%) <span className="text-red-600">*</span></label>
          <input name="marks_12th" type="number" step="0.01" value={formData.marks_12th} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Blood Group <span className="text-red-600">*</span></label>
          <select name="blood_group" value={formData.blood_group} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" onChange={handleChange}>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
          </select>
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Residential Address <span className="text-red-600">*</span></label>
          <textarea name="address" value={formData.address} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        <button type="submit" disabled={isSubmitting || !isFormValid} className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-slate-400">
          {isSubmitting ? "Allocating Seat..." : "Confirm & Allocate Seat"}
        </button>
      </form>
    </div>
  );
};

export default AdmissionForm;
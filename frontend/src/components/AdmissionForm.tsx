import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Applicant } from '../types';

interface Props { onSuccess: () => void; }

const AdmissionForm: React.FC<Props> = ({ onSuccess }) => {
  const initialFormState: Applicant = {
  name: '', 
  email: '', 
  phone: '', 
  category: 'GM',
  entry_type: 'Regular', 
  quota_type: 'KCET', 
  program_id: 1,
  gender: 'Male', 
  dob: '', 
  address: '', 
  marks_10th: 0,   // Ensure these are here
  marks_12th: 0,   // Ensure these are here
  parent_name: '', 
  blood_group: 'O+',
  document_status: 'Pending', 
  fee_paid: false
};

  const [formData, setFormData] = useState<Applicant>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://127.0.0.1:8001/allocate/', formData);
      setFormData(initialFormState);
      onSuccess();
      alert("Student Allocated Successfully!");
    } catch (error) {
      alert("Error submitting form");
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
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
          <input name="name" value={formData.name} placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
          <input name="email" value={formData.email} type="email" placeholder="xyz@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
          <input name="phone" value={formData.phone} placeholder="10-digit number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
          <input name="dob" value={formData.dob} type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Quota Type</label>
          <select name="quota_type" value={formData.quota_type} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange}>
            <option value="KCET">KCET</option>
            <option value="COMEDK">COMEDK</option>
            <option value="Management">Management</option>
          </select>
        </div>

        {/* Academic Details Section */}
<div className="space-y-1">
  <label className="text-xs font-bold text-slate-500 uppercase">10th Standard Marks (%)</label>
  <input 
    name="marks_10th" 
    type="number" 
    value={formData.marks_10th} 
    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" 
    onChange={handleChange} 
    required 
  />
</div>

<div className="space-y-1">
  <label className="text-xs font-bold text-slate-500 uppercase">12th Standard Marks (%)</label>
  <input 
    name="marks_12th" 
    type="number" 
    value={formData.marks_12th} 
    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" 
    onChange={handleChange} 
    required 
  />
</div>

        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Residential Address</label>
          <textarea name="address" value={formData.address} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
        </div>

        <button type="submit" disabled={isSubmitting} className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-slate-400">
          {isSubmitting ? "Allocating Seat..." : "Confirm & Allocate Seat"}
        </button>
      </form>
    </div>
  );
};

export default AdmissionForm;
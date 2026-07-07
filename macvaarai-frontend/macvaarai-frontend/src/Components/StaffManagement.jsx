import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Save } from 'lucide-react';

const StaffManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    experience: '',
    rating: 4.5,
    gender: 'Male',
    clinic: '',
    location: '',
    distance: '',
    languages: 'English, Hindi',
    responseTime: '5 mins',
    consultationCharge: '500',
    duration: '15 mins'
  });

  const genderOptions = ['Male', 'Female', 'Other'];

  // Load doctors from localStorage
  useEffect(() => {
    const savedDoctors = localStorage.getItem('doctors');
    if (savedDoctors) {
      setDoctors(JSON.parse(savedDoctors));
    }
  }, []);

  // Save doctors to localStorage
  const saveDoctors = (updatedDoctors) => {
    setDoctors(updatedDoctors);
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      const updated = doctors.map(doc => doc.id === editingId ? { ...formData, id: editingId } : doc);
      saveDoctors(updated);
      setEditingId(null);
    } else {
      const newDoctor = { ...formData, id: Date.now() };
      saveDoctors([...doctors, newDoctor]);
    }

    setFormData({
      name: '', qualification: '', experience: '', rating: 4.5, gender: 'Male',
      clinic: '', location: '', distance: '', languages: 'English, Hindi',
      responseTime: '5 mins', consultationCharge: '500', duration: '15 mins'
    });
    setShowForm(false);
  };

  const handleEdit = (doctor) => {
    setFormData(doctor);
    setEditingId(doctor.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      saveDoctors(doctors.filter(doc => doc.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👨‍⚕️ Staff Management</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({
            name: '', qualification: '', experience: '', rating: 4.5, gender: 'Male',
            clinic: '', location: '', distance: '', languages: 'English, Hindi',
            responseTime: '5 mins', consultationCharge: '500', duration: '15 mins'
          }); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} /> Add Doctor
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-blue-500">
          <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Doctor' : 'Add New Doctor'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Doctor Name *" value={formData.name} onChange={handleChange} required className="border rounded px-3 py-2" />
              <input type="text" name="qualification" placeholder="Qualification (MBBS, MD) *" value={formData.qualification} onChange={handleChange} required className="border rounded px-3 py-2" />
              <input type="text" name="experience" placeholder="Experience (12+ years) *" value={formData.experience} onChange={handleChange} required className="border rounded px-3 py-2" />
              <input type="number" name="rating" placeholder="Rating (0-5)" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} className="border rounded px-3 py-2" />
              <select name="gender" value={formData.gender} onChange={handleChange} className="border rounded px-3 py-2">
                <option value="">Select Gender *</option>
                <option value="Male">Male Doctor</option>
                <option value="Female">Female Doctor</option>
                <option value="Other">Other</option>
              </select>
              <input type="text" name="clinic" placeholder="Clinic/Hospital Name *" value={formData.clinic} onChange={handleChange} required className="border rounded px-3 py-2" />
              <input type="text" name="location" placeholder="Location (e.g., Nungambakkam, Chennai) *" value={formData.location} onChange={handleChange} required className="border rounded px-3 py-2" />
              <input type="text" name="distance" placeholder="Distance (e.g., 2 km) *" value={formData.distance} onChange={handleChange} required className="border rounded px-3 py-2" />
              <input type="text" name="languages" placeholder="Languages (comma-separated)" value={formData.languages} onChange={handleChange} className="border rounded px-3 py-2" />
              <input type="text" name="responseTime" placeholder="Response Time (e.g., 5 mins)" value={formData.responseTime} onChange={handleChange} className="border rounded px-3 py-2" />
              <input type="number" name="consultationCharge" placeholder="Consultation Charge (₹) *" value={formData.consultationCharge} onChange={handleChange} required className="border rounded px-3 py-2" />
              <input type="text" name="duration" placeholder="Duration (e.g., 15 mins)" value={formData.duration} onChange={handleChange} className="border rounded px-3 py-2" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition">
                <Save size={18} /> Save Doctor
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Doctors List */}
      <div className="space-y-3">
        {doctors.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No doctors added yet. Click "Add Doctor" to get started.</p>
        ) : (
          doctors.map(doctor => (
            <div key={doctor.id} className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="bg-blue-100 text-blue-700 font-bold w-12 h-12 rounded-full flex items-center justify-center">
                    {doctor.gender === 'Female' ? '👩‍⚕️' : doctor.gender === 'Male' ? '👨‍⚕️' : '👥'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.qualification} • {doctor.experience}</p>
                    <p className="text-xs text-gray-500 mt-1">⭐ {doctor.rating}/5 • 🩺 {doctor.gender} Doctor</p>
                    <p className="text-xs text-gray-500">🏥 {doctor.clinic}</p>
                    <p className="text-xs text-gray-500">📍 {doctor.location} • {doctor.distance}</p>
                    <p className="text-xs text-blue-600 font-semibold mt-1">🗣️ Languages: {doctor.languages}</p>
                    <p className="text-xs text-gray-500 mt-1">💰 ₹{doctor.consultationCharge} • {doctor.duration} • ⏱️ Response: {doctor.responseTime}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(doctor)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(doctor.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm text-gray-700">
          ✓ Doctors added here will appear in Video Call, Audio Call, and Chat options<br/>
          ✓ All fields marked with * are required<br/>
          ✓ Consultation charges are in Indian Rupees (₹)<br/>
          ✓ Changes are saved automatically to your device
        </p>
      </div>
    </div>
  );
};

export default StaffManagement;

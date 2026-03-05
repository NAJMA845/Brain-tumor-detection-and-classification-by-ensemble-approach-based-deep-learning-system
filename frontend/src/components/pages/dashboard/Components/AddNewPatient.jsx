import React, { useEffect, useState } from 'react';

export default function AddNewPatient() {
  const baseUrl = '/api/patients'; // adjust backend route if needed

  const emptyForm = {
    id: null,
    firstName: '',
    lastName: '',
    hospitalId: '',
    dob: '',
    sex: '',
    email: '',
    notes: '',
  };

  const [form, setForm] = useState(emptyForm);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    setLoading(true);
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPatients(data);
    } catch (e) {
      console.error(e);
      setError('Unable to load patients.');
    } finally {
      setLoading(false);
    }
  }

  function genHospitalId() {
    return 'H' + Date.now().toString().slice(-8);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function startNew() {
    setForm({ ...emptyForm, hospitalId: genHospitalId() });
    setEditing(false);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName) {
      setError('First and last name required.');
      return;
    }
    try {
      setLoading(true);
      if (editing && form.id) {
        const res = await fetch(`${baseUrl}/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const toCreate = { ...form, hospitalId: form.hospitalId || genHospitalId() };
        const res = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toCreate),
        });
        if (!res.ok) throw new Error('Create failed');
      }
      await fetchPatients();
      setForm(emptyForm);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError('Save failed.');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(p) {
    setForm({
      id: p.id || p._id || null,
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      hospitalId: p.hospitalId || '',
      dob: p.dob || '',
      sex: p.sex || '',
      email: p.email || '',
      notes: p.notes || '',
    });
    setEditing(true);
  }

  async function handleDelete(p) {
    const id = p.id || p._id;
    if (!id) return;
    if (!window.confirm('Delete patient?')) return;
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchPatients();
      if (editing && form.id === id) startNew();
    } catch (err) {
      console.error(err);
      setError('Delete failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700">{editing ? 'Edit Patient' : 'Add New Patient'}</h2>
        <div>
          <button onClick={startNew} className="px-3 py-1 bg-gray-200 rounded mr-2">New</button>
          <button onClick={fetchPatients} className="px-3 py-1 bg-gray-200 rounded">Refresh</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Hospital ID</label>
          <input name="hospitalId" value={form.hospitalId} onChange={handleChange} className="w-full mt-1 p-2 border rounded bg-gray-50" />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Date of Birth</label>
          <input name="dob" type="date" value={form.dob} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Sex</label>
          <select name="sex" value={form.sex} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
            <option value="">Select</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Contact Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full mt-1 p-2 border rounded" rows="3" />
        </div>

        <div className="md:col-span-2 flex items-center space-x-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-600 text-white rounded">
            {editing ? 'Update Patient' : 'Create Patient'}
          </button>
          <button type="button" onClick={startNew} className="px-3 py-2 bg-gray-200 rounded">Clear</button>
          {error && <div className="text-red-600 ml-4">{error}</div>}
        </div>
      </form>

      <hr className="my-4" />

      <div>
        <h3 className="text-lg font-medium text-gray-700">Patients</h3>
        {loading ? (
          <div className="mt-2 text-gray-600">Loading...</div>
        ) : patients.length === 0 ? (
          <div className="mt-2 text-gray-600">No patients found.</div>
        ) : (
          <div className="mt-2 space-y-2">
            {patients.map(p => (
              <div key={p.id || p._id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium">{(p.firstName || '') + ' ' + (p.lastName || '')}</div>
                  <div className="text-sm text-gray-500">{p.hospitalId || ''} — {p.email || ''}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={() => handleDelete(p)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useMemo, useState, useRef, useEffect } from 'react';

export default function UserRoles() {
	const [query, setQuery] = useState('');
	const [users, setUsers] = useState([
		{ id: 1, name: 'Dr. Johs Smith', email: 'john.smith@neurosight.com', role: 'admin', created: 'Jan 01, 2024', lastLogin: 'Jan 05, 2026', status: 'Active' },
		{ id: 2, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@neurosight.com', role: 'clinician', created: 'Jan 05, 2024', lastLogin: 'Jan 04, 2026', status: 'Active' },
		{ id: 3, name: 'Mike Wilson', email: 'mike.wilson@neurosight.com', role: 'attendant', created: 'Jan 10, 2024', lastLogin: 'Jan 03, 2026', status: 'Active' },
		// ...add more mock users if needed...
	]);
	const [openMenuId, setOpenMenuId] = useState(null);
	const menuRef = useRef(null);

	// Added: modal and new user state
	const [showAddModal, setShowAddModal] = useState(false);
	const [newUser, setNewUser] = useState({ name: '', email: '', role: 'attendant', status: 'Active' });

	const filtered = useMemo(() => {
		if (!query.trim()) return users;
		const q = query.toLowerCase();
		return users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
	}, [query, users]);

	useEffect(() => {
		function handleDocClick(e) {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setOpenMenuId(null);
			}
		}
		document.addEventListener('click', handleDocClick);
		return () => document.removeEventListener('click', handleDocClick);
	}, []);

	function onRowClick(user) {
		// placeholder: navigate to user detail or open modal in your app
		alert(`Open details for ${user.name}`);
	}

	// Updated: open modal instead of alert
	function onAddUser() {
		setShowAddModal(true);
	}

	// Added: handle modal form changes and submit
	function handleNewUserChange(field, value) {
		setNewUser(prev => ({ ...prev, [field]: value }));
	}

	function handleAddSubmit(e) {
		e.preventDefault();
		if (!newUser.name.trim() || !newUser.email.trim()) {
			alert('Please provide name and email');
			return;
		}
		const maxId = users.reduce((m, u) => Math.max(m, u.id), 0);
		const created = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
		const added = {
			id: maxId + 1,
			name: newUser.name.trim(),
			email: newUser.email.trim(),
			role: newUser.role,
			created,
			lastLogin: 'Never',
			status: newUser.status || 'Active'
		};
		setUsers(prev => [added, ...prev]);
		// reset & close
		setNewUser({ name: '', email: '', role: 'attendant', status: 'Active' });
		setShowAddModal(false);
	}

	function onAction(user, action) {
		setOpenMenuId(null);
		// placeholder actions
		alert(`${action} - ${user.name}`);
	}

	return (
		<div className="p-6 bg-white rounded shadow">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-2xl font-semibold text-gray-700">User Roles</h2>
					<p className="text-sm text-gray-500">Manage users and their access permissions</p>
				</div>
				<button onClick={onAddUser} className="bg-teal-500 text-white px-4 py-2 rounded shadow hover:bg-teal-600">
					+ Add User
				</button>
			</div>

			<div className="bg-white border rounded p-4">
				<div className="flex items-center justify-between mb-4">
					<div className="text-lg font-medium text-gray-700 flex items-center">
          <svg className="w-5 h-5 mr-2 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
						<span className="mr-2 text-teal-500">All Users</span>
					</div>

					<div className="w-64">
						<input
							type="text"
							placeholder="Search users..."
							value={query}
							onChange={e => setQuery(e.target.value)}
							className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
						/>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead className="text-xs text-gray-400 uppercase">
							<tr>
								<th className="py-3 px-4">Name</th>
								<th className="py-3 px-4">Email</th>
								<th className="py-3 px-4">Role</th>
								<th className="py-3 px-4">Created</th>
								<th className="py-3 px-4">Last Login</th>
								<th className="py-3 px-4">Status</th>
								<th className="py-3 px-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map(user => (
								<tr
									key={user.id}
									className="border-t hover:bg-gray-50 cursor-pointer"
									onClick={e => {
										// prevent row click when clicking actions (safe runtime check)
										const target = e.target;
										if (target && typeof target.closest === 'function' && target.closest('.actions-btn')) return;
										onRowClick(user);
									}}
								>
									<td className="py-4 px-4">{user.name}</td>
									<td className="py-4 px-4 text-sm text-gray-500">{user.email}</td>
									<td className="py-4 px-4">
										<span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
											{user.role}
										</span>
									</td>
									<td className="py-4 px-4 text-sm text-gray-500">{user.created}</td>
									<td className="py-4 px-4 text-sm text-gray-500">{user.lastLogin}</td>
									<td className="py-4 px-4">
										<span className={`inline-block px-3 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
											{user.status}
										</span>
									</td>
									<td className="py-4 px-4 relative" ref={openMenuId === user.id ? menuRef : null}>
										<button
											className="actions-btn p-2 rounded hover:bg-gray-100"
											onClick={e => {
												e.stopPropagation();
												setOpenMenuId(openMenuId === user.id ? null : user.id);
											}}
											aria-haspopup="true"
											aria-expanded={openMenuId === user.id}
										>
											<span className="text-gray-500">⋯</span>
										</button>

										{openMenuId === user.id && (
											<div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
												<button onClick={() => onAction(user, 'View')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">View</button>
												<button onClick={() => onAction(user, 'Edit')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Edit</button>
												<button onClick={() => onAction(user, 'Delete')} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Delete</button>
											</div>
										)}
									</td>
								</tr>
							))}
							{filtered.length === 0 && (
								<tr>
									<td colSpan="7" className="py-6 px-4 text-center text-gray-500">No users found</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Added: Add User Modal */}
			{showAddModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					{/* overlay */}
					<div
						className="absolute inset-0 bg-black opacity-50"
						onClick={() => setShowAddModal(false)}
					/>
					<form onSubmit={handleAddSubmit} className="relative bg-white rounded-lg w-96 p-6 z-10 shadow-lg">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">Add New User</h3>
							<button type="button" className="text-gray-500" onClick={() => setShowAddModal(false)}>✕</button>
						</div>

						<div className="space-y-3">
							<div>
								<label className="text-sm text-gray-600">Full Name</label>
								<input
									type="text"
									value={newUser.name}
									onChange={e => handleNewUserChange('name', e.target.value)}
									placeholder="Enter full name"
									className="w-full mt-1 border rounded px-3 py-2 text-sm"
								/>
							</div>

							<div>
								<label className="text-sm text-gray-600">Email</label>
								<input
									type="email"
									value={newUser.email}
									onChange={e => handleNewUserChange('email', e.target.value)}
									placeholder="Enter email address"
									className="w-full mt-1 border rounded px-3 py-2 text-sm"
								/>
							</div>

							<div>
								<label className="text-sm text-gray-600">Role</label>
								<select
									value={newUser.role}
									onChange={e => handleNewUserChange('role', e.target.value)}
									className="w-full mt-1 border rounded px-3 py-2 text-sm"
								>
									<option value="admin">Admin</option>
									<option value="clinician">Clinician</option>
									<option value="attendant">Attendant</option>
								</select>
							</div>
						</div>

						<div className="flex justify-end gap-3 mt-6">
							<button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded text-sm">Cancel</button>
							<button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded text-sm">Add User</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Search, MoreVertical, ShieldCheck, Loader2, X } from "lucide-react";
import { collection, onSnapshot, query, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust path if needed

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string;
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Editor');

  // --- 1. READ FROM FIREBASE ---
  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData: AdminUser[] = [];
      snapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as AdminUser);
      });
      setAdmins(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. WRITE TO FIREBASE ---
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add a new document to the "users" collection
      await addDoc(collection(db, "users"), {
        name: newName,
        email: newEmail,
        role: newRole,
        status: 'Active',
        createdAt: serverTimestamp(),
        lastLogin: 'Never'
      });

      // Reset form and close modal
      setNewName('');
      setNewEmail('');
      setNewRole('Editor');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add user. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    (admin.name && admin.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (admin.email && admin.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Users</h1>
          <p className="text-gray-500 text-sm">Manage team access and permissions for the CMS.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1B5E20] hover:bg-[#2A4B38] text-white flex items-center gap-2"
        >
          <UserPlus size={16} />
          Add New Admin
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1B5E20] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#1B5E20]">
            <Loader2 className="animate-spin h-8 w-8 mb-4" />
            <p>Loading users from database...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="mb-4">No admin profiles found in the database.</p>
            <Button onClick={() => setIsModalOpen(true)} variant="outline" className="text-[#1B5E20] border-[#1B5E20]">
              <UserPlus size={16} className="mr-2" /> Click 'Add New Admin' to start
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#1B5E20]/10 flex items-center justify-center text-[#1B5E20] font-bold border border-[#1B5E20]/20 uppercase">
                          {admin.name ? admin.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        {admin.role === 'Super Admin' && <ShieldCheck size={16} className="text-[#1B5E20]" />}
                        {admin.role || 'Admin'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        admin.status === 'Active' ? 'bg-[#76FF03]/20 text-[#1B5E20]' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {admin.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {admin.lastLogin || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* ADD NEW ADMIN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Add New Admin</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                  placeholder="john@recyglo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] bg-white"
                >
                  <option value="Editor">Editor (Can edit content)</option>
                  <option value="Author">Author (Can write articles)</option>
                  <option value="Super Admin">Super Admin (Full access)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-[#1B5E20] hover:bg-[#2A4B38] text-white"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Save User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
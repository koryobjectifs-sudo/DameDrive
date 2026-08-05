import React, { useState, useEffect, useRef } from 'react';
import { Search, UserPlus, MoreHorizontal, Pencil, Trash, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../config/roles';

const MOCK_OTHER_USERS = [
  { id: 2, name: 'John Doe', phone: '+15141234567', role: ROLES.MANAGER },
  { id: 3, name: 'Alice Smith', phone: '+14389876543', role: ROLES.INSTRUCTOR }
];

const SettingsView = () => {
  const { role: currentRole, setRoleOverride } = useAuth();
  
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  
  // First user is always the current session user to allow dynamic testing
  const [users, setUsers] = useState([
    { id: 1, name: 'Ton Compte (Test Actif)', phone: '+1 (514) ***-****', role: currentRole, isCurrentUser: true },
    ...MOCK_OTHER_USERS
  ]);
  
  // Sync if role changes elsewhere
  useEffect(() => {
    setUsers(prev => prev.map(u => u.isCurrentUser ? { ...u, role: currentRole } : u));
  }, [currentRole]);
  
  // Menu state
  const [menuOpenForId, setMenuOpenForId] = useState(null);
  const menuRef = useRef(null);

  // Edit Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Add Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', phone: '', email: '', role: ROLES.INSTRUCTOR });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenForId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setMenuOpenForId(null);
    setEditModalOpen(true);
  };

  const handleSaveRole = () => {
    if (selectedUser.isCurrentUser) {
      // Actively change the app's role for testing!
      setRoleOverride(newRole);
    } else {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
    }
    setEditModalOpen(false);
  };

  const handleAddUser = () => {
    const newUser = {
      id: Date.now(),
      name: newUserForm.name || 'Sans Nom',
      phone: newUserForm.phone || 'Non renseigné',
      role: newUserForm.role
    };
    setUsers([...users, newUser]);
    setAddModalOpen(false);
    setNewUserForm({ name: '', phone: '', email: '', role: ROLES.INSTRUCTOR });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto pb-12 w-full">
      <h2 className="text-3xl font-medium text-slate-800 text-center mb-8">Paramètres</h2>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-4 text-sm font-medium uppercase tracking-wide transition-colors relative ${activeTab === 'users' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Gestion Utilisateurs
          {activeTab === 'users' && (
            <motion.div layoutId="activeSettingsTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('account')}
          className={`pb-4 px-4 text-sm font-medium uppercase tracking-wide transition-colors relative ${activeTab === 'account' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Informations Compte
          {activeTab === 'account' && (
            <motion.div layoutId="activeSettingsTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-600 shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-6 self-end md:self-auto">
              <div className="flex items-center text-sm text-slate-500">
                <span className="mr-2">Lignes par page :</span>
                <span className="font-medium mr-1">10</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              <div className="flex items-center text-sm text-slate-500 gap-2">
                <span>1-{filteredUsers.length} sur {filteredUsers.length}</span>
                <div className="flex gap-1 ml-2">
                  <button className="text-slate-300 cursor-not-allowed">{'<'}</button>
                  <button className="text-slate-300 cursor-not-allowed">{'>'}</button>
                </div>
              </div>
              <button 
                onClick={() => setAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center shadow-md active:scale-95"
              >
                <UserPlus size={16} className="mr-2" />
                Ajouter un utilisateur
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 font-medium text-slate-800 text-sm w-1/3">Nom</th>
                  <th className="py-4 font-medium text-slate-800 text-sm w-1/3">Téléphone</th>
                  <th className="py-4 font-medium text-slate-800 text-sm w-1/3">Rôle</th>
                  <th className="py-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm text-slate-700">{user.name}</td>
                    <td className="py-4 text-sm text-slate-600">{user.phone}</td>
                    <td className="py-4 text-sm text-slate-600">{user.role}</td>
                    <td className="py-4 relative">
                      <button 
                        onClick={() => setMenuOpenForId(menuOpenForId === user.id ? null : user.id)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      <AnimatePresence>
                        {menuOpenForId === user.id && (
                          <motion.div 
                            ref={menuRef}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 top-12 w-40 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-1 z-10"
                          >
                            <button 
                              onClick={() => handleEditClick(user)}
                              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
                            >
                              <Pencil size={16} className="mr-3 text-slate-500" />
                              Modifier
                            </button>
                            <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors">
                              <Trash size={16} className="mr-3 text-slate-500" />
                              Supprimer
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 text-sm">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Informations du Compte</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prénom</label>
                <input type="text" defaultValue="Kory" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nom</label>
                <input type="text" defaultValue="SENGHOR" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Numéro de téléphone</label>
              <input type="tel" defaultValue="+1 (514) 000-0000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rôle / Accès actuel</label>
              <input type="text" disabled value={currentRole} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold text-blue-600 cursor-not-allowed uppercase" />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md active:scale-95">
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {editModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-medium text-slate-800 mb-6">
                  Modification de {selectedUser.name}
                </h3>
                
                <div className="relative mb-8 mt-2">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Nouveau Rôle
                  </label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-500 focus:border-blue-600 focus:ring-0 rounded-xl text-slate-700 font-medium bg-white appearance-none outline-none transition-colors"
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <ChevronDown size={16} className="text-slate-500" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button 
                    onClick={() => setEditModalOpen(false)}
                    className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleSaveRole}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md active:scale-95"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-medium text-slate-800 mb-6">
                  Ajouter un nouvel utilisateur
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Nom complet</label>
                    <input 
                      type="text" 
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                      placeholder="Ex: Sophie Martin"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                    <input 
                      type="email" 
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                      placeholder="sophie@damedrive.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Téléphone</label>
                    <input 
                      type="tel" 
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                    />
                  </div>

                  <div className="relative mt-2 pt-2">
                    <label className="absolute -top-1 left-3 bg-white px-1 text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Attribuer un rôle
                    </label>
                    <select 
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-blue-500 focus:border-blue-600 focus:ring-0 rounded-xl text-slate-700 font-medium bg-white appearance-none outline-none transition-colors mt-2"
                    >
                      {Object.values(ROLES).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none mt-2">
                      <ChevronDown size={16} className="text-slate-500" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button 
                    onClick={() => setAddModalOpen(false)}
                    className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleAddUser}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md active:scale-95"
                  >
                    Valider l'ajout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsView;

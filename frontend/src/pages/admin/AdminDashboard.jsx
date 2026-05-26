import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  BarChart3,
  Heart,
  Calendar,
  Users,
  Settings,
  FolderHeart,
  Camera,
  Layers,
  LogOut,
  Mail,
  FileSpreadsheet,
  Terminal,
  User,
} from 'lucide-react';
import Meta from '../../components/common/Meta.jsx';

// Import subtab pages
import DashboardHome from './DashboardHome.jsx';
import ManageDonations from './ManageDonations.jsx';
import ManageProjects from './ManageProjects.jsx';
import ManageEvents from './ManageEvents.jsx';
import ManageBlogs from './ManageBlogs.jsx';
import ManageVolunteers from './ManageVolunteers.jsx';
import ManageGallery from './ManageGallery.jsx';
import ManageTeam from './ManageTeam.jsx';
import ManageMessages from './ManageMessages.jsx';
import AuditLogsView from './AuditLogsView.jsx';
import CmsSettings from './CmsSettings.jsx';

export const AdminDashboard = () => {
  const { user, loading, isAuthenticated, isAdmin, isEditor, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('analytics');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Auth block
  if (!isAuthenticated || (!isAdmin && !isEditor)) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of admin panel', 'info');
    navigate('/');
  };

  // Sidebar buttons metadata
  const sidebarItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['super-admin', 'admin'] },
    { id: 'donations', label: 'Donations', icon: Heart, roles: ['super-admin', 'admin'] },
    { id: 'projects', label: 'Campaigns', icon: FolderHeart, roles: ['super-admin', 'admin', 'editor'] },
    { id: 'events', label: 'Events', icon: Calendar, roles: ['super-admin', 'admin', 'editor'] },
    { id: 'blogs', label: 'Blogs', icon: FileSpreadsheet, roles: ['super-admin', 'admin', 'editor'] },
    { id: 'volunteers', label: 'Volunteers', icon: Users, roles: ['super-admin', 'admin'] },
    { id: 'gallery', label: 'Gallery Media', icon: Camera, roles: ['super-admin', 'admin', 'editor'] },
    { id: 'team', label: 'Team Directory', icon: User, roles: ['super-admin', 'admin'] },
    { id: 'messages', label: 'Messages', icon: Mail, roles: ['super-admin', 'admin'] },
    { id: 'audit-logs', label: 'Audit Logs', icon: Terminal, roles: ['super-admin'] },
    { id: 'cms-settings', label: 'CMS Layouts', icon: Settings, roles: ['super-admin', 'admin'] },
  ];

  const filteredSidebarItems = sidebarItems.filter((item) => item.roles.includes(user.role));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics': return <DashboardHome />;
      case 'donations': return <ManageDonations />;
      case 'projects': return <ManageProjects />;
      case 'events': return <ManageEvents />;
      case 'blogs': return <ManageBlogs />;
      case 'volunteers': return <ManageVolunteers />;
      case 'gallery': return <ManageGallery />;
      case 'team': return <ManageTeam />;
      case 'messages': return <ManageMessages />;
      case 'audit-logs': return <AuditLogsView />;
      case 'cms-settings': return <CmsSettings />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col md:flex-row">
      <Meta title="Admin Dashboard" />

      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 shadow-lg border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
              N
            </span>
            <span className="font-extrabold text-base text-white tracking-tight">
              Namokriti Admin
            </span>
          </div>

          <nav className="space-y-1">
            {filteredSidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === item.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile / Logout footer */}
        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-800 rounded-full flex items-center justify-center text-emerald-500 font-bold text-sm">
              {user.name[0]}
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-white truncate">{user.name}</span>
              <span className="block text-[10px] text-slate-500 font-semibold uppercase">{user.role}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 py-2 hover:bg-slate-850 rounded-xl transition-all text-left px-2"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Area */}
      <main className="grow p-6 sm:p-10 overflow-y-auto space-y-6">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  ArrowRightLeft, 
  Building2, 
  ShieldAlert, 
  LogOut,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Loans', path: '/loans', icon: Wallet },
  { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
  { name: 'Branches', path: '/branches', icon: Building2 },
  { name: 'Compliance', path: '/compliance', icon: ShieldAlert },
];

export const DashboardLayout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20">
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">VaultShift</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">Main Menu</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 border border-slate-200 focus-within:ring-2 ring-indigo-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers, transactions..." 
              className="bg-transparent border-none focus:outline-none text-sm ml-3 w-full text-slate-700 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center border border-indigo-200 text-indigo-700 font-bold text-sm shadow-sm group-hover:shadow-md transition-all">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-none">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 ml-1" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

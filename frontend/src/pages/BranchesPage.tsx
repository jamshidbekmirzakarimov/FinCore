import { useState } from 'react';
import { Building2, Search, Plus, MapPin, Phone, Users, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const BranchesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await apiClient.get('/branches');
      return res.data;
    }
  });

  const filtered = branches.filter((branch: any) => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Branch Management</h1>
          <p className="text-slate-500 mt-1">Monitor branch operations, staffing counts, and geographic metrics.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-colors">
          <Plus className="w-4 h-4" />
          Add Branch
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search branches by code, name or city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((branch: any) => (
            <div key={branch.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
              {/* Status Ribbon */}
              <div className={`absolute top-0 right-0 w-24 h-6 text-center text-xs font-semibold flex items-center justify-center transform translate-x-6 translate-y-4 rotate-45 ${
                branch.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {branch.isActive ? 'Active' : 'Closed'}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{branch.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Code: {branch.code}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <MapPin className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
                    <span>{branch.address}, {branch.city}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Phone className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Users className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
                    <span>{branch._count?.users ?? 0} active staff members</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-slate-50 pt-4">
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold">
                  Manage Staff
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold">
                  View Reports
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 py-8 text-center text-slate-400">No branches found.</div>
          )}
        </div>
      )}
    </div>
  );
};

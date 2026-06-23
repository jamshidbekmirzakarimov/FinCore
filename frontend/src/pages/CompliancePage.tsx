import { useState } from 'react';
import { ShieldAlert, Search, AlertTriangle, CheckCircle, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const CompliancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['compliance-reports'],
    queryFn: async () => {
      const res = await apiClient.get('/compliance');
      return res.data;
    }
  });

  const filtered = reports.filter((rep: any) => 
    rep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance & Risk Center</h1>
          <p className="text-slate-500 mt-1">Review flagged activities, audit trails, and regulatory compliance logs.</p>
        </div>
        <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/10 transition-colors">
          <ShieldAlert className="w-4 h-4" />
          Flag Activity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-rose-700 text-sm font-semibold">Critical Alerts</h3>
            <p className="text-3xl font-bold text-rose-900 mt-2">
              {reports.filter((r: any) => r.severity === 'CRITICAL').length}
            </p>
          </div>
          <AlertTriangle className="w-10 h-10 text-rose-600" />
        </div>
        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-amber-700 text-sm font-semibold">Under Investigation</h3>
            <p className="text-3xl font-bold text-amber-900 mt-2">
              {reports.filter((r: any) => r.status === 'INVESTIGATING').length}
            </p>
          </div>
          <RefreshCw className="w-10 h-10 text-amber-600" />
        </div>
        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-emerald-700 text-sm font-semibold">Resolved Reports</h3>
            <p className="text-3xl font-bold text-emerald-900 mt-2">
              {reports.filter((r: any) => r.status === 'RESOLVED').length}
            </p>
          </div>
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search alerts by title or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Case ID</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Alert Details</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Detected</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((rep: any) => (
                  <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-900">{rep.id.slice(0, 8)}</td>
                    <td className="py-4 px-6 text-sm text-slate-900 font-semibold">{rep.title}</td>
                    <td className="py-4 px-6 text-xs text-slate-600 font-medium">{rep.type.replace('_', ' ')}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                        rep.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        rep.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {rep.severity}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        rep.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                        rep.status === 'OPEN' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {rep.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">{new Date(rep.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Investigate
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">No reports found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

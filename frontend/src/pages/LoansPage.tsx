import { useState } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const LoansPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    termMonths: '12',
    purpose: '',
    interestRate: '4.5'
  });

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const res = await apiClient.get('/loans');
      return res.data;
    }
  });

  const createLoanMutation = useMutation({
    mutationFn: async (newLoan: typeof form) => {
      const res = await apiClient.post('/loans', newLoan);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['stats-summary'] });
      setIsModalOpen(false);
      setForm({ amount: '', termMonths: '12', purpose: '', interestRate: '4.5' });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await apiClient.patch(`/loans/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    }
  });

  const filtered = loans.filter((loan: any) => 
    loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${loan.customer?.firstName} ${loan.customer?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLoanMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loan Portfolio</h1>
          <p className="text-slate-500 mt-1">Review commercial and retail loan applications, and manage risk ratings.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Loan Application
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by loan ID, customer or purpose..." 
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
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Loan ID</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate / Term</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Purpose</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((loan: any) => (
                  <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-900">{loan.loanNumber}</td>
                    <td className="py-4 px-6 text-sm text-slate-900 font-medium">{loan.customer ? `${loan.customer.firstName} ${loan.customer.lastName}` : 'Global User'}</td>
                    <td className="py-4 px-6 text-sm text-slate-900 font-semibold">${loan.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-slate-700">{loan.interestRate}%</p>
                      <p className="text-xs text-slate-400 mt-0.5">{loan.termMonths} Months</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        loan.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        loan.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                        loan.status === 'UNDER_REVIEW' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">{loan.purpose}</td>
                    <td className="py-4 px-6 flex gap-2">
                      {loan.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => updateStatusMutation.mutate({ id: loan.id, status: 'APPROVED' })}
                            className="bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-emerald-600"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => updateStatusMutation.mutate({ id: loan.id, status: 'REJECTED' })}
                            className="bg-rose-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-rose-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">No loans found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">New Loan Application</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Loan Amount ($)</label>
                <input required type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Term (Months)</label>
                  <select value={form.termMonths} onChange={e => setForm({...form, termMonths: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                    <option value="36">36 Months</option>
                    <option value="60">60 Months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Interest Rate (%)</label>
                  <input required step="0.1" type="number" value={form.interestRate} onChange={e => setForm({...form, interestRate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Purpose of Loan</label>
                <input required value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={createLoanMutation.isPending} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold disabled:opacity-75">
                  {createLoanMutation.isPending ? 'Saving...' : 'Apply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, ArrowRightLeft, ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const TransactionsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'>('ALL');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [form, setForm] = useState({
    accountNumber: '',
    amount: '',
    description: ''
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await apiClient.get('/transactions');
      return res.data;
    }
  });

  const depositMutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      const res = await apiClient.post('/transactions/deposit', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['stats-summary'] });
      setIsDepositOpen(false);
      setForm({ accountNumber: '', amount: '', description: '' });
    }
  });

  const withdrawMutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      const res = await apiClient.post('/transactions/withdraw', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['stats-summary'] });
      setIsWithdrawOpen(false);
      setForm({ accountNumber: '', amount: '', description: '' });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Transaction failed');
    }
  });

  const filtered = transactions.filter((trx: any) => {
    const matchesSearch = trx.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (trx.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'ALL' || trx.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    depositMutation.mutate(form);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    withdrawMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transaction Registry</h1>
          <p className="text-slate-500 mt-1">Audit, process, and view transaction history across all branch accounts.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsDepositOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/10 transition-colors cursor-pointer"
          >
            <ArrowDown className="w-4 h-4" />
            Deposit
          </button>
          <button 
            onClick={() => setIsWithdrawOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/10 transition-colors cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto">
          {(['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search reference..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Transactions Table */}
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
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference No.</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((trx: any) => (
                  <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-900">{trx.referenceNumber}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        trx.type === 'DEPOSIT' ? 'text-emerald-600' :
                        trx.type === 'WITHDRAWAL' ? 'text-rose-600' : 'text-blue-600'
                      }`}>
                        {trx.type === 'DEPOSIT' && <ArrowDownLeft className="w-3.5 h-3.5" />}
                        {trx.type === 'WITHDRAWAL' && <ArrowUpRight className="w-3.5 h-3.5" />}
                        {trx.type === 'TRANSFER' && <ArrowRightLeft className="w-3.5 h-3.5" />}
                        {trx.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-medium">{trx.description || 'System generated'}</td>
                    <td className={`py-4 px-6 text-sm font-bold ${
                      trx.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {trx.type === 'DEPOSIT' ? '+' : '-'}${trx.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">{new Date(trx.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {isDepositOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Process Deposit</h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Account Number</label>
                <input required value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Amount ($)</label>
                <input required type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <input required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsDepositOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={depositMutation.isPending} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold disabled:opacity-75">
                  {depositMutation.isPending ? 'Processing...' : 'Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 text-rose-600">Process Withdrawal</h3>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Account Number</label>
                <input required value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Amount ($)</label>
                <input required type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <input required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsWithdrawOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={withdrawMutation.isPending} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold disabled:opacity-75">
                  {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

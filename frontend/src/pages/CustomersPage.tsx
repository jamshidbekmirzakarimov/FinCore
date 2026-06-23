import { useState } from 'react';
import { Search, Filter, Plus, FileText, CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const CustomersPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKyc, setFilterKyc] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passportNumber: '',
    address: '',
    city: '',
    country: 'Uzbekistan'
  });

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', searchTerm, filterKyc],
    queryFn: async () => {
      const res = await apiClient.get('/customers', {
        params: { search: searchTerm, kycStatus: filterKyc }
      });
      return res.data;
    }
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (newCustomer: typeof form) => {
      const res = await apiClient.post('/customers', newCustomer);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['stats-summary'] });
      setIsModalOpen(false);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        passportNumber: '',
        address: '',
        city: '',
        country: 'Uzbekistan'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomerMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-slate-500 mt-1">Manage customer profiles, contact info, and KYC verification.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID, name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Filter className="w-4 h-4" />
            KYC Status:
          </div>
          <select 
            value={filterKyc}
            onChange={(e) => setFilterKyc(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-600 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:ring-2 ring-indigo-500/10"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">APPROVED</option>
            <option value="PENDING">PENDING</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
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
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Passport / City</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">KYC Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((cust: any) => (
                  <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-slate-900">{cust.firstName} {cust.lastName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">ID: {cust.id.slice(0, 8)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-slate-700">{cust.email}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{cust.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-slate-700">{cust.passportNumber}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{cust.city}, {cust.country}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        cust.kycStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        cust.kycStatus === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {cust.kycStatus === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {cust.kycStatus === 'PENDING' && <AlertCircle className="w-3.5 h-3.5" />}
                        {cust.kycStatus === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                        {cust.kycStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">No customers found.</td>
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
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Customer</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">First Name</label>
                  <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Last Name</label>
                  <input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                  <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Passport Number</label>
                <input required value={form.passportNumber} onChange={e => setForm({...form, passportNumber: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Address</label>
                <input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
                <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={createCustomerMutation.isPending} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold disabled:opacity-75">
                  {createCustomerMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

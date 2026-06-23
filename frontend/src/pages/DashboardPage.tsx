import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Wallet, 
  Activity, 
  CreditCard,
  Loader2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardPage = () => {
  // Fetch Summary Stats
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['stats-summary'],
    queryFn: async () => {
      const res = await apiClient.get('/stats/summary');
      return res.data;
    }
  });

  // Fetch Recent Transactions
  const { data: transactions, isLoading: isTrxLoading } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const res = await apiClient.get('/transactions');
      return res.data;
    }
  });

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        fill: true,
        label: 'Total Deposits',
        data: [33, 53, 85, 41, 44, 65, 89],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Loans Approved',
        data: [120, 190, 300, 250],
        backgroundColor: 'rgb(16, 185, 129)',
        borderRadius: 6,
      },
      {
        label: 'Loans Rejected',
        data: [30, 45, 20, 50],
        backgroundColor: 'rgb(239, 68, 68)',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { display: false, grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  const stats = [
    { 
      name: 'Active Customers', 
      value: summary?.activeCustomers ?? '0', 
      change: '+12%', 
      isPositive: true, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      name: 'Total Deposits', 
      value: summary ? `$${(summary.totalDeposits / 1000).toFixed(1)}k` : '$0.0k', 
      change: '+5.4%', 
      isPositive: true, 
      icon: Wallet, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100' 
    },
    { 
      name: 'Active Loans', 
      value: summary ? `$${(summary.totalLoans / 1000).toFixed(1)}k` : '$0.0k', 
      change: '-2.1%', 
      isPositive: false, 
      icon: CreditCard, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-100' 
    },
    { 
      name: 'System Health', 
      value: summary?.systemHealth ?? '99.99%', 
      change: 'Stable', 
      isPositive: true, 
      icon: Activity, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100' 
    },
  ];

  if (isSummaryLoading || isTrxLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cloud Migration Overview</h1>
        <p className="text-slate-500 mt-1">Real-time metrics from your core banking infrastructure.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.name}</h3>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Deposit Growth (YTD)</h3>
            <select className="bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 ring-indigo-500/20">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Loan Applications</h3>
            <p className="text-sm text-slate-500">Quarterly approval vs rejection</p>
          </div>
          <div className="h-72">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(transactions || []).slice(0, 4).map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-slate-900">{row.referenceNumber}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{row.type}</td>
                  <td className={`py-4 px-6 text-sm font-semibold ${row.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {row.type === 'DEPOSIT' ? '+' : '-'}${row.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      row.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(transactions || []).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

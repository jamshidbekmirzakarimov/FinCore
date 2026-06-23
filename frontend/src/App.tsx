import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { CustomersPage } from './pages/CustomersPage'
import { LoansPage } from './pages/LoansPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { BranchesPage } from './pages/BranchesPage'
import { CompliancePage } from './pages/CompliancePage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="loans" element={<LoansPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="branches" element={<BranchesPage />} />
        <Route path="compliance" element={<CompliancePage />} />
      </Route>
    </Routes>
  )
}

export default App

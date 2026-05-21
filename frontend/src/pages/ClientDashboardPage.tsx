import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Clock, FileText, Briefcase, TrendingUp, CreditCard } from 'lucide-react'
import { getClientDashboard, markAllInvoicesPaid } from '../api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import PaymentModal from '../components/PaymentModal'

interface DashboardData {
  activeProjects: number
  totalProjects: number
  completedTasks: number
  totalTasks: number
  totalHours: number
  totalInvoiced: number
  pendingAmount: number
  recentProjects: Array<any>
  recentInvoices: Array<any>
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  trend?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card hover className="flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary-500/20 rounded-lg text-primary-400">{Icon}</div>
        {trend !== undefined && (
          <div
            className={`text-sm font-semibold flex items-center gap-1 ${
              trend >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            <TrendingUp size={16} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-dark-muted text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {subtitle && <p className="text-dark-muted text-xs">{subtitle}</p>}
    </Card>
  </motion.div>
)

export default function ClientDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      const data = await getClientDashboard()
      setDashboard(data)
    } catch (err: any) {
      console.error('Failed to load dashboard:', err)
      const errorMsg = err.response?.data?.message || 'Failed to load dashboard'
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkPaid() {
    await markAllInvoicesPaid()
    await loadDashboard()
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-8 w-64" />
        <div className="grid grid-auto gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-40" />
          ))}
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient-primary mb-2">Dashboard</h1>
        <p className="text-dark-muted">Welcome back! Here's your business overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-auto gap-6">
        <StatCard
          icon={<Briefcase size={24} />}
          label="Active Projects"
          value={dashboard?.activeProjects || 0}
          subtitle={`${dashboard?.totalProjects || 0} total`}
        />
        <StatCard
          icon={<BarChart3 size={24} />}
          label="Completed Tasks"
          value={dashboard?.completedTasks || 0}
          subtitle={`${dashboard?.totalTasks || 0} total`}
        />
        <StatCard
          icon={<Clock size={24} />}
          label="Total Hours"
          value={`${(dashboard?.totalHours || 0).toFixed(1)}h`}
          subtitle="Logged time"
        />
        <StatCard
          icon={<CreditCard size={24} />}
          label="Total Invoiced"
          value={`₹${(dashboard?.totalInvoiced || 0).toFixed(0)}`}
          subtitle={`₹${(dashboard?.pendingAmount || 0).toFixed(0)} pending`}
          trend={12}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-2 gap-8">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Recent Projects</h2>
                <p className="text-dark-muted text-sm">Your latest projects</p>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400">
                <Briefcase size={24} />
              </div>
            </div>

       <div className="space-y-3">
         {dashboard?.recentProjects && dashboard.recentProjects.length > 0 ? (
           dashboard.recentProjects.map((project, idx) => (
             <motion.div
               key={project.id}
               className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10"
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 + idx * 0.1 }}
             >
               <div className="flex items-start justify-between mb-2">
                 <h4 className="font-semibold text-dark-text">{project.name}</h4>
                 <Badge variant={project.status === 'completed' ? 'success' : 'info'}>
                   {project.status}
                 </Badge>
               </div>
               {project.description && (
                 <p className="text-dark-text/60 text-sm line-clamp-2">
                   {project.description}
                 </p>
               )}
             </motion.div>
           ))
         ) : (
           <div className="empty-state">
             <p className="text-dark-text/60">No projects yet</p>
           </div>
         )}
       </div>
          </Card>
        </motion.div>

        {/* Recent Invoices */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Recent Invoices</h2>
                <p className="text-dark-muted text-sm">Payment history</p>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400">
                <FileText size={24} />
              </div>
            </div>

             <div className="space-y-3">
               {dashboard?.recentInvoices && dashboard.recentInvoices.length > 0 ? (
                 dashboard.recentInvoices.map((invoice, idx) => (
                   <motion.div
                     key={invoice.id}
                     className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10"
                     initial={{ opacity: 0, x: 10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.3 + idx * 0.1 }}
                   >
                     <div className="flex items-start justify-between mb-2">
                       <div>
                         <h4 className="font-semibold text-dark-text">
                           Invoice #{invoice.number}
                         </h4>
                         <p className="text-dark-text/60 text-sm">
                           {new Date(invoice.issueDate).toLocaleDateString('en-US', {
                             month: 'short',
                             day: 'numeric',
                             year: 'numeric',
                           })}
                         </p>
                       </div>
                       <div className="text-right">
                         <p className="font-bold text-dark-text">₹{invoice.total}</p>
                         <Badge
                           variant={
                             invoice.status === 'paid'
                               ? 'success'
                               : invoice.status === 'pending'
                                 ? 'warning'
                                 : 'danger'
                           }
                         >
                           {invoice.status}
                         </Badge>
                       </div>
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="empty-state">
                   <p className="text-dark-text/60">No invoices yet</p>
                 </div>
               )}
             </div>
          </Card>
        </motion.div>
      </div>

      {/* Payment Section */}
      {dashboard && dashboard.pendingAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-accent-pink/10 to-primary-600/10 border border-primary-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Pending Payment</h3>
                <p className="text-dark-muted">
                  You have ₹{dashboard.pendingAmount.toFixed(0)} pending
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowPaymentModal(true)}
                icon={<CreditCard size={20} />}
              >
                Pay Now
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onMarkPaid={handleMarkPaid}
        totalAmount={dashboard?.totalInvoiced || 0}
        pendingAmount={dashboard?.pendingAmount || 0}
      />
    </motion.div>
  )
}

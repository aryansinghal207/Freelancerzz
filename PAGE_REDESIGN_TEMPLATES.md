# Freelancerzz Frontend - Page Redesign Templates

These templates show the pattern for redesigning remaining pages. Copy and adapt these to TasksPage, TimerPage, InvoicesPage, etc.

## Template: Simple List Page

```tsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import PageTemplate from '../components/layout/PageTemplate'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'

export default function TemplateListPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      // Load data from API
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageTemplate
      title="Items"
      subtitle="Manage your items"
      actions={
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={20} /> New Item
        </Button>
      }
    >
      {/* Search Bar */}
      <Card>
        <Input
          placeholder="Search..."
          icon={<Search size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {/* Items List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-lg" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-dark-muted">
            {items.length === 0 ? 'No items yet' : 'No results found'}
          </div>
        </Card>
      ) : (
        <motion.div className="space-y-3">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="!p-0">
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-dark-text">{item.name}</h3>
                      <p className="text-dark-muted text-sm">{item.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </PageTemplate>
  )
}
```

## Template: Dashboard with Stats

```tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import PageTemplate from '../components/layout/PageTemplate'
import Card from '../components/ui/Card'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  trend?: number
}

function StatCard({ icon, label, value, subtitle, trend }: StatCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary-500/20 rounded-lg text-primary-400">
          {icon}
        </div>
        {trend && (
          <span className="text-sm font-semibold text-green-400 flex items-center gap-1">
            <TrendingUp size={16} />
            {trend}%
          </span>
        )}
      </div>
      <p className="text-dark-muted text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-dark-muted text-xs mt-1">{subtitle}</p>}
    </Card>
  )
}

export default function TemplateDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      // Load stats from API
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTemplate
      title="Dashboard"
      subtitle="Your overview"
    >
      {/* Stats Grid */}
      <div className="grid grid-auto gap-6">
        <StatCard
          icon={<span>📊</span>}
          label="Total"
          value="1,234"
          subtitle="This month"
          trend={12}
        />
        <StatCard
          icon={<span>✅</span>}
          label="Completed"
          value="567"
          subtitle="This month"
        />
        {/* Add more stat cards */}
      </div>

      {/* Charts Section */}
      <Card>
        <h2 className="text-2xl font-bold mb-6">Insights</h2>
        <p className="text-dark-muted">Chart/graph component here</p>
      </Card>
    </PageTemplate>
  )
}
```

## Template: Form-Heavy Page

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import PageTemplate from '../components/layout/PageTemplate'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'

export default function TemplateFormPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    field1: '',
    field2: '',
    field3: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Submit form to API
    setShowForm(false)
  }

  return (
    <PageTemplate title="Forms">
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="New Item"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Create
            </Button>
          </div>
        }
      >
        <form className="space-y-4">
          <Input
            label="Field 1"
            placeholder="Value"
            value={form.field1}
            onChange={(e) => setForm({ ...form, field1: e.target.value })}
          />
          <Input
            label="Field 2"
            placeholder="Value"
            value={form.field2}
            onChange={(e) => setForm({ ...form, field2: e.target.value })}
          />
          <Input
            label="Field 3"
            placeholder="Value"
            value={form.field3}
            onChange={(e) => setForm({ ...form, field3: e.target.value })}
          />
        </form>
      </Modal>

      {/* Content */}
      <Button onClick={() => setShowForm(true)}>Open Form</Button>
    </PageTemplate>
  )
}
```

## Quick Template: Table Page

```tsx
import { useEffect, useState } from 'react'
import PageTemplate from '../components/layout/PageTemplate'
import DataTable from '../components/DataTable'
import Button from '../components/ui/Button'

type ItemRow = {
  id: string
  name: string
  status: string
  amount: number
}

export default function TemplateTablePage() {
  const [data, setData] = useState<ItemRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Fetch data from API
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTemplate title="Data Table">
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
          { key: 'amount', label: 'Amount', render: (v) => `₹${v}` },
        ]}
        data={data}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Edit
            </Button>
            <Button variant="secondary" size="sm">
              Delete
            </Button>
          </div>
        )}
      />
    </PageTemplate>
  )
}
```

---

## Applying These Templates

1. **Copy the appropriate template** for your page type
2. **Replace API calls** with actual endpoints
3. **Update field names** for your specific data
4. **Adjust colors/icons** as needed
5. **Test in browser** with `npm run dev`

---

## Common Patterns

### Loading States
```tsx
if (loading) {
  return <div className="grid gap-4">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-lg" />)}</div>
}
```

### Empty States
```tsx
if (items.length === 0) {
  return <div className="text-center py-12 text-dark-muted">No items yet</div>
}
```

### Error Handling
```tsx
if (error) {
  return <Card className="bg-red-500/20 border border-red-500/30 p-4 text-red-300">{error}</Card>
}
```

### Animations
```tsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  Content
</motion.div>
```

---

**Use these templates to quickly complete the remaining pages! Each template provides the basic structure - just add your specific logic and API calls.**

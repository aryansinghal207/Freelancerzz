import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import paymentQr from '../assets/payment-qr.jpeg'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onMarkPaid: () => Promise<void>
  totalAmount: number
  pendingAmount: number
}

export default function PaymentModal({
  isOpen,
  onClose,
  onMarkPaid,
  totalAmount,
  pendingAmount,
}: PaymentModalProps) {
  const [marking, setMarking] = useState(false)

  async function handleMarkPaid() {
    setMarking(true)
    try {
      await onMarkPaid()
      alert('Payment confirmed! All invoices marked as paid.')
      onClose()
    } catch (err) {
      console.error('Failed to mark as paid:', err)
      alert('Failed to mark payment. Please try again.')
    } finally {
      setMarking(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Make Payment"
      size="lg"
      footer={
        <motion.div className="flex gap-3 w-full" whileHover={{ scale: 1.02 }}>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleMarkPaid}
            isLoading={marking}
            className="flex-1"
            icon={<CheckCircle2 size={20} />}
          >
            {marking ? 'Processing...' : 'Mark as Paid'}
          </Button>
        </motion.div>
      }
    >
      <div className="space-y-6">
        {/* Amount Summary */}
        <motion.div
          className="grid grid-2 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-4 bg-primary-500/20 rounded-lg border border-primary-500/30">
            <p className="text-dark-muted text-sm mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-primary-300">₹{totalAmount.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-accent-pink/20 rounded-lg border border-accent-pink/30">
            <p className="text-dark-muted text-sm mb-1">Pending Amount</p>
            <p className="text-3xl font-bold text-accent-pink">₹{pendingAmount.toFixed(2)}</p>
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-dark-muted text-sm mb-4">Scan QR code to pay via UPI</p>

          <div className="flex justify-center p-6 bg-white/5 rounded-xl border border-white/10 mb-4">
            <motion.div
              className="w-64 h-64 bg-white p-3 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={paymentQr}
                alt="Payment QR Code"
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>
          </div>

          <motion.div
            className="text-lg font-mono font-bold text-accent-cyan mb-6 p-3 bg-white/5 rounded-lg border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            aryansinghal207@oksbi
          </motion.div>

          <p className="text-dark-muted text-sm">
            After completing the payment, click "Mark as Paid" to confirm
          </p>
        </motion.div>

        {/* Warning Note */}
        <motion.div
          className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AlertCircle className="text-yellow-400 flex-shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-semibold text-yellow-300 mb-1">Important</p>
            <p className="text-yellow-200/80">
              Please ensure you have completed the payment before clicking "Mark as Paid". 
              Once marked as paid, the transaction cannot be reversed.
            </p>
          </div>
        </motion.div>
      </div>
    </Modal>
  )
}

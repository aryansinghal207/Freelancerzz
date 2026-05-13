import { useState } from 'react'
import paymentQr from '../assets/payment-qr.jpeg'

export default function PaymentModal({ isOpen, onClose, onMarkPaid, totalAmount, pendingAmount }) {
  const [marking, setMarking] = useState(false)

  if (!isOpen) return null

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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>Make Payment</h2>
          <button onClick={onClose} style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '24px', 
            cursor: 'pointer',
            padding: '0 8px'
          }}>×</button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>
            Total Amount: <strong>₹{totalAmount.toFixed(2)}</strong>
          </p>
          <p style={{ fontSize: '16px', color: '#d32f2f', marginBottom: '24px' }}>
            Pending: <strong>₹{pendingAmount.toFixed(2)}</strong>
          </p>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
              Scan QR code to pay via UPI
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '300px', 
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '18px',
                  border: '2px solid #ddd',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <img
                    src={paymentQr}
                    alt="Payment QR Code"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '16px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <p style={{ marginTop: '16px', fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  aryansinghal207@oksbi
                </p>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
            After completing the payment, click the button below to confirm
          </p>

          <button 
            onClick={handleMarkPaid}
            disabled={marking}
            style={{
              padding: '12px 32px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: marking ? 'not-allowed' : 'pointer',
              opacity: marking ? 0.6 : 1
            }}
          >
            {marking ? 'Processing...' : '✓ Mark as Paid'}
          </button>
        </div>

        <div style={{ 
          marginTop: '24px', 
          padding: '12px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>Note:</strong> Please ensure you have completed the payment before clicking "Mark as Paid"
        </div>
      </div>
    </div>
  )
}

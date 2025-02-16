import PaymentForm from '@/components/payment/PaymentForm'
import SummaryPage from '@/components/payment/SummaryPage'
import React from 'react'
import './globals.css';


export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <PaymentForm />
          <SummaryPage />
        </div>
  )
}

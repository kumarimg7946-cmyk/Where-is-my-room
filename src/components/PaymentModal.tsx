import React, { useState } from 'react';
import { PaymentMode, PaymentRecord } from '../types';
import { 
  X, CheckCircle2, ShieldCheck, QrCode, Smartphone, 
  CreditCard, Building2, IndianRupee, ArrowRight, 
  Copy, Check, AlertCircle, FileText, Download, Sparkles
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  amount: number;
  paymentType: 'retailer_application_fee' | 'student_booking_token' | 'security_deposit';
  propertyId?: number;
  propertyTitle?: string;
  payerName: string;
  payerPhone: string;
  onPaymentSuccess: (record: PaymentRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  amount,
  paymentType,
  propertyId,
  propertyTitle,
  payerName,
  payerPhone,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMode>('UPI');
  const [upiOption, setUpiOption] = useState<'qr' | 'vpa'>('qr');
  const [upiId, setUpiId] = useState('studentroomfinder@upi');
  const [customVpa, setCustomVpa] = useState('');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(payerName || '');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedRecord, setCompletedRecord] = useState<PaymentRecord | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const txId = `TXN-SRF-${Date.now().toString().slice(-8)}`;
      const record: PaymentRecord = {
        id: `PAY-${Date.now()}`,
        amount,
        payment_type: paymentType,
        payer_name: payerName || "Verified User",
        payer_phone: payerPhone || "+91 98765 43210",
        payment_mode: selectedMethod,
        upi_id: selectedMethod === 'UPI' ? (customVpa || upiId) : undefined,
        card_last4: selectedMethod === 'Card' && cardNumber.length >= 4 ? cardNumber.slice(-4) : '4242',
        bank_name: selectedMethod === 'NetBanking' ? selectedBank : undefined,
        transaction_id: txId,
        status: 'SUCCESS',
        property_id: propertyId,
        property_title: propertyTitle,
        notes: paymentType === 'retailer_application_fee' 
          ? 'Mandatory ₹100 retailer listing onboarding & verification fee'
          : 'Room reservation token advance',
        created_at: new Date().toISOString()
      };

      setIsProcessing(false);
      setIsCompleted(true);
      setCompletedRecord(record);
      onPaymentSuccess(record);
    }, 1400);
  };

  const gstBreakdown = paymentType === 'retailer_application_fee' && amount === 100 ? {
    base: 84.75,
    cgst: 7.625,
    sgst: 7.625,
    total: 100.00
  } : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure 256-Bit Payment Gateway</span>
          </div>

          <h3 className="text-xl font-black text-white">{title}</h3>
          <p className="text-xs text-indigo-200 mt-0.5">{subtitle}</p>

          {/* Amount Badge */}
          <div className="mt-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-indigo-200 block">Total Payable Amount</span>
              <span className="text-2xl font-black text-white flex items-center">
                ₹{amount.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-indigo-300 ml-1.5">(Inclusive of GST)</span>
              </span>
            </div>
            {paymentType === 'retailer_application_fee' && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                ₹100 Retailer Fee
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {!isCompleted ? (
            <div className="space-y-4">
              
              {/* Payment Mode Selector Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      selectedMethod === 'UPI'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Card')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      selectedMethod === 'Card'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>Debit / Credit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('NetBanking')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      selectedMethod === 'NetBanking'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>NetBanking</span>
                  </button>
                </div>
              </div>

              {/* UPI Option */}
              {selectedMethod === 'UPI' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setUpiOption('qr')}
                      className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                        upiOption === 'qr' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      Scan UPI QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiOption('vpa')}
                      className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                        upiOption === 'vpa' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Enter UPI ID
                    </button>
                  </div>

                  {upiOption === 'qr' ? (
                    <div className="text-center py-2 space-y-2">
                      <div className="inline-block p-3 bg-white rounded-2xl border-2 border-indigo-100 shadow-sm">
                        {/* Simulated high-fidelity QR Code */}
                        <div className="w-36 h-36 mx-auto bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-white grid grid-cols-6 grid-rows-6 gap-0.5 p-2">
                            {Array.from({ length: 36 }).map((_, i) => (
                              <div
                                key={i}
                                className={`rounded-xs ${
                                  (i % 2 === 0 || i % 5 === 0) ? 'bg-slate-900' : 'bg-transparent'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="relative z-10 w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white">
                            ₹{amount}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Scan with <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, or <strong>BHIM</strong>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-1">
                        <span className="text-xs font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                          {upiId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1 rounded-md text-slate-500 hover:text-indigo-600 bg-white border border-slate-200"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 py-1">
                      <label className="block text-xs font-bold text-slate-700">Your UPI ID / VPA</label>
                      <input
                        type="text"
                        value={customVpa}
                        onChange={(e) => setCustomVpa(e.target.value)}
                        placeholder="e.g. mobile@okhdfcbank or user@paytm"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-500 pt-1">
                        <span>Popular:</span>
                        {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setCustomVpa(prev => prev.split('@')[0] + s)}
                            className="px-2 py-0.5 bg-white border border-slate-200 rounded-md hover:bg-indigo-50"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Card Option */}
              {selectedMethod === 'Card' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      placeholder="4532 8920 1234 5678"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name printed on card"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* NetBanking Option */}
              {selectedMethod === 'NetBanking' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Choose Bank:</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                  </select>
                  <p className="text-[11px] text-slate-500 pt-1">
                    You will be redirected to {selectedBank}&apos;s secure authorization gateway.
                  </p>
                </div>
              )}

              {/* Tax Invoice Itemization for ₹100 Retailer Fee */}
              {gstBreakdown && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Retailer Listing Application Fee:</span>
                    <span>₹{gstBreakdown.base.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-800">
                    <span>CGST (9%):</span>
                    <span>₹{gstBreakdown.cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-800">
                    <span>SGST (9%):</span>
                    <span>₹{gstBreakdown.sgst.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-amber-300/80 pt-1 flex justify-between font-black text-slate-900 text-xs">
                    <span>Total Amount Charged:</span>
                    <span>₹100.00</span>
                  </div>
                </div>
              )}

              {/* Submit Pay Button */}
              <button
                type="button"
                id="submit-payment-btn"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authorizing ₹{amount}...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{amount.toLocaleString('en-IN')} via {selectedMethod}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Success State & Receipt */
            <div className="text-center py-4 space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5px]" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">Payment Successful!</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transaction has been verified and registered on the network.
                </p>
              </div>

              {completedRecord && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between pb-1 border-b border-slate-200">
                    <span className="text-slate-500">Transaction ID:</span>
                    <span className="font-mono font-bold text-slate-800">{completedRecord.transaction_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paid Amount:</span>
                    <span className="font-bold text-emerald-700">₹{completedRecord.amount}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Purpose:</span>
                    <span className="font-medium text-slate-800">
                      {paymentType === 'retailer_application_fee' 
                        ? '₹100 Retailer Listing & Verification Fee' 
                        : 'Student Booking Token'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Mode:</span>
                    <span className="font-medium text-slate-800">{completedRecord.payment_mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payer:</span>
                    <span className="font-medium text-slate-800">{completedRecord.payer_name}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Date & Time:</span>
                    <span className="font-mono text-[11px] text-slate-600">
                      {new Date(completedRecord.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition-colors text-xs"
              >
                Close & Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

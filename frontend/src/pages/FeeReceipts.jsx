import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getFeeReceipts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Receipt, Download, Eye, CheckCircle, Printer, X } from 'lucide-react';

/* ══════════════════════════════════════
   OFFICIAL RECEIPT MODAL
══════════════════════════════════════ */
function ReceiptModal({ receipt, student, onClose }) {
  if (!receipt) return null;

  const printDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const payDate = new Date(receipt.paymentDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '16px',
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '12px', width: '100%',
        maxWidth: '680px', maxHeight: '93vh', overflowY: 'auto',
        position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
        fontFamily: "'Arial', sans-serif",
      }} onClick={e => e.stopPropagation()}>

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '12px', right: '12px',
          background: '#f1f5f9', border: 'none', borderRadius: '50%',
          width: '32px', height: '32px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#64748b', zIndex: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <X size={17}/>
        </button>

        {/* ── PRINTABLE RECEIPT ── */}
        <div id="receipt-print" style={{ padding: '0' }}>

          {/* TOP COLOR BAR */}
          <div style={{
            background: 'linear-gradient(90deg, #1e1b4b 0%, #4f46e5 50%, #7c3aed 100%)',
            height: '8px', borderRadius: '12px 12px 0 0',
          }}/>

          <div style={{ padding: '28px 32px' }}>

            {/* ══ HEADER ══ */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: '20px',
              paddingBottom: '18px', borderBottom: '2px solid #e2e8f0',
            }}>
              {/* Left — Logo + University name */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <svg width="56" height="58" viewBox="0 0 70 72" fill="none">
                  <path d="M35 3L65 16V40C65 56 35 69 35 69C35 69 5 56 5 40V16Z" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
                  <path d="M35 7L35 36L14 25C16 12 26 7 35 7Z" fill="#F97316"/>
                  <path d="M35 7L56 25L35 36Z" fill="#3B82F6"/>
                  <path d="M35 36L56 25L55 42C52 54 44 61 35 65Z" fill="#8B5CF6"/>
                  <path d="M35 36L35 65C26 61 18 54 15 42L14 25Z" fill="#EC4899"/>
                  <line x1="35" y1="7" x2="35" y2="65" stroke="white" strokeWidth="1.5" opacity="0.9"/>
                  <line x1="14" y1="25" x2="56" y2="25" stroke="white" strokeWidth="1.5" opacity="0.9"/>
                  <line x1="14" y1="25" x2="35" y2="65" stroke="white" strokeWidth="1" opacity="0.6"/>
                  <line x1="56" y1="25" x2="35" y2="65" stroke="white" strokeWidth="1" opacity="0.6"/>
                </svg>
                <div>
                  <div style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.5px' }}>
                    <span style={{ color: '#F97316' }}>U</span>
                    <span style={{ color: '#1e1b4b' }}>PES</span>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e1b4b', marginTop: '3px', letterSpacing: '0.3px' }}>
                    University of Petroleum and Energy Studies
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                    Energy Acres, P.O. Bidholi, Via Prem Nagar
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    Dehradun – 248 007, Uttarakhand, India
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    NAAC Grade 'A' | NIRF Ranked | Est. 2003
                  </div>
                </div>
              </div>

              {/* Right — Receipt title + number */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  background: '#1e1b4b', color: 'white',
                  padding: '6px 14px', borderRadius: '6px',
                  fontSize: '13px', fontWeight: 800,
                  letterSpacing: '1.5px', marginBottom: '8px',
                }}>
                  FEE RECEIPT
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>Receipt No.</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e1b4b', fontFamily: 'monospace' }}>
                  {receipt.receiptNo}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  Print Date: {printDate}
                </div>
              </div>
            </div>

            {/* ══ PAYMENT STATUS BANNER ══ */}
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '8px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={16} color="white"/>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#15803d' }}>PAYMENT SUCCESSFUL</div>
                  <div style={{ fontSize: '10px', color: '#16a34a' }}>Transaction verified and confirmed</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Transaction ID</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>{receipt.transactionId}</div>
              </div>
            </div>

            {/* ══ TWO COLUMN INFO ══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginBottom: '20px', border: '1.5px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              {/* Student Details */}
              <div style={{ borderRight: '1.5px solid #e2e8f0' }}>
                <div style={{ background: '#f8fafc', padding: '8px 14px', borderBottom: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#1e1b4b', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Student Details</div>
                </div>
                {[
                  ['Student Name',  student?.name],
                  ['SAP ID',        student?.sapId],
                  ['Roll Number',   student?.rollNo || 'R252213456'],
                  ['Program',       student?.program],
                  ['School',        student?.school],
                  ['Semester',      student?.semester],
                ].map(([k, v], i) => (
                  <div key={k} style={{ display: 'flex', padding: '7px 14px', borderBottom: i < 5 ? '1px solid #f1f5f9' : 'none', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', minWidth: '90px', flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: 600, wordBreak: 'break-word' }}>{v || '—'}</span>
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div>
                <div style={{ background: '#f8fafc', padding: '8px 14px', borderBottom: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#1e1b4b', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Payment Details</div>
                </div>
                {[
                  ['Payment Date',  payDate],
                  ['Payment Mode',  receipt.paymentMode],
                  ['Bank Ref No.',  receipt.transactionId?.slice(-10)],
                  ['Academic Year', '2025-26'],
                  ['Fee Category',  receipt.semester?.split(' - ')[1] || 'Tuition Fee'],
                  ['Status',        '✅ Paid'],
                ].map(([k, v], i) => (
                  <div key={k} style={{ display: 'flex', padding: '7px 14px', borderBottom: i < 5 ? '1px solid #f1f5f9' : 'none', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', minWidth: '90px', flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: 600, wordBreak: 'break-word' }}>{v || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ FEE TABLE ══ */}
            <div style={{ marginBottom: '20px', border: '1.5px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#1e1b4b', padding: '9px 14px', gap: '8px' }}>
                {['Description', 'Fee Head', 'Charges (₹)', 'Paid (₹)'].map(h => (
                  <div key={h} style={{ fontSize: '11px', fontWeight: 700, color: 'white', letterSpacing: '0.5px' }}>{h}</div>
                ))}
              </div>
              {/* Table row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 14px', gap: '8px', borderBottom: '1px solid #f1f5f9', background: 'white' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{receipt.description}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{receipt.semester}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#374151' }}>
                  {receipt.semester?.includes('Admission') ? 'Admission' :
                   receipt.semester?.includes('Registration') ? 'Registration' :
                   receipt.semester?.includes('Security') ? 'Security' : 'Tuition'}
                </div>
                <div style={{ fontSize: '12px', color: '#374151', fontFamily: 'monospace' }}>
                  {receipt.amount.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', fontFamily: 'monospace' }}>
                  {receipt.amount.toLocaleString('en-IN')}
                </div>
              </div>
              {/* Subtotal */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '8px 14px', gap: '8px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ gridColumn: '1/3', fontSize: '11px', color: '#64748b' }}>Concession / Scholarship</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>0</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>0</div>
              </div>
              {/* Total */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 14px', gap: '8px', background: '#1e1b4b' }}>
                <div style={{ gridColumn: '1/3', fontSize: '12px', fontWeight: 800, color: 'white', letterSpacing: '0.5px' }}>TOTAL AMOUNT PAID</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                  {receipt.amount.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#86efac', fontFamily: 'monospace' }}>
                  ₹{receipt.amount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* ══ AMOUNT IN WORDS ══ */}
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '7px', padding: '10px 14px', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>Amount in Words: </span>
              <span style={{ fontSize: '11px', color: '#78350f', fontStyle: 'italic' }}>
                {numberToWords(receipt.amount)} Only
              </span>
            </div>

            {/* ══ FOOTER ══ */}
            <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', alignItems: 'flex-end' }}>

              {/* QR placeholder */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                <div style={{ width: '56px', height: '56px', border: '2px solid #e2e8f0', borderRadius: '6px', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '2px', padding: '5px', background: '#f8fafc' }}>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} style={{ background: [0,1,5,6,3,8,10,12,14,16,18,20,23,24].includes(i) ? '#1e1b4b' : 'transparent', borderRadius: '1px' }}/>
                  ))}
                </div>
                <div style={{ fontSize: '9px', color: '#94a3b8' }}>Scan to verify</div>
              </div>

              {/* Note */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: '#94a3b8', lineHeight: 1.5 }}>
                  This is a system generated receipt.<br/>
                  No signature required.<br/>
                  fees@upes.ac.in | 0135-2776053<br/>
                  www.upes.ac.in
                </div>
              </div>

              {/* Authorised stamp */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                  {/* Outer ring */}
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2.5px solid #4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Inner content */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '7.5px', fontWeight: 800, color: '#4f46e5', letterSpacing: '0.5px', lineHeight: 1.3 }}>UPES</div>
                      <div style={{ fontSize: '6px', color: '#7c3aed', lineHeight: 1.2 }}>FINANCE</div>
                      <div style={{ fontSize: '6px', color: '#7c3aed', lineHeight: 1.2 }}>DEPT.</div>
                      <div style={{ fontSize: '16px', lineHeight: 1 }}>✓</div>
                      <div style={{ fontSize: '6px', color: '#4f46e5', lineHeight: 1.2, fontWeight: 700 }}>AUTHORISED</div>
                    </div>
                  </div>
                  {/* Dashed border */}
                  <div style={{ position: 'absolute', inset: '3px', borderRadius: '50%', border: '1px dashed #a5b4fc' }}/>
                </div>
                <div style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'right' }}>
                  Authorised Signatory<br/>
                  Finance Department
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM COLOR BAR */}
          <div style={{ background: 'linear-gradient(90deg,#4f46e5,#7c3aed,#ec4899)', height: '5px', borderRadius: '0 0 12px 12px' }}/>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', padding: '14px 28px 20px', borderTop: '1px solid #f1f5f9' }}>
          <button onClick={() => window.print()} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            padding: '11px', background: 'linear-gradient(135deg,#1e1b4b,#4f46e5)',
            color: 'white', border: 'none', borderRadius: '9px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
          }}>
            <Printer size={15}/> Print Receipt
          </button>
          <button onClick={onClose} style={{
            padding: '11px 22px', background: '#f8fafc',
            border: '1.5px solid #e2e8f0', borderRadius: '9px',
            cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            color: '#374151', fontFamily: 'inherit',
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── number to words helper ── */
function numberToWords(num) {
  const a = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const b = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if (num === 0) return 'Zero';
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num/10)] + (num%10 ? ' ' + a[num%10] : '');
  if (num < 1000) return a[Math.floor(num/100)] + ' Hundred' + (num%100 ? ' ' + numberToWords(num%100) : '');
  if (num < 100000) return numberToWords(Math.floor(num/1000)) + ' Thousand' + (num%1000 ? ' ' + numberToWords(num%1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num/100000)) + ' Lakh' + (num%100000 ? ' ' + numberToWords(num%100000) : '');
  return numberToWords(Math.floor(num/10000000)) + ' Crore' + (num%10000000 ? ' ' + numberToWords(num%10000000) : '');
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function FeeReceipts() {
  const { student } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getFeeReceipts()
      .then(res => setReceipts(res.data.feeReceipts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = receipts.reduce((s, r) => s + r.amount, 0);

  return (
    <Layout title="Fee Receipts">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-print, #receipt-print * { visibility: visible; }
          #receipt-print { position: fixed; top: 0; left: 0; width: 100%; }
        }
        .fee-summary {
          background: linear-gradient(135deg,#1e1b4b,#4f46e5);
          border-radius:14px; padding:22px 26px;
          display:flex; justify-content:space-between; align-items:center;
          margin-bottom:20px;
        }
        .fee-sum-lbl  { color:rgba(255,255,255,0.7); font-size:12px; margin-bottom:4px; }
        .fee-sum-amt  { color:white; font-size:30px; font-weight:900; }
        .fee-sum-note { color:rgba(255,255,255,0.55); font-size:11px; margin-top:3px; }
        .fee-sum-right { display:flex; flex-direction:column; align-items:flex-end; gap:6px; }
        .fee-sum-badge {
          background:rgba(255,255,255,0.15); color:white;
          border-radius:20px; padding:4px 12px;
          font-size:11px; font-weight:700;
          display:flex; align-items:center; gap:5px;
        }

        .fee-list { display:flex; flex-direction:column; gap:10px; }
        .fee-row {
          background:white; border-radius:12px; padding:16px 20px;
          display:flex; justify-content:space-between; align-items:center;
          box-shadow:0 1px 4px rgba(0,0,0,0.07);
          border-left:4px solid #4f46e5; gap:12px;
        }
        .fee-row-left  { display:flex; align-items:center; gap:14px; flex:1; min-width:0; }
        .fee-row-icon  {
          width:46px; height:46px; border-radius:12px;
          background:linear-gradient(135deg,#eef2ff,#e0e7ff);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .fee-desc { font-size:14px; font-weight:700; color:#1e293b; margin-bottom:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .fee-sem  { font-size:12px; color:#64748b; margin-bottom:4px; }
        .fee-meta { display:flex; align-items:center; gap:6px; font-size:11px; color:#94a3b8; flex-wrap:wrap; }
        .fee-no   { font-family:monospace; background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:10px; border:1px solid #e2e8f0; }

        .fee-row-right { display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0; }
        .fee-amount { font-size:20px; font-weight:900; color:#1e293b; }
        .fee-paid   {
          display:flex; align-items:center; gap:4px;
          background:#dcfce7; color:#15803d;
          padding:3px 10px; border-radius:20px;
          font-size:11px; font-weight:700;
          border:1px solid #bbf7d0;
        }
        .fee-btns { display:flex; gap:6px; }
        .fee-view-btn {
          display:flex; align-items:center; gap:4px;
          padding:6px 12px; background:#1e1b4b; color:white;
          border:none; border-radius:7px; cursor:pointer;
          font-size:11px; font-weight:600; font-family:inherit;
          transition:opacity 0.15s;
        }
        .fee-view-btn:hover { opacity:0.85; }
        .fee-dl-btn {
          padding:6px 9px; background:#f8fafc;
          border:1.5px solid #e2e8f0; border-radius:7px;
          cursor:pointer; color:#64748b;
          display:flex; align-items:center; font-family:inherit;
        }

        @media (max-width:600px) {
          .fee-summary { padding:16px; flex-direction:column; align-items:flex-start; gap:10px; }
          .fee-sum-right { align-items:flex-start; }
          .fee-sum-amt { font-size:24px; }
          .fee-row { flex-direction:column; align-items:flex-start; padding:14px; }
          .fee-row-right { align-items:flex-start; flex-direction:row; flex-wrap:wrap; gap:8px; }
          .fee-amount { font-size:18px; }
        }
      `}</style>

      {selected && <ReceiptModal receipt={selected} student={student} onClose={() => setSelected(null)}/>}

      {/* Summary card */}
      <div className="fee-summary">
        <div>
          <div className="fee-sum-lbl">Total Fee Paid (Year 1)</div>
          <div className="fee-sum-amt">₹{total.toLocaleString('en-IN')}</div>
          <div className="fee-sum-note">{receipts.length} receipts · Academic Year 2025-26</div>
        </div>
        <div className="fee-sum-right">
          <Receipt size={32} color="rgba(255,255,255,0.4)"/>
          <div className="fee-sum-badge"><CheckCircle size={12}/>Fully Cleared</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'60px', color:'#94a3b8' }}>Loading receipts…</div>
      ) : receipts.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px', color:'#94a3b8' }}>
          <Receipt size={40} color="#e2e8f0" style={{ marginBottom:'12px' }}/>
          <div>No receipts found. Please run the seed script.</div>
        </div>
      ) : (
        <div className="fee-list">
          {receipts.map(r => (
            <div key={r._id} className="fee-row">
              <div className="fee-row-left">
                <div className="fee-row-icon">
                  <Receipt size={22} color="#4f46e5"/>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="fee-desc">{r.description}</div>
                  <div className="fee-sem">{r.semester}</div>
                  <div className="fee-meta">
                    <span className="fee-no">{r.receiptNo}</span>
                    <span style={{ color:'#cbd5e1' }}>|</span>
                    <span>{new Date(r.paymentDate).toLocaleDateString('en-IN',{ day:'2-digit', month:'short', year:'numeric' })}</span>
                    <span style={{ color:'#cbd5e1' }}>|</span>
                    <span>{r.paymentMode}</span>
                  </div>
                </div>
              </div>
              <div className="fee-row-right">
                <div className="fee-amount">₹{r.amount.toLocaleString('en-IN')}</div>
                <div className="fee-paid"><CheckCircle size={11}/>{r.status}</div>
                <div className="fee-btns">
                  <button onClick={() => setSelected(r)} className="fee-view-btn">
                    <Eye size={13}/> View Receipt
                  </button>
                  <button onClick={() => setSelected(r)} className="fee-dl-btn">
                    <Printer size={13}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

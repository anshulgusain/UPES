import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getFeeReceipts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Receipt, Download, Eye, CheckCircle, Printer, X } from 'lucide-react';

function ReceiptModal({ receipt, student, onClose }) {
  if (!receipt) return null;

  const handlePrint = () => window.print();

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>
        <button style={modal.closeBtn} onClick={onClose}><X size={20} /></button>

        <div id="receipt-print" style={modal.receipt}>
          {/* Header */}
          <div style={modal.receiptHeader}>
            <div style={modal.receiptLogoRow}>
              <div style={modal.receiptLogoIcon}>
                <span style={{ fontSize: '22px', fontWeight: 900, color: 'white' }}>U</span>
              </div>
              <div>
                <div style={modal.receiptLogoText}>
                  <span style={{ color: '#f97316' }}>U</span>
                  <span style={{ color: '#1e1b4b' }}>PES</span>
                </div>
                <div style={modal.receiptLogoSub}>UNIVERSITY OF TOMORROW</div>
              </div>
            </div>
            <div style={modal.receiptTitle}>FEE PAYMENT RECEIPT</div>
            <div style={modal.receiptReceiptNo}>Receipt No: {receipt.receiptNo}</div>
          </div>

          {/* Status badge */}
          <div style={modal.statusBadge}>
            <CheckCircle size={18} color="#059669" />
            <span style={{ color: '#059669', fontWeight: 700, fontSize: '15px' }}>PAYMENT CONFIRMED</span>
          </div>

          {/* Student Info */}
          <div style={modal.section}>
            <div style={modal.sectionTitle}>STUDENT DETAILS</div>
            <div style={modal.infoGrid}>
              <div style={modal.infoRow}><span style={modal.infoKey}>Student Name</span><span style={modal.infoVal}>{student?.name}</span></div>
              <div style={modal.infoRow}><span style={modal.infoKey}>SAP ID</span><span style={modal.infoVal}>{student?.sapId}</span></div>
              <div style={modal.infoRow}><span style={modal.infoKey}>Program</span><span style={modal.infoVal}>{student?.program}</span></div>
              <div style={modal.infoRow}><span style={modal.infoKey}>School</span><span style={modal.infoVal}>{student?.school}</span></div>
            </div>
          </div>

          {/* Payment Info */}
          <div style={modal.section}>
            <div style={modal.sectionTitle}>PAYMENT DETAILS</div>
            <div style={modal.infoGrid}>
              <div style={modal.infoRow}><span style={modal.infoKey}>Description</span><span style={modal.infoVal}>{receipt.description}</span></div>
              <div style={modal.infoRow}><span style={modal.infoKey}>Semester</span><span style={modal.infoVal}>{receipt.semester}</span></div>
              <div style={modal.infoRow}><span style={modal.infoKey}>Payment Date</span><span style={modal.infoVal}>{new Date(receipt.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
              <div style={modal.infoRow}><span style={modal.infoKey}>Payment Mode</span><span style={modal.infoVal}>{receipt.paymentMode}</span></div>
              <div style={modal.infoRow}><span style={modal.infoKey}>Transaction ID</span><span style={{ ...modal.infoVal, fontFamily: 'monospace', fontSize: '13px' }}>{receipt.transactionId}</span></div>
            </div>
          </div>

          {/* Amount */}
          <div style={modal.amountBox}>
            <span style={modal.amountLabel}>TOTAL AMOUNT PAID</span>
            <span style={modal.amountValue}>₹{receipt.amount.toLocaleString('en-IN')}</span>
          </div>

          {/* Footer */}
          <div style={modal.receiptFooter}>
            <p style={modal.footerText}>This is a computer-generated receipt and does not require a signature.</p>
            <p style={modal.footerText}>For queries, contact: fees@upes.ac.in | Helpline: 0135-2776053</p>
            <p style={modal.footerText}>UPES, Energy Acres, P.O. Bidholi, Via Prem Nagar, Dehradun – 248 007, Uttarakhand</p>
            <div style={modal.stampArea}>
              <div style={modal.stamp}>PAID ✓</div>
            </div>
          </div>
        </div>

        <div style={modal.actions}>
          <button onClick={handlePrint} style={modal.printBtn}><Printer size={16} /> Print Receipt</button>
          <button onClick={onClose} style={modal.closeAction}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function FeeReceipts() {
  const { student } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
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
      {selected && <ReceiptModal receipt={selected} student={student} onClose={() => setSelected(null)} />}

      {/* Summary */}
      <div style={styles.summaryCard}>
        <div>
          <div style={styles.summaryLabel}>Total Fee Paid</div>
          <div style={styles.summaryAmount}>₹{total.toLocaleString('en-IN')}</div>
          <div style={styles.summaryNote}>{receipts.length} receipts generated</div>
        </div>
        <div style={styles.summaryIcon}><Receipt size={36} color="rgba(255,255,255,0.8)" /></div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading receipts…</div>
      ) : (
        <div style={styles.list}>
          {receipts.map(r => (
            <div key={r._id} style={styles.receiptRow}>
              <div style={styles.receiptLeft}>
                <div style={styles.receiptIcon}>
                  <Receipt size={22} color="#4f46e5" />
                </div>
                <div>
                  <div style={styles.receiptDesc}>{r.description}</div>
                  <div style={styles.receiptSem}>{r.semester}</div>
                  <div style={styles.receiptMeta}>
                    <span style={styles.receiptNo}>{r.receiptNo}</span>
                    <span style={styles.dot}>·</span>
                    <span>{new Date(r.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span style={styles.dot}>·</span>
                    <span>{r.paymentMode}</span>
                  </div>
                </div>
              </div>
              <div style={styles.receiptRight}>
                <div style={styles.receiptAmount}>₹{r.amount.toLocaleString('en-IN')}</div>
                <div style={styles.paidBadge}><CheckCircle size={12} /> {r.status}</div>
                <div style={styles.receiptBtns}>
                  <button onClick={() => setSelected(r)} style={styles.viewBtn}><Eye size={14} /> View</button>
                  <button onClick={() => setSelected(r)} style={styles.dlBtn}><Download size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

const styles = {
  summaryCard: {
    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    borderRadius: '16px', padding: '24px 28px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '24px',
  },
  summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '4px' },
  summaryAmount: { color: 'white', fontSize: '32px', fontWeight: 900 },
  summaryNote: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' },
  summaryIcon: { opacity: 0.6 },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  receiptRow: {
    background: 'white', borderRadius: '14px', padding: '18px 22px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', gap: '12px',
  },
  receiptLeft: { display: 'flex', alignItems: 'center', gap: '16px', flex: 1 },
  receiptIcon: {
    width: '48px', height: '48px', borderRadius: '12px', background: '#eef2ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  receiptDesc: { fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '2px' },
  receiptSem: { fontSize: '13px', color: '#64748b', marginBottom: '4px' },
  receiptMeta: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', flexWrap: 'wrap' },
  receiptNo: { fontFamily: 'monospace', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' },
  dot: { color: '#cbd5e1' },
  receiptRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 },
  receiptAmount: { fontSize: '20px', fontWeight: 800, color: '#1e293b' },
  paidBadge: {
    display: 'flex', alignItems: 'center', gap: '4px',
    background: '#ecfdf5', color: '#059669',
    padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
  },
  receiptBtns: { display: 'flex', gap: '6px' },
  viewBtn: {
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '6px 12px', background: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontSize: '12px', fontWeight: 600,
  },
  dlBtn: {
    padding: '6px 10px', background: '#f1f5f9', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', cursor: 'pointer', color: '#64748b',
    display: 'flex', alignItems: 'center',
  },
};

const modal = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: '20px',
  },
  box: {
    background: 'white', borderRadius: '20px', width: '100%', maxWidth: '600px',
    maxHeight: '90vh', overflowY: 'auto', position: 'relative',
    boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
  },
  closeBtn: {
    position: 'absolute', top: '14px', right: '14px', zIndex: 10,
    background: '#f1f5f9', border: 'none', borderRadius: '50%',
    width: '32px', height: '32px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b',
  },
  receipt: { padding: '32px' },
  receiptHeader: { borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' },
  receiptLogoRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  receiptLogoIcon: {
    width: '44px', height: '44px', borderRadius: '12px',
    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  receiptLogoText: { fontSize: '22px', fontWeight: 900 },
  receiptLogoSub: { fontSize: '9px', color: '#64748b', letterSpacing: '2px', fontWeight: 600 },
  receiptTitle: { fontSize: '18px', fontWeight: 800, color: '#1e1b4b', letterSpacing: '1px' },
  receiptReceiptNo: { fontSize: '12px', color: '#64748b', fontFamily: 'monospace', marginTop: '4px' },
  statusBadge: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#ecfdf5', border: '1.5px solid #a7f3d0',
    borderRadius: '12px', padding: '10px 16px', marginBottom: '20px',
  },
  section: { marginBottom: '20px' },
  sectionTitle: {
    fontSize: '11px', color: '#94a3b8', fontWeight: 700,
    letterSpacing: '1.5px', marginBottom: '10px', textTransform: 'uppercase',
  },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '10px 12px', background: '#f8fafc', borderRadius: '8px',
  },
  infoKey: { fontSize: '12px', color: '#64748b', fontWeight: 500 },
  infoVal: { fontSize: '13px', color: '#1e293b', fontWeight: 600, textAlign: 'right', maxWidth: '60%' },
  amountBox: {
    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    borderRadius: '12px', padding: '16px 20px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '20px',
  },
  amountLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' },
  amountValue: { color: 'white', fontSize: '28px', fontWeight: 900 },
  receiptFooter: {
    borderTop: '1px solid #e2e8f0', paddingTop: '16px', position: 'relative',
  },
  footerText: { margin: '0 0 4px', fontSize: '11px', color: '#94a3b8' },
  stampArea: { position: 'absolute', top: '-10px', right: '0' },
  stamp: {
    border: '3px solid #059669', color: '#059669',
    borderRadius: '8px', padding: '4px 12px',
    fontSize: '14px', fontWeight: 900, transform: 'rotate(-8deg)',
    opacity: 0.8, letterSpacing: '2px',
  },
  actions: {
    display: 'flex', gap: '10px', padding: '16px 32px 24px',
    borderTop: '1px solid #f1f5f9',
  },
  printBtn: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '12px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    color: 'white', border: 'none', borderRadius: '10px',
    cursor: 'pointer', fontSize: '14px', fontWeight: 700,
  },
  closeAction: {
    padding: '12px 20px', background: '#f8fafc', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151',
  },
};

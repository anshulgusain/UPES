import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getFeeReceipts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Receipt, Download, Eye, CheckCircle, Printer, X } from 'lucide-react';

function ReceiptModal({ receipt, student, onClose }) {
  if (!receipt) return null;
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:'16px' }}
      onClick={onClose}>
      <div style={{ background:'white',borderRadius:'16px',width:'100%',maxWidth:'560px',maxHeight:'90vh',overflowY:'auto',position:'relative',boxShadow:'0 25px 50px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute',top:'12px',right:'12px',background:'#f1f5f9',border:'none',borderRadius:'50%',width:'30px',height:'30px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',zIndex:1 }}>
          <X size={18}/>
        </button>

        <div id="receipt-print" style={{ padding:'28px' }}>
          {/* Header */}
          <div style={{ borderBottom:'2px solid #e2e8f0',paddingBottom:'16px',marginBottom:'16px' }}>
            <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px' }}>
              <div style={{ width:'40px',height:'40px',borderRadius:'10px',background:'linear-gradient(135deg,#4f46e5,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <span style={{ fontSize:'18px',fontWeight:900,color:'white' }}>U</span>
              </div>
              <div>
                <div style={{ fontSize:'20px',fontWeight:900 }}>
                  <span style={{ color:'#f97316' }}>U</span>
                  <span style={{ color:'#1e1b4b' }}>PES</span>
                </div>
                <div style={{ fontSize:'8px',letterSpacing:'2px',color:'#64748b',fontWeight:600 }}>UNIVERSITY OF TOMORROW</div>
              </div>
            </div>
            <div style={{ fontSize:'16px',fontWeight:800,color:'#1e1b4b',letterSpacing:'0.5px' }}>FEE PAYMENT RECEIPT</div>
            <div style={{ fontSize:'11px',color:'#64748b',fontFamily:'monospace',marginTop:'3px' }}>Receipt No: {receipt.receiptNo}</div>
          </div>

          {/* Status */}
          <div style={{ display:'flex',alignItems:'center',gap:'8px',background:'#ecfdf5',border:'1.5px solid #a7f3d0',borderRadius:'10px',padding:'10px 14px',marginBottom:'16px' }}>
            <CheckCircle size={16} color="#059669"/>
            <span style={{ color:'#059669',fontWeight:700,fontSize:'14px' }}>PAYMENT CONFIRMED</span>
          </div>

          {/* Student info */}
          {[
            ['Student Name', student?.name],
            ['SAP ID',       student?.sapId],
            ['Program',      student?.program],
            ['Description',  receipt.description],
            ['Semester',     receipt.semester],
            ['Payment Date', new Date(receipt.paymentDate).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})],
            ['Payment Mode', receipt.paymentMode],
            ['Transaction ID', receipt.transactionId],
          ].map(([k,v]) => (
            <div key={k} style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'9px 11px',background:'#f8fafc',borderRadius:'7px',marginBottom:'7px',gap:'12px' }}>
              <span style={{ fontSize:'12px',color:'#64748b',fontWeight:500,flexShrink:0 }}>{k}</span>
              <span style={{ fontSize:'12px',color:'#1e293b',fontWeight:600,textAlign:'right',wordBreak:'break-all' }}>{v}</span>
            </div>
          ))}

          {/* Amount */}
          <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)',borderRadius:'10px',padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',margin:'16px 0' }}>
            <span style={{ color:'rgba(255,255,255,0.8)',fontSize:'11px',fontWeight:600,letterSpacing:'1px' }}>TOTAL AMOUNT PAID</span>
            <span style={{ color:'white',fontSize:'24px',fontWeight:900 }}>₹{receipt.amount.toLocaleString('en-IN')}</span>
          </div>

          {/* Footer */}
          <div style={{ borderTop:'1px solid #e2e8f0',paddingTop:'12px',position:'relative' }}>
            <p style={{ margin:'0 0 3px',fontSize:'10px',color:'#94a3b8' }}>This is a computer-generated receipt and does not require a signature.</p>
            <p style={{ margin:'0 0 3px',fontSize:'10px',color:'#94a3b8' }}>Contact: fees@upes.ac.in | 0135-2776053</p>
            <p style={{ margin:0,fontSize:'10px',color:'#94a3b8' }}>UPES, Energy Acres, Bidholi, Dehradun – 248 007</p>
            <div style={{ position:'absolute',top:'-8px',right:'0',border:'2px solid #059669',color:'#059669',borderRadius:'6px',padding:'3px 10px',fontSize:'13px',fontWeight:900,transform:'rotate(-8deg)',opacity:0.8 }}>
              PAID ✓
            </div>
          </div>
        </div>

        <div style={{ display:'flex',gap:'10px',padding:'14px 28px 20px',borderTop:'1px solid #f1f5f9' }}>
          <button onClick={() => window.print()}
            style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',padding:'11px',background:'linear-gradient(135deg,#4f46e5,#7c3aed)',color:'white',border:'none',borderRadius:'9px',cursor:'pointer',fontSize:'13px',fontWeight:700 }}>
            <Printer size={15}/> Print
          </button>
          <button onClick={onClose}
            style={{ padding:'11px 18px',background:'#f8fafc',border:'1.5px solid #e2e8f0',borderRadius:'9px',cursor:'pointer',fontSize:'13px',fontWeight:600,color:'#374151' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeeReceipts() {
  const { student } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getFeeReceipts()
      .then(res => setReceipts(res.data.feeReceipts))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const total = receipts.reduce((s,r)=>s+r.amount,0);

  return (
    <Layout title="Fee Receipts">
      <style>{`
        .fee-summary {
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          border-radius: 14px; padding: 22px 26px;
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px;
        }
        .fee-sum-lbl  { color:rgba(255,255,255,0.7); font-size:12px; margin-bottom:4px; }
        .fee-sum-amt  { color:white; font-size:28px; font-weight:900; }
        .fee-sum-note { color:rgba(255,255,255,0.6); font-size:11px; margin-top:3px; }

        .fee-list { display:flex; flex-direction:column; gap:10px; }

        .fee-row {
          background:white; border-radius:12px; padding:16px 18px;
          display:flex; justify-content:space-between; align-items:center;
          box-shadow:0 1px 3px rgba(0,0,0,0.06); gap:10px;
        }
        .fee-row-left  { display:flex; align-items:center; gap:13px; flex:1; min-width:0; }
        .fee-row-icon  {
          width:44px; height:44px; border-radius:11px; background:#eef2ff;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .fee-desc { font-size:14px; font-weight:700; color:#1e293b; margin-bottom:2px;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .fee-sem  { font-size:12px; color:#64748b; margin-bottom:3px; }
        .fee-meta { display:flex; align-items:center; gap:5px; font-size:11px; color:#94a3b8; flex-wrap:wrap; }
        .fee-no   { font-family:monospace; background:#f1f5f9; padding:1px 5px; border-radius:3px; font-size:10px; }

        .fee-row-right { display:flex; flex-direction:column; align-items:flex-end; gap:5px; flex-shrink:0; }
        .fee-amount { font-size:18px; font-weight:800; color:#1e293b; }
        .fee-paid   {
          display:flex; align-items:center; gap:3px;
          background:#ecfdf5; color:#059669;
          padding:3px 8px; border-radius:20px; font-size:11px; font-weight:700;
        }
        .fee-btns { display:flex; gap:5px; }
        .fee-view-btn {
          display:flex; align-items:center; gap:3px;
          padding:5px 10px; background:#4f46e5; color:white;
          border:none; border-radius:7px; cursor:pointer;
          font-size:11px; font-weight:600; font-family:inherit;
        }
        .fee-dl-btn {
          padding:5px 8px; background:#f1f5f9; border:1.5px solid #e2e8f0;
          border-radius:7px; cursor:pointer; color:#64748b;
          display:flex; align-items:center; font-family:inherit;
        }

        @media (max-width: 600px) {
          .fee-summary { padding:16px 18px; flex-direction:column; align-items:flex-start; gap:8px; }
          .fee-sum-amt  { font-size:22px; }
          .fee-row      { flex-direction:column; align-items:flex-start; padding:14px; }
          .fee-row-right { align-items:flex-start; flex-direction:row; flex-wrap:wrap; gap:8px; }
          .fee-amount   { font-size:20px; }
          .fee-desc     { font-size:13px; }
        }
      `}</style>

      {selected && <ReceiptModal receipt={selected} student={student} onClose={()=>setSelected(null)}/>}

      {/* Summary */}
      <div className="fee-summary">
        <div>
          <div className="fee-sum-lbl">Total Fee Paid</div>
          <div className="fee-sum-amt">₹{total.toLocaleString('en-IN')}</div>
          <div className="fee-sum-note">{receipts.length} receipts generated</div>
        </div>
        <Receipt size={36} color="rgba(255,255,255,0.5)"/>
      </div>

      {loading ? (
        <div style={{ textAlign:'center',padding:'60px',color:'#94a3b8' }}>Loading receipts…</div>
      ) : (
        <div className="fee-list">
          {receipts.map(r => (
            <div key={r._id} className="fee-row">
              <div className="fee-row-left">
                <div className="fee-row-icon">
                  <Receipt size={20} color="#4f46e5"/>
                </div>
                <div style={{ minWidth:0 }}>
                  <div className="fee-desc">{r.description}</div>
                  <div className="fee-sem">{r.semester}</div>
                  <div className="fee-meta">
                    <span className="fee-no">{r.receiptNo}</span>
                    <span>·</span>
                    <span>{new Date(r.paymentDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
                    <span>·</span>
                    <span>{r.paymentMode}</span>
                  </div>
                </div>
              </div>
              <div className="fee-row-right">
                <div className="fee-amount">₹{r.amount.toLocaleString('en-IN')}</div>
                <div className="fee-paid"><CheckCircle size={11}/>{r.status}</div>
                <div className="fee-btns">
                  <button onClick={()=>setSelected(r)} className="fee-view-btn"><Eye size={13}/> View</button>
                  <button onClick={()=>setSelected(r)} className="fee-dl-btn"><Download size={13}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
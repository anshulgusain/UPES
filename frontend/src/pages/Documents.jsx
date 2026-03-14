import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getDocuments } from '../services/api';
import { FileText, CheckCircle, Clock, XCircle, Upload, Download, Eye } from 'lucide-react';

const statusConfig = {
  verified: { icon: CheckCircle, color: '#059669', bg: '#ecfdf5', label: 'Verified' },
  pending:  { icon: Clock,       color: '#f97316', bg: '#fff7ed', label: 'Pending'  },
  rejected: { icon: XCircle,     color: '#dc2626', bg: '#fef2f2', label: 'Rejected' },
};
const typeEmoji = { 'Identity Proof':'🪪', 'Academic':'📄', 'Health':'🏥', 'Category Proof':'📋' };

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('All');

  useEffect(() => {
    getDocuments()
      .then(res => setDocuments(res.data.documents))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const types    = ['All', ...new Set(documents.map(d => d.type))];
  const filtered = filter === 'All' ? documents : documents.filter(d => d.type === filter);

  return (
    <Layout title="My Documents">
      <style>{`
        .docs-summary {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 14px; background: white; border-radius: 12px;
          padding: 18px; margin-bottom: 18px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .docs-sum-item { text-align: center; }
        .docs-sum-val  { font-size: 26px; font-weight: 800; }
        .docs-sum-lbl  { font-size: 11px; color: #64748b; margin-top: 2px; }

        .docs-filters { display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap; }
        .docs-filter-btn {
          padding:6px 14px; border-radius:20px; border:1.5px solid #e2e8f0;
          background:white; cursor:pointer; font-size:12px; font-weight:500;
          color:#64748b; font-family:inherit; transition:all 0.15s;
          white-space:nowrap;
        }
        .docs-filter-btn.active {
          background:#4f46e5; border-color:#4f46e5; color:white; font-weight:700;
        }

        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
          gap: 14px;
        }
        .doc-card {
          background: white; border-radius: 12px; padding: 18px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          border: 1.5px solid #f1f5f9;
        }
        .doc-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
        .doc-emoji    { font-size:26px; line-height:1; }
        .doc-status   {
          display:flex; align-items:center; gap:3px;
          padding:3px 7px; border-radius:20px; font-size:10px; font-weight:700;
        }
        .doc-name { margin:0 0 3px; font-size:14px; font-weight:700; color:#1e293b; }
        .doc-type { margin:0 0 5px; font-size:11px; color:#94a3b8; }
        .doc-date { margin:0 0 12px; font-size:11px; color:#64748b; }
        .doc-btns { display:flex; gap:7px; }
        .doc-btn  {
          flex:1; display:flex; align-items:center; justify-content:center; gap:4px;
          padding:6px; border-radius:7px; border:1.5px solid #e2e8f0;
          background:white; cursor:pointer; font-size:11px; font-weight:600; color:#374151;
          font-family:inherit;
        }

        .upload-card {
          background:white; border-radius:12px; padding:18px;
          border:2px dashed #e2e8f0;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:8px; min-height:160px;
        }
        .upload-txt { margin:0; font-size:13px; color:#94a3b8; }
        .upload-btn {
          padding:7px 18px; background:#f8fafc; border:1.5px solid #e2e8f0;
          border-radius:7px; cursor:pointer; font-size:12px; font-weight:600;
          color:#374151; font-family:inherit;
        }
        .docs-loading { text-align:center; padding:60px; color:#94a3b8; }

        @media (max-width: 600px) {
          .docs-summary { grid-template-columns: repeat(2,1fr); gap:10px; padding:14px; }
          .docs-sum-val  { font-size:20px; }
          .docs-grid    { grid-template-columns: repeat(2,1fr); gap:10px; }
          .doc-card     { padding:14px; }
          .doc-name     { font-size:13px; }
        }
        @media (max-width: 380px) {
          .docs-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Summary */}
      <div className="docs-summary">
        {[
          { label:'Total',    value: documents.length,                                      color:'#4f46e5' },
          { label:'Verified', value: documents.filter(d=>d.status==='verified').length,     color:'#059669' },
          { label:'Pending',  value: documents.filter(d=>d.status==='pending').length,      color:'#f97316' },
          { label:'Rejected', value: documents.filter(d=>d.status==='rejected').length,     color:'#dc2626' },
        ].map(({ label, value, color }) => (
          <div key={label} className="docs-sum-item">
            <div className="docs-sum-val" style={{ color }}>{value}</div>
            <div className="docs-sum-lbl">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="docs-filters">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`docs-filter-btn${filter===t?' active':''}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="docs-loading">Loading documents…</div>
      ) : (
        <div className="docs-grid">
          {filtered.map(doc => {
            const { icon: StatusIcon, color, bg, label } = statusConfig[doc.status] || statusConfig.pending;
            return (
              <div key={doc._id} className="doc-card">
                <div className="doc-card-top">
                  <div className="doc-emoji">{typeEmoji[doc.type] || '📁'}</div>
                  <div className="doc-status" style={{ background:bg, color }}>
                    <StatusIcon size={11} />
                    {label}
                  </div>
                </div>
                <h3 className="doc-name">{doc.name}</h3>
                <p className="doc-type">{doc.type}</p>
                <p className="doc-date">
                  {new Date(doc.uploadedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                </p>
                <div className="doc-btns">
                  <button className="doc-btn"><Eye size={13}/> View</button>
                  <button className="doc-btn"><Download size={13}/> Save</button>
                </div>
              </div>
            );
          })}
          <div className="upload-card">
            <Upload size={28} color="#cbd5e1"/>
            <p className="upload-txt">Upload Document</p>
            <button className="upload-btn">Choose File</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
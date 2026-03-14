import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getDocuments } from '../services/api';
import { FileText, CheckCircle, Clock, XCircle, Upload, Download, Eye } from 'lucide-react';

const statusConfig = {
  verified: { icon: CheckCircle, color: '#059669', bg: '#ecfdf5', label: 'Verified' },
  pending: { icon: Clock, color: '#f97316', bg: '#fff7ed', label: 'Pending' },
  rejected: { icon: XCircle, color: '#dc2626', bg: '#fef2f2', label: 'Rejected' },
};

const typeIcons = {
  'Identity Proof': '🪪',
  'Academic': '📄',
  'Health': '🏥',
  'Category Proof': '📋',
};

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getDocuments()
      .then(res => setDocuments(res.data.documents))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const types = ['All', ...new Set(documents.map(d => d.type))];
  const filtered = filter === 'All' ? documents : documents.filter(d => d.type === filter);
  const verified = documents.filter(d => d.status === 'verified').length;

  return (
    <Layout title="My Documents">
      {/* Summary bar */}
      <div style={styles.summaryBar}>
        {[
          { label: 'Total Documents', value: documents.length, color: '#4f46e5' },
          { label: 'Verified', value: verified, color: '#059669' },
          { label: 'Pending', value: documents.filter(d => d.status === 'pending').length, color: '#f97316' },
          { label: 'Rejected', value: documents.filter(d => d.status === 'rejected').length, color: '#dc2626' },
        ].map(({ label, value, color }) => (
          <div key={label} style={styles.summaryItem}>
            <div style={{ ...styles.summaryVal, color }}>{value}</div>
            <div style={styles.summaryLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={styles.filterRow}>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{ ...styles.filterBtn, ...(filter === t ? styles.filterBtnActive : {}) }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading documents…</div>
      ) : (
        <div style={styles.docsGrid}>
          {filtered.map(doc => {
            const { icon: StatusIcon, color, bg, label } = statusConfig[doc.status] || statusConfig.pending;
            return (
              <div key={doc._id} style={styles.docCard}>
                <div style={styles.docTop}>
                  <div style={styles.docEmoji}>{typeIcons[doc.type] || '📁'}</div>
                  <div style={{ ...styles.statusBadge, background: bg, color }}>
                    <StatusIcon size={12} />
                    {label}
                  </div>
                </div>
                <h3 style={styles.docName}>{doc.name}</h3>
                <p style={styles.docType}>{doc.type}</p>
                <p style={styles.docDate}>
                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
                <div style={styles.docActions}>
                  <button style={styles.actionBtn}>
                    <Eye size={14} /> View
                  </button>
                  <button style={styles.actionBtn}>
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            );
          })}

          {/* Upload placeholder card */}
          <div style={styles.uploadCard}>
            <Upload size={32} color="#cbd5e1" />
            <p style={styles.uploadText}>Upload New Document</p>
            <button style={styles.uploadBtn}>Choose File</button>
          </div>
        </div>
      )}
    </Layout>
  );
}

const styles = {
  summaryBar: {
    display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px',
    background: 'white', borderRadius: '14px', padding: '20px',
    marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  summaryItem: { textAlign: 'center' },
  summaryVal: { fontSize: '28px', fontWeight: 800 },
  summaryLabel: { fontSize: '12px', color: '#64748b', fontWeight: 500 },
  filterRow: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  filterBtn: {
    padding: '7px 16px', borderRadius: '20px', border: '1.5px solid #e2e8f0',
    background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#64748b',
  },
  filterBtnActive: { background: '#4f46e5', borderColor: '#4f46e5', color: 'white', fontWeight: 700 },
  loading: { textAlign: 'center', padding: '60px', color: '#94a3b8' },
  docsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '16px',
  },
  docCard: {
    background: 'white', borderRadius: '14px', padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1.5px solid #f1f5f9', transition: 'box-shadow 0.15s',
  },
  docTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  docEmoji: { fontSize: '28px', lineHeight: 1 },
  statusBadge: {
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
  },
  docName: { margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#1e293b' },
  docType: { margin: '0 0 6px', fontSize: '12px', color: '#94a3b8' },
  docDate: { margin: '0 0 14px', fontSize: '12px', color: '#64748b' },
  docActions: { display: 'flex', gap: '8px' },
  actionBtn: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
    padding: '7px', borderRadius: '8px', border: '1.5px solid #e2e8f0',
    background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#374151',
  },
  uploadCard: {
    background: 'white', borderRadius: '14px', padding: '20px',
    border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '10px', minHeight: '180px',
  },
  uploadText: { margin: 0, fontSize: '14px', color: '#94a3b8', fontWeight: 500 },
  uploadBtn: {
    padding: '8px 20px', background: '#f8fafc', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#374151',
  },
};

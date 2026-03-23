import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Shield, List, Activity, LogOut, Trash2, Plus, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('blocklist');
  const [sites, setSites] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch blocked sites
  const fetchSites = async () => {
    try {
      const res = await api.get('/block');
      setSites(res.data);
    } catch (err) {
      console.error('Failed to fetch sites', err);
    }
  };

  // Fetch access logs
  const fetchLogs = async () => {
    try {
      const res = await api.get('/logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  useEffect(() => {
    fetchSites();
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  const handleAddSite = async (e) => {
    e.preventDefault();
    if (!newUrl) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/block', { url: newUrl });
      setNewUrl('');
      fetchSites();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add site');
    }
    setLoading(false);
  };

  const handleDeleteSite = async (id) => {
    if (!window.confirm('Remove this site from blocklist?')) return;
    try {
      await api.delete(`/block/${id}`);
      fetchSites();
    } catch (err) {
      console.error('Failed to delete site', err);
    }
  };

  // Simulate an access log (for demo purposes)
  const handleSimulateAccess = async () => {
    if (sites.length === 0) {
      alert('Add a site to the blocklist first to simulate traffic.');
      return;
    }
    const randomSite = sites[Math.floor(Math.random() * sites.length)].url;
    try {
      await api.post('/logs', { url: randomSite, status: 'BLOCKED' });
      if (activeTab === 'logs') fetchLogs();
      else alert(`Simulated blocked access to ${randomSite}`);
    } catch (err) {
      console.error('Failed to generate log', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav style={{ padding: '1.25rem 2rem', background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield color="var(--accent-primary)" size={28} />
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Net<span style={{ color: 'var(--accent-primary)' }}>Blocker</span></h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            Welcome, <strong style={{ color: 'var(--text-primary)' }}>{user?.username}</strong>
          </div>
          <button onClick={logout} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="container" style={{ flex: 1, paddingTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Sidebar */}
          <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('blocklist')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem',
                background: activeTab === 'blocklist' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'blocklist' ? 'white' : 'var(--text-secondary)',
                border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                fontWeight: activeTab === 'blocklist' ? '600' : '500', transition: 'all 0.2s'
              }}
            >
              <List size={20} /> Manage Blocklist
            </button>
            
            <button 
              onClick={() => setActiveTab('logs')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem',
                background: activeTab === 'logs' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'logs' ? 'white' : 'var(--text-secondary)',
                border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                fontWeight: activeTab === 'logs' ? '600' : '500', transition: 'all 0.2s'
              }}
            >
              <Activity size={20} /> Access Logs
            </button>
            
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                  <AlertCircle size={18} />
                  <strong style={{ fontSize: '0.9rem' }}>Simulation</strong>
                </div>
                <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Generate sample traffic to see the block analyzer in action.</p>
                <button onClick={handleSimulateAccess} className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}>
                  Simulate Request
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, minWidth: '0' }}>
            <div className="glass-panel animate-fade-in" style={{ minHeight: '500px' }}>
              
              {activeTab === 'blocklist' && (
                <div>
                  <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Shield color="var(--accent-primary)" /> Protected Websites
                  </h2>
                  
                  <form onSubmit={handleAddSite} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      style={{ flex: 1 }} 
                      placeholder="e.g. facebook.com, youtube.com" 
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Plus size={18} /> Add to Blocklist
                    </button>
                  </form>
                  
                  {error && <div className="alert alert-error">{error}</div>}

                  {sites.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                      <Shield size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                      <p>Your blocklist is empty. Add a website above to start blocking.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Website URL</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sites.map(site => (
                            <tr key={site.id}>
                              <td><strong style={{ color: 'var(--text-primary)' }}>{site.url}</strong></td>
                              <td>
                                <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                                  {site.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button onClick={() => handleDeleteSite(site.id)} className="btn btn-danger" style={{ padding: '0.5rem', borderRadius: '8px' }} title="Remove block">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'logs' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                      <Activity color="var(--accent-primary)" /> Access Logs
                    </h2>
                    <button onClick={fetchLogs} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      Refresh
                    </button>
                  </div>
                  
                  {logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                      <Activity size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                      <p>No access logs recorded yet.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Website</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.map(log => {
                            const date = new Date(log.timestamp);
                            return (
                              <tr key={log.id}>
                                <td style={{ color: 'var(--text-secondary)' }}>
                                  {date.toLocaleDateString()} {date.toLocaleTimeString()}
                                </td>
                                <td>{log.url}</td>
                                <td>
                                  <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', background: log.status === 'BLOCKED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: log.status === 'BLOCKED' ? 'var(--accent-danger)' : 'var(--accent-success)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                                    {log.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

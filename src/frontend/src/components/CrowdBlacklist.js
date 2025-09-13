import React, { useState } from 'react';
import { X, Users, Flag, AlertTriangle, CheckCircle, ExternalLink, Shield } from 'lucide-react';
import '../styles/components/CrowdBlacklist.css';

const CrowdBlacklist = ({ onClose, initialContent = '', contentType = 'message' }) => {
  const [reportContent, setReportContent] = useState(initialContent);
  const [reportType, setReportType] = useState(contentType);
  const [reportReason, setReportReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock blacklisted items for demonstration
  const [blacklistedItems] = useState([
    {
      id: 1,
      content: 'bit.ly/nsfas-urgent-2024',
      type: 'link',
      reports: 23,
      status: 'confirmed',
      reason: 'Fake NSFAS bursary scam',
      dateAdded: '2024-01-15'
    },
    {
      id: 2,
      content: '+27 82 555 0123',
      type: 'phone',
      reports: 15,
      status: 'confirmed',
      reason: 'Telemarketing scam calls',
      dateAdded: '2024-01-12'
    },
    {
      id: 3,
      content: 'secure-wits.co.za',
      type: 'domain',
      reports: 8,
      status: 'pending',
      reason: 'Typosquatting wits.ac.za',
      dateAdded: '2024-01-10'
    },
    {
      id: 4,
      content: 'Congratulations! You have won R50,000 bursary',
      type: 'message',
      reports: 31,
      status: 'confirmed',
      reason: 'Fake prize/bursary scam',
      dateAdded: '2024-01-08'
    }
  ]);

  const handleSubmitReport = () => {
    if (!reportContent.trim() || !reportReason.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setReportContent('');
        setReportReason('');
        setSubmitted(false);
      }, 2000);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#ff4444';
      case 'pending': return '#ffaa00';
      default: return '#888888';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <AlertTriangle size={16} />;
      case 'pending': return <CheckCircle size={16} />;
      default: return <Flag size={16} />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'link': return <ExternalLink size={16} />;
      case 'phone': return <Users size={16} />;
      case 'domain': return <Shield size={16} />;
      default: return <Flag size={16} />;
    }
  };

  return (
    <div className="crowd-blacklist-overlay">
      <div className="crowd-blacklist-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-info">
            <Users size={24} />
            <div>
              <h2>Community Blacklist</h2>
              <p>Help protect other students by reporting suspicious content</p>
            </div>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Report Section */}
          <div className="report-section">
            <h3>Report Suspicious Content</h3>
            
            {!submitted ? (
              <div className="report-form">
                <div className="form-group">
                  <label>Content Type:</label>
                  <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="form-select"
                  >
                    <option value="message">Message/Text</option>
                    <option value="link">Link/URL</option>
                    <option value="phone">Phone Number</option>
                    <option value="email">Email Address</option>
                    <option value="domain">Domain/Website</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Suspicious Content:</label>
                  <textarea
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    placeholder="Paste the suspicious content here..."
                    className="form-textarea"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Reason for Report:</label>
                  <select 
                    value={reportReason} 
                    onChange={(e) => setReportReason(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select a reason...</option>
                    <option value="phishing">Phishing/Scam</option>
                    <option value="malware">Malware/Virus</option>
                    <option value="spam">Spam/Unwanted</option>
                    <option value="fraud">Financial Fraud</option>
                    <option value="impersonation">Impersonation</option>
                    <option value="other">Other Suspicious Activity</option>
                  </select>
                </div>

                <button 
                  onClick={handleSubmitReport}
                  disabled={!reportContent.trim() || !reportReason || isSubmitting}
                  className="submit-report-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Flag size={16} />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="success-message">
                <CheckCircle size={32} />
                <h4>Report Submitted Successfully!</h4>
                <p>Thank you for helping protect the community. Your report will be reviewed and added to the blacklist if confirmed.</p>
              </div>
            )}
          </div>

          {/* Blacklist Display */}
          <div className="blacklist-section">
            <h3>Community Blacklist ({blacklistedItems.length} items)</h3>
            <p className="blacklist-description">
              Items reported by 10+ users are automatically flagged for all CyberPulse users
            </p>

            <div className="blacklist-items">
              {blacklistedItems.map((item) => (
                <div key={item.id} className="blacklist-item">
                  <div className="item-header">
                    <div className="item-type">
                      {getTypeIcon(item.type)}
                      <span>{item.type}</span>
                    </div>
                    <div 
                      className="item-status"
                      style={{ color: getStatusColor(item.status) }}
                    >
                      {getStatusIcon(item.status)}
                      <span>{item.status}</span>
                    </div>
                  </div>

                  <div className="item-content">
                    <code>{item.content}</code>
                  </div>

                  <div className="item-details">
                    <div className="item-reason">
                      <strong>Reason:</strong> {item.reason}
                    </div>
                    <div className="item-stats">
                      <span className="reports-count">
                        <Users size={14} />
                        {item.reports} reports
                      </span>
                      <span className="date-added">
                        Added: {item.dateAdded}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-info">
            <Shield size={16} />
            <span>Reports are anonymous and help protect all students</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdBlacklist;

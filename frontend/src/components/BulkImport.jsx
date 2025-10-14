import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloudUpload, 
  faDownload, 
  faCheck, 
  faSpinner, 
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faFileExcel,
  faFileCsv
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/BulkImport.css';

const BulkImport = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importHistory, setImportHistory] = useState([]);
  const [currentBatchId, setCurrentBatchId] = useState(null);
  const [viewModal, setViewModal] = useState({ show: false, data: null });
  
  // Import options
  const [options, setOptions] = useState({
    source: '',
    skipDuplicates: true,
    sendVerification: false,
    autoVerify: true,
    sendWelcomeEmail: false
  });

  // File upload dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    onDrop: handleFileDrop,
    multiple: false
  });

  function handleFileDrop(acceptedFiles) {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }

  async function uploadFile(file) {
    if (!options.source) {
      alert('Please enter the source organization name first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', options.source);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/bulk-import/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUploadedFile(response.data);
      setCurrentBatchId(response.data.batch_id);
      // Auto-validate after upload
      validateData(response.data.batch_id);
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    }
  }

  async function validateData(batchId) {
    setIsValidating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/bulk-import/validate/${batchId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setValidationResults(response.data);
    } catch (error) {
      alert('Validation failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsValidating(false);
    }
  }

  async function processImport() {
    if (!uploadedFile || !validationResults) {
      alert('Please upload and validate a file first');
      return;
    }

    if (validationResults.errors.length > 0) {
      const confirm = window.confirm(
        `There are ${validationResults.errors.length} validation errors. ` +
        'Only valid records will be imported. Continue?'
      );
      if (!confirm) return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/bulk-import/process/${currentBatchId}`,
        options,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      alert('Import started successfully! Refresh the history table to see results.');
      // Refresh history
      fetchImportHistory();
      // Reset form
      setUploadedFile(null);
      setValidationResults(null);
      setCurrentBatchId(null);
      setOptions({...options, source: ''});
    } catch (error) {
      alert('Import failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsProcessing(false);
    }
  }

  async function fetchImportHistory() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/bulk-import/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setImportHistory(response.data.imports);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }

  async function downloadTemplate(userType) {
    window.open(`/api/bulk-import/template/${userType}`, '_blank');
  }

  async function downloadReport(batchId) {
    const token = localStorage.getItem('token');
    window.open(
      `/api/bulk-import/report/${batchId}?token=${token}`, 
      '_blank'
    );
  }

  async function sendWelcomeEmails(batchId) {
    if (!window.confirm('Send welcome emails with login credentials to all users from this import?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/bulk-import/send-welcome-emails/${batchId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        alert(`✅ Welcome emails sent to ${response.data.emails_sent} users!`);
      }
    } catch (error) {
      alert('Failed to send emails: ' + (error.response?.data?.error || error.message));
    }
  }

  async function archiveImport(batchId) {
    if (!window.confirm('Archive this import? It will be moved to archived imports.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/bulk-import/archive/${batchId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        alert('✅ Import archived successfully!');
        fetchImportHistory(); // Refresh the list
      }
    } catch (error) {
      alert('Failed to archive: ' + (error.response?.data?.error || error.message));
    }
  }

  async function removeImport(batchId) {
    if (!window.confirm('Permanently delete this import record? This cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `/api/bulk-import/delete/${batchId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        alert('✅ Import removed successfully!');
        fetchImportHistory(); // Refresh the list
      }
    } catch (error) {
      alert('Failed to remove: ' + (error.response?.data?.error || error.message));
    }
  }

  async function viewImportDetails(batchId) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/bulk-import/details/${batchId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setViewModal({ show: true, data: response.data });
    } catch (error) {
      alert('Failed to load details: ' + (error.response?.data?.error || error.message));
    }
  }

  useEffect(() => {
    fetchImportHistory();
  }, []);

  return (
    <div className="bulk-import-page">
      <div className="page-header">
        <h1>📊 Bulk User Import</h1>
        <p>Import users from community organizations and corporate partners</p>
      </div>

      {/* Templates Section */}
      <div className="templates-section card">
        <h2>📥 Download Templates</h2>
        <p className="section-description">Download a template to see the required format for bulk imports</p>
        <div className="template-buttons">
          <button onClick={() => downloadTemplate('jobSeeker')} className="btn-template">
            <FontAwesomeIcon icon={faFileCsv} />
            <span>Job Seeker Template</span>
          </button>
          <button onClick={() => downloadTemplate('recruiter')} className="btn-template">
            <FontAwesomeIcon icon={faFileCsv} />
            <span>Recruiter Template</span>
          </button>
          <button onClick={() => downloadTemplate('intern')} className="btn-template btn-intern">
            <FontAwesomeIcon icon={faFileCsv} />
            <span>Intern Template</span>
          </button>
          <button onClick={() => downloadTemplate('mixed')} className="btn-template">
            <FontAwesomeIcon icon={faFileExcel} />
            <span>Mixed Users Template</span>
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="upload-section card">
        <h2>📤 Upload Data File</h2>
        
        <div className="import-options">
          <div className="form-group">
            <label>Source Organization *</label>
            <input
              type="text"
              placeholder="e.g., UAN, Hindu Council, BIDCO"
              value={options.source}
              onChange={(e) => setOptions({...options, source: e.target.value})}
              required
            />
          </div>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.skipDuplicates}
                onChange={(e) => setOptions({...options, skipDuplicates: e.target.checked})}
              />
              <span>Skip Duplicate Entries</span>
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.sendVerification}
                onChange={(e) => setOptions({...options, sendVerification: e.target.checked})}
              />
              <span>Send Verification Emails</span>
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.autoVerify}
                onChange={(e) => setOptions({...options, autoVerify: e.target.checked})}
              />
              <span>Auto-Verify (Trusted Source)</span>
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.sendWelcomeEmail}
                onChange={(e) => setOptions({...options, sendWelcomeEmail: e.target.checked})}
              />
              <span>Send Welcome Emails with Passwords</span>
            </label>
          </div>
        </div>

        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faCloudUpload} size="3x" className="upload-icon" />
          {isDragActive ? (
            <p>Drop file here...</p>
          ) : (
            <>
              <p>Drag & drop CSV/Excel file here, or click to select</p>
              <p className="file-types">Supported: .csv, .xls, .xlsx</p>
            </>
          )}
        </div>

        {uploadedFile && (
          <div className="upload-success">
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>File uploaded: {uploadedFile.total_records} records found</span>
          </div>
        )}
      </div>

      {/* Validation Results */}
      {isValidating && (
        <div className="validation-loading card">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Validating data...</p>
        </div>
      )}

      {validationResults && !isValidating && (
        <div className="validation-results card">
          <h2>✓ Validation Results</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{validationResults.statistics.total_records}</div>
              <div className="stat-label">Total Records</div>
            </div>
            <div className="stat-card success">
              <div className="stat-value">{validationResults.statistics.valid_records}</div>
              <div className="stat-label">Valid Records</div>
            </div>
            <div className="stat-card error">
              <div className="stat-value">{validationResults.statistics.invalid_records}</div>
              <div className="stat-label">Invalid Records</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-value">{validationResults.statistics.duplicate_count}</div>
              <div className="stat-label">Duplicates</div>
            </div>
          </div>

          {/* Errors Table */}
          {validationResults.errors.length > 0 && (
            <div className="errors-section">
              <h3>❌ Errors Found</h3>
              <div className="table-container">
                <table className="errors-table">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Field</th>
                      <th>Error</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResults.errors.slice(0, 20).map((error, idx) => (
                      <tr key={idx}>
                        <td>{error.row}</td>
                        <td><strong>{error.field}</strong></td>
                        <td>{error.error}</td>
                        <td className="value-cell">{error.value || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {validationResults.errors.length > 20 && (
                  <p className="more-rows">... and {validationResults.errors.length - 20} more errors</p>
                )}
              </div>
            </div>
          )}

          {/* Duplicates Table */}
          {validationResults.duplicates.length > 0 && (
            <div className="duplicates-section">
              <h3>⚠️ Duplicate Entries</h3>
              <div className="table-container">
                <table className="duplicates-table">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Type</th>
                      <th>Field</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationResults.duplicates.slice(0, 20).map((dup, idx) => (
                      <tr key={idx}>
                        <td>{dup.row}</td>
                        <td><span className={`badge ${dup.type}`}>{dup.type}</span></td>
                        <td><strong>{dup.field}</strong></td>
                        <td className="value-cell">{dup.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {validationResults.duplicates.length > 20 && (
                  <p className="more-rows">... and {validationResults.duplicates.length - 20} more duplicates</p>
                )}
              </div>
            </div>
          )}

          {/* Process Button */}
          {validationResults.statistics.valid_records > 0 && (
            <div className="process-section">
              <button 
                onClick={processImport} 
                disabled={isProcessing}
                className="btn-process"
              >
                {isProcessing ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Process Import ({validationResults.statistics.valid_records} users)</span>
                  </>
                )}
              </button>
              <button 
                onClick={async () => {
                  if (window.confirm('Cancel this upload? All validation data will be lost.')) {
                    // Delete the batch from backend
                    if (currentBatchId) {
                      try {
                        const token = localStorage.getItem('token');
                        await axios.delete(
                          `/api/bulk-import/delete/${currentBatchId}`,
                          {
                            headers: { 'Authorization': `Bearer ${token}` }
                          }
                        );
                      } catch (error) {
                        console.error('Failed to delete batch:', error);
                      }
                    }
                    // Clear state
                    setUploadedFile(null);
                    setValidationResults(null);
                    setCurrentBatchId(null);
                  }
                }}
                disabled={isProcessing}
                className="btn-cancel"
              >
                <FontAwesomeIcon icon={faTimesCircle} />
                <span>Cancel Upload</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Import History */}
      <div className="history-section card">
        <div className="section-header">
          <h2>📜 Import History</h2>
          <button onClick={fetchImportHistory} className="btn-refresh">
            <FontAwesomeIcon icon={faSpinner} />
            <span>Refresh</span>
          </button>
        </div>
        
        {importHistory.length === 0 ? (
          <p className="no-data">No imports yet. Upload a file to get started.</p>
        ) : (
          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Organization/Company</th>
                  <th>Description</th>
                  <th>File Name</th>
                  <th>Uploaded By</th>
                  <th>Date & Time</th>
                  <th>Total</th>
                  <th>Success</th>
                  <th>Failed</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {importHistory.map((item) => (
                  <tr key={item.batch_id}>
                    <td><strong>{item.source || 'N/A'}</strong></td>
                    <td className="description-cell">{item.description || `Bulk import from ${item.source}`}</td>
                    <td className="filename-cell">{item.file_name}</td>
                    <td>{item.uploaded_by || 'Admin User'}</td>
                    <td className="datetime-cell">
                      {new Date(item.created_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>{item.total_records}</td>
                    <td className="success-count">
                      {item.successful > 0 && <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />}
                      {item.successful || 0}
                    </td>
                    <td className="error-count">
                      {item.failed > 0 && <FontAwesomeIcon icon={faTimesCircle} className="error-icon" />}
                      {item.failed || 0}
                    </td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="action-buttons-cell">
                      <button 
                        onClick={() => viewImportDetails(item.batch_id)}
                        className="btn-icon btn-view"
                        title="View Imported Data"
                      >
                        👁️
                      </button>
                      {item.status === 'completed' && (
                        <>
                          <button 
                            onClick={() => downloadReport(item.batch_id)}
                            className="btn-icon btn-download"
                            title="Download Report with Credentials"
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </button>
                          <button 
                            onClick={() => sendWelcomeEmails(item.batch_id)}
                            className="btn-icon btn-email"
                            title="Send Welcome Emails & Credentials"
                          >
                            📧
                          </button>
                          <button 
                            onClick={() => archiveImport(item.batch_id)}
                            className="btn-icon btn-archive"
                            title="Archive Import"
                          >
                            🗄️
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => removeImport(item.batch_id)}
                        className="btn-icon btn-remove"
                        title="Remove Import"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewModal.show && (
        <div className="modal-overlay" onClick={() => setViewModal({ show: false, data: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📊 Import Details</h2>
              <button 
                onClick={() => setViewModal({ show: false, data: null })}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {viewModal.data && (
                <>
                  <div className="detail-section">
                    <h3>Import Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Batch ID:</label>
                        <span>{viewModal.data.batch_id}</span>
                      </div>
                      <div className="detail-item">
                        <label>Source:</label>
                        <span>{viewModal.data.source}</span>
                      </div>
                      <div className="detail-item">
                        <label>File Name:</label>
                        <span>{viewModal.data.file_name}</span>
                      </div>
                      <div className="detail-item">
                        <label>Status:</label>
                        <span className={`status-badge ${viewModal.data.status}`}>
                          {viewModal.data.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Statistics</h3>
                    <div className="stats-grid-small">
                      <div className="stat-small">
                        <div className="stat-label">Total</div>
                        <div className="stat-value-small">{viewModal.data.total_records}</div>
                      </div>
                      <div className="stat-small success">
                        <div className="stat-label">Success</div>
                        <div className="stat-value-small">{viewModal.data.successful || 0}</div>
                      </div>
                      <div className="stat-small error">
                        <div className="stat-label">Failed</div>
                        <div className="stat-value-small">{viewModal.data.failed || 0}</div>
                      </div>
                    </div>
                  </div>

                  {viewModal.data.imported_users && viewModal.data.imported_users.length > 0 && (
                    <div className="detail-section">
                      <h3>Imported Users ({viewModal.data.imported_users.length})</h3>
                      <div className="users-list">
                        {viewModal.data.imported_users.slice(0, 20).map((user, idx) => (
                          <div key={idx} className="user-item">
                            <span className="user-name">{user.name}</span>
                            <span className="user-email">{user.email}</span>
                          </div>
                        ))}
                        {viewModal.data.imported_users.length > 20 && (
                          <p className="more-users">... and {viewModal.data.imported_users.length - 20} more users</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkImport;


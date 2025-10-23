import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, faSave, faUndo, faEye, faCode, faTrash, faPlus,
  faPalette, faFont, faImages, faClone, faDownload, faUpload
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const DashboardTemplateEditor = () => {
  const [activeTemplate, setActiveTemplate] = useState('recruiter');
  const [templates, setTemplates] = useState({
    recruiter: {
      sections: [],
      styles: {},
      layout: {}
    },
    jobSeeker: {
      sections: [],
      styles: {},
      layout: {}
    },
    intern: {
      sections: [],
      styles: {},
      layout: {}
    }
  });
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/dashboard-templates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      // Load default templates
      loadDefaultTemplates();
    }
  };

  const loadDefaultTemplates = () => {
    setTemplates({
      recruiter: {
        name: 'Recruiter Dashboard',
        theme: {
          primary: '#ff9800',
          secondary: '#f57c00',
          gradient: 'linear-gradient(180deg, #FF8A65 0%, #FF7043 100%)'
        },
        sections: [
          { id: 'dashboard', name: 'Dashboard', icon: 'th-large', enabled: true },
          { id: 'jobs', name: 'Job Postings', icon: 'briefcase', enabled: true },
          { id: 'internships', name: 'Internships', icon: 'user-graduate', enabled: true },
          { id: 'candidates', name: 'Candidates', icon: 'users', enabled: true },
          { id: 'pipeline', name: 'Pipeline', icon: 'stream', enabled: true },
          { id: 'messages', name: 'Messages', icon: 'envelope', enabled: true },
          { id: 'calendar', name: 'Calendar', icon: 'calendar-alt', enabled: true },
          { id: 'analytics', name: 'Analytics', icon: 'chart-bar', enabled: true },
          { id: 'settings', name: 'Settings', icon: 'cog', enabled: true }
        ]
      },
      jobSeeker: {
        name: 'Job Seeker Dashboard',
        theme: {
          primary: '#1976d2',
          secondary: '#1565c0',
          gradient: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)'
        },
        sections: [
          { id: 'dashboard', name: 'Dashboard', icon: 'th-large', enabled: true },
          { id: 'jobs', name: 'Browse Jobs', icon: 'search', enabled: true },
          { id: 'applications', name: 'Applications', icon: 'file-alt', enabled: true },
          { id: 'saved', name: 'Saved Jobs', icon: 'bookmark', enabled: true },
          { id: 'interviews', name: 'Interviews', icon: 'calendar-check', enabled: true },
          { id: 'matches', name: 'Recommended', icon: 'star', enabled: true },
          { id: 'messages', name: 'Messages', icon: 'envelope', enabled: true },
          { id: 'profile', name: 'Profile', icon: 'user', enabled: true },
          { id: 'resume', name: 'Resume', icon: 'file-pdf', enabled: true },
          { id: 'settings', name: 'Settings', icon: 'cog', enabled: true }
        ]
      },
      intern: {
        name: 'Intern Dashboard',
        theme: {
          primary: '#22c55e',
          secondary: '#16a34a',
          gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
        },
        sections: [
          { id: 'dashboard', name: 'Dashboard', icon: 'th-large', enabled: true },
          { id: 'internships', name: 'Find Internships', icon: 'search', enabled: true },
          { id: 'applications', name: 'Applications', icon: 'file-alt', enabled: true },
          { id: 'saved', name: 'Saved', icon: 'bookmark', enabled: true },
          { id: 'interviews', name: 'Interviews', icon: 'calendar-check', enabled: true },
          { id: 'matches', name: 'Recommended', icon: 'star', enabled: true },
          { id: 'messages', name: 'Messages', icon: 'envelope', enabled: true },
          { id: 'profile', name: 'Profile', icon: 'user', enabled: true },
          { id: 'academic', name: 'Academic', icon: 'graduation-cap', enabled: true },
          { id: 'learning', name: 'Learning', icon: 'book', enabled: true },
          { id: 'settings', name: 'Settings', icon: 'cog', enabled: true }
        ]
      }
    });
  };

  const saveTemplates = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/admin/dashboard-templates', templates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Templates saved successfully!');
    } catch (error) {
      console.error('Error saving templates:', error);
      alert('❌ Error saving templates');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (sectionId) => {
    const updatedSections = templates[activeTemplate].sections.map(section =>
      section.id === sectionId ? { ...section, enabled: !section.enabled } : section
    );
    setTemplates({
      ...templates,
      [activeTemplate]: {
        ...templates[activeTemplate],
        sections: updatedSections
      }
    });
  };

  const addSection = () => {
    const newSection = {
      id: `section_${Date.now()}`,
      name: 'New Section',
      icon: 'star',
      enabled: true
    };
    setTemplates({
      ...templates,
      [activeTemplate]: {
        ...templates[activeTemplate],
        sections: [...templates[activeTemplate].sections, newSection]
      }
    });
  };

  const deleteSection = (sectionId) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this section?')) {
      const updatedSections = templates[activeTemplate].sections.filter(s => s.id !== sectionId);
      setTemplates({
        ...templates,
        [activeTemplate]: {
          ...templates[activeTemplate],
          sections: updatedSections
        }
      });
    }
  };

  const updateSectionName = (sectionId, newName) => {
    const updatedSections = templates[activeTemplate].sections.map(section =>
      section.id === sectionId ? { ...section, name: newName } : section
    );
    setTemplates({
      ...templates,
      [activeTemplate]: {
        ...templates[activeTemplate],
        sections: updatedSections
      }
    });
  };

  const updateSectionIcon = (sectionId, newIcon) => {
    const updatedSections = templates[activeTemplate].sections.map(section =>
      section.id === sectionId ? { ...section, icon: newIcon } : section
    );
    setTemplates({
      ...templates,
      [activeTemplate]: {
        ...templates[activeTemplate],
        sections: updatedSections
      }
    });
  };

  const updateThemeColor = (colorType, newColor) => {
    setTemplates({
      ...templates,
      [activeTemplate]: {
        ...templates[activeTemplate],
        theme: {
          ...templates[activeTemplate].theme,
          [colorType]: newColor
        }
      }
    });
  };

  const exportTemplate = () => {
    const template = templates[activeTemplate];
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${activeTemplate}_template.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="template-editor">
      <div className="editor-header">
        <h2><FontAwesomeIcon icon={faEdit} /> Dashboard Template Editor</h2>
        <div className="editor-actions">
          <button className="btn btn-secondary" onClick={() => setPreviewMode(!previewMode)}>
            <FontAwesomeIcon icon={faEye} /> {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button className="btn btn-secondary" onClick={exportTemplate}>
            <FontAwesomeIcon icon={faDownload} /> Export
          </button>
          <button className="btn btn-primary" onClick={saveTemplates} disabled={saving}>
            <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Template Selector */}
      <div className="template-selector">
        <button 
          className={`template-btn ${activeTemplate === 'recruiter' ? 'active recruiter' : ''}`}
          onClick={() => setActiveTemplate('recruiter')}
        >
          <i className="fas fa-briefcase"></i> Recruiter Dashboard
        </button>
        <button 
          className={`template-btn ${activeTemplate === 'jobSeeker' ? 'active jobseeker' : ''}`}
          onClick={() => setActiveTemplate('jobSeeker')}
        >
          <i className="fas fa-user"></i> Job Seeker Dashboard
        </button>
        <button 
          className={`template-btn ${activeTemplate === 'intern' ? 'active intern' : ''}`}
          onClick={() => setActiveTemplate('intern')}
        >
          <i className="fas fa-graduation-cap"></i> Intern Dashboard
        </button>
      </div>

      <div className="editor-content">
        {/* Sidebar - Theme Settings */}
        <div className="editor-sidebar">
          <div className="sidebar-section">
            <h3><FontAwesomeIcon icon={faPalette} /> Theme Colors</h3>
            <div className="color-picker-group">
              <label>Primary Color:</label>
              <input 
                type="color" 
                value={templates[activeTemplate]?.theme?.primary || '#000000'}
                onChange={(e) => updateThemeColor('primary', e.target.value)}
              />
              <span>{templates[activeTemplate]?.theme?.primary}</span>
            </div>
            <div className="color-picker-group">
              <label>Secondary Color:</label>
              <input 
                type="color" 
                value={templates[activeTemplate]?.theme?.secondary || '#000000'}
                onChange={(e) => updateThemeColor('secondary', e.target.value)}
              />
              <span>{templates[activeTemplate]?.theme?.secondary}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3><FontAwesomeIcon icon={faFont} /> Typography</h3>
            <p style={{ fontSize: '12px', color: '#666' }}>Typography customization coming soon...</p>
          </div>

          <div className="sidebar-section">
            <h3><FontAwesomeIcon icon={faImages} /> Layout</h3>
            <p style={{ fontSize: '12px', color: '#666' }}>Layout customization coming soon...</p>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="editor-main">
          <div className="sections-header">
            <h3>Navigation Sections</h3>
            <button className="btn btn-sm btn-primary" onClick={addSection}>
              <FontAwesomeIcon icon={faPlus} /> Add Section
            </button>
          </div>

          <div className="sections-list">
            {templates[activeTemplate]?.sections?.map((section, index) => (
              <div key={section.id} className="section-item">
                <div className="section-handle">
                  <i className="fas fa-grip-vertical"></i>
                </div>
                <div className="section-icon">
                  <i className={`fas fa-${section.icon}`}></i>
                </div>
                <div className="section-details">
                  <input 
                    type="text" 
                    value={section.name}
                    onChange={(e) => updateSectionName(section.id, e.target.value)}
                    className="section-name-input"
                  />
                  <div className="section-meta">
                    <select 
                      value={section.icon}
                      onChange={(e) => updateSectionIcon(section.id, e.target.value)}
                      className="icon-select"
                    >
                      <option value="th-large">Dashboard</option>
                      <option value="briefcase">Briefcase</option>
                      <option value="users">Users</option>
                      <option value="search">Search</option>
                      <option value="file-alt">File</option>
                      <option value="bookmark">Bookmark</option>
                      <option value="calendar">Calendar</option>
                      <option value="envelope">Envelope</option>
                      <option value="cog">Settings</option>
                      <option value="star">Star</option>
                      <option value="graduation-cap">Graduation</option>
                      <option value="book">Book</option>
                      <option value="user">User</option>
                      <option value="chart-bar">Chart</option>
                    </select>
                  </div>
                </div>
                <div className="section-actions">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={section.enabled}
                      onChange={() => toggleSection(section.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <button 
                    className="btn-icon btn-danger" 
                    onClick={() => deleteSection(section.id)}
                    title="Delete Section"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {templates[activeTemplate]?.sections?.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <p>No sections yet. Click "Add Section" to get started.</p>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {previewMode && (
          <div className="editor-preview">
            <div className="preview-header">
              <h3>Live Preview</h3>
              <button className="btn btn-sm" onClick={() => setPreviewMode(false)}>
                Close Preview
              </button>
            </div>
            <div className="preview-content">
              <iframe 
                srcDoc={generatePreviewHTML()}
                style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function generatePreviewHTML() {
    const template = templates[activeTemplate];
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .sidebar { width: 260px; height: 100vh; background: ${template.theme?.gradient || '#333'}; color: white; padding: 20px; }
          .nav-item { padding: 10px; margin: 5px 0; cursor: pointer; border-radius: 6px; }
          .nav-item:hover { background: rgba(255,255,255,0.1); }
        </style>
      </head>
      <body>
        <div class="sidebar">
          <h2>${template.name}</h2>
          ${template.sections?.filter(s => s.enabled).map(section => `
            <div class="nav-item">
              <i class="fas fa-${section.icon}"></i> ${section.name}
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  }
};

export default DashboardTemplateEditor;

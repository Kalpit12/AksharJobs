import React, { useState, useEffect } from 'react';
import '../styles/TeamCollaboration.css';

const TeamCollaboration = ({ candidateId, jobId, onClose }) => {
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium'
  });
  const [teamMembers] = useState([
    { id: 1, name: 'Sarah Johnson', role: 'Senior Recruiter', avatar: '👩‍💼' },
    { id: 2, name: 'Mike Chen', role: 'Hiring Manager', avatar: '👨‍💻' },
    { id: 3, name: 'Lisa Rodriguez', role: 'HR Coordinator', avatar: '👩‍💻' },
    { id: 4, name: 'David Kim', role: 'Technical Lead', avatar: '👨‍💼' }
  ]);

  useEffect(() => {
    loadCollaborationData();
  }, [candidateId, jobId]);

  const loadCollaborationData = async () => {
    try {
      // TODO: API calls to load notes and tasks
      // const notesResponse = await axios.get(`/api/collaboration/notes/${candidateId}/${jobId}`);
      // const tasksResponse = await axios.get(`/api/collaboration/tasks/${candidateId}/${jobId}`);
      // setNotes(notesResponse.data);
      // setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error loading collaboration data:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const note = {
      id: Date.now(),
      content: newNote,
      author: 'Current User', // TODO: Get from auth context
      timestamp: new Date().toISOString(),
      type: 'general'
    };

    try {
      // TODO: API call to save note
      // await axios.post('/api/collaboration/notes', { ...note, candidateId, jobId });
      setNotes(prev => [note, ...prev]);
      setNewNote('');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.assignee) return;

    const task = {
      id: Date.now(),
      ...newTask,
      status: 'pending',
      createdBy: 'Current User', // TODO: Get from auth context
      createdAt: new Date().toISOString(),
      candidateId,
      jobId
    };

    try {
      // TODO: API call to save task
      // await axios.post('/api/collaboration/tasks', task);
      setTasks(prev => [task, ...prev]);
      setNewTask({
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      // TODO: API call to update task status
      // await axios.put(`/api/collaboration/tasks/${taskId}`, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in-progress': return '#007bff';
      case 'pending': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="team-collaboration-overlay">
      <div className="team-collaboration-modal">
        <div className="collaboration-header">
          <h2>Team Collaboration</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="collaboration-tabs">
          <button 
            className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📝 Notes & Comments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            ✅ Tasks & Assignments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            👥 Team Members
          </button>
        </div>

        <div className="collaboration-content">
          {activeTab === 'notes' && (
            <div className="notes-section">
              <div className="add-note-section">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note or comment about this candidate..."
                  rows={3}
                />
                <button className="btn-primary" onClick={handleAddNote}>
                  Add Note
                </button>
              </div>

              <div className="notes-list">
                {notes.length === 0 ? (
                  <div className="empty-state">
                    <p>No notes yet. Be the first to add one!</p>
                  </div>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="note-item">
                      <div className="note-header">
                        <span className="note-author">{note.author}</span>
                        <span className="note-time">{formatDate(note.timestamp)}</span>
                      </div>
                      <div className="note-content">{note.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="tasks-section">
              <div className="add-task-section">
                <div className="task-form">
                  <div className="form-row">
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Task title"
                      className="task-input"
                    />
                    <select
                      value={newTask.assignee}
                      onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                      className="task-select"
                    >
                      <option value="">Select Assignee</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Task description"
                      rows={2}
                      className="task-textarea"
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="task-date"
                    />
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="task-priority"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <button className="btn-primary" onClick={handleAddTask}>
                    Create Task
                  </button>
                </div>
              </div>

              <div className="tasks-list">
                {tasks.length === 0 ? (
                  <div className="empty-state">
                    <p>No tasks assigned yet. Create the first one!</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className="task-item">
                      <div className="task-header">
                        <h4 className="task-title">{task.title}</h4>
                        <div className="task-meta">
                          <span 
                            className="priority-badge"
                            style={{ backgroundColor: getPriorityColor(task.priority) }}
                          >
                            {task.priority}
                          </span>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(task.status) }}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                      <div className="task-details">
                        <p className="task-description">{task.description}</p>
                        <div className="task-info">
                          <span className="task-assignee">👤 {task.assignee}</span>
                          <span className="task-due">📅 {formatDate(task.dueDate)}</span>
                          <span className="task-created">Created by {task.createdBy}</span>
                        </div>
                      </div>
                      <div className="task-actions">
                        <select
                          value={task.status}
                          onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="team-section">
              <div className="team-members-grid">
                {teamMembers.map(member => (
                  <div key={member.id} className="team-member-card">
                    <div className="member-avatar">{member.avatar}</div>
                    <div className="member-info">
                      <h4 className="member-name">{member.name}</h4>
                      <p className="member-role">{member.role}</p>
                    </div>
                    <div className="member-actions">
                      <button className="btn-secondary btn-sm">Message</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCollaboration;

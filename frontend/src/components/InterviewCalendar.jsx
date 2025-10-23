import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';
import ThemedLoadingSpinner from './ThemedLoadingSpinner';
import '../styles/InterviewCalendar.css';

const InterviewCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    applicant_id: '',
    job_id: '',
    interview_date: '',
    interview_time: '',
    interview_mode: 'online',
    interview_link: '',
    interview_location: '',
    interview_notes: ''
  });

  useEffect(() => {
    fetchInterviews();
    fetchApplications();
  }, []);

  useEffect(() => {
    // Filter interviews for the current month
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const filtered = interviews.filter(interview => {
      const interviewDate = new Date(interview.interview_date);
      return interviewDate >= monthStart && interviewDate <= monthEnd;
    });
    
    setFilteredInterviews(filtered);
  }, [currentDate, interviews]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/applications/recruiter/interviews'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews || []);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/recruiters/applications'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter applications that are shortlisted or reviewed (ready for interview)
        const eligibleApps = data.filter(app => 
          ['shortlisted', 'reviewed', 'pending'].includes(app.status)
        );
        setApplications(eligibleApps);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/applications/schedule-interview'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(scheduleForm)
      });

      if (response.ok) {
        alert('Interview scheduled successfully!');
        setShowScheduleModal(false);
        resetScheduleForm();
        fetchInterviews();
        fetchApplications();
      } else {
        const error = await response.json();
        alert(`Failed to schedule interview: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Error scheduling interview. Please try again.');
    }
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      applicant_id: '',
      job_id: '',
      interview_date: '',
      interview_time: '',
      interview_mode: 'online',
      interview_link: '',
      interview_location: '',
      interview_notes: ''
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getInterviewsForDate = (day) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
    
    return filteredInterviews.filter(interview => 
      interview.interview_date.split('T')[0] === dateStr
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time not set';
    return timeString;
  };

  const getUpcomingInterviews = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return interviews
      .filter(interview => new Date(interview.interview_date) >= today)
      .sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date))
      .slice(0, 5);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
    const dayInterviews = getInterviewsForDate(day);
    
    if (dayInterviews.length === 1) {
      setSelectedInterview(dayInterviews[0]);
      setShowInterviewModal(true);
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Week day headers
    const headers = weekDays.map(day => (
      <div key={day} className="calendar-header-day">
        {day}
      </div>
    ));

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      currentDay.setHours(0, 0, 0, 0);
      
      const dayInterviews = getInterviewsForDate(day);
      const isToday = currentDay.getTime() === today.getTime();
      const isPast = currentDay < today;
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${dayInterviews.length > 0 ? 'has-interviews' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{day}</div>
          {dayInterviews.length > 0 && (
            <div className="day-interviews">
              {dayInterviews.slice(0, 3).map((interview, idx) => (
                <div
                  key={idx}
                  className="interview-dot"
                  title={`${interview.applicant_name} - ${interview.job_title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInterview(interview);
                    setShowInterviewModal(true);
                  }}
                >
                  <span className="interview-dot-text">
                    {interview.interview_time || '•'}
                  </span>
                </div>
              ))}
              {dayInterviews.length > 3 && (
                <div className="more-interviews">+{dayInterviews.length - 3}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="calendar-grid">
        {headers}
        {days}
      </div>
    );
  };

  if (loading) {
    return (
      <ThemedLoadingSpinner 
        theme="recruiter"
        size="large"
        text="Loading interview calendar..."
        fullScreen={false}
      />
    );
  }

  return (
    <div className="interview-calendar-container">
      <div className="calendar-header-section">
        <div className="calendar-title-section">
          <h1>
            <i className="fas fa-calendar-alt"></i>
            Interview Calendar
          </h1>
          <p className="calendar-subtitle">
            Manage and schedule interviews with candidates
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowScheduleModal(true)}
        >
          <i className="fas fa-plus"></i> Schedule Interview
        </button>
      </div>

      <div className="calendar-layout">
        <div className="calendar-main">
          <div className="calendar-controls">
            <button 
              className="btn-icon"
              onClick={() => navigateMonth(-1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <h2 className="calendar-month-title">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h2>
            
            <button 
              className="btn-icon"
              onClick={() => navigateMonth(1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={goToToday}
            >
              Today
            </button>
          </div>

          <div className="calendar-wrapper">
            {renderCalendar()}
          </div>
        </div>

        <div className="calendar-sidebar">
          <div className="card">
            <div className="card-header">
              <h3>
                <i className="fas fa-clock"></i>
                Upcoming Interviews
              </h3>
            </div>
            <div className="upcoming-interviews-list">
              {getUpcomingInterviews().length > 0 ? (
                getUpcomingInterviews().map((interview, idx) => (
                  <div 
                    key={idx}
                    className="upcoming-interview-item"
                    onClick={() => {
                      setSelectedInterview(interview);
                      setShowInterviewModal(true);
                    }}
                  >
                    <div className="interview-date-badge">
                      <div className="date-day">
                        {new Date(interview.interview_date).getDate()}
                      </div>
                      <div className="date-month">
                        {new Date(interview.interview_date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                    <div className="interview-details">
                      <div className="interview-candidate">
                        {interview.applicant_name}
                      </div>
                      <div className="interview-job-title">
                        {interview.job_title}
                      </div>
                      <div className="interview-time-mode">
                        <i className="fas fa-clock"></i>
                        {formatTime(interview.interview_time)}
                        <span className="interview-mode-badge">
                          {interview.interview_mode}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-small">
                  <i className="fas fa-calendar-check"></i>
                  <p>No upcoming interviews</p>
                  <small>Schedule interviews to see them here</small>
                </div>
              )}
            </div>
          </div>

          <div className="card calendar-stats">
            <div className="card-header">
              <h3>
                <i className="fas fa-chart-bar"></i>
                Statistics
              </h3>
            </div>
            <div className="stats-list">
              <div className="stat-item">
                <div className="stat-label">Total Scheduled</div>
                <div className="stat-value">{interviews.length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">This Month</div>
                <div className="stat-value">{filteredInterviews.length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Upcoming</div>
                <div className="stat-value">{getUpcomingInterviews().length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Details Modal */}
      {showInterviewModal && selectedInterview && (
        <div className="modal-overlay" onClick={() => setShowInterviewModal(false)}>
          <div className="modal-content interview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-calendar-check"></i>
                Interview Details
              </h2>
              <button 
                className="btn-close"
                onClick={() => setShowInterviewModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="interview-info-section">
                <h3>Candidate Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name</label>
                    <p>{selectedInterview.applicant_name}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{selectedInterview.applicant_email}</p>
                  </div>
                  {selectedInterview.applicant_phone && (
                    <div className="info-item">
                      <label>Phone</label>
                      <p>{selectedInterview.applicant_phone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="interview-info-section">
                <h3>Job Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Position</label>
                    <p>{selectedInterview.job_title}</p>
                  </div>
                  <div className="info-item">
                    <label>Company</label>
                    <p>{selectedInterview.company_name}</p>
                  </div>
                </div>
              </div>

              <div className="interview-info-section">
                <h3>Interview Schedule</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Date</label>
                    <p>{formatDate(selectedInterview.interview_date)}</p>
                  </div>
                  <div className="info-item">
                    <label>Time</label>
                    <p>{formatTime(selectedInterview.interview_time)}</p>
                  </div>
                  <div className="info-item">
                    <label>Mode</label>
                    <p className="interview-mode-badge">
                      {selectedInterview.interview_mode}
                    </p>
                  </div>
                  {selectedInterview.interview_link && (
                    <div className="info-item full-width">
                      <label>Meeting Link</label>
                      <a 
                        href={selectedInterview.interview_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interview-link"
                      >
                        {selectedInterview.interview_link}
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                  )}
                  {selectedInterview.interview_location && (
                    <div className="info-item full-width">
                      <label>Location</label>
                      <p>{selectedInterview.interview_location}</p>
                    </div>
                  )}
                  {selectedInterview.interview_notes && (
                    <div className="info-item full-width">
                      <label>Notes</label>
                      <p>{selectedInterview.interview_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowInterviewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-calendar-plus"></i>
                Schedule Interview
              </h2>
              <button 
                className="btn-close"
                onClick={() => setShowScheduleModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleScheduleInterview}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Select Application *</label>
                  <select
                    value={scheduleForm.applicant_id ? `${scheduleForm.applicant_id}|${scheduleForm.job_id}` : ''}
                    onChange={(e) => {
                      const [applicant_id, job_id] = e.target.value.split('|');
                      setScheduleForm({
                        ...scheduleForm,
                        applicant_id,
                        job_id
                      });
                    }}
                    required
                  >
                    <option value="">Choose an application...</option>
                    {applications.map((app, idx) => (
                      <option 
                        key={idx} 
                        value={`${app.applicant_id}|${app.job_id}`}
                      >
                        {app.candidate_name || app.applicant_name} - {app.job_title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Interview Date *</label>
                    <input
                      type="date"
                      value={scheduleForm.interview_date}
                      onChange={(e) => setScheduleForm({
                        ...scheduleForm,
                        interview_date: e.target.value
                      })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Interview Time *</label>
                    <input
                      type="time"
                      value={scheduleForm.interview_time}
                      onChange={(e) => setScheduleForm({
                        ...scheduleForm,
                        interview_time: e.target.value
                      })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Interview Mode *</label>
                  <select
                    value={scheduleForm.interview_mode}
                    onChange={(e) => setScheduleForm({
                      ...scheduleForm,
                      interview_mode: e.target.value
                    })}
                    required
                  >
                    <option value="online">Online</option>
                    <option value="in-person">In-Person</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>

                {scheduleForm.interview_mode === 'online' && (
                  <div className="form-group">
                    <label>Meeting Link</label>
                    <input
                      type="url"
                      value={scheduleForm.interview_link}
                      onChange={(e) => setScheduleForm({
                        ...scheduleForm,
                        interview_link: e.target.value
                      })}
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                )}

                {scheduleForm.interview_mode === 'in-person' && (
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={scheduleForm.interview_location}
                      onChange={(e) => setScheduleForm({
                        ...scheduleForm,
                        interview_location: e.target.value
                      })}
                      placeholder="Office address..."
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={scheduleForm.interview_notes}
                    onChange={(e) => setScheduleForm({
                      ...scheduleForm,
                      interview_notes: e.target.value
                    })}
                    placeholder="Additional interview details or instructions..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowScheduleModal(false);
                    resetScheduleForm();
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  <i className="fas fa-calendar-check"></i>
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewCalendar;


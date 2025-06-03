import React, { useState } from 'react';
import Layout from "../pages/Layout";
import '../styles/CalendarPageStyle.css';

const typeIcon = {
  task: "📝",
  meeting: "👥",
  reminder: "⏰",
};

const dummytasks = [
  { id: 1, date: new Date().toISOString(), type: 'task', content: 'Submit project update' },
  { id: 2, date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), type: 'meeting', content: 'Team sync-up' },
  { id: 3, date: new Date().toISOString(), type: 'reminder', content: 'Call with client' },
];

function getMonthDays(year, month) {
  const result = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  for(let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    result.push(new Date(d));
  }
  return result;
}

export default function CalendarPage() {
  const [calendarView, setCalendarView] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getWeekDates = () => {
    const today = new Date(selectedDate);
    const week = [];
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push(new Date(d));
    }
    return week;
  };

  // Responsive calendar grid for monthly view (no external Calendar)
  const renderMonthGrid = () => {
    const now = selectedDate;
    const monthDays = getMonthDays(now.getFullYear(), now.getMonth());
    const firstDay = monthDays[0].getDay();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    cells.push(...monthDays);
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div className="calendar-month-table">
        <div className="calendar-month-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w, i) => (
            <div key={i} className="calendar-month-cell calendar-month-week">{w}</div>
          ))}
        </div>
        <div className="calendar-month-days">
          {cells.map((cell, idx) => {
            if (!cell) return <div key={idx} className="calendar-month-cell empty" />;
            const hastasks = dummytasks.filter(
              task => new Date(task.date).toDateString() === cell.toDateString()
            );
            const isToday = cell.toDateString() === new Date().toDateString();
            const isSelected = cell.toDateString() === selectedDate.toDateString();
            return (
              <div
                key={idx}
                className={
                  "calendar-month-cell" +
                  (isToday ? " today" : "") +
                  (isSelected ? " selected" : "")
                }
                onClick={() => setSelectedDate(new Date(cell))}
              >
                <span className="calendar-month-date">{cell.getDate()}</span>
                <div>
                  {hastasks.map((task, i) => (
                    <span key={i} className={`dot ${task.type}`}></span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="calendar-main">
        <div className="calendar-topbar">
          <div className="calendar-title">📅 Calendar</div>
          <div className="calendar-controls">
            <label htmlFor="view-select">View</label>
            <select id="view-select" value={calendarView} onChange={e => setCalendarView(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {calendarView === 'monthly' && (
          <div className="calendar-monthly-view">
            {renderMonthGrid()}
            <div className="calendar-events-list">
              <div className="calendar-event-date">
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              {dummytasks.filter(task => new Date(task.date).toDateString() === selectedDate.toDateString()).length === 0 && (
                <div className="calendar-no-data">No events for this day.</div>
              )}
              {dummytasks
                .filter(task => new Date(task.date).toDateString() === selectedDate.toDateString())
                .map(task => (
                  <div key={task.id} className={`calendar-task ${task.type}`}>
                    <span className="calendar-task-type">{typeIcon[task.type]}</span>
                    <span className="calendar-task-content">{task.content}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

{calendarView === 'weekly' && (
  <div className="calendar-weekly-view">
    <div className="calendar-week-body">
      {getWeekDates().map((day, idx) => (
        <div key={idx} className="calendar-week-row">
          <div className="calendar-week-row-date">
            {day.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="calendar-week-row-tasks">
            {dummytasks
              .filter(task => new Date(task.date).toDateString() === day.toDateString())
              .map(task => (
                <div key={task.id} className={`calendar-week-row-task ${task.type}`}>
                  <span className="calendar-task-type">{typeIcon[task.type]}</span>
                  <span className="calendar-task-content">{task.content}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {calendarView === 'daily' && (
          <div className="calendar-daily-view">
            <div className="calendar-event-date">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </div>
            {dummytasks.filter(task => new Date(task.date).toDateString() === new Date().toDateString()).length === 0 && (
              <div className="calendar-no-data">No events for today.</div>
            )}
            {dummytasks
              .filter(task => new Date(task.date).toDateString() === new Date().toDateString())
              .map(task => (
                <div key={task.id} className={`calendar-task ${task.type}`}>
                  <span className="calendar-task-type">{typeIcon[task.type]}</span>
                  <span className="calendar-task-content">{task.content}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
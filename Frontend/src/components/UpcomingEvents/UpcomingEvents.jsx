import React, { useState, useEffect } from "react";
import "./UpcomingEvents.css"; 

const eventsData = [
    { id: 1, title: "Math Class", date: "2025-03-25", time: "10:00 AM", type: "Class" },
    { id: 2, title: "Project Submission", date: "2025-03-27", time: "11:59 PM", type: "Deadline" },
    { id: 3, title: "Teacher-Student Meeting", date: "2025-03-28", time: "02:30 PM", type: "Meeting" },
    { id: 4, title: "AI Workshop", date: "2025-04-01", time: "04:00 PM", type: "Workshop" }
];

const UpcomingEvents = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        const today = new Date();
        const filteredEvents = eventsData.filter(event => new Date(event.date) >= today);
        setUpcomingEvents(filteredEvents);
    }, []);

    const getTagColor = (type) => {
        switch (type) {
            case "Class": return "blue";
            case "Deadline": return "red";
            case "Meeting": return "green";
            case "Workshop": return "purple";
            default: return "gray";
        }
    };

    return (
        <div className="upcoming-events">
            <h3>📅 Upcoming Schedule</h3>
            <ul>
                {upcomingEvents.length > 0 ? (
                    upcomingEvents.map(event => (
                        <li key={event.id}>
                            <div className="event-info">
                                <span className="event-title">{event.title}</span>
                                <span className="event-time">{event.date} at {event.time}</span>
                            </div>
                            <span className={`event-tag ${getTagColor(event.type)}`}>{event.type}</span>
                        </li>
                    ))
                ) : (
                    <p>No upcoming events 🎉</p>
                )}
            </ul>
        </div>
    );
};

export default UpcomingEvents;

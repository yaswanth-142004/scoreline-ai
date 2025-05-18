import React, { useState, useEffect } from "react";
import "./StudentTeacherQuotes.css";

const quotes = [
    { id: 1, quote: "A good teacher can inspire hope, ignite the imagination, and instill a love of learning.", author: "Brad Henry" },
    { id: 2, quote: "Teachers affect eternity; no one can tell where their influence stops.", author: "Henry Adams" },
    { id: 3, quote: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
    { id: 4, quote: "Teaching is the greatest act of optimism.", author: "Colleen Wilcox" },
    { id: 5, quote: "The best teachers are those who show you where to look, but don’t tell you what to see.", author: "Alexandra K. Trenfor" },
];

const StudentTeacherQuotes = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slide, setSlide] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlide(false); // Trigger exit animation
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
                setSlide(true); // Trigger enter animation
            }, 500);
        }, 4000); // Change quote every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="quote-slider-container">
            <div className={`quote-card ${slide ? "slide-in" : "slide-out"}`}>
                <p>"{quotes[currentIndex].quote}"</p>
                <span>- {quotes[currentIndex].author}</span>
            </div>
        </div>
    );
};

export default StudentTeacherQuotes;

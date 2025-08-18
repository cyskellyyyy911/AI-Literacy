# Project H-AI-R — Putting the AI in HR

A modern, interactive website showcasing the "Project H-AI-R" model for AI transformation in Human Resources.

## Overview test

This website visualizes the journey from Digital HR to AI Native HR, highlighting the progression through AI Literacy and the transformation of key HR pillars.

## Features   

### 🎯 Project H-AI-R Model
- **Current Stage**: Digital HR (where we are now)
- **Next Goal**: AI Literacy (building AI understanding)
- **Ultimate Vision**: AI Native HR (fully AI-driven processes)
- **Output Metrics**: Efficiency and Effectiveness visualization

### 🏛️ HR Transformation Pillars 1 more
1. **Learning & Development** - AI-powered personalized learning
2. **Recruitment** - Intelligent candidate matching
3. **Engagement** - Real-time sentiment analysis
4. **Performance Appraisal** - Continuous AI-driven insights

### ✨ Interactive Features
- Hover effects on all interactive elements
- Animated progress bars showing AI integration levels
- Timeline visualization of transformation stages
- Clickable HR pillars with detailed information
- Responsive design for all devices
- Subtle particle background animation

## File Structure (selected)

```
AI Literacy/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling with animations
├── script.js           # Interactive JavaScript features
└── README.md           # This documentation
```

## How to Use

1. Open `index.html` in any modern web browser
2. Explore the interactive elements:
   - Hover over stages in the Project Rectangle model
   - Click on HR pillars for detailed information
   - Scroll to see animated timeline and progress bars

## Design Highlights

- **Modern Gradient Background**: Purple to blue gradient for professional appeal
- **Card-Based Layout**: Clean, modern design with rounded corners and shadows
- **Color-Coded Stages**: Different colors for current, next, and future stages
- **Progress Visualization**: Animated bars showing current AI integration levels
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Technology Stack

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **Vanilla JavaScript**: Interactive features and animations
- **Google Fonts**: Inter font family for modern typography

## Browser Compatibility

Works in all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

- Real-time data integration for progress tracking
- User authentication for personalized views
- Advanced analytics dashboard
- Mobile app version

## Backend API (Node.js + MySQL)

The AI Impact Tracker uses a Node.js API backed by MySQL.

Setup:

1. Install Node.js 18+.
2. Create `config.js` in the project root with your DSN:

```
module.exports = {
  MYSQL_DSN: process.env.MYSQL_DSN || 'mysql://user:pass@host:3306/dbname'
};
```

3. In the project root, run:

```
npm install
npm start
```

This starts the API at `http://localhost:3000`.

Frontend integration:

- The tracker loads from `/api/entries` (no localStorage fallback).
- Serve the frontend from the same origin, or configure a proxy for `/api/*` to `http://localhost:3000`.

Deploying the API:

- Host on any Node platform; set `MYSQL_DSN` as an environment variable.

---

*Built with ❤️ for the AI transformation journey in HR*
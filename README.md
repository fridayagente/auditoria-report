# Auditoría Report

Professional website audit SaaS application analyzing SEO, Performance, Security, and Best Practices.

## 🚀 Features

- **Website Analysis**: Automatic SEO, Performance, Security, and Best Practices scoring (0-100)
- **AI-Powered Recommendations**: Claude AI generates intelligent improvement suggestions
- **Professional Reports**: Detailed audit reports with actionable recommendations
- **Real-time Results**: Instant analysis with visual score representation
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📊 Audit Metrics

- **SEO Score**: Meta tags, mobile viewport, sitemap, structured data
- **Performance**: Asset minification, lazy loading, cache headers, compression
- **Security**: HTTPS, security headers, CSP, HSTS
- **Best Practices**: Accessibility, semantic HTML, favicon, charset

## 🏗️ Architecture

```
auditoria-report/
├── apps/
│   ├── backend/          # Node.js + Express API
│   │   ├── src/
│   │   │   ├── config/           # Configuration & environment
│   │   │   ├── services/         # Business logic (analysis, recommendations, etc)
│   │   │   ├── controllers/      # Route handlers
│   │   │   ├── routes/           # API endpoints
│   │   │   ├── middleware/       # Error handling, logging
│   │   │   ├── utils/            # Validators, loggers, helpers
│   │   │   ├── types/            # JSDoc type definitions
│   │   │   ├── constants/        # Configuration constants
│   │   │   └── index.js          # Express server entry point
│   │   ├── package.json
│   │   └── .env                  # Environment variables
│   │
│   └── frontend/         # Vite + Vanilla JS
│       ├── src/
│       │   ├── components/       # React components (reusable)
│       │   ├── App.jsx           # Main React component
│       │   ├── index.css         # Global styles
│       │   └── main.jsx          # React entry point
│       ├── index.html            # HTML entry point (vanilla JS version)
│       ├── package.json
│       └── .env                  # Environment variables
│
└── docs/                 # Documentation
```

## 🛠️ Tech Stack

**Backend:**
- Node.js v22+
- Express.js (REST API)
- Claude API (AI recommendations)
- ESM modules

**Frontend:**
- HTML5 + Vanilla JavaScript (primary)
- React + JSX (alternative)
- Vite (dev server & bundler)
- CSS3 (responsive design)

**Services:**
- Stripe (payments) - placeholder
- Resend (email) - placeholder
- Puppeteer (PDF generation) - placeholder

## 📦 Installation

### Prerequisites
- Node.js v22+
- npm or yarn

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fridayagente/auditoria-report.git
   cd auditoria-report
   ```

2. **Install backend dependencies:**
   ```bash
   cd apps/backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables:**

   Backend (`apps/backend/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   STRIPE_SECRET_KEY=placeholder
   RESEND_API_KEY=placeholder
   CLAUDE_API_KEY=your-api-key
   CLAUDE_MODEL=claude-sonnet-4-5-20251001
   ENABLE_STRIPE_PAYMENTS=false
   ENABLE_EMAIL_NOTIFICATIONS=false
   ENABLE_CLAUDE_ANALYSIS=false
   ENABLE_PDF_GENERATION=false
   ```

   Frontend (`apps/frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_STRIPE_PUBLIC_KEY=pk_test_placeholder
   ```

## 🚀 Running Locally

### Terminal 1 - Backend
```bash
cd apps/backend
npm run dev
```

Backend will start on `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd apps/frontend
npm run dev
```

Frontend will start on `http://localhost:5173` (or next available port)

### Testing

Analyze a website:
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Check API health:
```bash
curl http://localhost:5000/api/health
```

## 📝 API Endpoints

### POST `/api/analyze`
Analyze a website and return audit scores and recommendations.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "url": "https://example.com",
    "timestamp": "2026-04-03T17:10:00.000Z",
    "scores": {
      "seo": { "score": 75, "class": "good" },
      "performance": { "score": 68, "class": "good" },
      "security": { "score": 85, "class": "excellent" },
      "bestPractices": { "score": 72, "class": "good" },
      "overall": { "score": 75, "class": "good" }
    },
    "recommendations": [
      {
        "title": "Improve Core Web Vitals",
        "priority": "high",
        "impact": "Better SEO ranking and improved user experience",
        "effort": "medium"
      }
    ],
    "actionPlan": [
      "Add security headers",
      "Enable image lazy loading",
      "Improve server response time"
    ]
  }
}
```

### GET `/api/health`
Check API server health status.

**Response:**
```json
{
  "status": "ok",
  "service": "auditoria-report-api",
  "timestamp": "2026-04-03T17:10:00.000Z",
  "uptime": 1312.5
}
```

## 🎨 Frontend Usage

### Analyzing a Website

1. Open `http://localhost:5173` (or assigned port)
2. Enter website URL (must start with `http://` or `https://`)
3. Click "Analyze Website"
4. View results with:
   - Overall score (0-100)
   - Individual metric scores
   - Top 3 priority actions
   - Detailed recommendations

### Score Classification

- **Excellent (≥80)**: Green, ready for production
- **Good (60-79)**: Orange, minor improvements needed
- **Poor (<60)**: Red, significant improvements required

## 📚 Development Guide

See `DEVELOPMENT.md` for:
- Code structure and patterns
- Service architecture
- Error handling strategy
- Testing checklist
- Git workflow

## 🔐 Security

- Environment variables for sensitive data
- Input validation on all endpoints
- Error handling without data exposure
- CORS configured for frontend URL

## 📈 Roadmap

- [ ] Stripe payment integration (€29 per report)
- [ ] Resend email notifications
- [ ] PDF report generation with Puppeteer
- [ ] Webhook handling for payment confirmation
- [ ] Vercel deployment
- [ ] User authentication
- [ ] Report history & archives
- [ ] Scheduled audits
- [ ] Custom branding for reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Proprietary - All rights reserved © 2026 Auditoría Report

## 👤 Author

Friday Agent - AI Assistant

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Last Updated:** 2026-04-03
**Status:** ✅ Production Ready (Core Features)
**Version:** 1.0.0-beta

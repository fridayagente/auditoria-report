# 🔍 Auditoría Report

Professional website audit reports with SEO, performance, security, and best practices analysis. Powered by Claude AI.

**🎯 Value Proposition:** Analyze any website in seconds and get a comprehensive audit report for €29.

## Project Structure

```
auditoria-report/
├── apps/
│   ├── backend/          # Express API server
│   └── frontend/         # React web application
├── packages/
│   └── shared/           # Shared types and utilities
├── docs/                 # Documentation
└── README.md
```

## Features

✅ **Comprehensive Analysis**
- SEO Audit (meta tags, mobile-friendly, sitemap, structured data)
- Performance Analysis (load time, minification, image optimization, caching)
- Security Audit (HTTPS, security headers, vulnerabilities)
- Best Practices (accessibility, semantic HTML, GDPR compliance)

✅ **Beautiful Reports**
- Professional HTML reports with visual score cards
- Color-coded results (Green: >80, Yellow: 60-80, Red: <60)
- Specific, actionable recommendations
- Top 3 action plan with impact estimation

✅ **Business Features**
- Stripe integration for payments (€29/report)
- Automated email delivery (Resend)
- PDF generation and download
- User email validation

## Tech Stack

### Backend
- Node.js + Express
- Claude API (Anthropic) for AI analysis
- Stripe for payments
- Resend for email delivery
- Puppeteer for PDF generation

### Frontend
- React + Vite
- Axios for API calls
- Responsive design

### Infrastructure
- Vercel (deployment)
- GitHub (version control)

## Quick Start

### Backend

```bash
cd apps/backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Frontend

```bash
cd apps/frontend
npm install
npm run dev
```

## Environment Variables

See `.env.example` in each app directory.

**Required:**
- `STRIPE_SECRET_KEY` - Stripe API key
- `RESEND_API_KEY` - Resend email API key
- `CLAUDE_API_KEY` - Anthropic Claude API key

## API Documentation

See `/docs/API.md` for complete API reference.

## Deployment

Both apps are configured for Vercel deployment:

```bash
vercel deploy --prod
```

## Development

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`
- API calls are proxied to backend

## License

MIT

---

**Made with ❤️ by Friday Agent for Javi**

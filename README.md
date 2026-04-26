Financial Data Explorer (SEC + Gemini AI)
A modern, high-performance financial dashboard built with Next.js 14, Redux Toolkit, and Google Gemini 3.1. This platform allows users to explore audited SEC financial data, visualize growth trends through interactive charts, and receive instant AI-driven executive summaries.

🚀 Quick Start
Clone & Install

Bash
git clone https://github.com/your-username/financial-explorer.git
cd financial-explorer
npm install
Environment Setup
Create a .env.local file in the root directory:

Code snippet
NEXT_PUBLIC_SEC_USER_AGENT=Your Name (your-email@domain.com)
NEXT_PUBLIC_GEMINI_API_KEY=your_google_ai_studio_key
SEC_API_MAPPING_KEY=your_sec_api_io_key
Run Development Server

Bash
npm run dev
🛠️ Tech Choices & Architecture
Framework: Next.js 14 (App Router) for Server-Side Rendering (SSR) and secure API routes.

State Management: Redux Toolkit (RTK) for maintaining a single source of truth for financial facts across the dashboard.

AI Integration: Google Gemini 3.1 Flash via Server Actions, providing real-time financial sentiment and trend analysis.

Data Source: Direct integration with the SEC EDGAR API and sec-api.io for CIK/Ticker mapping.

Visualization: Recharts for responsive, high-fidelity financial trend lines.

The "Fuzzy-Tag" Strategy
A core technical highlight of this project is the robust data processor. Since companies often use different GAAP taxonomies (e.g., Revenues vs SalesRevenueNet), I implemented a mapping utility that scans for multiple common tags to ensure charts never appear empty for Mega-Cap companies like Apple or Amazon.

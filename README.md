# 🌿 Ingwan' Elihle — Health & Safety Business Website

**A full-stack website concept for a future occupational health and safety consultancy.**

> **Project status:** In development · Business concept (not yet launched)

## About the project

Ingwan' Elihle began as a business idea while I was exploring a career in occupational health and safety, before joining WeThinkCode_. I used the concept to practise building a business-facing website and a supporting backend.

The project is a portfolio prototype, not a live consultancy or a production-ready service.

## Features implemented in code

- Responsive website layout with mobile navigation
- Company, services, project experience, and contact sections
- Testimonial slider, scrolling effects, and client-side form validation
- Express API for submitting and managing enquiries
- PostgreSQL schema for storing enquiries
- Email confirmation and administrator notification functions using Nodemailer
- API health-check route, CORS configuration, security headers, and request rate limiting

**Note:** Some integrations and admin security controls are still incomplete; the features above have not all been verified end to end.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Database | PostgreSQL (`pg`) |
| Email | Nodemailer |
| Security middleware | Helmet, CORS, express-rate-limit |

## Repository structure

```text
ingwan-elihle/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── images/
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── database.sql
│   ├── email.js
│   ├── controllers/
│   ├── routes/
│   └── package.json
└── assets/
```

## Running locally

**Prerequisites:** Node.js, npm, and PostgreSQL.

1. Clone the repository:

   ```bash
   git clone https://github.com/nthabies-25/ingwan-elihle.git
   cd ingwan-elihle
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Create a local `backend/.env` from a **placeholder-only** `.env.example`. Configure the PostgreSQL connection and email settings. Never commit actual secrets.
4. Set up PostgreSQL using `backend/database.sql` (review and remove the placeholder admin-user insert before use).
5. Correct the controller's database and email import paths before running the backend. Then start it:

   ```bash
   npm start
   ```

6. Serve the `frontend/` directory with a local development server (for example, on port 5500). The frontend currently expects the API at `http://localhost:3001/api`.

The backend provides `GET /api/health` and enquiry routes under `/api/enquiries`. **Do not expose the administrative enquiry routes publicly until authentication and authorisation are implemented.**

## Next steps

- Fix backend module imports and align the database schema with controller queries
- Implement authentication and authorisation for admin endpoints
- Add automated tests for enquiry validation and API responses
- Add screenshots and document the working local setup
- Review frontend responsiveness and accessibility
- Deploy a safe demonstration once integrations have been tested

## Why I built it

The project connects an entrepreneurial idea with my transition into software development. It gives me a practical way to explore how a website, API, database, and email service fit together to support a business workflow.

## Developer

**Nthabi Moloi** · [GitHub](https://github.com/nthabies-25)

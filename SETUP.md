# Setup Guide - Study Portfolio Project

This guide helps you set up the Study Portfolio project on a new computer and continue development from where it was left off.

## 🚀 Quick Start for New Computer

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Text Editor/IDE** - VS Code, WebStorm, or your preferred editor

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/LeeJH6/study-project.git

# Navigate to project directory
cd study-project
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

**Dependencies that will be installed:**
- express (web framework)
- body-parser (request parsing)
- cors (cross-origin requests)
- express-validator (input validation)
- helmet (security headers)
- express-rate-limit (rate limiting)
- express-mongo-sanitize (input sanitization)
- dotenv (environment variables)
- nodemon (development auto-restart)

### Step 3: Environment Configuration

Create a `.env` file in the project root:

```bash
# Create .env file
touch .env
```

Add the following content to `.env`:

```env
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# Future database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=study_portfolio
DB_USER=root
DB_PASSWORD=

# Future JWT configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

**⚠️ Important**: Never commit the `.env` file to git as it contains sensitive information.

### Step 4: Verify Setup

```bash
# Start the development server
npm run dev

# Or start in production mode
npm start
```

You should see:
```
🚀 Study Portfolio 서버가 http://localhost:3001 에서 실행 중입니다.
Environment: development
```

### Step 5: Test the API

Open a new terminal and test the endpoints:

```bash
# Test GET endpoint
curl http://localhost:3001/api/papers

# Test POST endpoint with validation
curl -X POST http://localhost:3001/api/papers \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Paper","authors":"Your Name","summary":"Test summary","content":"Test content","tags":["test"]}'

# Test validation error
curl -X POST http://localhost:3001/api/papers \
  -H "Content-Type: application/json" \
  -d '{"title":"","authors":"","summary":"","content":""}'
```

## 🔄 Continuing Development

### Getting Latest Changes

```bash
# Always pull latest changes before starting work
git pull origin main

# Install any new dependencies
npm install
```

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Server automatically restarts on file changes
   - Check logs in `logs/error.log` for debugging

3. **Test Changes**
   - Use the API endpoints to test functionality
   - Check browser at `http://localhost:3001`

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   git push origin main
   ```

## 📁 Project Structure Overview

```
study-project/
├── server.js                 # Main Express server
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (create this)
├── .gitignore               # Git ignore rules
├── config/                  # Configuration management
│   └── config.js            # Centralized config
├── middleware/              # Custom middleware
│   ├── validation.js        # Input validation rules
│   └── errorHandler.js      # Error handling and logging
├── logs/                    # Application logs (auto-created)
│   └── error.log           # Error logs
├── data/                    # JSON data storage (auto-created)
│   ├── papers.json         # Paper reviews
│   ├── experiments.json    # Experiments
│   ├── algorithms.json     # Algorithms
│   └── course-notes.json   # Course notes
└── public/                  # Frontend files
    ├── index.html          # Main page
    ├── pages/              # Category pages
    ├── styles/             # CSS files
    └── scripts/            # JavaScript files
```

## 🛠️ Available Commands

```bash
# Development with auto-restart
npm run dev

# Production start
npm start

# Install dependencies
npm install

# View package info
npm list
```

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Change port in .env file
PORT=3002
```

**Permission Errors**
```bash
# On Windows, run as administrator
# On macOS/Linux, check file permissions
chmod 755 .
```

**Missing Dependencies**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables Not Loading**
- Ensure `.env` file exists in project root
- Check `.env` file format (no spaces around =)
- Restart the server after changing `.env`

### API Testing Tools

**Using curl (Terminal)**
```bash
# GET request
curl http://localhost:3001/api/papers

# POST request
curl -X POST http://localhost:3001/api/papers \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","authors":"Me","summary":"Summary","content":"Content"}'
```

**Using Browser**
- GET requests: Open `http://localhost:3001/api/papers` in browser
- For POST/PUT/DELETE: Use Postman, Insomnia, or browser dev tools

### Log Files

- **Error Logs**: `logs/error.log`
- **Console Logs**: Terminal where server is running

## 📋 Current API Endpoints

### Complete CRUD for All Resources

**Papers** (`/api/papers`)
- `GET /api/papers` - List all papers
- `POST /api/papers` - Create new paper (validated, rate limited)
- `PUT /api/papers/:id` - Update paper (validated)
- `DELETE /api/papers/:id` - Delete paper

**Experiments** (`/api/experiments`)
- `GET /api/experiments` - List all experiments
- `POST /api/experiments` - Create new experiment (validated, rate limited)
- `PUT /api/experiments/:id` - Update experiment (validated)
- `DELETE /api/experiments/:id` - Delete experiment

**Algorithms** (`/api/algorithms`)
- `GET /api/algorithms` - List all algorithms
- `POST /api/algorithms` - Create new algorithm (validated, rate limited)
- `PUT /api/algorithms/:id` - Update algorithm (validated)
- `DELETE /api/algorithms/:id` - Delete algorithm

**Course Notes** (`/api/course-notes`)
- `GET /api/course-notes` - List all course notes
- `POST /api/course-notes` - Create new course note (validated, rate limited)
- `PUT /api/course-notes/:id` - Update course note (validated)
- `DELETE /api/course-notes/:id` - Delete course note

**Utility**
- `GET /api/recent-posts` - Get 5 most recent posts across all categories

## 🔐 Security Features

- **Rate Limiting**: 100 requests per 15 minutes (general), 5 requests per minute (POST)
- **Input Validation**: Comprehensive field validation for all endpoints
- **Security Headers**: Helmet.js for security headers
- **Input Sanitization**: Protection against injection attacks
- **Error Handling**: Structured error logging without exposing sensitive data

## 🎯 Next Steps (Phase 2)

When you're ready to continue development:

1. **Route Modularization**: Separate routes into individual files
2. **Health Check Endpoints**: Add `/health` and `/metrics` endpoints
3. **Request/Response Logging**: Add middleware for API logging
4. **Frontend Updates**: Add UPDATE and DELETE operations to frontend

## 📞 Support

If you encounter issues:

1. Check the error logs in `logs/error.log`
2. Verify all environment variables are set correctly
3. Ensure Node.js version is compatible (v16+)
4. Check that the port is not already in use

## 📋 Phase 1 Completion Status

- ✅ Complete CRUD operations for all resources
- ✅ Input validation with express-validator
- ✅ Security middleware (helmet, rate limiting, sanitization)
- ✅ Centralized error handling and logging
- ✅ Environment configuration management
- ✅ Updated project structure and documentation

Ready to continue with Phase 2 development!
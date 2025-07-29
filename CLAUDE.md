# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Study Portfolio** is a dynamic web application for managing and displaying academic learning content. It's built with Node.js/Express backend and vanilla JavaScript frontend, using JSON files for data persistence.

## Phase 1 Improvements (Latest Update)

### 🚀 Major Architecture Upgrades Completed

**Before Phase 1**: Simple Express app with basic GET/POST operations and minimal security
**After Phase 1**: Production-ready backend with comprehensive CRUD operations, validation, security, and error handling

### ✅ Key Improvements Implemented

1. **Complete CRUD Operations**
   - Added PUT/DELETE endpoints for all resources
   - Full REST API compliance
   - Proper HTTP status codes and responses

2. **Robust Input Validation**
   - express-validator integration
   - Field-level validation rules
   - Comprehensive error messages
   - Request sanitization

3. **Enhanced Security**
   - Helmet.js for security headers
   - Rate limiting (100 req/15min general, 5 req/min for POST)
   - Input sanitization against injection attacks
   - Environment-based configuration

4. **Professional Error Handling**
   - Centralized error middleware
   - Structured error logging to files
   - Development vs production error responses
   - 404 handling for unknown routes

5. **Configuration Management**
   - Environment variables with .env
   - Structured config system
   - Development/production environment support
   - Future-ready database and JWT configuration

## Architecture

### Backend (Express.js)
- **Server**: `server.js` - Main Express server with configurable port (default 3002)
- **Data Storage**: JSON files in `data/` directory for persistent storage
- **API Structure**: Complete RESTful endpoints with full CRUD operations
- **Middleware Stack**: 
  - Security: Helmet, rate limiting, input sanitization
  - Validation: express-validator with comprehensive rules
  - Error handling: Centralized error logging and response
  - Configuration: Environment-based settings management

### Frontend (Vanilla JS + HTML/CSS)
- **Static Files**: Served from `public/` directory
- **Pages**: Multi-page application with dynamic content loading
- **Styling**: Modern CSS with responsive design
- **JavaScript**: Vanilla JS for API communication and DOM manipulation

### Data Model
The application manages four content categories:
- **Papers** (`papers.json`): Academic paper reviews
- **Experiments** (`experiments.json`): Research experiment results  
- **Algorithms** (`algorithms.json`): Algorithm study notes
- **Course Notes** (`course-notes.json`): Academic course materials

## Development Commands

### Installation
```bash
npm install
```

### Running the Application
```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

### Port Configuration
- **Development Server**: http://localhost:3002 (configurable via .env)
- **Static Files**: Served from `/public` directory

## Project Structure

```
study-project/
├── server.js                 # Main Express server (enhanced with middleware)
├── package.json              # Dependencies (updated with security packages)
├── .env                      # Environment variables (NEW)
├── .gitignore               # Git ignore file (NEW)
├── config/                  # Configuration management (NEW)
│   └── config.js            # Centralized configuration
├── middleware/              # Middleware modules (NEW)
│   ├── validation.js        # Input validation rules
│   └── errorHandler.js      # Error handling and logging
├── logs/                    # Error logs (auto-created)
│   └── error.log           # Application error logs
├── data/                    # JSON data files (auto-created)
│   ├── papers.json         # Paper reviews storage
│   ├── experiments.json    # Experiment results storage
│   ├── algorithms.json     # Algorithm notes storage
│   └── course-notes.json   # Course notes storage
└── public/                  # Static frontend files
    ├── index.html          # Main landing page
    ├── pages/              # Category-specific pages
    │   ├── paper-review.html
    │   ├── experiments.html
    │   ├── algorithms.html
    │   └── course-notes.html
    ├── styles/             # CSS stylesheets
    │   ├── main.css        # Global styles
    │   └── pages.css       # Page-specific styles
    └── scripts/            # JavaScript files
        └── blog.js         # Legacy script (not currently used)
```

## API Endpoints

All API endpoints return JSON and follow RESTful conventions:

### Content Management APIs (Complete CRUD)
**Papers API**
- `GET /api/papers` - Retrieve all paper reviews
- `POST /api/papers` - Create new paper review (with validation & rate limiting)
- `PUT /api/papers/:id` - Update existing paper review (with validation)
- `DELETE /api/papers/:id` - Delete paper review

**Experiments API**
- `GET /api/experiments` - Retrieve all experiments
- `POST /api/experiments` - Create new experiment (with validation & rate limiting)
- `PUT /api/experiments/:id` - Update existing experiment (with validation)
- `DELETE /api/experiments/:id` - Delete experiment

**Algorithms API**
- `GET /api/algorithms` - Retrieve all algorithms
- `POST /api/algorithms` - Create new algorithm study (with validation & rate limiting)
- `PUT /api/algorithms/:id` - Update existing algorithm (with validation)
- `DELETE /api/algorithms/:id` - Delete algorithm

**Course Notes API**
- `GET /api/course-notes` - Retrieve all course notes
- `POST /api/course-notes` - Create new course note (with validation & rate limiting)
- `PUT /api/course-notes/:id` - Update existing course note (with validation)
- `DELETE /api/course-notes/:id` - Delete course note

### Utility APIs
- `GET /api/recent-posts` - Get 5 most recent posts across all categories

## Data Schema

### Paper Review Schema
```json
{
  "id": "timestamp",
  "title": "Paper title", // Required, 1-200 characters
  "authors": "Author names", // Required, 1-500 characters
  "summary": "Brief summary", // Required, 1-1000 characters
  "content": "Detailed review content", // Required
  "tags": ["tag1", "tag2"], // Optional array, each tag 1-50 characters
  "date": "YYYY-MM-DD",
  "updatedAt": "ISO string" // Added on updates
}
```

### Experiment Schema
```json
{
  "id": "timestamp",
  "title": "Experiment title",
  "description": "Experiment description",
  "methodology": "Research methodology",
  "results": "Experiment results",
  "conclusion": "Conclusions drawn",
  "tags": ["tag1", "tag2"],
  "date": "YYYY-MM-DD"
}
```

### Algorithm Schema
```json
{
  "id": "timestamp",
  "title": "Algorithm name",
  "problem": "Problem description",
  "solution": "Solution approach",
  "complexity": "Time/space complexity",
  "code": "Implementation code",
  "tags": ["tag1", "tag2"],
  "date": "YYYY-MM-DD"
}
```

### Course Note Schema
```json
{
  "id": "timestamp",
  "title": "Note title",
  "course": "Course name",
  "week": "Week number",
  "topic": "Lecture topic",
  "content": "Note content",
  "tags": ["tag1", "tag2"],
  "date": "YYYY-MM-DD"
}
```

## Key Implementation Patterns

### Data Persistence Pattern
- **File-based Storage**: JSON files in `data/` directory
- **Auto-creation**: Data files are created automatically when first accessed
- **Error Handling**: Graceful fallback to empty arrays for missing files
- **Atomic Operations**: Read-modify-write pattern for data updates

### API Route Pattern
Each content type follows enhanced REST patterns in `server.js`:
1. **GET route**: Read data file and return array
2. **POST route**: Validation → Rate limiting → Create with timestamp ID → Write back
3. **PUT route**: ID validation → Field validation → Update with timestamp → Write back
4. **DELETE route**: ID validation → Find and remove → Write back
5. **Error handling**: Centralized middleware with structured logging
6. **Data validation**: express-validator with comprehensive field rules
7. **Security**: Rate limiting, input sanitization, security headers

### Frontend Architecture Pattern
- **Page-specific JavaScript**: Each page handles its own API calls and DOM manipulation
- **Form Handling**: Event-driven form submission with async/await
- **Dynamic Content**: DOM manipulation to display fetched data
- **Error States**: User-friendly error messages for failed operations

### Styling Architecture
- **Global Styles** (`main.css`): Layout, typography, common components
- **Page Styles** (`pages.css`): Form styling, content display, responsive design
- **Component-based**: Reusable CSS classes for consistent styling

## Development Guidelines

### Adding New Content Types
1. Add API routes in `server.js` following existing pattern
2. Create corresponding JSON data file schema
3. Create HTML page in `public/pages/`
4. Add navigation link in `index.html`
5. Update recent posts aggregation logic

### Modifying Data Schema
1. Update the schema documentation in this file
2. Modify POST route validation in `server.js`
3. Update frontend form fields in corresponding HTML page
4. Test with existing data for backward compatibility

### Styling Changes
- Global changes: Modify `public/styles/main.css`
- Page-specific changes: Modify `public/styles/pages.css`
- Follow existing CSS class naming conventions
- Test responsive design on mobile devices

## Testing the Application

### Manual Testing Checklist
1. Start server with `npm start`
2. Navigate to http://localhost:3002
3. Test each content category:
   - **Create**: Fill out and submit new content form
   - **Read**: Verify content appears in list
   - **Update**: Edit existing content (frontend needs update)
   - **Delete**: Remove content (frontend needs update)
   - Check that recent posts update on main page
4. Test validation with invalid data
5. Test rate limiting with rapid requests
6. Test responsive design on different screen sizes

### Common Development Issues
- **Port conflicts**: Check .env file for PORT setting (default 3002)
- **Data persistence**: Check that `data/` directory is writable
- **Static files**: Ensure `public/` directory is properly served
- **CORS issues**: Verify CORS middleware is properly configured
- **Environment variables**: Ensure .env file exists and is properly loaded
- **Rate limiting**: Be aware of API rate limits during testing
- **Validation errors**: Check error logs in `logs/error.log` for debugging

## Dependencies

### Production Dependencies
- **express**: Web framework for Node.js
- **body-parser**: Middleware for parsing request bodies
- **cors**: Cross-origin resource sharing middleware
- **express-validator**: Input validation and sanitization
- **helmet**: Security middleware for HTTP headers
- **express-rate-limit**: Rate limiting middleware
- **express-mongo-sanitize**: Input sanitization middleware
- **dotenv**: Environment variable management

### Development Dependencies
- **nodemon**: Auto-restart server during development

All dependencies are standard, well-maintained packages with regular security updates.

## Future Enhancement Opportunities

### Phase 2 (Planned)
- Route modularization into separate files
- Health check endpoints
- Request/response logging middleware

### Phase 3 (Future)
- Database migration from JSON to SQLite
- User authentication system
- Search and filtering functionality
- Rich text editor for content creation
- File upload for images and attachments
- Export/import functionality for content backup

## Phase 1 API Testing Examples

### Create a paper (with validation)
```bash
curl -X POST http://localhost:3002/api/papers \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Paper","authors":"John Doe","summary":"Test summary","content":"Test content","tags":["test"]}'
```

### Update a paper
```bash
curl -X PUT http://localhost:3002/api/papers/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'
```

### Delete a paper
```bash
curl -X DELETE http://localhost:3002/api/papers/1234567890
```

### Test validation error
```bash
curl -X POST http://localhost:3002/api/papers \
  -H "Content-Type: application/json" \
  -d '{"title":"","authors":"","summary":"","content":""}'
```

## Changelog - Phase 1 Implementation

**2025-07-29 - Phase 1 Complete**
- ✅ Added complete CRUD operations for all resources
- ✅ Implemented comprehensive input validation with express-validator
- ✅ Added security middleware (helmet, rate limiting, sanitization)
- ✅ Created centralized error handling and logging system
- ✅ Added environment configuration management
- ✅ Updated project structure with middleware and config directories
- ✅ Enhanced API documentation with new endpoints

**Frontend Note**: Current frontend only supports CREATE and READ operations. UPDATE and DELETE operations are available via API but require frontend interface updates.
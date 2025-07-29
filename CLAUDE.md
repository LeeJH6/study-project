# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Study Portfolio** is a dynamic web application for managing and displaying academic learning content. It's built with Node.js/Express backend and vanilla JavaScript frontend, using JSON files for data persistence.

## Architecture

### Backend (Express.js)
- **Server**: `server.js` - Main Express server running on port 3001
- **Data Storage**: JSON files in `data/` directory for persistent storage
- **API Structure**: RESTful endpoints for CRUD operations
- **Middleware**: CORS, body-parser for request handling

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
- **Development Server**: http://localhost:3001
- **Static Files**: Served from `/public` directory

## Project Structure

```
study-project/
├── server.js              # Express server with API routes
├── package.json           # Dependencies and scripts
├── data/                  # JSON data files (auto-created)
│   ├── papers.json        # Paper reviews storage
│   ├── experiments.json   # Experiment results storage
│   ├── algorithms.json    # Algorithm notes storage
│   └── course-notes.json  # Course notes storage
└── public/                # Static frontend files
    ├── index.html         # Main landing page
    ├── pages/             # Category-specific pages
    │   ├── paper-review.html
    │   ├── experiments.html
    │   ├── algorithms.html
    │   └── course-notes.html
    ├── styles/            # CSS stylesheets
    │   ├── main.css       # Global styles
    │   └── pages.css      # Page-specific styles
    └── scripts/           # JavaScript files
        └── blog.js        # Legacy script (not currently used)
```

## API Endpoints

All API endpoints return JSON and follow RESTful conventions:

### Content Management APIs
- `GET /api/papers` - Retrieve all paper reviews
- `POST /api/papers` - Create new paper review
- `GET /api/experiments` - Retrieve all experiments
- `POST /api/experiments` - Create new experiment
- `GET /api/algorithms` - Retrieve all algorithms
- `POST /api/algorithms` - Create new algorithm study
- `GET /api/course-notes` - Retrieve all course notes
- `POST /api/course-notes` - Create new course note

### Utility APIs
- `GET /api/recent-posts` - Get 5 most recent posts across all categories

## Data Schema

### Paper Review Schema
```json
{
  "id": "timestamp",
  "title": "Paper title",
  "authors": "Author names",
  "summary": "Brief summary",
  "content": "Detailed review content",
  "tags": ["tag1", "tag2"],
  "date": "YYYY-MM-DD"
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
Each content type follows the same pattern in `server.js`:
1. **GET route**: Read data file and return array
2. **POST route**: Read existing data, add new item with timestamp ID, write back
3. **Error handling**: Try-catch blocks with meaningful error responses
4. **Data validation**: Basic validation on required fields

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
2. Navigate to http://localhost:3001
3. Test each content category:
   - Click on category card
   - Fill out and submit new content form
   - Verify content appears in list
   - Check that recent posts update on main page
4. Test responsive design on different screen sizes

### Common Development Issues
- **Port conflicts**: Ensure port 3001 is available
- **Data persistence**: Check that `data/` directory is writable
- **Static files**: Ensure `public/` directory is properly served
- **CORS issues**: Verify CORS middleware is properly configured

## Dependencies

### Production Dependencies
- **express**: Web framework for Node.js
- **body-parser**: Middleware for parsing request bodies
- **cors**: Cross-origin resource sharing middleware

### Development Dependencies
- **nodemon**: Auto-restart server during development

All dependencies are standard, well-maintained packages with no security concerns.

## Future Enhancement Opportunities

- Add search and filtering functionality
- Implement user authentication
- Add rich text editor for content creation
- Implement database migration from JSON files
- Add export/import functionality for content backup
- Implement file upload for images and attachments
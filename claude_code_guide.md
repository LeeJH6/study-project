# IMPROVEMENT_GUIDE.md

This file provides Claude Code with specific improvement instructions for the Study Portfolio project. Follow these guidelines when making changes to enhance the backend architecture.

## Project Status & Context

**Current State**: Simple Express.js app with JSON file storage
**Target State**: Production-ready backend with proper architecture patterns
**Migration Strategy**: Incremental improvements in 4 phases

## Immediate Action Items (Phase 1)

### 1. Fix Missing CRUD Operations
**PRIORITY: HIGH**

Currently missing UPDATE and DELETE operations for all resources.

```javascript
// Add these routes to server.js for each resource type (papers, experiments, algorithms, course-notes)
app.put('/api/papers/:id', async (req, res) => {
  try {
    const papers = JSON.parse(fs.readFileSync('./data/papers.json', 'utf8'));
    const index = papers.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }
    papers[index] = { ...papers[index], ...req.body, updatedAt: new Date().toISOString() };
    fs.writeFileSync('./data/papers.json', JSON.stringify(papers, null, 2));
    res.json({ success: true, data: papers[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/papers/:id', async (req, res) => {
  try {
    const papers = JSON.parse(fs.readFileSync('./data/papers.json', 'utf8'));
    const index = papers.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }
    papers.splice(index, 1);
    fs.writeFileSync('./data/papers.json', JSON.stringify(papers, null, 2));
    res.json({ success: true, message: 'Paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

**Apply the same pattern for**: experiments, algorithms, course-notes

### 2. Add Input Validation
**PRIORITY: HIGH**

Install and implement express-validator:

```bash
npm install express-validator
```

Create `middleware/validation.js`:

```javascript
const { body, param, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Common validation rules
const paperValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
  body('authors').trim().isLength({ min: 1, max: 500 }).withMessage('Authors required'),
  body('summary').trim().isLength({ min: 1, max: 1000 }).withMessage('Summary required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Each tag must be 1-50 characters')
];

const experimentValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description required'),
  body('methodology').trim().isLength({ min: 1 }).withMessage('Methodology required'),
  body('results').trim().isLength({ min: 1 }).withMessage('Results required'),
  body('conclusion').trim().isLength({ min: 1 }).withMessage('Conclusion required'),
  body('tags').optional().isArray()
];

const algorithmValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title required'),
  body('problem').trim().isLength({ min: 1 }).withMessage('Problem description required'),
  body('solution').trim().isLength({ min: 1 }).withMessage('Solution required'),
  body('complexity').optional().trim().isLength({ max: 200 }),
  body('code').optional().trim(),
  body('tags').optional().isArray()
];

const courseNoteValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title required'),
  body('course').trim().isLength({ min: 1, max: 100 }).withMessage('Course name required'),
  body('week').optional().trim().isLength({ max: 50 }),
  body('topic').trim().isLength({ min: 1, max: 200 }).withMessage('Topic required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content required'),
  body('tags').optional().isArray()
];

module.exports = {
  validateRequest,
  paperValidation,
  experimentValidation,
  algorithmValidation,
  courseNoteValidation
};
```

**Update server.js** to use validation:

```javascript
const { validateRequest, paperValidation, experimentValidation, algorithmValidation, courseNoteValidation } = require('./middleware/validation');

// Apply validation to POST routes
app.post('/api/papers', paperValidation, validateRequest, /* existing handler */);
app.post('/api/experiments', experimentValidation, validateRequest, /* existing handler */);
app.post('/api/algorithms', algorithmValidation, validateRequest, /* existing handler */);
app.post('/api/course-notes', courseNoteValidation, validateRequest, /* existing handler */);

// Apply validation to PUT routes (add param validation)
app.put('/api/papers/:id', [param('id').notEmpty().withMessage('ID required'), ...paperValidation], validateRequest, /* handler */);
```

### 3. Improve Error Handling
**PRIORITY: HIGH**

Create `middleware/errorHandler.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Simple file-based logging (upgrade to Winston later)
const logError = (error, req) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  };
  
  const logFile = path.join(logsDir, 'error.log');
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};

const errorHandler = (error, req, res, next) => {
  // Log the error
  logError(error, req);
  
  // Default error response
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(isDevelopment && { stack: error.stack })
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  });
};

module.exports = { errorHandler, notFoundHandler };
```

**Add to server.js**:

```javascript
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// ... existing routes ...

// Add these at the end of server.js
app.use(notFoundHandler);
app.use(errorHandler);
```

### 4. Add Basic Security
**PRIORITY: HIGH**

Install security packages:

```bash
npm install helmet express-rate-limit express-mongo-sanitize
```

**Update server.js**:

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Add after other middleware
app.use(helmet());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  }
});

app.use('/api/', limiter);

// Stricter limits for POST requests
const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 create requests per minute
  message: {
    success: false,
    message: 'Too many create requests, please try again later'
  }
});

app.use('/api/*/post', createLimiter);
```

### 5. Add Environment Configuration
**PRIORITY: MEDIUM**

Install dotenv:

```bash
npm install dotenv
```

Create `.env` file:

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

Create `config/config.js`:

```javascript
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Future database config
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'study_portfolio',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },
  
  // Future JWT config
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};
```

**Update server.js**:

```javascript
const config = require('./config/config');

// Use config.port instead of hardcoded 3001
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
});
```

## Phase 2 Tasks (Architecture Refactoring)

### 1. Separate Routes into Modules
**PRIORITY: MEDIUM**

Create `routes/` directory with separate route files:

```
routes/
├── index.js        # Main router
├── papers.js       # Papers routes
├── experiments.js  # Experiments routes
├── algorithms.js   # Algorithms routes
├── courseNotes.js  # Course notes routes
└── health.js       # Health check routes
```

Example `routes/papers.js`:

```javascript
const express = require('express');
const router = express.Router();
const { validateRequest, paperValidation } = require('../middleware/validation');
const { param } = require('express-validator');

// GET /api/papers
router.get('/', async (req, res, next) => {
  try {
    // Move existing logic here
  } catch (error) {
    next(error);
  }
});

// POST /api/papers
router.post('/', paperValidation, validateRequest, async (req, res, next) => {
  try {
    // Move existing logic here
  } catch (error) {
    next(error);
  }
});

// PUT /api/papers/:id
router.put('/:id', [param('id').notEmpty(), ...paperValidation], validateRequest, async (req, res, next) => {
  try {
    // Add update logic
  } catch (error) {
    next(error);
  }
});

// DELETE /api/papers/:id
router.delete('/:id', [param('id').notEmpty()], validateRequest, async (req, res, next) => {
  try {
    // Add delete logic
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

### 2. Add Health Check Endpoint

Create `routes/health.js`:

```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
  
  // Check if data directory is accessible
  try {
    const dataDir = path.join(__dirname, '../data');
    fs.accessSync(dataDir, fs.constants.R_OK | fs.constants.W_OK);
    healthCheck.dataAccess = 'OK';
  } catch (error) {
    healthCheck.dataAccess = 'ERROR';
    healthCheck.status = 'ERROR';
  }
  
  // Check data files
  const dataFiles = ['papers.json', 'experiments.json', 'algorithms.json', 'course-notes.json'];
  healthCheck.dataFiles = {};
  
  dataFiles.forEach(file => {
    try {
      const filePath = path.join(__dirname, '../data', file);
      const stats = fs.statSync(filePath);
      healthCheck.dataFiles[file] = {
        exists: true,
        size: stats.size,
        modified: stats.mtime
      };
    } catch (error) {
      healthCheck.dataFiles[file] = {
        exists: false,
        error: error.message
      };
    }
  });
  
  const statusCode = healthCheck.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

router.get('/metrics', (req, res) => {
  const metrics = {
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    platform: process.platform,
    nodeVersion: process.version
  };
  
  res.json(metrics);
});

module.exports = router;
```

## Phase 3 Tasks (Database Migration)

### 1. SQLite Setup
**PRIORITY: LOW** (for later implementation)

```bash
npm install sqlite3 knex
```

Create `database/migrations/` and `database/seeds/` directories.

### 2. Service Layer Pattern
**PRIORITY: LOW** (for later implementation)

Create `services/` directory with business logic separation.

## File Structure After Phase 1 Implementation

```
study-project/
├── server.js                 # Main server file (updated)
├── package.json              # Dependencies (updated)
├── .env                      # Environment variables (new)
├── .gitignore               # Ignore .env and logs/ (new)
├── config/
│   └── config.js            # Configuration management (new)
├── middleware/
│   ├── validation.js        # Input validation (new)
│   └── errorHandler.js      # Error handling (new)
├── routes/                  # Route modules (new)
│   ├── index.js
│   ├── papers.js
│   ├── experiments.js
│   ├── algorithms.js
│   ├── courseNotes.js
│   └── health.js
├── logs/                    # Log files (auto-created)
│   └── error.log
├── data/                    # JSON data files
│   ├── papers.json
│   ├── experiments.json
│   ├── algorithms.json
│   └── course-notes.json
└── public/                  # Static frontend files
    └── ...
```

## Testing After Implementation

### Manual Testing Checklist
1. **CRUD Operations**: Test all endpoints for each resource type
   - GET /api/{resource} - List all
   - POST /api/{resource} - Create new
   - PUT /api/{resource}/:id - Update existing
   - DELETE /api/{resource}/:id - Delete existing

2. **Validation**: Test with invalid data to ensure validation works
3. **Error Handling**: Test with malformed requests
4. **Health Check**: Access /health and /metrics endpoints
5. **Rate Limiting**: Make rapid requests to test limits

### Example Test Commands
```bash
# Test health check
curl http://localhost:3001/health

# Test paper creation with validation
curl -X POST http://localhost:3001/api/papers \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Paper","authors":"John Doe","summary":"Test summary","content":"Test content","tags":["test"]}'

# Test paper update
curl -X PUT http://localhost:3001/api/papers/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Test paper deletion
curl -X DELETE http://localhost:3001/api/papers/1234567890
```

## Implementation Priority

**Week 1**: Items 1-3 (CRUD, Validation, Error Handling)
**Week 2**: Items 4-5 (Security, Configuration)
**Week 3**: Phase 2 tasks (Route separation, Health checks)

## Notes for Claude Code

- Always test changes before committing
- Maintain backward compatibility with existing frontend
- Follow existing code style and patterns
- Add proper error handling to all new functions
- Document any breaking changes in commit messages
- Ensure all new endpoints return consistent JSON response format:
  ```json
  {
    "success": true/false,
    "data": {...},
    "message": "...",
    "errors": [...]
  }
  ```
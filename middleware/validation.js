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
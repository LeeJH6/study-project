const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { param } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { 
  validateRequest, 
  paperValidation, 
  experimentValidation, 
  algorithmValidation, 
  courseNoteValidation 
} = require('./middleware/validation');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const config = require('./config/config');

const app = express();

// 보안 미들웨어
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

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 데이터 파일 경로
const DATA_DIR = path.join(__dirname, 'data');

// 데이터 파일 읽기 함수
async function readDataFile(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(`Creating new data file: ${filename}`);
        return [];
    }
}

// 데이터 파일 쓰기 함수
async function writeDataFile(filename, data) {
    try {
        // data 디렉토리가 없으면 생성
        await fs.mkdir(DATA_DIR, { recursive: true });
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data file:', error);
        return false;
    }
}

// API 라우트
// 논문 리뷰 API
app.get('/api/papers', async (req, res) => {
    const papers = await readDataFile('papers.json');
    res.json(papers);
});

app.post('/api/papers', createLimiter, paperValidation, validateRequest, async (req, res) => {
    const papers = await readDataFile('papers.json');
    const newPaper = {
        id: Date.now(),
        title: req.body.title,
        authors: req.body.authors,
        summary: req.body.summary,
        content: req.body.content,
        tags: req.body.tags || [],
        date: new Date().toISOString().split('T')[0]
    };
    
    papers.unshift(newPaper);
    const success = await writeDataFile('papers.json', papers);
    
    if (success) {
        res.json({ success: true, data: newPaper });
    } else {
        res.status(500).json({ success: false, message: 'Failed to save data' });
    }
});

// PUT /api/papers/:id - 논문 리뷰 수정
app.put('/api/papers/:id', [param('id').notEmpty().withMessage('ID required'), ...paperValidation], validateRequest, async (req, res) => {
    try {
        const papers = await readDataFile('papers.json');
        const index = papers.findIndex(p => p.id.toString() === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Paper not found' });
        }
        
        papers[index] = { 
            ...papers[index], 
            ...req.body, 
            id: papers[index].id, // ID는 변경하지 않음
            updatedAt: new Date().toISOString() 
        };
        
        const success = await writeDataFile('papers.json', papers);
        
        if (success) {
            res.json({ success: true, data: papers[index] });
        } else {
            res.status(500).json({ success: false, message: 'Failed to update paper' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/papers/:id - 논문 리뷰 삭제
app.delete('/api/papers/:id', [param('id').notEmpty().withMessage('ID required')], validateRequest, async (req, res) => {
    try {
        const papers = await readDataFile('papers.json');
        const index = papers.findIndex(p => p.id.toString() === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Paper not found' });
        }
        
        papers.splice(index, 1);
        const success = await writeDataFile('papers.json', papers);
        
        if (success) {
            res.json({ success: true, message: 'Paper deleted successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to delete paper' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 실험 결과 API
app.get('/api/experiments', async (req, res) => {
    const experiments = await readDataFile('experiments.json');
    res.json(experiments);
});

app.post('/api/experiments', createLimiter, experimentValidation, validateRequest, async (req, res) => {
    const experiments = await readDataFile('experiments.json');
    const newExperiment = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description,
        methodology: req.body.methodology,
        results: req.body.results,
        conclusion: req.body.conclusion,
        tags: req.body.tags || [],
        date: new Date().toISOString().split('T')[0]
    };
    
    experiments.unshift(newExperiment);
    const success = await writeDataFile('experiments.json', experiments);
    
    if (success) {
        res.json({ success: true, data: newExperiment });
    } else {
        res.status(500).json({ success: false, message: 'Failed to save data' });
    }
});

// PUT /api/experiments/:id - 실험 결과 수정
app.put('/api/experiments/:id', [param('id').notEmpty().withMessage('ID required'), ...experimentValidation], validateRequest, async (req, res) => {
    try {
        const experiments = await readDataFile('experiments.json');
        const index = experiments.findIndex(e => e.id.toString() === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Experiment not found' });
        }
        
        experiments[index] = { 
            ...experiments[index], 
            ...req.body, 
            id: experiments[index].id,
            updatedAt: new Date().toISOString() 
        };
        
        const success = await writeDataFile('experiments.json', experiments);
        
        if (success) {
            res.json({ success: true, data: experiments[index] });
        } else {
            res.status(500).json({ success: false, message: 'Failed to update experiment' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/experiments/:id - 실험 결과 삭제
app.delete('/api/experiments/:id', [param('id').notEmpty().withMessage('ID required')], validateRequest, async (req, res) => {
    try {
        const experiments = await readDataFile('experiments.json');
        const index = experiments.findIndex(e => e.id.toString() === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Experiment not found' });
        }
        
        experiments.splice(index, 1);
        const success = await writeDataFile('experiments.json', experiments);
        
        if (success) {
            res.json({ success: true, message: 'Experiment deleted successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to delete experiment' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 알고리즘 스터딩 API
app.get('/api/algorithms', async (req, res) => {
    const algorithms = await readDataFile('algorithms.json');
    res.json(algorithms);
});

app.post('/api/algorithms', createLimiter, algorithmValidation, validateRequest, async (req, res) => {
    const algorithms = await readDataFile('algorithms.json');
    const newAlgorithm = {
        id: Date.now(),
        title: req.body.title,
        problem: req.body.problem,
        solution: req.body.solution,
        complexity: req.body.complexity,
        code: req.body.code,
        tags: req.body.tags || [],
        date: new Date().toISOString().split('T')[0]
    };
    
    algorithms.unshift(newAlgorithm);
    const success = await writeDataFile('algorithms.json', algorithms);
    
    if (success) {
        res.json({ success: true, data: newAlgorithm });
    } else {
        res.status(500).json({ success: false, message: 'Failed to save data' });
    }
});

// PUT /api/algorithms/:id - 알고리즘 수정
app.put('/api/algorithms/:id', [param('id').notEmpty().withMessage('ID required'), ...algorithmValidation], validateRequest, async (req, res) => {
    try {
        const algorithms = await readDataFile('algorithms.json');
        const index = algorithms.findIndex(a => a.id.toString() === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Algorithm not found' });
        }
        
        algorithms[index] = { 
            ...algorithms[index], 
            ...req.body, 
            id: algorithms[index].id,
            updatedAt: new Date().toISOString() 
        };
        
        const success = await writeDataFile('algorithms.json', algorithms);
        
        if (success) {
            res.json({ success: true, data: algorithms[index] });
        } else {
            res.status(500).json({ success: false, message: 'Failed to update algorithm' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/algorithms/:id - 알고리즘 삭제
app.delete('/api/algorithms/:id', [param('id').notEmpty().withMessage('ID required')], validateRequest, async (req, res) => {
    try {
        const algorithms = await readDataFile('algorithms.json');
        const index = algorithms.findIndex(a => a.id.toString() === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Algorithm not found' });
        }
        
        algorithms.splice(index, 1);
        const success = await writeDataFile('algorithms.json', algorithms);
        
        if (success) {
            res.json({ success: true, message: 'Algorithm deleted successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to delete algorithm' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 수업 노트 API
app.get('/api/course-notes', async (req, res) => {
    const notes = await readDataFile('course-notes.json');
    res.json(notes);
});

app.post('/api/course-notes', createLimiter, courseNoteValidation, validateRequest, async (req, res) => {
    const notes = await readDataFile('course-notes.json');
    const newNote = {
        id: Date.now(),
        title: req.body.title,
        course: req.body.course,
        week: req.body.week,
        topic: req.body.topic,
        content: req.body.content,
        tags: req.body.tags || [],
        date: new Date().toISOString().split('T')[0]
    };
    
    notes.unshift(newNote);
    const success = await writeDataFile('course-notes.json', notes);
    
    if (success) {
        res.json({ success: true, data: newNote });
    } else {
        res.status(500).json({ success: false, message: 'Failed to save data' });
    }
});

// PUT /api/course-notes/:id - 수업 노트 수정
app.put('/api/course-notes/:id', [param('id').notEmpty().withMessage('ID required'), ...courseNoteValidation], validateRequest, async (req, res) => {
    try {
        const notes = await readDataFile('course-notes.json');
        const index = notes.findIndex(n => n.id.toString() === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Course note not found' });
        }
        
        notes[index] = { 
            ...notes[index], 
            ...req.body, 
            id: notes[index].id,
            updatedAt: new Date().toISOString() 
        };
        
        const success = await writeDataFile('course-notes.json', notes);
        
        if (success) {
            res.json({ success: true, data: notes[index] });
        } else {
            res.status(500).json({ success: false, message: 'Failed to update course note' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/course-notes/:id - 수업 노트 삭제
app.delete('/api/course-notes/:id', [param('id').notEmpty().withMessage('ID required')], validateRequest, async (req, res) => {
    try {
        const notes = await readDataFile('course-notes.json');
        const index = notes.findIndex(n => n.id.toString() === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Course note not found' });
        }
        
        notes.splice(index, 1);
        const success = await writeDataFile('course-notes.json', notes);
        
        if (success) {
            res.json({ success: true, message: 'Course note deleted successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to delete course note' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 최근 포스트 API (모든 카테고리에서 최신 5개)
app.get('/api/recent-posts', async (req, res) => {
    try {
        const [papers, experiments, algorithms, notes] = await Promise.all([
            readDataFile('papers.json'),
            readDataFile('experiments.json'),
            readDataFile('algorithms.json'),
            readDataFile('course-notes.json')
        ]);

        const allPosts = [
            ...papers.map(p => ({ ...p, category: '논문 리뷰', type: 'papers' })),
            ...experiments.map(e => ({ ...e, category: '실험 결과', type: 'experiments' })),
            ...algorithms.map(a => ({ ...a, category: '알고리즘 스터딩', type: 'algorithms' })),
            ...notes.map(n => ({ ...n, category: '수업 노트', type: 'course-notes' }))
        ];

        // 날짜순 정렬 후 최신 5개
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(allPosts.slice(0, 5));
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        res.json([]);
    }
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// 서버 시작
app.listen(config.port, () => {
    console.log(`🚀 Study Portfolio 서버가 http://localhost:${config.port} 에서 실행 중입니다.`);
    console.log(`Environment: ${config.nodeEnv}`);
});
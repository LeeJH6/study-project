const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

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

app.post('/api/papers', async (req, res) => {
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

// 실험 결과 API
app.get('/api/experiments', async (req, res) => {
    const experiments = await readDataFile('experiments.json');
    res.json(experiments);
});

app.post('/api/experiments', async (req, res) => {
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

// 알고리즘 스터딩 API
app.get('/api/algorithms', async (req, res) => {
    const algorithms = await readDataFile('algorithms.json');
    res.json(algorithms);
});

app.post('/api/algorithms', async (req, res) => {
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

// 수업 노트 API
app.get('/api/course-notes', async (req, res) => {
    const notes = await readDataFile('course-notes.json');
    res.json(notes);
});

app.post('/api/course-notes', async (req, res) => {
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

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 Study Portfolio 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
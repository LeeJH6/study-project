// 블로그 기능 JavaScript

// 로컬 스토리지에서 데이터 로드
function loadPosts(category) {
    const posts = localStorage.getItem(`posts_${category}`);
    return posts ? JSON.parse(posts) : [];
}

// 로컬 스토리지에 데이터 저장
function savePosts(category, posts) {
    localStorage.setItem(`posts_${category}`, JSON.stringify(posts));
}

// 폼 표시/숨기기
function showAddForm() {
    document.getElementById('add-form').style.display = 'block';
}

function hideAddForm() {
    document.getElementById('add-form').style.display = 'none';
    document.querySelector('form').reset();
}

// 포스트 추가
function addPost(event, category) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const post = {
        id: Date.now().toString(),
        title: formData.get('title'),
        date: formData.get('date'),
        content: formData.get('content'),
        category: category,
        created: new Date().toISOString()
    };
    
    // 카테고리별 추가 필드
    if (category === 'paper-review') {
        post.authors = formData.get('authors');
        post.journal = formData.get('journal');
    } else if (category === 'experiments') {
        post.project = formData.get('project');
        post.method = formData.get('method');
    } else if (category === 'algorithms') {
        post.category_sub = formData.get('category');
        post.difficulty = formData.get('difficulty');
    } else if (category === 'course-notes') {
        post.course = formData.get('course');
        post.professor = formData.get('professor');
    }
    
    const posts = loadPosts(category);
    posts.unshift(post); // 최신 포스트를 앞에 추가
    savePosts(category, posts);
    
    hideAddForm();
    displayPosts(category);
    
    alert('포스트가 성공적으로 추가되었습니다!');
}

// 포스트 목록 표시
function displayPosts(category) {
    const posts = loadPosts(category);
    const postsList = document.getElementById('posts-list');
    
    if (posts.length === 0) {
        postsList.innerHTML = getEmptyState(category);
        return;
    }
    
    postsList.innerHTML = posts.map(post => createPostCard(post, category)).join('');
}

// 빈 상태 HTML 생성
function getEmptyState(category) {
    const icons = {
        'paper-review': '📄',
        'experiments': '🧪',
        'algorithms': '⚡',
        'course-notes': '📚'
    };
    
    const titles = {
        'paper-review': '논문 리뷰',
        'experiments': '실험 결과',
        'algorithms': '알고리즘 학습 기록',
        'course-notes': '수업 노트'
    };
    
    return `
        <div class="empty-state">
            <div class="empty-icon">${icons[category]}</div>
            <h3>아직 ${titles[category]}가 없습니다</h3>
            <p>첫 번째 ${titles[category]}를 추가해보세요!</p>
        </div>
    `;
}

// 포스트 카드 HTML 생성
function createPostCard(post, category) {
    const preview = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');
    
    let metaInfo = `<span>${formatDate(post.date)}</span>`;
    
    if (category === 'paper-review' && post.authors) {
        metaInfo += `<span>저자: ${post.authors}</span>`;
    } else if (category === 'experiments' && post.project) {
        metaInfo += `<span>프로젝트: ${post.project}</span>`;
    } else if (category === 'algorithms' && post.category_sub) {
        metaInfo += `<span>카테고리: ${post.category_sub}</span>`;
    } else if (category === 'course-notes' && post.course) {
        metaInfo += `<span>과목: ${post.course}</span>`;
    }
    
    return `
        <div class="post-item" onclick="viewPost('${post.id}', '${category}')">
            <div class="post-meta">
                ${metaInfo}
            </div>
            <h3>${post.title}</h3>
            <div class="post-preview">${preview}</div>
            <div class="post-actions">
                <button onclick="event.stopPropagation(); editPost('${post.id}', '${category}')" class="edit-btn">수정</button>
                <button onclick="event.stopPropagation(); deletePost('${post.id}', '${category}')" class="delete-btn">삭제</button>
            </div>
        </div>
    `;
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 포스트 상세보기
function viewPost(postId, category) {
    const posts = loadPosts(category);
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    // 새 창에서 포스트 상세보기 열기
    const newWindow = window.open('', '_blank');
    newWindow.document.write(generatePostDetailHTML(post, category));
}

// 포스트 상세보기 HTML 생성
function generatePostDetailHTML(post, category) {
    let metaInfo = `<span><strong>작성일:</strong> ${formatDate(post.date)}</span>`;
    
    if (category === 'paper-review') {
        if (post.authors) metaInfo += `<span><strong>저자:</strong> ${post.authors}</span>`;
        if (post.journal) metaInfo += `<span><strong>저널/학회:</strong> ${post.journal}</span>`;
    } else if (category === 'experiments') {
        if (post.project) metaInfo += `<span><strong>프로젝트:</strong> ${post.project}</span>`;
        if (post.method) metaInfo += `<span><strong>실험 방법:</strong> ${post.method}</span>`;
    } else if (category === 'algorithms') {
        if (post.category_sub) metaInfo += `<span><strong>카테고리:</strong> ${post.category_sub}</span>`;
        if (post.difficulty) metaInfo += `<span><strong>난이도:</strong> ${post.difficulty}</span>`;
    } else if (category === 'course-notes') {
        if (post.course) metaInfo += `<span><strong>과목:</strong> ${post.course}</span>`;
        if (post.professor) metaInfo += `<span><strong>교수:</strong> ${post.professor}</span>`;
    }
    
    return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${post.title} - 나의 학습 포트폴리오</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
                .post-detail { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .post-detail h1 { color: #2c3e50; margin-bottom: 20px; border-bottom: 3px solid #667eea; padding-bottom: 15px; }
                .post-detail-meta { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 30px; display: flex; flex-wrap: wrap; gap: 15px; font-size: 0.9rem; }
                .post-detail-content { font-size: 1.05rem; white-space: pre-wrap; }
                pre { background: #f8f9fa; padding: 15px; border-radius: 6px; overflow-x: auto; border-left: 4px solid #667eea; }
                code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; }
            </style>
        </head>
        <body>
            <div class="post-detail">
                <h1>${post.title}</h1>
                <div class="post-detail-meta">${metaInfo}</div>
                <div class="post-detail-content">${post.content}</div>
            </div>
        </body>
        </html>
    `;
}

// 포스트 삭제
function deletePost(postId, category) {
    if (!confirm('정말 이 포스트를 삭제하시겠습니까?')) return;
    
    const posts = loadPosts(category);
    const filteredPosts = posts.filter(p => p.id !== postId);
    savePosts(category, filteredPosts);
    displayPosts(category);
    
    alert('포스트가 삭제되었습니다.');
}

// 포스트 수정 (간단한 구현)
function editPost(postId, category) {
    const posts = loadPosts(category);
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    const newTitle = prompt('제목을 수정하세요:', post.title);
    const newContent = prompt('내용을 수정하세요:', post.content);
    
    if (newTitle !== null && newContent !== null) {
        post.title = newTitle;
        post.content = newContent;
        post.modified = new Date().toISOString();
        savePosts(category, posts);
        displayPosts(category);
        alert('포스트가 수정되었습니다.');
    }
}

// 페이지 로드 시 카테고리 감지 및 포스트 표시
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    let category = '';
    
    if (path.includes('paper-review')) category = 'paper-review';
    else if (path.includes('experiments')) category = 'experiments';
    else if (path.includes('algorithms')) category = 'algorithms';
    else if (path.includes('course-notes')) category = 'course-notes';
    
    if (category) {
        displayPosts(category);
    }
});

// 메인 페이지용 최근 포스트 표시
function displayRecentPosts() {
    const categories = ['paper-review', 'experiments', 'algorithms', 'course-notes'];
    const allPosts = [];
    
    categories.forEach(category => {
        const posts = loadPosts(category);
        posts.forEach(post => {
            post.categoryName = getCategoryName(category);
            allPosts.push(post);
        });
    });
    
    // 최신순으로 정렬하고 최대 4개만 표시
    allPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
    const recentPosts = allPosts.slice(0, 4);
    
    const container = document.querySelector('.posts-preview');
    if (container && recentPosts.length > 0) {
        container.innerHTML = recentPosts.map(post => `
            <div class="post-card">
                <span class="post-category">${post.categoryName}</span>
                <h4>${post.title}</h4>
                <p class="post-date">${formatDate(post.date)}</p>
            </div>
        `).join('');
    }
}

function getCategoryName(category) {
    const names = {
        'paper-review': '논문 리뷰',
        'experiments': '실험 결과',
        'algorithms': '알고리즘',
        'course-notes': '수업 노트'
    };
    return names[category] || category;
}

// 메인 페이지에서 최근 포스트 표시
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    document.addEventListener('DOMContentLoaded', displayRecentPosts);
}
const PREFIX = 'bv_';

function getItem(key) {
  try {
    const data = localStorage.getItem(PREFIX + key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function setItem(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

function removeItem(key) {
  localStorage.removeItem(PREFIX + key);
}

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

export const Store = {

  // ────────────────────── AUTH ──────────────────────

  getCurrentUser() {
    const userId = getItem('currentUserId');
    if (!userId) return null;
    const users = getItem('users') || [];
    return users.find(u => u.id === userId) || null;
  },

  setCurrentUser(userId) {
    setItem('currentUserId', userId);
  },

  login(email, password) {
    const users = getItem('users') || [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      if (user.status === 'pending') {
        return { error: 'Your account is pending admin approval' };
      }
      if (user.status === 'suspended') {
        return { error: 'Your account has been suspended. Please contact support.' };
      }
      setItem('currentUserId', user.id);
      this.updateStreak(user.id);
      this.logActivity('Login', `${user.name} logged in`);
      return user;
    }
    return null;
  },

  signup(userData) {
    const users = getItem('users') || [];
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { error: 'Email already registered' };
    }
    const user = {
      id: generateId('user'),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      class: userData.class || '1st PU',
      role: 'student',
      password: userData.password,
      streak: 1,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    users.push(user);
    setItem('users', users);
    setItem('currentUserId', user.id);
    setItem(`progress_${user.id}`, {
      videosWatched: [],
      notesRead: [],
      testsCompleted: [],
      chapterProgress: {},
      streak: 1,
      lastActive: new Date().toISOString()
    });
    return { ...user, isPending: true };
  },

  logout() {
    removeItem('currentUserId');
  },

  updateProfile(data) {
    const userId = getItem('currentUserId');
    if (!userId) return null;
    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...data };
      setItem('users', users);
      return users[idx];
    }
    return null;
  },

  changePassword(oldPassword, newPassword) {
    const user = this.getCurrentUser();
    if (!user) return { error: 'Not logged in' };
    if (user.password !== oldPassword) return { error: 'Incorrect current password' };
    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx].password = newPassword;
      setItem('users', users);
      return { success: true };
    }
    return { error: 'User not found' };
  },

  // ────────────────────── SYLLABUS ──────────────────────

  getSyllabus() {
    return getItem('syllabus') || [];
  },

  getUnits(classId) {
    const syllabus = this.getSyllabus();
    return syllabus.filter(u => u.classId === classId);
  },

  getChapter(chapterId) {
    const syllabus = this.getSyllabus();
    for (const unit of syllabus) {
      const chapter = unit.chapters.find(c => c.id === chapterId);
      if (chapter) return { ...chapter, unitTitle: unit.title, unitNumber: unit.number, unitId: unit.id, classId: unit.classId };
    }
    return null;
  },

  getAllChapters(classId) {
    const units = classId ? this.getUnits(classId) : this.getSyllabus();
    return units.flatMap(u =>
      u.chapters.map(c => ({ ...c, unitTitle: u.title, unitNumber: u.number, unitId: u.id, classId: u.classId }))
    );
  },

  getConcepts(chapterId) {
    const chapter = this.getChapter(chapterId);
    return chapter ? (chapter.concepts || []) : [];
  },

  getConcept(conceptId) {
    const syllabus = this.getSyllabus();
    for (const unit of syllabus) {
      for (const chapter of unit.chapters) {
        const concept = (chapter.concepts || []).find(c => c.id === conceptId);
        if (concept) {
          return { ...concept, chapterId: chapter.id, chapterTitle: chapter.title, unitTitle: unit.title, classId: unit.classId };
        }
      }
    }
    return null;
  },

  // ────────────────────── VIDEOS ──────────────────────

  getVideos(conceptId) {
    const videos = getItem('videos') || [];
    return conceptId ? videos.filter(v => v.conceptId === conceptId) : videos;
  },

  getVideosByChapter(chapterId) {
    const videos = getItem('videos') || [];
    return videos.filter(v => v.chapterId === chapterId);
  },

  addVideo(data) {
    const videos = getItem('videos') || [];
    const video = {
      id: generateId('vid'),
      ...data,
      youtubeId: this.extractYoutubeId(data.youtubeUrl || '')
    };
    videos.push(video);
    setItem('videos', videos);
    this.logActivity('Add Video', `Added video: ${video.title}`);
    return video;
  },

  updateVideo(id, data) {
    const videos = getItem('videos') || [];
    const idx = videos.findIndex(v => v.id === id);
    if (idx >= 0) {
      videos[idx] = { ...videos[idx], ...data };
      if (data.youtubeUrl) videos[idx].youtubeId = this.extractYoutubeId(data.youtubeUrl);
      setItem('videos', videos);
      this.logActivity('Update Video', `Updated video: ${videos[idx].title}`);
      return videos[idx];
    }
    return null;
  },

  deleteVideo(id) {
    const videos = getItem('videos') || [];
    const v = videos.find(x => x.id === id);
    if (v) {
      setItem('videos', videos.filter(x => x.id !== id));
      this.logActivity('Delete Video', `Deleted video: ${v.title}`);
    }
  },

  extractYoutubeId(url) {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^&#?]+)/);
    return match ? match[1] : url;
  },

  // ────────────────────── NOTES ──────────────────────

  getNotes(chapterId) {
    const notes = getItem('notes') || [];
    return chapterId ? notes.filter(n => n.chapterId === chapterId) : notes;
  },

  getNote(noteId) {
    const notes = getItem('notes') || [];
    return notes.find(n => n.id === noteId) || null;
  },

  addNote(data) {
    const notes = getItem('notes') || [];
    const note = { id: generateId('note'), ...data, createdAt: new Date().toISOString() };
    notes.push(note);
    setItem('notes', notes);
    this.logActivity('Add Note', `Added note: ${note.title}`);
    return note;
  },

  updateNote(id, data) {
    const notes = getItem('notes') || [];
    const idx = notes.findIndex(n => n.id === id);
    if (idx >= 0) {
      notes[idx] = { ...notes[idx], ...data };
      setItem('notes', notes);
      this.logActivity('Update Note', `Updated note: ${notes[idx].title}`);
      return notes[idx];
    }
    return null;
  },

  deleteNote(id) {
    const notes = getItem('notes') || [];
    const n = notes.find(x => x.id === id);
    if (n) {
      setItem('notes', notes.filter(x => x.id !== id));
      this.logActivity('Delete Note', `Deleted note: ${n.title}`);
    }
  },

  // ────────────────────── QUESTIONS ──────────────────────

  getQuestions(filters = {}) {
    let questions = getItem('questions') || [];
    if (filters.chapterId) questions = questions.filter(q => q.chapterId === filters.chapterId);
    if (filters.conceptId) questions = questions.filter(q => q.conceptId === filters.conceptId);
    if (filters.category) questions = questions.filter(q => q.category === filters.category);
    if (filters.difficulty) questions = questions.filter(q => q.difficulty === filters.difficulty);
    if (filters.year) questions = questions.filter(q => q.year === filters.year);
    return questions;
  },

  addQuestion(data) {
    const questions = getItem('questions') || [];
    const question = { id: generateId('q'), ...data };
    questions.push(question);
    setItem('questions', questions);
    this.logActivity('Add Question', `Added question ID: ${question.id}`);
    return question;
  },

  updateQuestion(id, data) {
    const questions = getItem('questions') || [];
    const idx = questions.findIndex(q => q.id === id);
    if (idx >= 0) {
      questions[idx] = { ...questions[idx], ...data };
      setItem('questions', questions);
      this.logActivity('Update Question', `Updated question ID: ${id}`);
      return questions[idx];
    }
    return null;
  },

  deleteQuestion(id) {
    const questions = getItem('questions') || [];
    const q = questions.find(x => x.id === id);
    if (q) {
      setItem('questions', questions.filter(x => x.id !== id));
      this.logActivity('Delete Question', `Deleted question ID: ${id}`);
    }
  },

  // ────────────────────── TESTS ──────────────────────

  getTests(filters = {}) {
    let tests = getItem('tests') || [];
    if (filters.type) tests = tests.filter(t => t.type === filters.type);
    if (filters.chapterId) tests = tests.filter(t => t.chapterId === filters.chapterId);
    if (filters.classId) tests = tests.filter(t => t.classId === filters.classId);
    return tests;
  },

  getTest(testId) {
    const tests = getItem('tests') || [];
    const test = tests.find(t => t.id === testId);
    if (!test) return null;
    const allQuestions = getItem('questions') || [];
    const testCopy = { ...test };
    testCopy.questions = (test.questionIds || []).map(qid => allQuestions.find(q => q.id === qid)).filter(Boolean);
    return testCopy;
  },

  addTest(data) {
    const tests = getItem('tests') || [];
    const test = { id: generateId('test'), ...data, createdAt: new Date().toISOString() };
    tests.push(test);
    setItem('tests', tests);
    this.logActivity('Create Test', `Created test: ${test.title}`);
    return test;
  },

  updateTest(id, data) {
    const tests = getItem('tests') || [];
    const idx = tests.findIndex(t => t.id === id);
    if (idx >= 0) {
      tests[idx] = { ...tests[idx], ...data };
      setItem('tests', tests);
      this.logActivity('Update Test', `Updated test: ${tests[idx].title}`);
      return tests[idx];
    }
    return null;
  },

  deleteTest(id) {
    const tests = getItem('tests') || [];
    const t = tests.find(x => x.id === id);
    if (t) {
      setItem('tests', tests.filter(x => x.id !== id));
      this.logActivity('Delete Test', `Deleted test: ${t.title}`);
    }
  },

  submitTest(testId, answers, timeTaken) {
    const test = this.getTest(testId);
    if (!test) return null;

    let correct = 0, wrong = 0, unattempted = 0;
    const answerDetails = {};

    test.questions.forEach(q => {
      const selected = answers[q.id];
      if (selected === undefined || selected === null || selected === -1) {
        unattempted++;
        answerDetails[q.id] = { selected: -1, correct: q.correctAnswer, isCorrect: false, status: 'unattempted' };
      } else if (selected === q.correctAnswer) {
        correct++;
        answerDetails[q.id] = { selected, correct: q.correctAnswer, isCorrect: true, status: 'correct' };
      } else {
        wrong++;
        answerDetails[q.id] = { selected, correct: q.correctAnswer, isCorrect: false, status: 'wrong' };
      }
    });

    const result = {
      id: generateId('result'),
      testId,
      testTitle: test.title,
      userId: getItem('currentUserId'),
      answers: answerDetails,
      score: correct,
      totalQuestions: test.questions.length,
      correct,
      wrong,
      unattempted,
      accuracy: test.questions.length > 0 ? Math.round((correct / test.questions.length) * 100) : 0,
      timeTaken,
      duration: test.duration,
      completedAt: new Date().toISOString()
    };

    const userId = getItem('currentUserId');
    const results = getItem(`testResults_${userId}`) || [];
    results.push(result);
    setItem(`testResults_${userId}`, results);

    this.markTestCompleted(testId);
    
    // Update Concept Mastery
    const accuracy = test.questions.length > 0 ? Math.round((correct / test.questions.length) * 100) : 0;
    const points = Math.round(accuracy * 0.4);
    if (test.chapterId && points > 0) {
      const concepts = this.getConcepts(test.chapterId);
      if (concepts && concepts.length > 0) {
        concepts.forEach(c => {
          this.increaseConceptMastery(c.id, points);
        });
      }
    }
    
    if (this.grantXP) {
      const xpEarned = test.questions.length > 0 ? Math.round((correct / test.questions.length) * 50) : 0;
      if (xpEarned > 0) this.grantXP(xpEarned, userId);
      this.updateDailyChallenge('test');
      this.checkAchievements(userId);
    }

    return result;
  },

  getTestResult(resultId) {
    const userId = getItem('currentUserId');
    const results = getItem(`testResults_${userId}`) || [];
    return results.find(r => r.id === resultId) || null;
  },

  getTestResults() {
    const userId = getItem('currentUserId');
    return getItem(`testResults_${userId}`) || [];
  },

  // ────────────────────── PROGRESS ──────────────────────

  getProgress(userId = null) {
    userId = userId || getItem('currentUserId');
    if (!userId) return { videosWatched: [], notesRead: [], testsCompleted: [], chapterProgress: {}, streak: 0, xp: 0, achievements: [], lastActive: '' };
    return getItem(`progress_${userId}`) || {
      videosWatched: [], notesRead: [], testsCompleted: [],
      chapterProgress: {}, streak: 0, xp: 0, achievements: [], lastActive: new Date().toISOString()
    };
  },

  markVideoWatched(videoId) {
    const userId = getItem('currentUserId');
    if (!userId) return;
    const progress = this.getProgress();
    if (!progress.videosWatched.includes(videoId)) {
      progress.videosWatched.push(videoId);
      progress.lastActive = new Date().toISOString();
      setItem(`progress_${userId}`, progress);
      
      // Update Concept Mastery
      const videos = getItem('videos') || [];
      const video = videos.find(v => v.id === videoId);
      if (video && video.conceptId) {
        this.increaseConceptMastery(video.conceptId, 25);
      }
      
      if (this.grantXP) {
        this.grantXP(10, userId);
        this.updateDailyChallenge('video');
        this.checkAchievements(userId);
      }
    }
  },

  markNoteRead(noteId) {
    const userId = getItem('currentUserId');
    if (!userId) return;
    const progress = this.getProgress();
    if (!progress.notesRead.includes(noteId)) {
      progress.notesRead.push(noteId);
      progress.lastActive = new Date().toISOString();
      setItem(`progress_${userId}`, progress);
      
      // Update Concept Mastery
      const note = this.getNote(noteId);
      if (note && note.chapterId) {
        const concepts = this.getConcepts(note.chapterId);
        if (concepts && concepts.length > 0) {
          this.increaseConceptMastery(concepts[0].id, 15);
        }
      }
      
      if (this.grantXP) {
        this.grantXP(5, userId);
        this.updateDailyChallenge('note');
        this.checkAchievements(userId);
      }
    }
  },

  markTestCompleted(testId) {
    const userId = getItem('currentUserId');
    if (!userId) return;
    const progress = this.getProgress();
    if (!progress.testsCompleted.includes(testId)) {
      progress.testsCompleted.push(testId);
      progress.lastActive = new Date().toISOString();
      setItem(`progress_${userId}`, progress);
    }
  },

  updateStreak(userId) {
    userId = userId || getItem('currentUserId');
    if (!userId) return;
    const progress = getItem(`progress_${userId}`) || { streak: 0 };
    const lastActive = progress.lastActive ? new Date(progress.lastActive) : null;
    const now = new Date();

    if (lastActive) {
      const lastDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        progress.streak = (progress.streak || 0) + 1;
      } else if (diffDays > 1) {
        progress.streak = 1;
      }
      // If diffDays === 0, same day, keep streak
    } else {
      progress.streak = 1;
    }
    progress.lastActive = now.toISOString();
    setItem(`progress_${userId}`, progress);

    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      users[idx].streak = progress.streak;
      users[idx].lastActive = now.toISOString();
      setItem('users', users);
    }
  },

  getChapterProgress(chapterId) {
    const videos = this.getVideosByChapter(chapterId);
    const notes = this.getNotes(chapterId);
    const questions = this.getQuestions({ chapterId });
    const progress = this.getProgress();

    const watchedCount = videos.filter(v => progress.videosWatched.includes(v.id)).length;
    const readCount = notes.filter(n => progress.notesRead.includes(n.id)).length;

    const totalItems = videos.length + notes.length;
    const completedItems = watchedCount + readCount;

    return {
      videos: { total: videos.length, completed: watchedCount },
      notes: { total: notes.length, completed: readCount },
      questions: { total: questions.length },
      percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  },

  getOverallProgress(classId) {
    const chapters = this.getAllChapters(classId);
    if (chapters.length === 0) return 0;
    let totalPercentage = 0;
    chapters.forEach(ch => {
      totalPercentage += this.getChapterProgress(ch.id).percentage;
    });
    return Math.round(totalPercentage / chapters.length);
  },

  // ────────────────────── ADMIN: SYLLABUS ──────────────────────

  addUnit(data) {
    const syllabus = this.getSyllabus();
    const unit = { id: generateId('unit'), ...data, chapters: data.chapters || [] };
    syllabus.push(unit);
    setItem('syllabus', syllabus);
    return unit;
  },

  updateUnit(unitId, data) {
    const syllabus = this.getSyllabus();
    const idx = syllabus.findIndex(u => u.id === unitId);
    if (idx >= 0) {
      syllabus[idx] = { ...syllabus[idx], ...data };
      setItem('syllabus', syllabus);
      return syllabus[idx];
    }
    return null;
  },

  deleteUnit(unitId) {
    const syllabus = this.getSyllabus();
    setItem('syllabus', syllabus.filter(u => u.id !== unitId));
  },

  addChapter(unitId, chapterData) {
    const syllabus = this.getSyllabus();
    const unit = syllabus.find(u => u.id === unitId);
    if (unit) {
      const chapter = {
        id: generateId('ch'),
        ...chapterData,
        concepts: chapterData.concepts || [],
        order: unit.chapters.length + 1
      };
      unit.chapters.push(chapter);
      setItem('syllabus', syllabus);
      return chapter;
    }
    return null;
  },

  updateChapter(chapterId, data) {
    const syllabus = this.getSyllabus();
    for (const unit of syllabus) {
      const idx = unit.chapters.findIndex(c => c.id === chapterId);
      if (idx >= 0) {
        unit.chapters[idx] = { ...unit.chapters[idx], ...data };
        setItem('syllabus', syllabus);
        return unit.chapters[idx];
      }
    }
    return null;
  },

  deleteChapter(chapterId) {
    const syllabus = this.getSyllabus();
    for (const unit of syllabus) {
      unit.chapters = unit.chapters.filter(c => c.id !== chapterId);
    }
    setItem('syllabus', syllabus);
  },

  addConcept(chapterId, conceptData) {
    const syllabus = this.getSyllabus();
    for (const unit of syllabus) {
      const chapter = unit.chapters.find(c => c.id === chapterId);
      if (chapter) {
        if (!chapter.concepts) chapter.concepts = [];
        const concept = { id: generateId('con'), ...conceptData, order: chapter.concepts.length + 1 };
        chapter.concepts.push(concept);
        setItem('syllabus', syllabus);
        return concept;
      }
    }
    return null;
  },

  updateConcept(conceptId, data) {
    const syllabus = this.getSyllabus();
    for (const unit of syllabus) {
      for (const chapter of unit.chapters) {
        const idx = (chapter.concepts || []).findIndex(con => con.id === conceptId);
        if (idx >= 0) {
          chapter.concepts[idx] = { ...chapter.concepts[idx], ...data };
          setItem('syllabus', syllabus);
          return chapter.concepts[idx];
        }
      }
    }
    return null;
  },

  deleteConcept(conceptId) {
    const syllabus = this.getSyllabus();
    for (const unit of syllabus) {
      for (const chapter of unit.chapters) {
        if (chapter.concepts) {
          chapter.concepts = chapter.concepts.filter(con => con.id !== conceptId);
        }
      }
    }
    setItem('syllabus', syllabus);
  },

  // ────────────────────── ADMIN: STUDENTS ──────────────────────

  getAllStudents() {
    const users = getItem('users') || [];
    return users.filter(u => u.role === 'student');
  },

  getAllUsers() {
    return getItem('users') || [];
  },

  updateStudentSubscription(userId, subscription) {
    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      users[idx].subscription = subscription;
      setItem('users', users);
      this.logActivity('Update Subscription Status', `Set ${users[idx].email} plan to ${subscription}`);
      return users[idx];
    }
    return null;
  },

  deleteStudent(userId) {
    const users = getItem('users') || [];
    const student = users.find(u => u.id === userId);
    if (student) {
      setItem('users', users.filter(u => u.id !== userId));
      removeItem(`progress_${userId}`);
      removeItem(`testResults_${userId}`);
      this.logActivity('Delete Student', `Deleted student: ${student.email}`);
    }
  },

  approveStudent(userId) {
    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      users[idx].status = 'approved';
      setItem('users', users);
      this.logActivity('Approve Student Registration', `Approved student: ${users[idx].email}`);
      return users[idx];
    }
    return null;
  },

  // ────────────────────── STATS ──────────────────────

  getStats() {
    const syllabus = this.getSyllabus();
    const totalChapters = syllabus.reduce((sum, u) => sum + u.chapters.length, 0);
    const totalConcepts = syllabus.reduce((sum, u) =>
      sum + u.chapters.reduce((s, c) => s + (c.concepts || []).length, 0), 0);
    const questions = getItem('questions') || [];
    const tests = getItem('tests') || [];
    const users = getItem('users') || [];
    const videos = getItem('videos') || [];
    const notes = getItem('notes') || [];

    return {
      totalUnits: syllabus.length,
      totalChapters,
      totalConcepts,
      totalQuestions: questions.length,
      totalTests: tests.length,
      totalStudents: users.filter(u => u.role === 'student').length,
      totalVideos: videos.length,
      totalNotes: notes.length,
      kcetQuestions: questions.filter(q => q.category === 'kcet').length,
      neetQuestions: questions.filter(q => q.category === 'neet').length,
      puQuestions: questions.filter(q => q.category === 'pu').length,
    };
  },

  // ────────────────────── ADVANCED: PHASE 2 ──────────────────────

  grantXP(amount, userId = null) {
    userId = userId || getItem('currentUserId');
    if (!userId) return;
    const progress = this.getProgress(userId);
    progress.xp = (progress.xp || 0) + amount;
    setItem(`progress_${userId}`, progress);
  },

  addXP(amount, userId = null) {
    return this.grantXP(amount, userId);
  },

  getAchievements() {
    return getItem('achievements') || [];
  },

  checkAchievements(userId = null) {
    userId = userId || getItem('currentUserId');
    if (!userId) return [];
    const progress = this.getProgress(userId);
    const unlocked = progress.achievements || [];
    let newUnlocked = [];
    
    if (!unlocked.includes('ach_1') && progress.videosWatched.length >= 1) {
      unlocked.push('ach_1'); newUnlocked.push('ach_1');
      progress.xp = (progress.xp || 0) + 50;
    }
    if (!unlocked.includes('ach_2') && progress.notesRead.length >= 5) {
      unlocked.push('ach_2'); newUnlocked.push('ach_2');
      progress.xp = (progress.xp || 0) + 100;
    }
    if (!unlocked.includes('ach_3')) {
      const results = getItem(`testResults_${userId}`) || [];
      if (results.some(r => r.accuracy === 100)) {
        unlocked.push('ach_3'); newUnlocked.push('ach_3');
        progress.xp = (progress.xp || 0) + 200;
      }
    }
    if (!unlocked.includes('ach_4') && progress.streak >= 7) {
      unlocked.push('ach_4'); newUnlocked.push('ach_4');
      progress.xp = (progress.xp || 0) + 150;
    }
    
    if (newUnlocked.length > 0) {
      progress.achievements = unlocked;
      setItem(`progress_${userId}`, progress);
    }
    return newUnlocked;
  },

  getDailyChallenge() {
    const userId = getItem('currentUserId');
    if (!userId) return null;
    const today = new Date().toISOString().split('T')[0];
    let challenge = getItem(`daily_challenge_${userId}`);
    if (!challenge || challenge.date !== today) {
      challenge = {
        date: today,
        tasks: [
          { id: 't1', type: 'video', target: 1, current: 0, title: 'Watch 1 Video', xpReward: 20 },
          { id: 't2', type: 'note', target: 2, current: 0, title: 'Read 2 Notes', xpReward: 30 },
          { id: 't3', type: 'test', target: 1, current: 0, title: 'Take 1 Test', xpReward: 50 }
        ],
        completed: false
      };
      setItem(`daily_challenge_${userId}`, challenge);
    }
    return challenge;
  },

  updateDailyChallenge(type, count = 1) {
    const userId = getItem('currentUserId');
    if (!userId) return;
    const challenge = this.getDailyChallenge();
    if (!challenge || challenge.completed) return;
    
    let allDone = true;
    let anyUpdate = false;
    challenge.tasks.forEach(task => {
      if (task.type === type && task.current < task.target) {
        task.current = Math.min(task.current + count, task.target);
        anyUpdate = true;
        if (task.current === task.target) {
          this.grantXP(task.xpReward, userId);
        }
      }
      if (task.current < task.target) allDone = false;
    });
    
    if (anyUpdate) {
      challenge.completed = allDone;
      if (allDone) {
        this.grantXP(100, userId); // Bonus for completing all
      }
      setItem(`daily_challenge_${userId}`, challenge);
    }
  },

  createStudyPlan(chapters, examDate, hoursPerDay) {
    const userId = getItem('currentUserId');
    if (!userId) return null;
    const plan = {
      id: generateId('plan'),
      chapters,
      examDate,
      hoursPerDay,
      createdAt: new Date().toISOString(),
      schedule: []
    };
    let currentDate = new Date();
    chapters.forEach((chId, idx) => {
      let date = new Date(currentDate);
      date.setDate(date.getDate() + idx);
      plan.schedule.push({ date: date.toISOString().split('T')[0], chapterId: chId, completed: false });
    });
    setItem(`study_plan_${userId}`, plan);
    return plan;
  },

  getStudyPlan() {
    const userId = getItem('currentUserId');
    if (!userId) return null;
    return getItem(`study_plan_${userId}`);
  },

  updateStudyPlanTask(chapterId, date, completed) {
    const userId = getItem('currentUserId');
    const plan = this.getStudyPlan();
    if (plan) {
      const task = plan.schedule.find(t => t.chapterId === chapterId && t.date === date);
      if (task) {
        task.completed = completed;
        setItem(`study_plan_${userId}`, plan);
      }
    }
  },

  getKcetAnalytics() {
    return this._getExamAnalytics('kcet');
  },

  getNeetAnalytics() {
    return this._getExamAnalytics('neet');
  },

  _getExamAnalytics(examType) {
    const userId = getItem('currentUserId');
    if (!userId) return null;
    const results = getItem(`testResults_${userId}`) || [];
    const examResults = results.filter(r => {
      const test = this.getTest(r.testId);
      return test && test.type === examType;
    });
    let avgScore = 0;
    if (examResults.length > 0) {
      avgScore = examResults.reduce((acc, r) => acc + r.accuracy, 0) / examResults.length;
    }
    
    const allResults = results;
    let chapterScores = {};
    allResults.forEach(r => {
      const test = this.getTest(r.testId);
      if (test && test.chapterId) {
        if (!chapterScores[test.chapterId]) chapterScores[test.chapterId] = [];
        chapterScores[test.chapterId].push(r.accuracy);
      }
    });
    
    let strong = [];
    let weak = [];
    Object.keys(chapterScores).forEach(chId => {
      const scores = chapterScores[chId];
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg >= 70) strong.push(chId);
      else weak.push(chId);
    });
    
    let estimatedScore = Math.round(avgScore * (examType === 'neet' ? 7.2 : 0.6));

    return {
      averageAccuracy: Math.round(avgScore),
      estimatedScore,
      testsTaken: examResults.length,
      strongChapters: strong,
      weakChapters: weak
    };
  },

  saveSmartNoteHighlight(noteId, text, comment = '') {
    const userId = getItem('currentUserId');
    if (!userId) return;
    const key = `smart_notes_${userId}`;
    const highlights = getItem(key) || [];
    highlights.push({ noteId, text, comment, id: generateId('hl'), createdAt: new Date().toISOString() });
    setItem(key, highlights);
  },

  getSmartNoteHighlights(noteId = null) {
    const userId = getItem('currentUserId');
    if (!userId) return [];
    const highlights = getItem(`smart_notes_${userId}`) || [];
    return noteId ? highlights.filter(h => h.noteId === noteId) : highlights;
  },

  // ────────────────────── PHASE 3: CMS & ADMIN ──────────────────────

  getPlans() {
    return getItem('plans') || [];
  },

  addPlan(planData) {
    const plans = this.getPlans();
    const plan = { id: generateId('plan'), ...planData };
    plans.push(plan);
    setItem('plans', plans);
    this.logActivity('Create Subscription Plan', `Created plan: ${plan.name}`);
    return plan;
  },

  updatePlan(planId, planData) {
    const plans = this.getPlans();
    const idx = plans.findIndex(p => p.id === planId);
    if (idx >= 0) {
      plans[idx] = { ...plans[idx], ...planData };
      setItem('plans', plans);
      this.logActivity('Update Subscription Plan', `Updated plan: ${plans[idx].name}`);
      return plans[idx];
    }
    return null;
  },

  deletePlan(planId) {
    const plans = this.getPlans();
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setItem('plans', plans.filter(p => p.id !== planId));
      this.logActivity('Delete Subscription Plan', `Deleted plan: ${plan.name}`);
    }
  },

  logActivity(action, details = '') {
    const userId = getItem('currentUserId');
    const users = getItem('users') || [];
    const user = users.find(u => u.id === userId) || { email: 'System', role: 'system' };
    const logs = getItem('activity_logs') || [];
    logs.push({
      id: generateId('log'),
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userRole: user.role,
      action,
      details
    });
    setItem('activity_logs', logs);
  },

  getActivityLogs() {
    return getItem('activity_logs') || [];
  },

  sendAnnouncement(title, content, channels = ['in-app']) {
    const announcements = getItem('announcements') || [];
    const announcement = {
      id: generateId('ann'),
      title,
      content,
      channels,
      timestamp: new Date().toISOString()
    };
    announcements.push(announcement);
    setItem('announcements', announcements);
    this.logActivity('Send Announcement', `Announcement title: ${title}`);
    return announcement;
  },

  getAnnouncements() {
    return getItem('announcements') || [];
  },

  saveSyllabus(syllabus) {
    setItem('syllabus', syllabus);
  },

  incrementChapterView(chapterId) {
    const views = getItem('chapter_views') || {};
    views[chapterId] = (views[chapterId] || 0) + 1;
    setItem('chapter_views', views);
  },

  getChapterViews() {
    const views = getItem('chapter_views') || {};
    const syllabus = this.getSyllabus();
    let index = 0;
    syllabus.forEach(unit => {
      unit.chapters.forEach(ch => {
        if (!views[ch.id]) {
          views[ch.id] = 120 - index * 3 + Math.floor(Math.sin(index) * 15);
          if (views[ch.id] < 5) views[ch.id] = 5;
        }
        index++;
      });
    });
    return views;
  },

  getAllTestResults() {
    const users = this.getAllUsers();
    let allResults = [];
    users.forEach(u => {
      const results = getItem(`testResults_${u.id}`) || [];
      allResults.push(...results);
    });
    return allResults;
  },

  getTestResultsForUser(userId) {
    return getItem(`testResults_${userId}`) || [];
  },

  toggleStudentSuspension(userId) {
    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      const currentStatus = users[idx].status || 'approved';
      const newStatus = currentStatus === 'suspended' ? 'approved' : 'suspended';
      users[idx].status = newStatus;
      setItem('users', users);
      this.logActivity(newStatus === 'suspended' ? 'Suspend Student' : 'Unsuspend Student', `Set status of ${users[idx].email} to ${newStatus}`);
      return users[idx];
    }
    return null;
  },

  // ────────────────────── PHASE 4: MONETIZATION & SUBSCRIPTIONS ──────────────────────

  getCoupons() {
    return getItem('coupons') || [];
  },

  addCoupon(data) {
    const coupons = this.getCoupons();
    const coupon = {
      id: generateId('coupon'),
      code: data.code.toUpperCase(),
      type: data.type || 'percentage', // 'percentage' or 'fixed'
      value: parseFloat(data.value),
      expiryDate: data.expiryDate || '',
      usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
      usedCount: 0,
      active: true
    };
    coupons.push(coupon);
    setItem('coupons', coupons);
    this.logActivity('Create Coupon', `Created coupon code: ${coupon.code}`);
    return coupon;
  },

  deleteCoupon(id) {
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.id === id);
    if (coupon) {
      setItem('coupons', coupons.filter(c => c.id !== id));
      this.logActivity('Delete Coupon', `Deleted coupon code: ${coupon.code}`);
    }
  },

  validateCoupon(code) {
    if (!code) return { error: 'Coupon code is empty' };
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    
    if (!coupon) return { error: 'Invalid coupon code' };
    
    if (coupon.expiryDate) {
      const expiry = new Date(coupon.expiryDate);
      if (expiry < new Date()) {
        return { error: 'Coupon code has expired' };
      }
    }
    
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return { error: 'Coupon code usage limit reached' };
    }
    
    return { success: true, coupon };
  },

  getTestimonials() {
    return getItem('testimonials') || [];
  },

  addTestimonial(data) {
    const testimonials = this.getTestimonials();
    const user = this.getCurrentUser();
    const testimonial = {
      id: generateId('testi'),
      studentName: user ? user.name : data.studentName || 'Anonymous Student',
      email: user ? user.email : data.email || '',
      rating: parseInt(data.rating) || 5,
      content: data.content || '',
      status: 'pending', // pending, approved
      timestamp: new Date().toISOString()
    };
    testimonials.push(testimonial);
    setItem('testimonials', testimonials);
    this.logActivity('Submit Testimonial', `Testimonial submitted by ${testimonial.studentName}`);
    return testimonial;
  },

  approveTestimonial(id) {
    const testimonials = this.getTestimonials();
    const idx = testimonials.findIndex(t => t.id === id);
    if (idx >= 0) {
      testimonials[idx].status = 'approved';
      setItem('testimonials', testimonials);
      this.logActivity('Approve Testimonial', `Approved testimonial ID: ${id}`);
      return testimonials[idx];
    }
    return null;
  },

  deleteTestimonial(id) {
    const testimonials = this.getTestimonials();
    setItem('testimonials', testimonials.filter(t => t.id !== id));
    this.logActivity('Delete Testimonial', `Deleted testimonial ID: ${id}`);
  },

  getWaitlist() {
    return getItem('waitlist') || [];
  },

  addToWaitlist(data) {
    const waitlist = this.getWaitlist();
    if (waitlist.some(w => w.email.toLowerCase() === data.email.toLowerCase())) {
      return { error: 'You are already on the waitlist!' };
    }
    const entry = {
      id: generateId('wait'),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      timestamp: new Date().toISOString()
    };
    waitlist.push(entry);
    setItem('waitlist', waitlist);
    return { success: true, entry };
  },

  getCertificates() {
    return getItem('certificates') || [];
  },

  getCertificatesForUser(userId) {
    const certificates = this.getCertificates();
    return certificates.filter(c => c.userId === userId);
  },

  generateCertificate(userId, courseName, type = 'completion') {
    const certificates = this.getCertificates();
    const users = getItem('users') || [];
    const student = users.find(u => u.id === userId);
    if (!student) return null;
    
    // Check if certificate already exists
    const existing = certificates.find(c => c.userId === userId && c.courseName === courseName);
    if (existing) return existing;

    const cert = {
      id: generateId('cert'),
      userId,
      studentName: student.name,
      courseName,
      type, // 'completion', 'unit', 'chapter'
      certificateId: 'BV-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString()
    };
    certificates.push(cert);
    setItem('certificates', certificates);
    this.logActivity('Generate Certificate', `Generated certificate for ${student.email} - ${courseName}`);
    return cert;
  },

  getPaymentSettings() {
    return getItem('payment_settings') || {
      keyId: 'rzp_test_bv109238',
      keySecret: '********************',
      liveMode: false
    };
  },

  savePaymentSettings(settings) {
    setItem('payment_settings', settings);
    this.logActivity('Update Payment Settings', 'Updated API configuration keys');
  },

  toggleAutoRenewal(userId) {
    userId = userId || getItem('currentUserId');
    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      const current = !!users[idx].autoRenew;
      users[idx].autoRenew = !current;
      setItem('users', users);
      this.logActivity('Toggle Auto Renewal', `Set auto-renewal to ${!current} for ${users[idx].email}`);
      return users[idx];
    }
    return null;
  },

  upgradeSubscription(userId, planId, price, couponUsed = '') {
    const users = getItem('users') || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      const user = users[idx];
      const durationDays = planId === 'yearly' ? 365 : 30;
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + durationDays);

      user.subscription = 'premium';
      user.subscriptionPlan = planId;
      user.subscriptionStart = start.toISOString();
      user.subscriptionEnd = end.toISOString();
      if (user.autoRenew === undefined) user.autoRenew = true; // Enabled by default on checkout
      
      const paymentId = 'pay_' + Math.random().toString(36).substr(2, 9) + Date.now().toString().substr(-4);
      const invoiceId = 'INV-' + start.getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

      const paymentRecord = {
        paymentId,
        invoiceId,
        planName: planId === 'yearly' ? 'Premium Yearly' : 'Premium Monthly',
        amount: price,
        date: start.toISOString(),
        coupon: couponUsed,
        status: 'success'
      };

      if (!user.paymentHistory) user.paymentHistory = [];
      user.paymentHistory.push(paymentRecord);

      // Increment coupon usage count if coupon was used
      if (couponUsed) {
        const coupons = this.getCoupons();
        const cIdx = coupons.findIndex(c => c.code.toUpperCase() === couponUsed.toUpperCase());
        if (cIdx >= 0) {
          coupons[cIdx].usedCount++;
          setItem('coupons', coupons);
        }
      }

      setItem('users', users);
      this.logActivity('Subscription Purchase', `User ${user.email} purchased ${planId} plan for ₹${price}`);
      
      // Seed welcome / welcome notifications
      this.sendAnnouncement(
        'Subscription Activated! 🎉',
        `Thank you for subscribing to BioVerse Premium! Your ${planId} plan is active until ${end.toLocaleDateString('en-IN')}. Enjoy full access!`,
        ['in-app']
      );

      return user;
    }
    return null;
  },

  // ────────────────────── PHASE 5: AI & ADAPTIVE SYSTEMS ──────────────────────

  getConceptMastery(conceptId) {
    const userId = getItem('currentUserId');
    if (!userId) return { score: 0, level: 'Beginner' };
    const progress = this.getProgress();
    if (!progress.conceptMastery) progress.conceptMastery = {};
    const score = progress.conceptMastery[conceptId] || 0;
    let level = 'Beginner';
    if (score > 75) level = 'Mastered';
    else if (score > 50) level = 'Advanced';
    else if (score > 25) level = 'Intermediate';
    return { score, level };
  },

  increaseConceptMastery(conceptId, points) {
    const userId = getItem('currentUserId');
    if (!userId) return;
    const progress = this.getProgress();
    if (!progress.conceptMastery) progress.conceptMastery = {};
    const current = progress.conceptMastery[conceptId] || 0;
    progress.conceptMastery[conceptId] = Math.min(current + points, 100);
    setItem(`progress_${userId}`, progress);
    this.logActivity('Concept Mastery Increased', `Concept ${conceptId} mastery raised by +${points} points`);
  },

  getAiChats() {
    const userId = getItem('currentUserId');
    if (!userId) return [];
    return getItem(`ai_chats_${userId}`) || [];
  },

  saveAiChat(question, answer) {
    const userId = getItem('currentUserId');
    if (!userId) return;
    const chats = this.getAiChats();
    chats.push({
      id: generateId('chat'),
      question,
      answer,
      timestamp: new Date().toISOString()
    });
    setItem(`ai_chats_${userId}`, chats);
  },

  generateCustomTest(chapterId, difficulty, numQuestions) {
    const questions = this.getQuestions({ chapterId, difficulty });
    let testQuestions = questions;
    if (testQuestions.length === 0) {
      testQuestions = this.getQuestions({ chapterId });
    }
    // Shuffle and slice
    testQuestions = testQuestions.sort(() => 0.5 - Math.random()).slice(0, numQuestions);
    
    if (testQuestions.length === 0) return null;
    
    const qIds = testQuestions.map(q => q.id);
    const chapter = this.getChapter(chapterId);
    const title = `AI Custom Test: ${chapter ? chapter.title : 'Chapter'} (${difficulty.toUpperCase()})`;
    
    const newTest = this.addTest({
      title,
      type: 'mock',
      duration: numQuestions * 2, // 2 mins per question
      questionIds: qIds,
      chapterId,
      isAiGenerated: true
    });
    return newTest;
  },

  reschedulePlannerPlan() {
    const userId = getItem('currentUserId');
    if (!userId) return null;
    const plan = this.getStudyPlan();
    if (!plan) return null;
    
    plan.isAdaptive = true;
    plan.rescheduledAt = new Date().toISOString();
    
    let shiftedCount = 0;
    plan.schedule.forEach(task => {
      if (!task.completed) {
        task.isCatchUp = true;
        task.notes = "⚠️ Catch-Up Session recommended";
        shiftedCount++;
      }
    });
    
    if (shiftedCount > 0) {
      // Append a special catch-up task card at the end of the schedule
      plan.schedule.push({
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        chapterId: plan.schedule[0].chapterId,
        completed: false,
        isRevisionSession: true,
        notes: "🔄 Revision Session: Consolidate weak areas"
      });
    }
    
    setItem(`study_plan_${userId}`, plan);
    this.logActivity('Adaptive Planner Reschedule', `Rescheduled study plan with ${shiftedCount} catch-up items`);
    return plan;
  },

  askBiologyTutor(question, currentContext = {}, language = 'en') {
    const questionLower = question.toLowerCase();
    const biologyKeywords = ['cell', 'photo', 'dna', 'rna', 'heart', 'genetics', 'mitosis', 'meiosis', 'plant', 'human', 'biomolecules', 'biology', 'exam', 'neet', 'kcet', 'pu', 'syllabus', 'chromosome', 'gene', 'organ', 'reproduction', 'transpiration', 'respiration', 'photosynthesis', 'digest', 'circulation', 'nervous', 'hormone', 'blood', 'artery', 'vein'];
    
    const isBio = biologyKeywords.some(keyword => questionLower.includes(keyword));
    if (!isBio) {
      if (language === 'kn') {
        return "ನಾನು ನಿಮ್ಮ ಬಯೋವರ್ಸ್ ಬಯಾಲಜಿ ಶಿಕ್ಷಕ. ನಾನು ಬಯಾಲಜಿ ಮತ್ತು ಕರ್ನಾಟಕ ಪಿಯು/ಕೆಸಿಇಟಿ/ನೀಟ್ ಪಠ್ಯಕ್ರಮದ ಪ್ರಶ್ನೆಗಳಿಗೆ ಮಾತ್ರ ಉತ್ತರಿಸಬಲ್ಲೆ. ದಯವಿಟ್ಟು ಜೀವವಿಜ್ಞಾನಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ!";
      }
      return "I am your BioVerse Biology Tutor. I can only answer Biology and Karnataka PU Board/KCET/NEET syllabus questions. Please ask me a Biology related question!";
    }
    
    const chapterTitle = currentContext.chapterTitle || '';
    const classLabel = currentContext.classLabel || '';
    
    let answer = '';
    let tricks = '';
    let recs = [];
    
    if (questionLower.includes('photosynthesis')) {
      answer = `**Photosynthesis** is the process by which green plants synthesize organic compounds (carbohydrates) from inorganic raw materials like carbon dioxide and water in the presence of sunlight and chlorophyll.
- **Light Reaction (Granum):** Occurs in the chloroplast thylakoids. Photolysis of water releases O2 and generates ATP and NADPH.
- **Dark Reaction / Calvin Cycle (Stroma):** Fixes carbon dioxide using ATP and NADPH into sugars.
*Exam Focus:* Memorize the Calvin cycle stages: Carboxylation, Reduction, and Regeneration.`;
      tricks = `💡 *Memory Trick:* **C**owboys **R**ide **R**apidly — **C**arboxylation, **R**eduction, **R**egeneration.`;
      recs = ['Light Reaction', 'Calvin Cycle', 'Chloroplast Structure'];
    } else if (questionLower.includes('dna') || questionLower.includes('replication') || questionLower.includes('molecular')) {
      answer = `**DNA Replication** is semiconservative. The double helix unwinds, and each strand acts as a template for synthesis of a new complementary strand.
- **Helicase:** Unwinds the DNA helix at the replication fork.
- **DNA Polymerase:** Synthesizes the leading strand continuously and lagging strand discontinuously (Okazaki fragments) in the 5' to 3' direction.
- **Ligase:** Glues Okazaki fragments together.`;
      tricks = `💡 *Memory Trick:* **H**elicase **H**alves the helix; **P**olymerase **P**olishes new strands; **L**igase **L**inks them.`;
      recs = ['Transcription', 'Genetic Code', 'Okazaki Fragments'];
    } else if (questionLower.includes('heart')) {
      answer = `The **Human Heart** is a 4-chambered muscular organ that pumps blood throughout the body.
- **Right Side:** Receives deoxygenated blood from the body and pumps it to the lungs (Pulmonary Circulation).
- **Left Side:** Receives oxygenated blood from the lungs and pumps it to the body (Systemic Circulation).
- **Valves:** Tricuspid (right) and Bicuspid/Mitral (left) prevent backflow.`;
      tricks = `💡 *Memory Trick:* **LAB RAT** — **L**eft **A**trium **B**icuspid, **R**ight **A**trium **T**ricuspid.`;
      recs = ['Double Circulation', 'Cardiac Cycle', 'ECG Waveforms'];
    } else if (questionLower.includes('genetics') || questionLower.includes('cross') || questionLower.includes('mendel')) {
      answer = `**Mendelian Genetics** covers heredity rules:
- **Law of Dominance:** Dominant alleles mask recessive alleles in heterozygotes.
- **Law of Segregation:** Alleles separate during gamete formation.
- **Monohybrid Ratio:** Phenotypic 3:1, Genotypic 1:2:1.
- **Dihybrid Ratio:** Phenotypic 9:3:3:1.`;
      tricks = `💡 *Memory Trick:* **S**egregation happens in **S**ingle genes; **I**ndependent assortment in **I**nterdependent multiple genes.`;
      recs = ['Monohybrid Cross', 'Dihybrid Cross', 'Linkage & Recombination'];
    } else if (questionLower.includes('mitosis') || questionLower.includes('meiosis') || questionLower.includes('cell division')) {
      answer = `**Mitosis** (Equational Division) results in two diploid daughter cells. **Meiosis** (Reduction Division) results in four haploid gametes.
- Mitosis Phases: Prophase, Metaphase, Anaphase, Telophase.
- Meiosis Prophase I has 5 sub-stages where crossing over occurs (Pachytene).`;
      tricks = `💡 *Memory Trick:* **IPMAT** — **I**nterphase, **P**rophase, **M**etaphase, **A**naphase, **T**elophase. 
For Meiosis I: **L**azy **Z**ebra **P**lays **D**ouble **D**rums — **L**eptotene, **Z**ygotene, **P**achytene, **D**iplotene, **D**iakinesis.`;
      recs = ['Prophase I', 'Crossing Over', 'Cell Cycle Checkpoints'];
    } else {
      answer = `Here is a detailed explanation: In Karnataka PU Board and NEET Biology, understanding structural details and pathways is critical. 
- Ensure you review the NCERT definitions and diagrams carefully.
- Always practice drawing the standard labels.
- Practice solving MCQs daily to solidify this concept.`;
      tricks = `💡 *Syllabus Tip:* Pay close attention to definitions highlighted in your textbook.`;
      recs = ['Syllabus overview', 'NCERT points', 'Past year papers'];
    }
    
    if (chapterTitle) {
      answer = `*Context Focus: ${chapterTitle} (${classLabel})*\n\n` + answer;
    }
    
    if (language === 'kn') {
      let knAnswer = `**${chapterTitle || 'ಬಯಾಲಜಿ'} ಬಗ್ಗೆ ವಿವರಣೆ:**\n\n`;
      if (questionLower.includes('photosynthesis')) {
        knAnswer += `**ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Photosynthesis)** ಎನ್ನುವುದು ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ಕಾರ್ಬನ್ ಡೈಆಕ್ಸೈಡ್ ಬಳಸಿ ಆಹಾರ ತಯಾರಿಸುವ ಕ್ರಿಯೆ.\n- **ಬೆಳಕಿನ ಕ್ರಿಯೆ (Light Reaction):** ಹರಿದ್ರೇಣುವಿನ ಥೈಲಕಾಯ್ಡ್‌ನಲ್ಲಿ ನಡೆಯುತ್ತದೆ.\n- **ಕತ್ತಲೆ ಕ್ರಿಯೆ (Dark Reaction):** ಸ್ಟ್ರೋಮಾದಲ್ಲಿ ನಡೆಯುತ್ತದೆ.`;
        knAnswer += `\n\n💡 *ನೆನಪಿಡುವ ವಿಧಾನ:* Cowboys Ride Rapidly (Carboxylation, Reduction, Regeneration)`;
      } else if (questionLower.includes('dna')) {
        knAnswer += `**ಡಿಎನ್ಎ ರೆಪ್ಲಿಕೇಶನ್ (DNA Replication):** ಡಿಎನ್ಎ ತನ್ನದೇ ಆದ ಮತ್ತೊಂದು ನಕಲನ್ನು ತಯಾರಿಸುವ ಪ್ರಕ್ರಿಯೆ. ಇದು ಅರೆ-ಸಂಪ್ರದಾಯಬದ್ಧವಾಗಿದೆ (Semiconservative).`;
      } else if (questionLower.includes('heart')) {
        knAnswer += `**ಮಾನವನ ಹೃದಯ (Human Heart):** ನಾಲ್ಕು ಕೋಣೆಗಳ ಸ್ನಾಯು ಅಂಗ. ಬಲ ಭಾಗವು ಆಮ್ಲಜನಕರಹಿತ ರಕ್ತವನ್ನು ಪಡೆಯುತ್ತದೆ, ಎಡ ಭಾಗವು ಆಮ್ಲಜನಕಯುಕ್ತ ರಕ್ತವನ್ನು ಇಡೀ ದೇಹಕ್ಕೆ ಪಂಪ್ ಮಾಡುತ್ತದೆ.`;
      } else {
        knAnswer += `ಕರ್ನಾಟಕ ಪಿಯು ಬೋರ್ಡ್ ಮತ್ತು ನೀಟ್ ಪರೀಕ್ಷೆಗೆ ಇದು ಪ್ರಮುಖ ವಿಷಯವಾಗಿದೆ. ದಯವಿಟ್ಟು ಎನ್.ಸಿ.ಇ.ಆರ್.ಟಿ ಪಠ್ಯವನ್ನು ಗಮನಿಸಿ.`;
      }
      return knAnswer;
    }
    
    return `${answer}\n\n${tricks}\n\n*Recommended Topics: ${recs.join(', ')}*`;
  },

  // ────────────────────── UTILITY ──────────────────────

  clearAll() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) keys.push(key);
    }
    keys.forEach(k => localStorage.removeItem(k));
  },

  isSeeded() {
    return !!getItem('seeded');
  },

  markSeeded() {
    setItem('seeded', true);
  },

  resetAndReseed() {
    this.clearAll();
  }
};

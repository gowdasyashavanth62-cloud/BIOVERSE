import { supabase } from './supabase.js';
import { diagramsData } from './data/diagrams.js';
import { pyqData } from './data/pyqs.js';

const PREFIX = 'bv_';

function getLocalItem(key) {
  try {
    const data = localStorage.getItem(PREFIX + key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function setLocalItem(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

function removeLocalItem(key) {
  localStorage.removeItem(PREFIX + key);
}

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

export const Store = {

  _currentUser: null,
  _initialized: false,

  // ────────────────────── AUTH ──────────────────────

  async initAuth() {
    if (this._initialized) return;
    
    // Resolve initial session
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      await this._syncUserProfile(session.user);
    }
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        await this._syncUserProfile(session.user);
      } else {
        this._currentUser = null;
        removeLocalItem('currentUserId');
      }
    });

    this._initialized = true;
  },

  async _syncUserProfile(authUser) {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (profile) {
        this._currentUser = {
          id: authUser.id,
          email: authUser.email,
          name: profile.full_name,
          ...profile
        };
        setLocalItem('currentUserId', authUser.id);
      } else {
        // Fallback profile creation if database trigger lagged
        const newProfile = {
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Student',
          email: authUser.email,
          phone: authUser.user_metadata?.phone || '',
          class: authUser.user_metadata?.class || '1st PU',
          subscription_plan: 'free',
          subscription_status: 'active',
          role: authUser.user_metadata?.role || 'student',
          xp: 0,
          streak: 0,
          last_active: new Date().toISOString()
        };
        
        await supabase.from('users').insert(newProfile);
        this._currentUser = { ...newProfile, name: newProfile.full_name };
        setLocalItem('currentUserId', authUser.id);
      }
    } catch (e) {
      console.warn('Profile sync failed:', e);
      this._currentUser = authUser;
    }
  },

  getCurrentUser() {
    return this._currentUser;
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      return { error: error.message };
    }
    await this._syncUserProfile(data.user);
    return this._currentUser;
  },

  async signup(userData) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.name,
          phone: userData.phone || '',
          class: userData.class || '1st PU',
          role: 'student'
        }
      }
    });
    if (error) {
      return { error: error.message };
    }
    await this._syncUserProfile(data.user);
    return this._currentUser;
  },

  async logout() {
    await supabase.auth.signOut();
    this._currentUser = null;
    removeLocalItem('currentUserId');
  },

  async updateProfile(data) {
    const user = this.getCurrentUser();
    if (!user) return null;
    
    const profileUpdates = {};
    if (data.name !== undefined) profileUpdates.full_name = data.name;
    if (data.full_name !== undefined) profileUpdates.full_name = data.full_name;
    if (data.phone !== undefined) profileUpdates.phone = data.phone;
    if (data.class !== undefined) profileUpdates.class = data.class;
    if (data.xp !== undefined) profileUpdates.xp = data.xp;
    if (data.streak !== undefined) profileUpdates.streak = data.streak;
    if (data.last_active !== undefined) profileUpdates.last_active = data.last_active;
    if (data.subscription_plan !== undefined) profileUpdates.subscription_plan = data.subscription_plan;
    if (data.subscription_status !== undefined) profileUpdates.subscription_status = data.subscription_status;

    const { error } = await supabase
      .from('users')
      .update(profileUpdates)
      .eq('id', user.id);
      
    if (error) {
      console.error('Update profile error:', error.message);
      return null;
    }
    
    this._currentUser = { ...this._currentUser, ...profileUpdates, name: profileUpdates.full_name || this._currentUser.full_name };
    return this._currentUser;
  },

  async changePassword(oldPassword, newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) {
      return { error: error.message };
    }
    return { success: true };
  },

  // ────────────────────── SYLLABUS ──────────────────────

  async getSyllabus() {
    const { data: units } = await supabase.from('units').select('*').order('order_number');
    const { data: chapters } = await supabase.from('chapters').select('*').order('order_number');
    const { data: concepts } = await supabase.from('concepts').select('*').order('order_number');

    if (!units || !chapters || !concepts) return [];

    return units.map(u => {
      const uChapters = chapters.filter(c => c.unit_id === u.id).map(c => {
        const cConcepts = concepts.filter(con => con.chapter_id === c.id).map(con => ({
          id: con.id,
          title: con.concept_name,
          description: con.description,
          order: con.order_number
        }));
        
        return {
          id: c.id,
          title: c.chapter_name,
          description: c.description,
          order: c.order_number,
          concepts: cConcepts
        };
      });
      
      return {
        id: u.id,
        number: u.order_number.toString(),
        title: u.name,
        description: u.description,
        classId: u.class_id,
        chapters: uChapters
      };
    });
  },

  async getUnits(classId) {
    const syllabus = await this.getSyllabus();
    return syllabus.filter(u => u.classId === classId);
  },

  async getChapter(chapterId) {
    const { data: chapter, error } = await supabase
      .from('chapters')
      .select('*, units(*)')
      .eq('id', chapterId)
      .single();
      
    if (error || !chapter) return null;
    return {
      id: chapter.id,
      title: chapter.chapter_name,
      description: chapter.description,
      order: chapter.order_number,
      unitTitle: chapter.units.name,
      unitNumber: chapter.units.order_number.toString(),
      unitId: chapter.units.id,
      classId: chapter.units.class_id
    };
  },

  async getAllChapters(classId) {
    const units = classId ? await this.getUnits(classId) : await this.getSyllabus();
    return units.flatMap(u =>
      u.chapters.map(c => ({ ...c, unitTitle: u.title, unitNumber: u.number, unitId: u.id, classId: u.classId }))
    );
  },

  async getConcepts(chapterId) {
    const { data: concepts } = await supabase
      .from('concepts')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('order_number');
    return (concepts || []).map(con => ({
      id: con.id,
      title: con.concept_name,
      description: con.description,
      order: con.order_number
    }));
  },

  async getConcept(conceptId) {
    const { data: concept, error } = await supabase
      .from('concepts')
      .select('*, chapters(*, units(*))')
      .eq('id', conceptId)
      .single();
      
    if (error || !concept) return null;
    return {
      id: concept.id,
      title: concept.concept_name,
      description: concept.description,
      order: concept.order_number,
      chapterId: concept.chapters.id,
      chapterTitle: concept.chapters.chapter_name,
      unitTitle: concept.chapters.units.name,
      classId: concept.chapters.units.class_id
    };
  },

  // ────────────────────── VIDEOS ──────────────────────

  async getVideos(conceptId) {
    let query = supabase.from('videos').select('*');
    if (conceptId) query = query.eq('concept_id', conceptId);
    const { data } = await query;
    return (data || []).map(v => ({
      ...v,
      youtubeId: this.extractYoutubeId(v.youtube_url)
    }));
  },

  async getVideosByChapter(chapterId) {
    // Fetch concepts for chapter, then filter videos
    const concepts = await this.getConcepts(chapterId);
    if (concepts.length === 0) return [];
    const conceptIds = concepts.map(c => c.id);
    const { data } = await supabase.from('videos').select('*').in('concept_id', conceptIds);
    return (data || []).map(v => ({
      ...v,
      youtubeId: this.extractYoutubeId(v.youtube_url)
    }));
  },

  async addVideo(data) {
    const video = {
      id: generateId('vid'),
      concept_id: data.conceptId,
      title: data.title,
      youtube_url: data.youtubeUrl,
      description: data.description || '',
      duration: data.duration || 0
    };
    const { error } = await supabase.from('videos').insert(video);
    if (error) console.error(error);
    await this.logActivity('Add Video', `Added video: ${video.title}`);
    return video;
  },

  async updateVideo(id, data) {
    const update = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.youtubeUrl !== undefined) update.youtube_url = data.youtubeUrl;
    if (data.description !== undefined) update.description = data.description;
    if (data.duration !== undefined) update.duration = data.duration;
    if (data.conceptId !== undefined) update.concept_id = data.conceptId;

    const { error } = await supabase.from('videos').update(update).eq('id', id);
    if (error) console.error(error);
    await this.logActivity('Update Video', `Updated video: ${id}`);
    return { id, ...update };
  },

  async deleteVideo(id) {
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) console.error(error);
    await this.logActivity('Delete Video', `Deleted video: ${id}`);
  },

  extractYoutubeId(url) {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^&#?]+)/);
    return match ? match[1] : url;
  },

  // ────────────────────── NOTES ──────────────────────

  async getNotes(chapterId) {
    // In SQL, we query notes joining concepts where chapter_id matches
    let query = supabase.from('notes').select('*, concepts(*)');
    const { data } = await query;
    let notes = data || [];
    if (chapterId) {
      notes = notes.filter(n => n.concepts && n.concepts.chapter_id === chapterId);
    }
    return notes.map(n => ({
      id: n.id,
      conceptId: n.concept_id,
      chapterId: n.concepts ? n.concepts.chapter_id : '',
      title: n.title,
      pdf_url: n.pdf_url,
      content: n.content,
      createdAt: n.created_at
    }));
  },

  async getNote(noteId) {
    const { data, error } = await supabase.from('notes').select('*, concepts(*)').eq('id', noteId).single();
    if (error || !data) return null;
    return {
      id: data.id,
      conceptId: data.concept_id,
      chapterId: data.concepts ? data.concepts.chapter_id : '',
      title: data.title,
      pdf_url: data.pdf_url,
      content: data.content,
      createdAt: data.created_at
    };
  },

  async addNote(data) {
    const note = {
      id: generateId('note'),
      concept_id: data.conceptId,
      title: data.title,
      pdf_url: data.pdfUrl || '',
      content: data.content || ''
    };
    const { error } = await supabase.from('notes').insert(note);
    if (error) console.error(error);
    await this.logActivity('Add Note', `Added note: ${note.title}`);
    return note;
  },

  async updateNote(id, data) {
    const update = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.pdfUrl !== undefined) update.pdf_url = data.pdfUrl;
    if (data.content !== undefined) update.content = data.content;
    if (data.conceptId !== undefined) update.concept_id = data.conceptId;

    const { error } = await supabase.from('notes').update(update).eq('id', id);
    if (error) console.error(error);
    await this.logActivity('Update Note', `Updated note ID: ${id}`);
    return { id, ...update };
  },

  async deleteNote(id) {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) console.error(error);
    await this.logActivity('Delete Note', `Deleted note: ${id}`);
  },

  // ────────────────────── QUESTIONS ──────────────────────

  async getQuestions(filters = {}) {
    let query = supabase.from('questions').select('*');
    if (filters.chapterId) query = query.eq('chapter_id', filters.chapterId);
    if (filters.conceptId) query = query.eq('concept_id', filters.conceptId);
    if (filters.category) query = query.eq('exam_type', filters.category.toUpperCase());
    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty.toLowerCase());
    
    const { data } = await query;
    return (data || []).map(q => ({
      id: q.id,
      chapterId: q.chapter_id,
      conceptId: q.concept_id,
      question: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      category: q.exam_type,
      difficulty: q.difficulty,
      createdAt: q.created_at
    }));
  },

  async addQuestion(data) {
    const question = {
      id: generateId('q'),
      chapter_id: data.chapterId,
      concept_id: data.conceptId || null,
      question: data.question,
      option_a: data.options ? data.options[0] : (data.option_a || ''),
      option_b: data.options ? data.options[1] : (data.option_b || ''),
      option_c: data.options ? data.options[2] : (data.option_c || ''),
      option_d: data.options ? data.options[3] : (data.option_d || ''),
      correct_answer: parseInt(data.correctAnswer) || 0,
      explanation: data.explanation || '',
      exam_type: (data.category || 'NEET').toUpperCase(),
      difficulty: (data.difficulty || 'medium').toLowerCase()
    };
    const { error } = await supabase.from('questions').insert(question);
    if (error) console.error(error);
    await this.logActivity('Add Question', `Added question ID: ${question.id}`);
    return question;
  },

  async updateQuestion(id, data) {
    const update = {};
    if (data.question !== undefined) update.question = data.question;
    if (data.options !== undefined) {
      update.option_a = data.options[0];
      update.option_b = data.options[1];
      update.option_c = data.options[2];
      update.option_d = data.options[3];
    }
    if (data.correctAnswer !== undefined) update.correct_answer = parseInt(data.correctAnswer);
    if (data.explanation !== undefined) update.explanation = data.explanation;
    if (data.category !== undefined) update.exam_type = data.category.toUpperCase();
    if (data.difficulty !== undefined) update.difficulty = data.difficulty.toLowerCase();
    if (data.chapterId !== undefined) update.chapter_id = data.chapterId;
    if (data.conceptId !== undefined) update.concept_id = data.conceptId;

    const { error } = await supabase.from('questions').update(update).eq('id', id);
    if (error) console.error(error);
    await this.logActivity('Update Question', `Updated question ID: ${id}`);
    return { id, ...update };
  },

  async deleteQuestion(id) {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) console.error(error);
    await this.logActivity('Delete Question', `Deleted question ID: ${id}`);
  },

  // ────────────────────── TESTS ──────────────────────

  async getTests(filters = {}) {
    let query = supabase.from('tests').select('*');
    if (filters.chapterId) query = query.eq('chapter_id', filters.chapterId);
    if (filters.classId) query = query.eq('class_id', filters.classId);
    if (filters.type) query = query.eq('test_type', filters.type);
    
    const { data } = await query;
    return (data || []).map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      chapterId: t.chapter_id,
      classId: t.class_id,
      type: t.test_type,
      duration: t.time_limit,
      totalQuestions: t.total_questions,
      createdAt: t.created_at
    }));
  },

  async getTest(testId) {
    const { data: test, error } = await supabase.from('tests').select('*').eq('id', testId).single();
    if (error || !test) return null;
    
    // Fetch mapped question IDs
    const { data: mappings } = await supabase.from('test_questions').select('question_id').eq('test_id', testId);
    const questionIds = (mappings || []).map(m => m.question_id);
    
    // Fetch the questions
    let questions = [];
    if (questionIds.length > 0) {
      const { data: qData } = await supabase.from('questions').select('*').in('id', questionIds);
      questions = (qData || []).map(q => ({
        id: q.id,
        chapterId: q.chapter_id,
        conceptId: q.concept_id,
        question: q.question,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        category: q.exam_type,
        difficulty: q.difficulty
      }));
    }

    return {
      id: test.id,
      title: test.title,
      description: test.description,
      chapterId: test.chapter_id,
      classId: test.class_id,
      type: test.test_type,
      duration: test.time_limit,
      totalQuestions: test.total_questions,
      questions
    };
  },

  async addTest(data) {
    const test = {
      id: generateId('test'),
      chapter_id: data.chapterId || null,
      title: data.title,
      description: data.description || '',
      time_limit: parseInt(data.duration) || 30,
      total_questions: data.questionIds ? data.questionIds.length : 0,
      class_id: data.classId || null,
      test_type: data.type || 'chapter'
    };
    const { error } = await supabase.from('tests').insert(test);
    if (error) console.error(error);
    
    // Insert mappings
    if (data.questionIds && data.questionIds.length > 0) {
      const mappings = data.questionIds.map(qid => ({
        test_id: test.id,
        question_id: qid
      }));
      await supabase.from('test_questions').insert(mappings);
    }

    await this.logActivity('Create Test', `Created test: ${test.title}`);
    return test;
  },

  async updateTest(id, data) {
    const update = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description;
    if (data.duration !== undefined) update.time_limit = parseInt(data.duration);
    if (data.classId !== undefined) update.class_id = data.classId;
    if (data.type !== undefined) update.test_type = data.type;
    if (data.chapterId !== undefined) update.chapter_id = data.chapterId;

    const { error } = await supabase.from('tests').update(update).eq('id', id);
    if (error) console.error(error);

    // Update mappings if supplied
    if (data.questionIds !== undefined) {
      await supabase.from('test_questions').delete().eq('test_id', id);
      if (data.questionIds.length > 0) {
        const mappings = data.questionIds.map(qid => ({
          test_id: id,
          question_id: qid
        }));
        await supabase.from('test_questions').insert(mappings);
      }
      await supabase.from('tests').update({ total_questions: data.questionIds.length }).eq('id', id);
    }

    await this.logActivity('Update Test', `Updated test ID: ${id}`);
    return { id, ...update };
  },

  async deleteTest(id) {
    const { error } = await supabase.from('tests').delete().eq('id', id);
    if (error) console.error(error);
    await this.logActivity('Delete Test', `Deleted test ID: ${id}`);
  },

  async submitTest(testId, answers, timeTaken) {
    const test = await this.getTest(testId);
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

    const user = this.getCurrentUser();
    if (!user) return null;

    const accuracy = test.questions.length > 0 ? Math.round((correct / test.questions.length) * 100) : 0;

    const result = {
      id: generateId('result'),
      student_id: user.id,
      test_id: testId,
      score: correct,
      accuracy,
      time_taken: timeTaken,
      answers: answerDetails,
      total_questions: test.questions.length,
      correct_count: correct,
      wrong_count: wrong,
      unattempted_count: unattempted
    };

    const { error } = await supabase.from('results').insert(result);
    if (error) console.error(error);

    await this.markTestCompleted(testId);
    
    // Award XP
    const xpEarned = test.questions.length > 0 ? Math.round((correct / test.questions.length) * 50) : 0;
    if (xpEarned > 0) {
      await this.grantXP(xpEarned, user.id);
      this.updateDailyChallenge('test');
    }

    return {
      id: result.id,
      testId: result.test_id,
      testTitle: test.title,
      userId: result.student_id,
      answers: result.answers,
      score: result.score,
      totalQuestions: result.total_questions,
      correct: result.correct_count,
      wrong: result.wrong_count,
      unattempted: result.unattempted_count,
      accuracy: result.accuracy,
      timeTaken: result.time_taken,
      duration: test.duration,
      completedAt: new Date().toISOString()
    };
  },

  async getTestResult(resultId) {
    const { data: r, error } = await supabase.from('results').select('*, tests(*)').eq('id', resultId).single();
    if (error || !r) return null;
    return {
      id: r.id,
      testId: r.test_id,
      testTitle: r.tests ? r.tests.title : 'Chapter Test',
      userId: r.student_id,
      answers: r.answers,
      score: r.score,
      totalQuestions: r.total_questions,
      correct: r.correct_count,
      wrong: r.wrong_count,
      unattempted: r.unattempted_count,
      accuracy: r.accuracy,
      timeTaken: r.time_taken,
      duration: r.tests ? r.tests.time_limit : 30,
      completedAt: r.created_at
    };
  },

  async getTestResults() {
    const user = this.getCurrentUser();
    if (!user) return [];
    const { data } = await supabase.from('results').select('*, tests(*)').eq('student_id', user.id).order('created_at', { ascending: false });
    return (data || []).map(r => ({
      id: r.id,
      testId: r.test_id,
      testTitle: r.tests ? r.tests.title : 'Chapter Test',
      userId: r.student_id,
      answers: r.answers,
      score: r.score,
      totalQuestions: r.total_questions,
      correct: r.correct_count,
      wrong: r.wrong_count,
      unattempted: r.unattempted_count,
      accuracy: r.accuracy,
      timeTaken: r.time_taken,
      duration: r.tests ? r.tests.time_limit : 30,
      completedAt: r.created_at
    }));
  },

  // ────────────────────── PROGRESS ──────────────────────

  async getProgress(userId = null) {
    userId = userId || (this.getCurrentUser() ? this.getCurrentUser().id : null);
    if (!userId) return this._emptyProgress();
    
    // Fetch profile details (for XP/Streak)
    const { data: userProfile } = await supabase.from('users').select('xp, streak, last_active').eq('id', userId).single();
    const xp = userProfile ? userProfile.xp : 0;
    const streak = userProfile ? userProfile.streak : 0;
    const lastActive = userProfile ? userProfile.last_active : '';
    
    // Fetch completions
    const { data: completions } = await supabase.from('progress').select('*').eq('student_id', userId);
    
    const videosWatched = [];
    const notesRead = [];
    const testsCompleted = [];
    const chapterProgress = {}; // We will compile these dynamically based on concept progress if needed
    
    (completions || []).forEach(c => {
      if (c.video_completed) videosWatched.push(c.concept_id); // Map concepts completed
      if (c.notes_completed) notesRead.push(c.concept_id);
      if (c.test_completed) testsCompleted.push(c.concept_id);
    });

    // Load extra local storage items for offline mode & custom cards
    const offlineNotes = getLocalItem(`offline_notes_${userId}`) || [];
    const offlineVideos = getLocalItem(`offline_videos_${userId}`) || [];
    const badges = getLocalItem(`badges_${userId}`) || [];
    const achievements = getLocalItem(`achievements_${userId}`) || [];

    return {
      videosWatched,
      notesRead,
      testsCompleted,
      chapterProgress,
      streak,
      xp,
      achievements,
      badges,
      offlineNotes,
      offlineVideos,
      lastActive
    };
  },

  _emptyProgress() {
    return { videosWatched: [], notesRead: [], testsCompleted: [], chapterProgress: {}, streak: 0, xp: 0, achievements: [], badges: [], offlineNotes: [], offlineVideos: [], lastActive: '' };
  },

  async markVideoWatched(videoId) {
    const user = this.getCurrentUser();
    if (!user) return;
    
    // Locate the video to get the concept ID
    const { data: video } = await supabase.from('videos').select('concept_id').eq('id', videoId).single();
    if (!video || !video.concept_id) return;
    
    const conceptId = video.concept_id;

    // Check if progress already exists
    const { data: existing } = await supabase
      .from('progress')
      .select('*')
      .eq('student_id', user.id)
      .eq('concept_id', conceptId)
      .single();

    if (!existing) {
      await supabase.from('progress').insert({
        student_id: user.id,
        concept_id: conceptId,
        video_completed: true,
        progress_percentage: 33
      });
    } else if (!existing.video_completed) {
      const nextPct = existing.progress_percentage + 33;
      await supabase
        .from('progress')
        .update({ video_completed: true, progress_percentage: nextPct })
        .eq('id', existing.id);
    }
    
    await this.grantXP(10, user.id);
    this.updateDailyChallenge('video');
  },

  async markNoteRead(noteId) {
    const user = this.getCurrentUser();
    if (!user) return;
    
    const { data: note } = await supabase.from('notes').select('concept_id').eq('id', noteId).single();
    if (!note || !note.concept_id) return;
    
    const conceptId = note.concept_id;

    const { data: existing } = await supabase
      .from('progress')
      .select('*')
      .eq('student_id', user.id)
      .eq('concept_id', conceptId)
      .single();

    if (!existing) {
      await supabase.from('progress').insert({
        student_id: user.id,
        concept_id: conceptId,
        notes_completed: true,
        progress_percentage: 33
      });
    } else if (!existing.notes_completed) {
      const nextPct = existing.progress_percentage + 33;
      await supabase
        .from('progress')
        .update({ notes_completed: true, progress_percentage: nextPct })
        .eq('id', existing.id);
    }
    
    await this.grantXP(5, user.id);
    this.updateDailyChallenge('note');
  },

  async markTestCompleted(testId) {
    const user = this.getCurrentUser();
    if (!user) return;
    
    const { data: test } = await supabase.from('tests').select('chapter_id').eq('id', testId).single();
    if (!test || !test.chapter_id) return;
    
    // In our schema, progress maps student_id and concept_id.
    // Since a test belongs to a chapter (not concept directly), we can map to the first concept of the chapter.
    const { data: concepts } = await supabase.from('concepts').select('id').eq('chapter_id', test.chapter_id).order('order_number').limit(1);
    if (!concepts || concepts.length === 0) return;
    
    const conceptId = concepts[0].id;

    const { data: existing } = await supabase
      .from('progress')
      .select('*')
      .eq('student_id', user.id)
      .eq('concept_id', conceptId)
      .single();

    if (!existing) {
      await supabase.from('progress').insert({
        student_id: user.id,
        concept_id: conceptId,
        test_completed: true,
        progress_percentage: 34
      });
    } else if (!existing.test_completed) {
      const nextPct = existing.progress_percentage + 34;
      await supabase
        .from('progress')
        .update({ test_completed: true, progress_percentage: nextPct })
        .eq('id', existing.id);
    }
    
    await this.grantXP(25, user.id);
  },

  // ────────────────────── COMMUNITY ──────────────────────

  async getCommunityPosts() {
    const { data } = await supabase.from('community_posts').select('*').order('date', { ascending: false });
    return (data || []).map(p => ({
      id: p.id,
      authorName: p.author_name,
      authorRole: p.author_role,
      authorBadge: p.author_badge,
      category: p.category,
      title: p.title,
      content: p.content,
      upvotes: p.upvotes,
      upvotedBy: p.upvoted_by,
      comments: p.comments,
      date: p.date
    }));
  },

  async addCommunityPost(category, title, content) {
    const user = this.getCurrentUser();
    if (!user) return null;

    const prog = await this.getProgress(user.id);
    const featuredBadge = prog.featuredBadge || (prog.achievements && prog.achievements.length > 0 ? '🏆 High Achiever' : '');

    const post = {
      id: generateId('post'),
      author_id: user.id,
      author_name: user.full_name || user.name || 'Student',
      author_role: user.role,
      author_badge: featuredBadge,
      category,
      title,
      content,
      upvotes: 0,
      upvoted_by: [],
      comments: []
    };

    const { error } = await supabase.from('community_posts').insert(post);
    if (error) console.error(error);

    await this.grantXP(20, user.id);
    await this.addNotification('XP Earned! 🏆', 'You earned +20 XP for posting in the community.');
    return {
      ...post,
      authorName: post.author_name,
      authorRole: post.author_role,
      authorBadge: post.author_badge,
      upvotedBy: post.upvoted_by,
      date: new Date().toISOString()
    };
  },

  async upvotePost(postId) {
    const user = this.getCurrentUser();
    if (!user) return;
    
    const { data: post, error } = await supabase.from('community_posts').select('upvotes, upvoted_by').eq('id', postId).single();
    if (error || !post) return;
    
    let upvotedBy = post.upvoted_by || [];
    let upvotes = post.upvotes;
    
    if (upvotedBy.includes(user.id)) {
      upvotedBy = upvotedBy.filter(id => id !== user.id);
      upvotes = Math.max(0, upvotes - 1);
    } else {
      upvotedBy.push(user.id);
      upvotes++;
      await this.grantXP(2, user.id);
    }

    await supabase.from('community_posts').update({ upvotes, upvoted_by: upvotedBy }).eq('id', postId);
  },

  async addPostComment(postId, commentContent) {
    const user = this.getCurrentUser();
    if (!user) return;

    const { data: post, error } = await supabase.from('community_posts').select('comments').eq('id', postId).single();
    if (error || !post) return;

    const comments = post.comments || [];
    const newComment = {
      id: generateId('c'),
      authorName: user.full_name || user.name || 'Student',
      authorRole: user.role,
      content: commentContent,
      date: new Date().toISOString()
    };
    comments.push(newComment);

    await supabase.from('community_posts').update({ comments }).eq('id', postId);
    await this.grantXP(5, user.id);
  },

  async getChapterPosts(chapterId) {
    const posts = await this.getCommunityPosts();
    return posts.filter(p => p.content.toLowerCase().includes(chapterId.toLowerCase()));
  },

  async addChapterPost(chapterId, title, content) {
    const post = await this.addCommunityPost('Chapter Q&A', title, content);
    if (post) {
      // Append chapterId flag into content/title or update
      const { data: fullPost } = await supabase.from('community_posts').select('content').eq('id', post.id).single();
      if (fullPost) {
        const markedContent = `${fullPost.content}\n\n[Chapter: ${chapterId}]`;
        await supabase.from('community_posts').update({ content: markedContent }).eq('id', post.id);
      }
    }
    return post;
  },

  // ────────────────────── NOTIFICATIONS ──────────────────────

  async getNotifications() {
    const user = this.getCurrentUser();
    if (!user) return [];
    const { data } = await supabase.from('notifications').select('*').eq('student_id', user.id).order('created_at', { ascending: false });
    return (data || []).map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      read: n.is_read,
      timestamp: n.created_at
    }));
  },

  async addNotification(title, message, userId = null) {
    userId = userId || (this.getCurrentUser() ? this.getCurrentUser().id : null);
    if (!userId) return;
    await supabase.from('notifications').insert({
      student_id: userId,
      title,
      message,
      is_read: false
    });
  },

  async markNotificationRead(id) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  },

  async markAllNotificationsRead() {
    const user = this.getCurrentUser();
    if (!user) return;
    await supabase.from('notifications').update({ is_read: true }).eq('student_id', user.id);
  },

  // ────────────────────── PAYMENTS & SUBSCRIPTIONS ──────────────────────

  async upgradeSubscription(userId, planType, price, coupon = '') {
    const expiry = new Date();
    if (planType === 'yearly') {
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else {
      expiry.setMonth(expiry.getMonth() + 1);
    }

    // 1. Create payment entry
    const paymentId = generateId('pay');
    await supabase.from('payments').insert({
      id: paymentId,
      student_id: userId,
      razorpay_payment_id: 'rzp_' + Math.random().toString(36).substr(2, 9),
      amount: price,
      status: 'success'
    });

    // 2. Create subscription entry
    const subId = generateId('sub');
    await supabase.from('subscriptions').insert({
      id: subId,
      student_id: userId,
      plan_name: planType === 'yearly' ? 'Premium Yearly' : 'Premium Monthly',
      start_date: new Date().toISOString(),
      expiry_date: expiry.toISOString(),
      status: 'active'
    });

    // 3. Update user model plan
    const { data: updatedUser } = await supabase
      .from('users')
      .update({ subscription_plan: planType, subscription_status: 'active' })
      .eq('id', userId)
      .select('*')
      .single();

    if (updatedUser) {
      await this.logActivity('Activate Subscription', `User upgraded to Premium ${planType}`);
      await this.addNotification('Subscription Activated! 👑', `Thank you for subscribing! Your Premium plan expires on ${expiry.toLocaleDateString()}.`);
      
      this._currentUser = { ...this._currentUser, ...updatedUser, name: updatedUser.full_name };
      return this._currentUser;
    }
    return null;
  },

  async getPayments() {
    const user = this.getCurrentUser();
    if (!user) return [];
    const { data } = await supabase.from('payments').select('*').eq('student_id', user.id).order('created_at', { ascending: false });
    return (data || []).map(p => ({
      paymentId: p.razorpay_payment_id,
      amount: p.amount,
      status: p.status,
      date: p.created_at
    }));
  },

  // ────────────────────── GAMIFICATION SYSTEM ──────────────────────

  async grantXP(amount, userId = null) {
    userId = userId || (this.getCurrentUser() ? this.getCurrentUser().id : null);
    if (!userId) return;
    
    // Fetch profile
    const { data: userProfile } = await supabase.from('users').select('xp').eq('id', userId).single();
    if (!userProfile) return;

    const nextXp = (userProfile.xp || 0) + amount;
    await supabase.from('users').update({ xp: nextXp }).eq('id', userId);
    
    if (this._currentUser && this._currentUser.id === userId) {
      this._currentUser.xp = nextXp;
    }
  },

  async addXP(amount, userId = null) {
    return await this.grantXP(amount, userId);
  },

  async updateStreak(userId = null) {
    userId = userId || (this.getCurrentUser() ? this.getCurrentUser().id : null);
    if (!userId) return;

    const { data: userProfile } = await supabase.from('users').select('streak, last_active').eq('id', userId).single();
    if (!userProfile) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const lastActiveStr = userProfile.last_active ? userProfile.last_active.split('T')[0] : '';

    if (todayStr !== lastActiveStr) {
      let streak = userProfile.streak || 0;
      if (lastActiveStr) {
        const lastDate = new Date(lastActiveStr);
        const today = new Date(todayStr);
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak++;
        } else if (diffDays > 1) {
          streak = 1;
        }
      } else {
        streak = 1;
      }
      
      await supabase.from('users').update({ streak, last_active: new Date().toISOString() }).eq('id', userId);
      if (this._currentUser && this._currentUser.id === userId) {
        this._currentUser.streak = streak;
      }
    }
  },

  updateDailyChallenge(type, amount = 1) {
    // Keep daily challenge trackers in local storage per user session
    const user = this.getCurrentUser();
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    let challenge = getLocalItem(`daily_challenge_${user.id}`);
    
    if (!challenge || challenge.date !== today) {
      challenge = { date: today, type: 'video', target: 1, current: 0, rewardXp: 50, claimed: false };
      // Randomize challenge type
      const types = ['video', 'note', 'test'];
      challenge.type = types[Math.floor(Math.random() * types.length)];
      setLocalItem(`daily_challenge_${user.id}`, challenge);
    }
    
    if (challenge.type === type && !challenge.claimed) {
      challenge.current = Math.min(challenge.current + amount, challenge.target);
      setLocalItem(`daily_challenge_${user.id}`, challenge);
      
      if (challenge.current >= challenge.target) {
        challenge.claimed = true;
        setLocalItem(`daily_challenge_${user.id}`, challenge);
        this.grantXP(challenge.rewardXp, user.id);
        this.addNotification('Daily Challenge Completed! 🌟', `You earned +${challenge.rewardXp} XP!`);
      }
    }
  },

  getDailyChallenge() {
    const user = this.getCurrentUser();
    if (!user) return null;
    const today = new Date().toISOString().split('T')[0];
    let challenge = getLocalItem(`daily_challenge_${user.id}`);
    if (!challenge || challenge.date !== today) {
      challenge = { date: today, type: 'video', target: 1, current: 0, rewardXp: 50, claimed: false };
      setLocalItem(`daily_challenge_${user.id}`, challenge);
    }
    return challenge;
  },

  // ────────────────────── REWARDS & CHALLENGES ──────────────────────

  getWeeklyChallenges() {
    const user = this.getCurrentUser();
    if (!user) return [];
    const sunday = this.getWeeklyChallengesWeekStart();
    let challengeData = getLocalItem(`weekly_challenges_${user.id}`);
    
    if (!challengeData || challengeData.weekStart !== sunday) {
      challengeData = {
        weekStart: sunday,
        challenges: [
          { id: 'wc1', title: 'Complete 3 Chapter Notes', target: 3, current: 0, rewardXp: 300, type: 'note', claimed: false },
          { id: 'wc2', title: 'Score 80%+ on Genetics test', target: 1, current: 0, rewardXp: 400, type: 'genetics_test', claimed: false },
          { id: 'wc3', title: 'Complete 50 practice questions', target: 50, current: 0, rewardXp: 500, type: 'question', claimed: false }
        ]
      };
      setLocalItem(`weekly_challenges_${user.id}`, challengeData);
    }
    return challengeData.challenges;
  },

  getWeeklyChallengesWeekStart() {
    const today = new Date();
    return new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split('T')[0];
  },

  async claimChallengeReward(challengeId) {
    const user = this.getCurrentUser();
    if (!user) return null;
    const challenges = this.getWeeklyChallenges();
    const idx = challenges.findIndex(c => c.id === challengeId);
    if (idx >= 0 && !challenges[idx].claimed && challenges[idx].current >= challenges[idx].target) {
      challenges[idx].claimed = true;
      await this.grantXP(challenges[idx].rewardXp, user.id);
      
      const sunday = this.getWeeklyChallengesWeekStart();
      setLocalItem(`weekly_challenges_${user.id}`, { weekStart: sunday, challenges });
      
      await this.addNotification('Challenge Completed! 🏆', `Claimed reward of +${challenges[idx].rewardXp} XP.`);
      return challenges[idx];
    }
    return null;
  },

  getRedeemableItems() {
    return [
      { id: 'ri_7days', title: '7 Days Premium Access', desc: 'Add 7 premium subscription days to your account.', costXp: 1000, type: 'premium_days', value: 7 },
      { id: 'ri_30days', title: '30 Days Premium Access', desc: 'Add 30 premium subscription days to your account.', costXp: 3500, type: 'premium_days', value: 30 },
      { id: 'ri_cheat_sheet', title: 'NEET Biology Cheat Sheet', desc: 'Downloadable PDF of high-yield memory tricks and diagrams.', costXp: 1500, type: 'exclusive_notes', value: 'sheet_neet' },
      { id: 'ri_avatar_frame', title: 'DNA Master Avatar Frame', desc: 'Show off your expertise with a glowing DNA frame on community posts.', costXp: 500, type: 'avatar_frame', value: 'frame_dna' }
    ];
  },

  async redeemItem(itemId) {
    const user = this.getCurrentUser();
    if (!user) return { error: 'User not logged in' };
    const items = this.getRedeemableItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return { error: 'Item not found' };
    
    const progress = await this.getProgress(user.id);
    if (progress.xp < item.costXp) {
      return { error: 'Insufficient XP to redeem this item' };
    }
    
    // Deduct XP
    await this.grantXP(-item.costXp, user.id);
    
    if (item.type === 'premium_days') {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + item.value);
      // Create a subscription entry
      await supabase.from('subscriptions').insert({
        id: generateId('sub'),
        student_id: user.id,
        plan_name: 'Premium Redeem Access',
        start_date: new Date().toISOString(),
        expiry_date: expiry.toISOString(),
        status: 'active'
      });
      await supabase.from('users').update({ subscription_plan: 'premium', subscription_status: 'active' }).eq('id', user.id);
      this._currentUser.subscription_plan = 'premium';
      this._currentUser.subscription_status = 'active';
      await this.addNotification('Store Purchase Redeemed! 🎁', `Extended Premium Access by +${item.value} days!`);
    } else {
      // Store in local storage redeemed locker
      const locker = getLocalItem(`redeemed_locker_${user.id}`) || [];
      locker.push(itemId);
      setLocalItem(`redeemed_locker_${user.id}`, locker);
      await this.addNotification('Store Purchase Redeemed! 🎁', `Successfully redeemed: ${item.title}`);
    }
    return { success: true, item };
  },

  setFeaturedBadge(badgeId) {
    const user = this.getCurrentUser();
    if (!user) return;
    const progress = getLocalItem(`progress_${user.id}`) || {};
    progress.featuredBadge = badgeId;
    setLocalItem(`progress_${user.id}`, progress);
  },

  // ────────────────────── CUSTOM FLASHCARDS ──────────────────────

  getCustomFlashcards() {
    const user = this.getCurrentUser();
    if (!user) return [];
    return getLocalItem(`custom_flashcards_${user.id}`) || [];
  },

  async saveCustomFlashcard(front, back, chapterId = '') {
    const user = this.getCurrentUser();
    if (!user) return null;
    const cards = this.getCustomFlashcards();
    const newCard = {
      id: generateId('cfc'),
      front,
      back,
      chapterId,
      createdAt: new Date().toISOString()
    };
    cards.push(newCard);
    setLocalItem(`custom_flashcards_${user.id}`, cards);
    await this.grantXP(5, user.id);
    return newCard;
  },

  deleteCustomFlashcard(cardId) {
    const user = this.getCurrentUser();
    if (!user) return;
    const cards = this.getCustomFlashcards();
    setLocalItem(`custom_flashcards_${user.id}`, cards.filter(c => c.id !== cardId));
  },

  // ────────────────────── STATIC/MOCK ASSETS ──────────────────────

  getDiagrams() {
    return diagramsData || [];
  },

  getDiagram(id) {
    return (diagramsData || []).find(d => d.id === id) || null;
  },

  getPYQs() {
    return pyqData || [];
  },

  getMockLiveClasses() {
    return [
      { id: 'live_1', title: 'Molecular Basis of Inheritance: Transcription Deep Dive', teacher: 'Dr. Shruti Patil', start: new Date().toISOString(), duration: 60, active: true },
      { id: 'live_2', title: 'KCET Mock Biology Paper Analysis & Strategy', teacher: 'Prof. Ramesh Gowda', start: new Date(Date.now() + 86400000).toISOString(), duration: 90, active: false }
    ];
  },

  getMockLiveClassPolls() {
    return [
      {
        id: 'poll_1',
        question: 'Which of the following enzymes initiates transcription by binding to the promoter?',
        options: ['RNA Polymerase', 'DNA Polymerase', 'DNA Ligase', 'Helicase'],
        votes: [45, 12, 5, 8]
      }
    ];
  },

  async getLeaderboard(classFilter = '', categoryFilter = 'All Time') {
    // Select top users by XP
    let query = supabase.from('users').select('id, full_name, role, xp, streak').eq('role', 'student').order('xp', { ascending: false }).limit(20);
    if (classFilter) {
      query = query.eq('class', classFilter);
    }
    const { data } = await query;
    return (data || []).map((u, index) => ({
      rank: index + 1,
      name: u.full_name,
      xp: u.xp,
      streak: u.streak,
      badge: u.xp > 2000 ? '🧬 Expert' : '🌱 Learner',
      avatarColor: '#0A6847'
    }));
  },

  async getMasteredConceptsCount(userId = null) {
    userId = userId || (this.getCurrentUser() ? this.getCurrentUser().id : null);
    if (!userId) return 0;
    const { count } = await supabase.from('progress').select('*', { count: 'exact', head: true }).eq('student_id', userId).gt('progress_percentage', 75);
    return count || 0;
  },

  getLevelInfo(xp) {
    xp = xp || 0;
    const levels = [
      { level: 1, title: 'Biology Beginner', minXp: 0, maxXp: 500 },
      { level: 2, title: 'Biology Learner', minXp: 500, maxXp: 1500 },
      { level: 3, title: 'Biology Explorer', minXp: 1500, maxXp: 3000 },
      { level: 4, title: 'Biology Scholar', minXp: 3000, maxXp: 5000 },
      { level: 5, title: 'Biology Master', minXp: 5000, maxXp: null }
    ];

    let current = levels[0];
    for (let i = 0; i < levels.length; i++) {
      if (xp >= levels[i].minXp && (levels[i].maxXp === null || xp < levels[i].maxXp)) {
        current = levels[i];
        break;
      }
    }

    const nextXp = current.maxXp;
    const prevXp = current.minXp;
    let percentage = 0;
    if (nextXp !== null) {
      percentage = Math.round(((xp - prevXp) / (nextXp - prevXp)) * 100);
    } else {
      percentage = 100;
    }

    return {
      level: current.level,
      title: current.title,
      percentage,
      prevXp,
      nextXp
    };
  },

  async getChapterProgress(chapterId) {
    const videos = await this.getVideosByChapter(chapterId);
    const notes = await this.getNotes(chapterId);
    const questions = await this.getQuestions({ chapterId });
    const progress = await this.getProgress();

    const watchedCount = videos.filter(v => progress.videosWatched.includes(v.concept_id)).length;
    const readCount = notes.filter(n => progress.notesRead.includes(n.concept_id)).length;

    const totalItems = videos.length + notes.length;
    const completedItems = watchedCount + readCount;

    return {
      videos: { total: videos.length, completed: watchedCount },
      notes: { total: notes.length, completed: readCount },
      questions: { total: questions.length },
      percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  },

  async getOverallProgress(classId) {
    const chapters = await this.getAllChapters(classId);
    if (chapters.length === 0) return 0;
    let totalPercentage = 0;
    for (const ch of chapters) {
      const prog = await this.getChapterProgress(ch.id);
      totalPercentage += prog.percentage;
    }
    return Math.round(totalPercentage / chapters.length);
  },

  async getStats() {
    const { count: totalUnits } = await supabase.from('units').select('*', { count: 'exact', head: true });
    const { count: totalChapters } = await supabase.from('chapters').select('*', { count: 'exact', head: true });
    const { count: totalConcepts } = await supabase.from('concepts').select('*', { count: 'exact', head: true });
    const { count: totalQuestions } = await supabase.from('questions').select('*', { count: 'exact', head: true });
    const { count: totalTests } = await supabase.from('tests').select('*', { count: 'exact', head: true });
    const { count: totalStudents } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student');
    const { count: totalVideos } = await supabase.from('videos').select('*', { count: 'exact', head: true });
    const { count: totalNotes } = await supabase.from('notes').select('*', { count: 'exact', head: true });
    
    const { count: kcetQuestions } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('exam_type', 'KCET');
    const { count: neetQuestions } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('exam_type', 'NEET');
    const { count: puQuestions } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('exam_type', 'PU');

    return {
      totalUnits: totalUnits || 0,
      totalChapters: totalChapters || 0,
      totalConcepts: totalConcepts || 0,
      totalQuestions: totalQuestions || 0,
      totalTests: totalTests || 0,
      totalStudents: totalStudents || 0,
      totalVideos: totalVideos || 0,
      totalNotes: totalNotes || 0,
      kcetQuestions: kcetQuestions || 0,
      neetQuestions: neetQuestions || 0,
      puQuestions: puQuestions || 0,
    };
  },

  async getConceptMastery(conceptId) {
    const user = this.getCurrentUser();
    if (!user) return { score: 0, level: 'Beginner' };
    const { data } = await supabase.from('progress').select('progress_percentage').eq('student_id', user.id).eq('concept_id', conceptId).single();
    const score = data ? parseFloat(data.progress_percentage) : 0;
    let level = 'Beginner';
    if (score > 75) level = 'Mastered';
    else if (score > 50) level = 'Advanced';
    else if (score > 25) level = 'Intermediate';
    return { score, level };
  },

  async increaseConceptMastery(conceptId, points) {
    const user = this.getCurrentUser();
    if (!user) return;
    const { data: existing } = await supabase.from('progress').select('*').eq('student_id', user.id).eq('concept_id', conceptId).single();
    const current = existing ? parseFloat(existing.progress_percentage || 0) : 0;
    const nextPct = Math.min(current + points, 100);
    
    if (existing) {
      await supabase.from('progress').update({ progress_percentage: nextPct }).eq('id', existing.id);
    } else {
      await supabase.from('progress').insert({
        student_id: user.id,
        concept_id: conceptId,
        progress_percentage: nextPct
      });
    }
    await this.logActivity('Concept Mastery Increased', `Concept ${conceptId} mastery raised by +${points} points`);
  },

  createStudyPlan(chapters, examDate, hoursPerDay) {
    const user = this.getCurrentUser();
    if (!user) return null;
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
    setLocalItem(`study_plan_${user.id}`, plan);
    return plan;
  },

  getStudyPlan() {
    const user = this.getCurrentUser();
    if (!user) return null;
    return getLocalItem(`study_plan_${user.id}`);
  },

  updateStudyPlanTask(chapterId, date, completed) {
    const user = this.getCurrentUser();
    if (!user) return;
    const plan = this.getStudyPlan();
    if (plan) {
      const task = plan.schedule.find(t => t.chapterId === chapterId && t.date === date);
      if (task) {
        task.completed = completed;
        setLocalItem(`study_plan_${user.id}`, plan);
      }
    }
  },

  reschedulePlannerPlan() {
    const user = this.getCurrentUser();
    if (!user) return null;
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
    
    setLocalItem(`study_plan_${user.id}`, plan);
    this.logActivity('Adaptive Planner Reschedule', `Rescheduled study plan with ${shiftedCount} catch-up items`);
    return plan;
  },

  getAiChats() {
    const user = this.getCurrentUser();
    if (!user) return [];
    return getLocalItem(`ai_chats_${user.id}`) || [];
  },

  saveAiChat(question, answer) {
    const user = this.getCurrentUser();
    if (!user) return;
    const chats = this.getAiChats();
    chats.push({
      id: generateId('chat'),
      question,
      answer,
      timestamp: new Date().toISOString()
    });
    setLocalItem(`ai_chats_${user.id}`, chats);
  },

  async generateCustomTest(chapterId, difficulty, numQuestions) {
    const questions = await this.getQuestions({ chapterId, difficulty });
    let testQuestions = questions;
    if (testQuestions.length === 0) {
      testQuestions = await this.getQuestions({ chapterId });
    }
    // Shuffle and slice
    testQuestions = testQuestions.sort(() => 0.5 - Math.random()).slice(0, numQuestions);
    
    if (testQuestions.length === 0) return null;
    
    const qIds = testQuestions.map(q => q.id);
    const chapter = await this.getChapter(chapterId);
    const title = `AI Custom Test: ${chapter ? chapter.title : 'Chapter'} (${difficulty.toUpperCase()})`;
    
    const newTest = await this.addTest({
      title,
      type: 'mock',
      duration: numQuestions * 2, // 2 mins per question
      questionIds: qIds,
      chapterId,
      isAiGenerated: true
    });
    return newTest;
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
      let knAnswer = `**${chapterTitle || 'ಜೀವವಿಜ್ಞಾನ'} ಬಗ್ಗೆ ವಿವರಣೆ:**\n\n`;
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

  async getKcetAnalytics() {
    return await this._getExamAnalytics('kcet');
  },

  async getNeetAnalytics() {
    return await this._getExamAnalytics('neet');
  },

  async _getExamAnalytics(examType) {
    const user = this.getCurrentUser();
    if (!user) return null;
    const results = await this.getTestResults();
    const examResults = [];
    for (const r of results) {
      const test = await this.getTest(r.testId);
      if (test && test.type === examType) {
        examResults.push(r);
      }
    }
    
    let avgScore = 0;
    if (examResults.length > 0) {
      avgScore = examResults.reduce((acc, r) => acc + r.accuracy, 0) / examResults.length;
    }
    
    let chapterScores = {};
    for (const r of results) {
      const test = await this.getTest(r.testId);
      if (test && test.chapterId) {
        if (!chapterScores[test.chapterId]) chapterScores[test.chapterId] = [];
        chapterScores[test.chapterId].push(r.accuracy);
      }
    }
    
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

  incrementChapterView(chapterId) {
    const views = getLocalItem('chapter_views') || {};
    views[chapterId] = (views[chapterId] || 0) + 1;
    setLocalItem('chapter_views', views);
  },

  async getChapterViews() {
    const views = getLocalItem('chapter_views') || {};
    const syllabus = await this.getSyllabus();
    let index = 0;
    syllabus.forEach(unit => {
      (unit.chapters || []).forEach(ch => {
        if (!views[ch.id]) {
          views[ch.id] = 120 - index * 3 + Math.floor(Math.sin(index) * 15);
        }
        index++;
      });
    });
    return views;
  },

  // ────────────────────── UTILITY ──────────────────────

  async logActivity(action, details) {
    console.log(`[ACTIVITY LOG] Action: ${action} | Details: ${details}`);
  },

  // --------------------------------------------------------
  // ADMIN PANEL CRUD OPERATIONS
  // --------------------------------------------------------
  async addNote(note) {
    const { data } = await supabase.from('notes').insert({
      id: 'note_' + Date.now(),
      title: note.title,
      type: note.type,
      chapter_id: note.chapterId,
      content: note.content,
      file_url: note.fileUrl,
      description: note.description
    });
    return data;
  },

  async updateNote(id, note) {
    const { data } = await supabase.from('notes').update({
      title: note.title,
      type: note.type,
      chapter_id: note.chapterId,
      content: note.content,
      file_url: note.fileUrl,
      description: note.description
    }).eq('id', id);
    return data;
  },

  async deleteNote(id) {
    await supabase.from('notes').delete().eq('id', id);
  },

  async getPYQs() {
    const { data } = await supabase.from('questions').select('*').eq('is_pyq', true);
    return data || [];
  },

  async addPYQ(pyq) {
    return this.addQuestion({ ...pyq, is_pyq: true });
  },

  async updatePYQ(id, pyq) {
    return this.updateQuestion(id, pyq);
  },

  async deletePYQ(id) {
    return this.deleteQuestion(id);
  },

  async getQuestions() {
    const { data } = await supabase.from('questions').select('*');
    return data || [];
  },

  async addQuestion(q) {
    const { data } = await supabase.from('questions').insert({
      id: 'q_' + Date.now(),
      question_text: q.questionText || q.text,
      options: q.options,
      correct_option: q.correctOption,
      explanation: q.explanation,
      concept_id: q.conceptId,
      exam_type: q.examType,
      is_pyq: q.is_pyq || false
    });
    return data;
  },

  async updateQuestion(id, q) {
    const { data } = await supabase.from('questions').update({
      question_text: q.questionText || q.text,
      options: q.options,
      correct_option: q.correctOption,
      explanation: q.explanation,
      concept_id: q.conceptId,
      exam_type: q.examType
    }).eq('id', id);
    return data;
  },

  async deleteQuestion(id) {
    await supabase.from('questions').delete().eq('id', id);
  },

  async getAllStudents() {
    const { data } = await supabase.from('users').select('*').eq('role', 'student');
    return data || [];
  },

  async updateStudent(id, student) {
    const { data } = await supabase.from('users').update({
      full_name: student.name,
      email: student.email,
      phone: student.phone,
      class: student.class,
      subscription_status: student.status,
      subscription_plan: student.subscription
    }).eq('id', id);
    return data;
  },

  async suspendStudent(id) {
    await supabase.from('users').update({ subscription_status: 'suspended' }).eq('id', id);
  },

  async addVideo(v) {
    const { data } = await supabase.from('videos').insert({
      id: 'v_' + Date.now(),
      title: v.title,
      youtube_url: v.youtubeUrl,
      description: v.description,
      concept_id: v.conceptId
    });
    return data;
  },

  async updateVideo(id, v) {
    const { data } = await supabase.from('videos').update({
      title: v.title,
      youtube_url: v.youtubeUrl,
      description: v.description,
      concept_id: v.conceptId
    }).eq('id', id);
    return data;
  },

  async deleteVideo(id) {
    await supabase.from('videos').delete().eq('id', id);
  },

  async getPlans() {
    return [
      { id: 'plan_1', name: 'Free', price: 0, duration: 30, active: true, features: ['Basic Access'] },
      { id: 'plan_2', name: 'Premium Monthly', price: 499, duration: 30, active: true, features: ['All Videos', 'Mock Tests'] },
      { id: 'plan_3', name: 'Premium Yearly', price: 4999, duration: 365, active: true, features: ['Everything', 'Live Doubts'] }
    ];
  },
  async updatePlan(id, p) { return true; },
  async deletePlan(id) { return true; },
  async addPlan(p) { return true; },

  async addTest(test) {
    const { data } = await supabase.from('tests').insert({
      id: 'test_' + Date.now(),
      title: test.title,
      description: test.description,
      duration_minutes: test.duration,
      total_marks: test.totalMarks,
      class_id: test.classId,
      chapter_id: test.chapterId
    });
    return data;
  },

  async updateTest(id, test) {
    const { data } = await supabase.from('tests').update({
      title: test.title,
      description: test.description,
      duration_minutes: test.duration,
      total_marks: test.totalMarks,
      class_id: test.classId,
      chapter_id: test.chapterId
    }).eq('id', id);
    return data;
  },

  async deleteTest(id) {
    await supabase.from('tests').delete().eq('id', id);
  },

  async validateCoupon(code) {
    if (code === 'BIO50') {
      return { coupon: { code: 'BIO50', type: 'fixed', value: 500 } };
    }
    if (code === 'STUDENT20') {
      return { coupon: { code: 'STUDENT20', type: 'percentage', value: 20 } };
    }
    return { error: 'Invalid or expired coupon code' };
  },

  async upgradeSubscription(userId, planType, amount, coupon) {
    const paymentId = 'pay_' + Date.now() + Math.floor(Math.random() * 1000);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + (planType === 'yearly' ? 365 : 30));

    // Update users table
    await supabase.from('users').update({
      subscription_plan: planType,
      subscription_status: 'active'
    }).eq('id', userId);

    // Insert into subscriptions table
    await supabase.from('subscriptions').insert({
      id: 'sub_' + Date.now(),
      student_id: userId,
      plan_name: planType,
      amount: amount,
      status: 'active',
      razorpay_payment_id: paymentId,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    });

    return {
      id: userId,
      paymentHistory: [{ paymentId }]
    };
  },

  async logActivity(action, details) {
    // We don't have an activity_logs table, so we just console log for now
    console.log('[Admin Activity]', action, details);
  }
};

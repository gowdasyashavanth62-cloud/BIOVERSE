import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { syllabusData } from './js/data/syllabus.js';
import { sampleQuestions } from './js/data/questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new pg.Client({
  host: 'db.nvbaykuuxjzjeafpoexi.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'xAV2d6b#cyGcKax',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Connecting to database for seeding...');
    await client.connect();
    console.log('Connected!');

    // 1. Clear existing curriculum and post data
    console.log('Cleaning existing database records...');
    await client.query('TRUNCATE public.test_questions, public.results, public.progress, public.payments, public.subscriptions, public.notifications, public.videos, public.notes, public.tests, public.questions, public.concepts, public.chapters, public.units, public.community_posts CASCADE;');
    console.log('Existing database records cleared.');

    // 2. Load and parse seed.js to extract videos, notes, tests
    console.log('Extracting videos, notes, and tests from seed.js...');
    const seedJsPath = path.resolve(__dirname, 'js/data/seed.js');
    let seedJsCode = fs.readFileSync(seedJsPath, 'utf8');

    // Strip ES6 imports and exports to make it clean for evaluation
    seedJsCode = seedJsCode
      .split('\n')
      .filter(line => !line.trim().startsWith('import '))
      .join('\n');
    seedJsCode = seedJsCode.replace('export function seedData()', 'function seedData()');

    // Evaluate the code
    const evalEnv = {
      syllabusData,
      sampleQuestions,
      diagramsData: [],
      pyqData: [],
      Date,
      Math,
      console
    };
    
    // Define store and mock localStorage inside the evaluated script itself
    const wrapper = new Function(
      ...Object.keys(evalEnv),
      `
      const store = {};
      globalThis.localStorage = {
        setItem: (key, value) => {
          const cleanKey = key.replace('bv_', '');
          store[cleanKey] = JSON.parse(value);
        },
        getItem: (key) => {
          const cleanKey = key.replace('bv_', '');
          return store[cleanKey] ? JSON.stringify(store[cleanKey]) : null;
        }
      };
      ${seedJsCode}
      seedData();
      return store;
      `
    );
    
    const extractedData = wrapper(...Object.values(evalEnv));
    const videos = extractedData.videos || [];
    const notes = extractedData.notes || [];
    const tests = extractedData.tests || [];
    
    console.log(`Extracted: ${videos.length} videos, ${notes.length} notes, ${tests.length} tests`);

    // 3. Seed Units, Chapters, Concepts
    console.log('Seeding units, chapters, and concepts...');
    for (const unit of syllabusData) {
      await client.query(
        'INSERT INTO public.units (id, name, description, order_number, class_id) VALUES ($1, $2, $3, $4, $5)',
        [unit.id, unit.title, unit.description || '', unit.number ? parseInt(unit.number) || 0 : 0, unit.classId || 'pu1']
      );

      for (const ch of unit.chapters || []) {
        await client.query(
          'INSERT INTO public.chapters (id, unit_id, chapter_name, description, order_number) VALUES ($1, $2, $3, $4, $5)',
          [ch.id, unit.id, ch.title, ch.description || '', ch.order || 0]
        );

        for (const con of ch.concepts || []) {
          await client.query(
            'INSERT INTO public.concepts (id, chapter_id, concept_name, description, order_number) VALUES ($1, $2, $3, $4, $5)',
            [con.id, ch.id, con.title, con.description || '', con.order || 0]
          );
        }
      }
    }
    console.log('Curriculum structural layer seeded successfully!');

    // 4. Seed Questions
    console.log(`Seeding ${sampleQuestions.length} questions into question bank...`);
    for (const q of sampleQuestions) {
      // Map options
      const optA = q.options ? q.options[0] : (q.option_a || '');
      const optB = q.options ? q.options[1] : (q.option_b || '');
      const optC = q.options ? q.options[2] : (q.option_c || '');
      const optD = q.options ? q.options[3] : (q.option_d || '');
      
      let correct = q.correctAnswer;
      if (typeof correct === 'string') {
        correct = correct.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
      }

      // Standardize values to meet table check constraints
      const examType = (q.category || 'NEET').toUpperCase();
      const difficulty = (q.difficulty || 'medium').toLowerCase();

      await client.query(
        'INSERT INTO public.questions (id, chapter_id, concept_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, exam_type, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [q.id, q.chapterId, q.conceptId || null, q.question, optA, optB, optC, optD, correct, q.explanation || '', examType, difficulty]
      );
    }
    console.log('Questions seeded!');

    // 5. Seed Videos
    console.log(`Seeding ${videos.length} videos...`);
    for (const v of videos) {
      let durationSeconds = 0;
      if (v.duration) {
        const parts = v.duration.split(':');
        if (parts.length === 2) {
          durationSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else {
          durationSeconds = parseInt(v.duration) || 0;
        }
      }
      await client.query(
        'INSERT INTO public.videos (id, concept_id, title, youtube_url, description, duration) VALUES ($1, $2, $3, $4, $5, $6)',
        [v.id, v.conceptId, v.title, v.youtubeUrl, v.description || '', durationSeconds]
      );
    }
    console.log('Videos seeded!');

    // 6. Seed Notes
    console.log(`Seeding ${notes.length} notes...`);
    for (const n of notes) {
      await client.query(
        'INSERT INTO public.notes (id, concept_id, title, pdf_url, content) VALUES ($1, $2, $3, $4, $5)',
        [n.id, n.conceptId || 'con_3_6', n.title, n.pdf_url || '', n.content || '']
      );
    }
    console.log('Notes seeded!');

    // 7. Seed Tests and Test Questions mapping
    console.log(`Seeding ${tests.length} tests...`);
    for (const t of tests) {
      await client.query(
        'INSERT INTO public.tests (id, chapter_id, title, description, time_limit, total_questions, class_id, test_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [t.id, t.chapterId || null, t.title, t.description || '', t.duration || 30, t.totalQuestions || 0, t.classId || null, t.type || 'chapter']
      );

      // Seed mapping
      for (const qid of t.questionIds || []) {
        // Verify question exists
        const res = await client.query('SELECT id FROM public.questions WHERE id = $1', [qid]);
        if (res.rowCount > 0) {
          await client.query(
            'INSERT INTO public.test_questions (test_id, question_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [t.id, qid]
          );
        }
      }
    }
    console.log('Tests and mappings seeded!');

    // 8. Seed Community Posts
    console.log('Seeding initial community posts...');
    const adminUuid = '00000000-0000-0000-0000-000000000001';
    const studentUuid = '00000000-0000-0000-0000-000000000002';
    
    console.log('Inserting mock users into auth.users...');
    const adminCheck = await client.query('SELECT id FROM auth.users WHERE id = $1', [adminUuid]);
    if (adminCheck.rowCount === 0) {
      await client.query(`
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud, created_at, updated_at)
        VALUES ($1, '00000000-0000-0000-0000-000000000000', 'admin@bioverse.com', '$2a$10$7Z2v6V4Qf10kFqgR8L88zOV5Ua/p9yP9/eN/2R5vU.0v2z9eY4oTq', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin","role":"admin"}', 'authenticated', 'authenticated', now(), now());
      `, [adminUuid]);
    }
    
    const studentCheck = await client.query('SELECT id FROM auth.users WHERE id = $1', [studentUuid]);
    if (studentCheck.rowCount === 0) {
      await client.query(`
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, role, aud, created_at, updated_at)
        VALUES ($1, '00000000-0000-0000-0000-000000000000', 'student@bioverse.com', '$2a$10$7Z2v6V4Qf10kFqgR8L88zOV5Ua/p9yP9/eN/2R5vU.0v2z9eY4oTq', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Arjun Kumar","role":"student"}', 'authenticated', 'authenticated', now(), now());
      `, [studentUuid]);
    }

    await client.query(
      "UPDATE public.users SET full_name = 'Admin', role = 'admin' WHERE id = $1",
      [adminUuid]
    );
    await client.query(
      "UPDATE public.users SET full_name = 'Arjun Kumar', role = 'student' WHERE id = $1",
      [studentUuid]
    );

    console.log('Mock users seeded.');

    const posts = [
      {
        id: 'post_1',
        author_id: studentUuid,
        author_name: 'Rohan Deshmukh',
        author_role: 'student',
        author_badge: '🧬 Genetics Expert',
        category: 'NEET Biology',
        title: 'How to memorize the stages of Meiosis Prophase I?',
        content: 'I keep getting confused between Zygotene and Pachytene. Pachytene has crossing over, but zygotene has synapsis. Any tricks?',
        upvotes: 18,
        upvoted_by: JSON.stringify([]),
        comments: JSON.stringify([
          { id: 'c_1', authorName: 'Dr. Shruti Patil', authorRole: 'teacher', content: 'Use the mnemonic: **L**azy **Z**ebras **P**lay **D**ouble **D**rums (Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis). Zygotene is "Zipping" (synapsis) and Pachytene is "Packing" (crossing over).', date: new Date(Date.now() - 3600000 * 3).toISOString() }
        ]),
        date: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: 'post_2',
        author_id: studentUuid,
        author_name: 'Preeti Hegde',
        author_role: 'student',
        author_badge: '📖 Chapter Master',
        category: 'KCET Biology',
        title: 'High weightage chapters list for KCET 2026',
        content: 'Based on last 5 years, Plant Physiology and Genetics have the maximum weightage. Make sure you don\'t skip Photosynthesis and Molecular Basis of Inheritance!',
        upvotes: 24,
        upvoted_by: JSON.stringify([]),
        comments: JSON.stringify([]),
        date: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];

    for (const p of posts) {
      await client.query(
        'INSERT INTO public.community_posts (id, author_id, author_name, author_role, author_badge, category, title, content, upvotes, upvoted_by, comments, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [p.id, p.author_id, p.author_name, p.author_role, p.author_badge, p.category, p.title, p.content, p.upvotes, p.upvoted_by, p.comments, p.date]
      );
    }
    console.log('Community posts seeded successfully!');

    console.log('🎉 Seeding successfully completed!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await client.end();
  }
}

run();

// ─────────────────────────────────────────────────────────
//  BioVerse – Data Seeder
//  Populates localStorage with demo data on first run
// ─────────────────────────────────────────────────────────

import { syllabusData } from './syllabus.js';
import { sampleQuestions } from './questions.js';
import { diagramsData } from './diagrams.js';
import { pyqData } from './pyqs.js';

const PREFIX = 'bv_';

function set(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function seedData() {

  // ────────────────────────────────────────────────
  //  1. USERS
  // ────────────────────────────────────────────────

  const users = [
    {
      id: 'user_admin',
      name: 'Admin',
      email: 'yashavanthgowdas',
      password: 'bujju@6367',
      phone: '9999999999',
      class: '',
      role: 'admin',
      subscription: 'premium',
      streak: 15,
      lastActive: new Date().toISOString(),
      createdAt: '2025-01-01T00:00:00.000Z',
      status: 'approved'
    },
    {
      id: 'user_manager',
      name: 'Content Manager',
      email: 'manager@bioverse.com',
      password: 'manager123',
      phone: '9999999991',
      class: '',
      role: 'content_manager',
      subscription: 'premium',
      streak: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'approved'
    },
    {
      id: 'user_teacher',
      name: 'Biology Teacher',
      email: 'teacher@bioverse.com',
      password: 'teacher123',
      phone: '9999999992',
      class: '',
      role: 'teacher',
      subscription: 'premium',
      streak: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'approved'
    },
    {
      id: 'user_student',
      name: 'Arjun Kumar',
      email: 'student@bioverse.com',
      password: 'student123',
      phone: '9876543210',
      class: '2nd PU',
      role: 'student',
      subscription: 'free',
      streak: 7,
      lastActive: new Date().toISOString(),
      createdAt: '2025-06-01T00:00:00.000Z',
      status: 'approved'
    },
    {
      id: 'user_student_2',
      name: 'Priya Sharma',
      email: 'priya@bioverse.com',
      password: 'priya123',
      phone: '9876543211',
      class: '1st PU',
      role: 'student',
      subscription: 'free',
      streak: 3,
      lastActive: new Date().toISOString(),
      createdAt: '2025-07-10T00:00:00.000Z',
      status: 'approved'
    },
    {
      id: 'user_student_3',
      name: 'Rahul Gowda',
      email: 'rahul@bioverse.com',
      password: 'rahul123',
      phone: '9876543212',
      class: '2nd PU',
      role: 'student',
      subscription: 'premium',
      subscriptionPlan: 'monthly',
      subscriptionStart: new Date(Date.now() - 3600000 * 24 * 10).toISOString(), // 10 days ago
      subscriptionEnd: new Date(Date.now() + 3600000 * 24 * 20).toISOString(), // 20 days left
      autoRenew: true,
      referralCode: 'REF_RAHUL3',
      referralsCount: 2,
      paymentHistory: [
        {
          paymentId: 'pay_HjKls9281uIoa',
          invoiceId: 'INV-2026-8729',
          planName: 'Premium Monthly',
          amount: 299,
          date: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
          coupon: 'WELCOME20',
          status: 'success'
        }
      ],
      streak: 12,
      lastActive: new Date().toISOString(),
      createdAt: '2025-05-15T00:00:00.000Z',
      status: 'approved'
    },
    {
      id: 'user_student_4',
      name: 'Sneha Reddy',
      email: 'sneha@bioverse.com',
      password: 'sneha123',
      phone: '9876543213',
      class: '1st PU',
      role: 'student',
      subscription: 'free',
      streak: 1,
      lastActive: new Date().toISOString(),
      createdAt: '2025-08-01T00:00:00.000Z',
      status: 'approved'
    }
  ];

  set('users', users);

  // ────────────────────────────────────────────────
  //  2. SYLLABUS
  // ────────────────────────────────────────────────

  set('syllabus', syllabusData);

  // ────────────────────────────────────────────────
  //  3. QUESTIONS
  // ────────────────────────────────────────────────

  set('questions', sampleQuestions);

  // ────────────────────────────────────────────────
  //  4. VIDEOS
  // ────────────────────────────────────────────────

  const videos = [
    // ── Chapter 1: The Living World ──
    {
      id: 'vid_001',
      title: 'Introduction to The Living World',
      chapterId: 'ch_living_world',
      conceptId: 'con_1_1',
      youtubeUrl: 'https://www.youtube.com/watch?v=X7jXMPMa5Xw',
      youtubeId: 'X7jXMPMa5Xw',
      duration: '14:22',
      order: 1
    },
    {
      id: 'vid_002',
      title: 'Characteristics of Living Organisms',
      chapterId: 'ch_living_world',
      conceptId: 'con_1_1',
      youtubeUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8',
      youtubeId: 'URUJD5NEXC8',
      duration: '11:05',
      order: 2
    },
    {
      id: 'vid_003',
      title: 'Taxonomic Categories & Hierarchy',
      chapterId: 'ch_living_world',
      conceptId: 'con_1_4',
      youtubeUrl: 'https://www.youtube.com/watch?v=8kK2zwjRV0M',
      youtubeId: '8kK2zwjRV0M',
      duration: '16:48',
      order: 3
    },

    // ── Chapter 2: Biological Classification ──
    {
      id: 'vid_004',
      title: 'Five Kingdom Classification – Whittaker',
      chapterId: 'ch_bio_classification',
      conceptId: 'con_2_1',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '18:30',
      order: 1
    },
    {
      id: 'vid_005',
      title: 'Kingdom Monera – Bacteria',
      chapterId: 'ch_bio_classification',
      conceptId: 'con_2_1',
      youtubeUrl: 'https://www.youtube.com/watch?v=X7jXMPMa5Xw',
      youtubeId: 'X7jXMPMa5Xw',
      duration: '15:12',
      order: 2
    },
    {
      id: 'vid_006',
      title: 'Kingdom Protista & Kingdom Fungi',
      chapterId: 'ch_bio_classification',
      conceptId: 'con_2_2',
      youtubeUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8',
      youtubeId: 'URUJD5NEXC8',
      duration: '20:15',
      order: 3
    },
    {
      id: 'vid_007',
      title: 'Viruses, Viroids and Lichens',
      chapterId: 'ch_bio_classification',
      conceptId: 'con_2_6',
      youtubeUrl: 'https://www.youtube.com/watch?v=8kK2zwjRV0M',
      youtubeId: '8kK2zwjRV0M',
      duration: '12:40',
      order: 4
    },

    // ── Chapter 3: Plant Kingdom ──
    {
      id: 'vid_008',
      title: 'Algae – Classification and Characteristics',
      chapterId: 'ch_plant_kingdom',
      conceptId: 'con_3_1',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '17:35',
      order: 1
    },
    {
      id: 'vid_009',
      title: 'Bryophytes and Pteridophytes',
      chapterId: 'ch_plant_kingdom',
      conceptId: 'con_3_2',
      youtubeUrl: 'https://www.youtube.com/watch?v=X7jXMPMa5Xw',
      youtubeId: 'X7jXMPMa5Xw',
      duration: '19:10',
      order: 2
    },
    {
      id: 'vid_010',
      title: 'Gymnosperms and Angiosperms',
      chapterId: 'ch_plant_kingdom',
      conceptId: 'con_3_4',
      youtubeUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8',
      youtubeId: 'URUJD5NEXC8',
      duration: '22:00',
      order: 3
    },
    {
      id: 'vid_011',
      title: 'Alternation of Generations in Plants',
      chapterId: 'ch_plant_kingdom',
      conceptId: 'con_3_6',
      youtubeUrl: 'https://www.youtube.com/watch?v=8kK2zwjRV0M',
      youtubeId: '8kK2zwjRV0M',
      duration: '13:25',
      order: 4
    },

    // ── Chapter 4: Animal Kingdom ──
    {
      id: 'vid_012',
      title: 'Basis of Animal Classification',
      chapterId: 'ch_animal_kingdom',
      conceptId: 'con_4_1',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '16:50',
      order: 1
    },
    {
      id: 'vid_013',
      title: 'Non-Chordata – Porifera to Echinodermata',
      chapterId: 'ch_animal_kingdom',
      conceptId: 'con_4_2',
      youtubeUrl: 'https://www.youtube.com/watch?v=X7jXMPMa5Xw',
      youtubeId: 'X7jXMPMa5Xw',
      duration: '24:15',
      order: 2
    },
    {
      id: 'vid_014',
      title: 'Phylum Chordata – Vertebrate Classes',
      chapterId: 'ch_animal_kingdom',
      conceptId: 'con_4_5',
      youtubeUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8',
      youtubeId: 'URUJD5NEXC8',
      duration: '21:30',
      order: 3
    },

    // ── Chapter 5: Cell ──
    {
      id: 'vid_015',
      title: 'Cell Theory and Cell Organelles',
      chapterId: 'ch_cell',
      conceptId: 'con_8_1',
      youtubeUrl: 'https://www.youtube.com/watch?v=8kK2zwjRV0M',
      youtubeId: '8kK2zwjRV0M',
      duration: '18:40',
      order: 1
    }
  ];

  set('videos', videos);

  // ────────────────────────────────────────────────
  //  5. NOTES
  // ────────────────────────────────────────────────

  const notes = [
    // ── Chapter 1: The Living World ──
    {
      id: 'note_001',
      chapterId: 'ch_living_world',
      conceptId: 'con_1_1',
      title: 'What is Living? – Key Properties',
      content: `<h3>Properties of Living Organisms</h3>
<p>Living organisms exhibit several defining characteristics that distinguish them from non-living matter. While growth, reproduction, and response to stimuli are important, <strong>metabolism</strong> is considered the most defining property of all living organisms.</p>
<ul>
  <li><strong>Growth:</strong> Increase in mass and number of individuals. In living organisms, growth is from inside (intrinsic growth by cell division). Non-living objects can also grow by accumulation from outside.</li>
  <li><strong>Reproduction:</strong> Production of offspring. However, organisms like mules, sterile worker bees, and infertile humans are still alive despite not reproducing.</li>
  <li><strong>Metabolism:</strong> Sum total of all chemical reactions occurring in the body – includes anabolism (synthesis) and catabolism (breakdown). This is the <em>defining feature</em> of life.</li>
  <li><strong>Cellular Organisation:</strong> All living organisms are made up of cells – the basic structural and functional unit of life.</li>
  <li><strong>Consciousness:</strong> Ability to sense and respond to environmental stimuli. Even plants respond to light, gravity, etc.</li>
</ul>
<p><em>Key Takeaway:</em> No single characteristic is sufficient to define "living." It is a combination of all these properties, with metabolism being the most inclusive.</p>`,
      type: 'detailed',
      order: 1,
      createdAt: '2025-06-01T10:00:00.000Z'
    },
    {
      id: 'note_002',
      chapterId: 'ch_living_world',
      conceptId: 'con_1_4',
      title: 'Taxonomic Categories – Quick Revision',
      content: `<h3>Taxonomic Hierarchy</h3>
<p>Classification involves grouping organisms into a hierarchical system of categories called <strong>taxa</strong> (singular: taxon). The hierarchy from lowest to highest is:</p>
<ol>
  <li><strong>Species</strong> – Basic unit of classification. Group of organisms that can interbreed and produce fertile offspring.</li>
  <li><strong>Genus</strong> – Group of closely related species. E.g., <em>Panthera</em> includes lion (<em>P. leo</em>) and tiger (<em>P. tigris</em>).</li>
  <li><strong>Family</strong> – Group of related genera. E.g., Family Felidae includes cats, lions, tigers.</li>
  <li><strong>Order</strong> – Group of related families. E.g., Order Carnivora.</li>
  <li><strong>Class</strong> – Group of related orders. E.g., Class Mammalia.</li>
  <li><strong>Phylum/Division</strong> – Group of related classes. Phylum for animals, Division for plants.</li>
  <li><strong>Kingdom</strong> – Highest category. E.g., Kingdom Animalia, Kingdom Plantae.</li>
</ol>
<p><strong>Remember:</strong> King Philip Came Over For Good Spaghetti (Kingdom, Phylum, Class, Order, Family, Genus, Species)</p>`,
      type: 'revision',
      order: 2,
      createdAt: '2025-06-01T10:30:00.000Z'
    },
    {
      id: 'note_003',
      chapterId: 'ch_living_world',
      conceptId: 'con_1_5',
      title: 'Taxonomical Aids',
      content: `<h3>Tools for Studying Taxonomy</h3>
<p>Biologists have established several taxonomical aids to study, identify, and classify organisms systematically.</p>
<ul>
  <li><strong>Herbarium:</strong> A storehouse of collected, dried, pressed, and preserved plant specimens mounted on sheets. Includes details like date, place, collector's name, and scientific name.</li>
  <li><strong>Botanical Gardens:</strong> Specialised gardens where living plants are grown for identification and reference. Famous: Royal Botanical Garden (Kew, England), Indian Botanical Garden (Howrah, Kolkata).</li>
  <li><strong>Museum:</strong> Collections of preserved plant and animal specimens for study. Specimens are stored in jars (wet preservation in formalin) or as dry specimens. Includes skeletons, stuffed animals, and insect collections.</li>
  <li><strong>Zoological Parks (Zoos):</strong> Places where wild animals are kept in protected environments for public education and awareness.</li>
  <li><strong>Keys:</strong> Analytical tools based on contrasting characters (couplets) used for identification. Each pair of contrasting characters is called a <em>lead</em>. Keys are used in flora, manuals, and monographs.</li>
</ul>`,
      type: 'detailed',
      order: 3,
      createdAt: '2025-06-02T09:00:00.000Z'
    },

    // ── Chapter 2: Biological Classification ──
    {
      id: 'note_004',
      chapterId: 'ch_bio_classification',
      conceptId: 'con_2_1',
      title: 'Kingdom Monera – Bacteria',
      content: `<h3>Kingdom Monera</h3>
<p>Kingdom Monera includes all prokaryotic organisms — bacteria and cyanobacteria (blue-green algae). They are the most abundant and ubiquitous organisms on Earth.</p>
<h4>Archaebacteria</h4>
<p>Special bacteria that survive in the harshest habitats. Their cell wall has a different composition (lacks peptidoglycan in many species).</p>
<ul>
  <li><strong>Halophiles:</strong> Live in extreme salty environments (e.g., salt lakes).</li>
  <li><strong>Thermoacidophiles:</strong> Thrive in hot springs at 80°C+ and acidic pH.</li>
  <li><strong>Methanogens:</strong> Found in marshy areas and the gut of ruminant animals. Produce methane (biogas) from CO₂ and H₂.</li>
</ul>
<h4>Eubacteria (True Bacteria)</h4>
<p>Most common bacteria with a rigid cell wall made of <strong>peptidoglycan</strong>. Classified by shape:</p>
<ul>
  <li><em>Coccus</em> (spherical), <em>Bacillus</em> (rod-shaped), <em>Vibrio</em> (comma-shaped), <em>Spirillum</em> (spiral)</li>
</ul>
<p>Nutrition: Autotrophic (photosynthetic or chemosynthetic) or Heterotrophic (parasitic, saprophytic). Reproduction mainly by binary fission.</p>`,
      type: 'detailed',
      order: 1,
      createdAt: '2025-06-03T08:00:00.000Z'
    },
    {
      id: 'note_005',
      chapterId: 'ch_bio_classification',
      conceptId: 'con_2_6',
      title: 'Viruses, Viroids and Lichens – Revision Notes',
      content: `<h3>Viruses</h3>
<p>Viruses are <strong>non-cellular, obligate intracellular parasites</strong> that show characteristics of both living and non-living. They were discovered by <strong>D.J. Ivanowsky</strong> (1892) while studying Tobacco Mosaic Disease.</p>
<ul>
  <li>Outside a host cell: behave as non-living (can be crystallised — <em>W.M. Stanley</em>, 1935).</li>
  <li>Inside a host cell: behave as living (replicate using host machinery).</li>
  <li>Composed of a protein coat (<strong>capsid</strong>) enclosing genetic material — either DNA or RNA (never both).</li>
  <li>Plant viruses: usually ssRNA. Animal viruses: DNA or RNA. Bacteriophages: usually dsDNA.</li>
</ul>
<h3>Viroids</h3>
<p>Discovered by <strong>T.O. Diener</strong> (1971). Smaller than viruses — consist of <em>free RNA without a protein coat</em>. Cause diseases in plants (e.g., potato spindle tuber disease).</p>
<h3>Lichens</h3>
<p>Symbiotic (mutualistic) association between <strong>algae</strong> (phycobiont — photosynthetic) and <strong>fungi</strong> (mycobiont — provides shelter and minerals). Lichens are pollution indicators — they do not grow in polluted areas.</p>`,
      type: 'revision',
      order: 2,
      createdAt: '2025-06-04T09:00:00.000Z'
    },

    // ── Chapter 3: Plant Kingdom ──
    {
      id: 'note_006',
      chapterId: 'ch_plant_kingdom',
      conceptId: 'con_3_1',
      title: 'Algae – Types and Characteristics',
      content: `<h3>Algae (Thallophyta)</h3>
<p>Algae are chlorophyll-bearing, simple, thalloid, autotrophic, and largely aquatic organisms. They occur in moist stones, soils, wood, and in association with fungi (lichens) and animals (on sloth bear fur).</p>
<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%;">
  <tr style="background:#e8f5e9;"><th>Feature</th><th>Chlorophyceae (Green)</th><th>Phaeophyceae (Brown)</th><th>Rhodophyceae (Red)</th></tr>
  <tr><td><strong>Pigments</strong></td><td>Chl a, b</td><td>Chl a, c, fucoxanthin</td><td>Chl a, d, phycoerythrin</td></tr>
  <tr><td><strong>Stored Food</strong></td><td>Starch</td><td>Mannitol, laminarin</td><td>Floridean starch</td></tr>
  <tr><td><strong>Cell Wall</strong></td><td>Cellulose</td><td>Cellulose + algin</td><td>Cellulose + pectin + polysulphate esters</td></tr>
  <tr><td><strong>Flagella</strong></td><td>2–8, equal, apical</td><td>2, unequal, lateral</td><td>Absent</td></tr>
  <tr><td><strong>Habitat</strong></td><td>Fresh water mostly</td><td>Marine</td><td>Marine (some fresh water)</td></tr>
  <tr><td><strong>Examples</strong></td><td>Chlamydomonas, Spirogyra, Ulva</td><td>Ectocarpus, Fucus, Sargassum</td><td>Polysiphonia, Porphyra, Gelidium</td></tr>
</table>
<p><strong>Economic Importance:</strong> Agar (from Gelidium, Gracilaria), algin (from brown algae), carrageenan (from red algae), food (Porphyra, Laminaria, Sargassum), biofuel research.</p>`,
      type: 'detailed',
      order: 1,
      createdAt: '2025-06-05T08:00:00.000Z'
    },
    {
      id: 'note_007',
      chapterId: 'ch_plant_kingdom',
      conceptId: 'con_3_6',
      title: 'Alternation of Generations – Summary',
      content: `<h3>Plant Life Cycles & Alternation of Generations</h3>
<p>All plants show alternation between a haploid gametophytic phase (n) and a diploid sporophytic phase (2n). The relative dominance of each phase varies across plant groups.</p>
<ul>
  <li><strong>Haplontic Life Cycle:</strong> The dominant phase is gametophyte (n). Sporophyte is represented only by the single-celled zygote (2n) which immediately undergoes meiosis. <em>Examples:</em> Volvox, Spirogyra, Chlamydomonas (most algae).</li>
  <li><strong>Diplontic Life Cycle:</strong> The dominant phase is sporophyte (2n). Gametophyte is reduced to few cells. Meiosis produces gametes (gametic meiosis). <em>Examples:</em> Fucus (brown alga), all seed plants (gymnosperms and angiosperms).</li>
  <li><strong>Haplo-diplontic Life Cycle:</strong> Both gametophyte and sporophyte are multicellular. In <em>bryophytes</em>, the gametophyte is dominant; in <em>pteridophytes</em>, the sporophyte is dominant. Meiosis is sporic (produces spores).</li>
</ul>
<p><strong>Key Point:</strong> As we move from algae → bryophytes → pteridophytes → gymnosperms → angiosperms, the sporophyte becomes progressively more dominant and the gametophyte becomes more reduced.</p>`,
      type: 'revision',
      order: 2,
      createdAt: '2025-06-05T10:00:00.000Z'
    },
    {
      id: 'note_008',
      chapterId: 'ch_plant_kingdom',
      conceptId: null,
      title: 'Plant Kingdom – Complete Revision Sheet',
      content: `<h3>Plant Kingdom at a Glance</h3>
<p>A quick overview of all major plant groups for exam revision.</p>
<ul>
  <li><strong>Bryophytes</strong> (Amphibians of plant kingdom): Non-vascular, dominant gametophyte. Need water for fertilisation. E.g., Riccia, Marchantia (liverworts), Funaria, Sphagnum (mosses).</li>
  <li><strong>Pteridophytes</strong> (First vascular plants): Have xylem and phloem. Dominant sporophyte. Gametophyte = prothallus (small, independent). Heterospory first seen here (Selaginella, Salvinia). E.g., Dryopteris (fern), Equisetum (horsetail), Lycopodium.</li>
  <li><strong>Gymnosperms</strong> (Naked seeds): Ovules not enclosed in ovary. Vascular, dominant sporophyte. Male and female cones. E.g., Pinus, Cedrus, Cycas, Ginkgo.</li>
  <li><strong>Angiosperms</strong> (Enclosed seeds): Most advanced. Ovules enclosed in ovary → fruit. Double fertilisation and triple fusion. Divided into Dicots and Monocots. E.g., Mango, Rice, Wheat, Rose.</li>
</ul>
<p><strong>Exam Tip:</strong> Focus on the comparison tables — pigments, food storage, vascular tissue, dominant phase, and examples are frequently asked in both PU and NEET exams.</p>`,
      type: 'revision',
      order: 3,
      createdAt: '2025-06-06T08:00:00.000Z'
    }
  ];

  set('notes', notes);

  // ────────────────────────────────────────────────
  //  6. TESTS
  // ────────────────────────────────────────────────

  // Helper: gather question IDs by filter
  const qByChapter = (chId) => sampleQuestions.filter(q => q.chapterId === chId).map(q => q.id);
  const qByCategory = (cat) => sampleQuestions.filter(q => q.category === cat).map(q => q.id);

  const tests = [
    {
      id: 'test_ch1',
      title: 'Chapter Test – The Living World',
      type: 'chapter',
      chapterId: 'ch_living_world',
      classId: 'pu1',
      description: 'Test your understanding of Chapter 1: The Living World. Covers definitions of life, taxonomy, nomenclature, and taxonomical aids.',
      questionIds: qByChapter('ch_living_world'),
      totalQuestions: qByChapter('ch_living_world').length,
      duration: 15,
      createdAt: '2025-06-10T08:00:00.000Z'
    },
    {
      id: 'test_ch2',
      title: 'Chapter Test – Biological Classification',
      type: 'chapter',
      chapterId: 'ch_bio_classification',
      classId: 'pu1',
      description: 'Test your knowledge of Whittaker\'s five-kingdom classification, viruses, viroids, and lichens.',
      questionIds: qByChapter('ch_bio_classification'),
      totalQuestions: qByChapter('ch_bio_classification').length,
      duration: 15,
      createdAt: '2025-06-10T09:00:00.000Z'
    },
    {
      id: 'test_unit1',
      title: 'Unit Test – Diversity in the Living World',
      type: 'unit',
      chapterId: null,
      classId: 'pu1',
      description: 'Comprehensive unit test covering Unit I: The Living World, Biological Classification, Plant Kingdom, and Animal Kingdom.',
      questionIds: [
        // Pick 5 from each of the 4 chapters in Unit I = 20 questions
        ...qByChapter('ch_living_world').slice(0, 5),
        ...qByChapter('ch_bio_classification').slice(0, 5),
        ...qByChapter('ch_plant_kingdom').slice(0, 5),
        ...qByChapter('ch_animal_kingdom').slice(0, 5)
      ],
      totalQuestions: 20,
      duration: 30,
      createdAt: '2025-06-15T08:00:00.000Z'
    },
    {
      id: 'test_mock1',
      title: 'Full Mock Test 1 – 1st PU Biology',
      type: 'mock',
      chapterId: null,
      classId: 'pu1',
      description: 'Full-length mock test covering multiple chapters from 1st PU Biology. Simulates PU board exam pattern.',
      questionIds: [
        // 5 from each of 6 chapters = 30 questions
        ...qByChapter('ch_living_world').slice(0, 5),
        ...qByChapter('ch_bio_classification').slice(0, 5),
        ...qByChapter('ch_plant_kingdom').slice(0, 5),
        ...qByChapter('ch_animal_kingdom').slice(0, 5),
        ...qByChapter('ch_cell').slice(0, 5),
        ...qByChapter('ch_biomolecules').slice(0, 5)
      ],
      totalQuestions: 30,
      duration: 45,
      createdAt: '2025-06-20T08:00:00.000Z'
    },
    {
      id: 'test_kcet1',
      title: 'KCET Practice Test 1',
      type: 'kcet',
      chapterId: null,
      classId: null,
      description: 'Practice test with KCET-pattern questions from multiple chapters. Focus on previous year KCET biology questions.',
      questionIds: qByCategory('kcet').slice(0, 20),
      totalQuestions: Math.min(qByCategory('kcet').length, 20),
      duration: 30,
      createdAt: '2025-06-22T08:00:00.000Z'
    }
  ];

  set('tests', tests);

  // ────────────────────────────────────────────────
  //  X. NEW DATA: DIAGRAMS, PYQS, ACHIEVEMENTS
  // ────────────────────────────────────────────────

  set('diagrams', diagramsData);
  set('pyqs', pyqData);

  const achievements = [
    { id: 'ach_1', title: 'First Steps', description: 'Watched your first video', icon: '🎯', xpReward: 50 },
    { id: 'ach_2', title: 'Bookworm', description: 'Read 5 notes', icon: '📚', xpReward: 100 },
    { id: 'ach_3', title: 'Quiz Master', description: 'Scored 100% in a test', icon: '🏆', xpReward: 200 },
    { id: 'ach_4', title: 'Streak 7', description: 'Maintained a 7-day streak', icon: '🔥', xpReward: 150 },
  ];
  set('achievements', achievements);

  // ────────────────────────────────────────────────
  //  7. PROGRESS FOR DEMO STUDENT
  // ────────────────────────────────────────────────

  set('progress_user_student', {
    videosWatched: ['vid_001', 'vid_002', 'vid_003'],
    notesRead: ['note_001', 'note_002'],
    testsCompleted: [],
    chapterProgress: {},
    streak: 7,
    xp: 120,
    achievements: [],
    lastActive: new Date().toISOString()
  });

  // Also set initial (empty) progress for other students
  set('progress_user_student_2', {
    videosWatched: [],
    notesRead: [],
    testsCompleted: [],
    chapterProgress: {},
    streak: 3,
    xp: 0,
    achievements: [],
    lastActive: new Date().toISOString()
  });

  set('progress_user_student_3', {
    videosWatched: ['vid_001', 'vid_004', 'vid_008', 'vid_012'],
    notesRead: ['note_001', 'note_004', 'note_006'],
    testsCompleted: [],
    chapterProgress: {},
    streak: 12,
    xp: 450,
    achievements: ['ach_1'],
    lastActive: new Date().toISOString()
  });

  set('progress_user_student_4', {
    videosWatched: [],
    notesRead: [],
    testsCompleted: [],
    chapterProgress: {},
    streak: 1,
    xp: 0,
    achievements: [],
    lastActive: new Date().toISOString()
  });

  // ────────────────────────────────────────────────
  //  9. SUBSCRIPTION PLANS
  // ────────────────────────────────────────────────

  set('plans', [
    { id: 'plan_free', name: 'Free Plan', price: 0, interval: 'forever', features: ['Sample Videos', 'Limited Notes', 'Daily Quiz', 'Basic Dashboard'], active: true },
    { id: 'plan_monthly', name: 'Premium Monthly', price: 299, interval: 'month', features: ['All Videos', 'All Notes', 'Question Bank', 'PYQs', 'Chapter Tests', 'Unit Tests', 'Progress Analytics'], active: true },
    { id: 'plan_yearly', name: 'Premium Yearly', price: 2499, interval: 'year', features: ['Everything in Monthly', 'Priority Support', 'Early Access Features'], active: true }
  ]);

  // ────────────────────────────────────────────────
  //  9b. MOCK COUPONS
  // ────────────────────────────────────────────────

  set('coupons', [
    { id: 'c_1', code: 'BIO50', type: 'percentage', value: 50, expiryDate: '2027-12-31', usageLimit: 100, usedCount: 15, active: true },
    { id: 'c_2', code: 'WELCOME20', type: 'percentage', value: 20, expiryDate: '2027-12-31', usageLimit: 500, usedCount: 42, active: true }
  ]);

  // ────────────────────────────────────────────────
  //  9c. MOCK TESTIMONIALS
  // ────────────────────────────────────────────────

  set('testimonials', [
    { id: 't_1', studentName: 'Anjali Deshpande', email: 'anjali@gmail.com', rating: 5, content: 'BioVerse made learning plant physiology so simple! The diagrams center is amazing.', status: 'approved', timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString() },
    { id: 't_2', studentName: 'Vikas Gowda', email: 'vikas@gmail.com', rating: 5, content: 'The KCET readiness analyzer helped me target my weak spots. Got 55/60 in Biology!', status: 'approved', timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString() },
    { id: 't_3', studentName: 'Sanjay Kumar', email: 'sanjay@gmail.com', rating: 4, content: 'Great notes and summaries, but please add more NEET mock tests.', status: 'pending', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() }
  ]);

  // ────────────────────────────────────────────────
  //  9d. MOCK CERTIFICATES
  // ────────────────────────────────────────────────

  set('certificates', [
    { id: 'cert_1', userId: 'user_student_3', studentName: 'Rahul Gowda', courseName: '1st PU Biology Course Completion', type: 'completion', certificateId: 'BV-982736', timestamp: new Date(Date.now() - 3600000 * 24 * 10).toISOString() }
  ]);

  // ────────────────────────────────────────────────
  //  9e. MOCK PAYMENT SETTINGS
  // ────────────────────────────────────────────────

  set('payment_settings', {
    keyId: 'rzp_test_bv109238',
    keySecret: 'sk_test_mockBioVerseKey1928374',
    liveMode: false
  });

  // ────────────────────────────────────────────────
  //  9f. WAITLIST ENTRIES
  // ────────────────────────────────────────────────

  set('waitlist', []);

  // ────────────────────────────────────────────────
  //  10. ACTIVITY LOGS / AUDIT TRAIL
  // ────────────────────────────────────────────────

  set('activity_logs', [
    { id: 'log_001', timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), userEmail: 'yashavanthgowdas', userRole: 'admin', action: 'Approve Student Registration', details: 'Approved student sneha@bioverse.com' },
    { id: 'log_002', timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), userEmail: 'yashavanthgowdas', userRole: 'admin', action: 'Add Video', details: 'Added video: Introduction to The Living World' },
    { id: 'log_003', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), userEmail: 'manager@bioverse.com', userRole: 'content_manager', action: 'Add Question', details: 'Added question ID: q_015' },
    { id: 'log_004', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), userEmail: 'teacher@bioverse.com', userRole: 'teacher', action: 'Create Test', details: 'Created test: Unit 1 Mock Assessment' }
  ]);

  // ────────────────────────────────────────────────
  //  11. ANNOUNCEMENTS
  // ────────────────────────────────────────────────

  set('announcements', [
    { id: 'ann_001', title: 'KCET Mock Test Released!', content: 'A brand new KCET Mock Test with latest patterns is now live in the Mock Test center. Test yourself now!', channels: ['in-app', 'email'], timestamp: new Date(Date.now() - 3600000 * 48).toISOString() },
    { id: 'ann_002', title: 'Chapter 5 Notes Uploaded', content: 'Detailed smart notes for Cell Structure and Function are now available with highlighted quick summaries.', channels: ['in-app'], timestamp: new Date(Date.now() - 3600000 * 8).toISOString() }
  ]);

  // ────────────────────────────────────────────────
  //  8. MARK AS SEEDED
  // ────────────────────────────────────────────────

  set('seeded', true);

  console.log('✅ BioVerse data seeded successfully!');
  console.log(`   📚 ${syllabusData.length} units, ${syllabusData.reduce((s, u) => s + u.chapters.length, 0)} chapters`);
  console.log(`   ❓ ${sampleQuestions.length} questions`);
  console.log(`   🎬 ${videos.length} videos`);
  console.log(`   📝 ${notes.length} notes`);
  console.log(`   📋 ${tests.length} tests`);
  console.log(`   🏆 ${achievements.length} achievements`);
  console.log(`   👤 ${users.length} users`);
}

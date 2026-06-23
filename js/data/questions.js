// ─────────────────────────────────────────────────────────
//  BioVerse – Sample Question Bank
//  Karnataka PU Biology MCQs (1st & 2nd PU)
//  Covers: ch_living_world, ch_bio_classification,
//          ch_plant_kingdom, ch_animal_kingdom, ch_cell,
//          ch_biomolecules, ch_sexual_repro_plants, ch_inheritance
// ─────────────────────────────────────────────────────────

export const sampleQuestions = [

  // ═══════════════════════════════════════════════════════
  //  CHAPTER 1 – THE LIVING WORLD  (10 questions)
  // ═══════════════════════════════════════════════════════

  {
    id: 'q_001', chapterId: 'ch_living_world', conceptId: 'con_1_1',
    question: 'Which of the following is a defining property of all living organisms?',
    options: ['Growth', 'Reproduction', 'Metabolism', 'Decay'],
    correctAnswer: 2,
    explanation: 'Metabolism (sum of anabolism and catabolism) is the defining property of all living organisms. Non-living objects can also show growth (e.g., mountains), and mules cannot reproduce, but all living things carry out metabolism.',
    category: 'neet', difficulty: 'medium', year: '2017'
  },
  {
    id: 'q_002', chapterId: 'ch_living_world', conceptId: 'con_1_4',
    question: 'The basic unit of classification is:',
    options: ['Genus', 'Species', 'Family', 'Order'],
    correctAnswer: 1,
    explanation: 'Species is the basic or lowest unit of classification. It is a group of organisms that can interbreed among themselves and produce fertile offspring.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_003', chapterId: 'ch_living_world', conceptId: 'con_1_3',
    question: 'Binomial nomenclature was introduced by:',
    options: ['Aristotle', 'Carolus Linnaeus', 'Robert Hooke', 'Charles Darwin'],
    correctAnswer: 1,
    explanation: 'Carolus Linnaeus introduced the system of binomial nomenclature, where each organism is given a two-part Latin name consisting of genus and species.',
    category: 'pu', difficulty: 'easy', year: '2019'
  },
  {
    id: 'q_004', chapterId: 'ch_living_world', conceptId: 'con_1_5',
    question: 'A herbarium is:',
    options: [
      'A garden where medicinal plants are grown',
      'A storehouse of collected, dried, pressed and preserved plant specimens on sheets',
      'A place where living animals are kept',
      'A book with descriptions of plants'
    ],
    correctAnswer: 1,
    explanation: 'A herbarium is a storehouse of collected, dried, pressed, and preserved plant specimens mounted on sheets. Each specimen is labelled with date, place of collection, collector\'s name, etc.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_005', chapterId: 'ch_living_world', conceptId: 'con_1_4',
    question: 'The correct sequence of taxonomic categories in ascending order is:',
    options: [
      'Species → Genus → Order → Family → Class',
      'Species → Genus → Family → Order → Class',
      'Species → Family → Genus → Order → Class',
      'Species → Order → Family → Genus → Class'
    ],
    correctAnswer: 1,
    explanation: 'The correct ascending hierarchy of taxonomic categories is: Species → Genus → Family → Order → Class → Phylum → Kingdom.',
    category: 'kcet', difficulty: 'medium', year: '2020'
  },
  {
    id: 'q_006', chapterId: 'ch_living_world', conceptId: 'con_1_1',
    question: 'Which of the following is unique to living organisms?',
    options: ['Growth by cell division', 'Increase in mass', 'Increase in size', 'All of these'],
    correctAnswer: 0,
    explanation: 'Growth by cell division (intrinsic growth) is unique to living organisms. Non-living things like crystals and mountains can also increase in mass and size by accumulation of material.',
    category: 'neet', difficulty: 'medium', year: null
  },
  {
    id: 'q_007', chapterId: 'ch_living_world', conceptId: 'con_1_3',
    question: 'The scientific name of mango is written as:',
    options: ['Mangifera Indica', 'Mangifera indica', 'mangifera indica', 'mangifera Indica'],
    correctAnswer: 1,
    explanation: 'As per binomial nomenclature rules, the generic name starts with a capital letter and the specific epithet starts with a small letter. Both are italicised (or underlined when handwritten). So Mangifera indica is correct.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_008', chapterId: 'ch_living_world', conceptId: 'con_1_5',
    question: 'A taxonomic key is a tool used for:',
    options: [
      'Naming organisms',
      'Identification of organisms based on contrasting characters',
      'Classifying organisms into kingdoms',
      'Studying the evolution of organisms'
    ],
    correctAnswer: 1,
    explanation: 'A taxonomic key is an analytical tool based on contrasting characters (couplets) used for identification of plants and animals. Each statement in the key is called a lead.',
    category: 'kcet', difficulty: 'medium', year: null
  },
  {
    id: 'q_009', chapterId: 'ch_living_world', conceptId: 'con_1_2',
    question: 'The number of known species of plants on Earth is approximately:',
    options: ['1.5 million', '2.5 lakhs', '3.5 lakhs', '1.0 million'],
    correctAnswer: 1,
    explanation: 'According to NCERT, the number of known plant species is approximately 2.5 lakhs (250,000). The total known species of living organisms is about 1.7–1.8 million.',
    category: 'pu', difficulty: 'medium', year: '2022'
  },
  {
    id: 'q_010', chapterId: 'ch_living_world', conceptId: 'con_1_1',
    question: 'All living organisms are linked to one another because they:',
    options: [
      'Need food for survival',
      'Share a common genetic material (DNA/RNA)',
      'Are of the same size',
      'Have the same habitat'
    ],
    correctAnswer: 1,
    explanation: 'All living organisms share common genetic material – DNA or RNA – which links them together. This is the molecular basis of the unity of life.',
    category: 'neet', difficulty: 'hard', year: null
  },

  // ═══════════════════════════════════════════════════════
  //  CHAPTER 2 – BIOLOGICAL CLASSIFICATION  (10 questions)
  // ═══════════════════════════════════════════════════════

  {
    id: 'q_011', chapterId: 'ch_bio_classification', conceptId: 'con_2_1',
    question: 'Which of the following is a characteristic feature of archaebacteria?',
    options: [
      'Presence of peptidoglycan in cell wall',
      'Ability to survive in extreme environments',
      'Presence of membrane-bound nucleus',
      'Multicellular organisation'
    ],
    correctAnswer: 1,
    explanation: 'Archaebacteria are special bacteria that can survive in extreme harsh environments such as hot springs (thermophiles), salty areas (halophiles), and marshy areas (methanogens). Their cell wall lacks peptidoglycan.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_012', chapterId: 'ch_bio_classification', conceptId: 'con_2_6',
    question: 'Viruses are considered as living because they:',
    options: [
      'Can be crystallised',
      'Can reproduce inside a living host cell',
      'Are made of proteins only',
      'Can move independently'
    ],
    correctAnswer: 1,
    explanation: 'Viruses are at the borderline of living and non-living. They are considered living because they can reproduce inside host cells using the host\'s machinery. Outside the host, they behave as non-living (can be crystallised).',
    category: 'neet', difficulty: 'medium', year: '2019'
  },
  {
    id: 'q_013', chapterId: 'ch_bio_classification', conceptId: 'con_2_3',
    question: 'The cell wall of fungi is made up of:',
    options: ['Cellulose', 'Peptidoglycan', 'Chitin', 'Pectin'],
    correctAnswer: 2,
    explanation: 'The cell wall of fungi is composed of chitin, a complex polysaccharide made of N-acetylglucosamine units. This distinguishes fungi from plants (cellulose) and bacteria (peptidoglycan).',
    category: 'kcet', difficulty: 'easy', year: '2021'
  },
  {
    id: 'q_014', chapterId: 'ch_bio_classification', conceptId: 'con_2_2',
    question: 'Euglenoids are classified under which kingdom?',
    options: ['Monera', 'Protista', 'Plantae', 'Fungi'],
    correctAnswer: 1,
    explanation: 'Euglenoids (e.g., Euglena) are classified under Kingdom Protista. They are photosynthetic in the presence of sunlight but become heterotrophic in its absence. They have a flexible pellicle instead of a cell wall.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_015', chapterId: 'ch_bio_classification', conceptId: 'con_2_3',
    question: 'Deuteromycetes are called imperfect fungi because:',
    options: [
      'They have imperfect mycelium',
      'Their sexual reproduction is not known',
      'They lack cell wall',
      'They cannot produce spores'
    ],
    correctAnswer: 1,
    explanation: 'Deuteromycetes are called imperfect fungi (Fungi Imperfecti) because only the asexual or vegetative phases of these fungi are known. Once the sexual stage is discovered, they are moved to appropriate classes.',
    category: 'neet', difficulty: 'medium', year: null
  },
  {
    id: 'q_016', chapterId: 'ch_bio_classification', conceptId: 'con_2_6',
    question: 'Lichens are an example of:',
    options: ['Parasitism', 'Commensalism', 'Mutualism', 'Competition'],
    correctAnswer: 2,
    explanation: 'Lichens are a symbiotic (mutualistic) association between algae (or cyanobacteria) and fungi. The alga provides food through photosynthesis while the fungus provides shelter, minerals, and moisture.',
    category: 'kcet', difficulty: 'easy', year: '2018'
  },
  {
    id: 'q_017', chapterId: 'ch_bio_classification', conceptId: 'con_2_1',
    question: 'Cyanobacteria are also called:',
    options: ['Golden algae', 'Blue-green algae', 'Red algae', 'Brown algae'],
    correctAnswer: 1,
    explanation: 'Cyanobacteria are also called blue-green algae. They are photosynthetic prokaryotes that have chlorophyll a similar to green plants. They belong to Kingdom Monera, not Plantae.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_018', chapterId: 'ch_bio_classification', conceptId: 'con_2_2',
    question: 'Dinoflagellates appear red due to:',
    options: [
      'Red pigments in their cell wall',
      'Rapid multiplication causing red tides',
      'Reflection of red light',
      'Presence of haemoglobin'
    ],
    correctAnswer: 1,
    explanation: 'Dinoflagellates (e.g., Gonyaulax) multiply rapidly and make the sea appear red, a phenomenon called "red tides". The red colour is due to the concentration of red-pigmented dinoflagellates. They release toxins that can kill marine animals.',
    category: 'neet', difficulty: 'hard', year: '2020'
  },
  {
    id: 'q_019', chapterId: 'ch_bio_classification', conceptId: 'con_2_6',
    question: 'Viroids differ from viruses in:',
    options: [
      'Having DNA as genetic material',
      'Being enclosed in a protein coat',
      'Having free RNA without a protein coat',
      'Being visible under light microscope'
    ],
    correctAnswer: 2,
    explanation: 'Viroids are smaller than viruses and consist of free RNA without a protein coat. They were discovered by T.O. Diener (1971) and cause diseases in plants like potato spindle tuber disease.',
    category: 'kcet', difficulty: 'medium', year: null
  },
  {
    id: 'q_020', chapterId: 'ch_bio_classification', conceptId: 'con_2_3',
    question: 'Yeast is a unicellular fungus that reproduces asexually by:',
    options: ['Binary fission', 'Budding', 'Fragmentation', 'Spore formation'],
    correctAnswer: 1,
    explanation: 'Yeast (Saccharomyces) is a unicellular fungus that reproduces asexually by budding. A small bud-like outgrowth develops from the parent cell, gradually enlarges, and separates to form a new cell.',
    category: 'pu', difficulty: 'easy', year: '2023'
  },

  // ═══════════════════════════════════════════════════════
  //  CHAPTER 3 – PLANT KINGDOM  (10 questions)
  // ═══════════════════════════════════════════════════════

  {
    id: 'q_021', chapterId: 'ch_plant_kingdom', conceptId: 'con_3_1',
    question: 'Chlorophyceae (green algae) store food in the form of:',
    options: ['Floridean starch', 'Mannitol and laminarin', 'Starch', 'Glycogen'],
    correctAnswer: 2,
    explanation: 'Green algae (Chlorophyceae) store food as starch, similar to higher plants. Red algae store floridean starch, while brown algae store mannitol and laminarin.',
    category: 'pu', difficulty: 'medium', year: null
  },
  {
    id: 'q_022', chapterId: 'ch_plant_kingdom', conceptId: 'con_3_2',
    question: 'Bryophytes are called "amphibians of the plant kingdom" because:',
    options: [
      'They live in both water and on land',
      'They need water for fertilisation but can live on land',
      'They resemble frogs',
      'They have both gills and lungs'
    ],
    correctAnswer: 1,
    explanation: 'Bryophytes are called amphibians of the plant kingdom because they can live on land but need water for the transfer of male gametes (antherozoids) to the female gamete for fertilisation.',
    category: 'neet', difficulty: 'easy', year: null
  },
  {
    id: 'q_023', chapterId: 'ch_plant_kingdom', conceptId: 'con_3_3',
    question: 'The dominant phase in the life cycle of pteridophytes is:',
    options: ['Gametophyte', 'Sporophyte', 'Both are equal', 'Prothallus'],
    correctAnswer: 1,
    explanation: 'In pteridophytes, the dominant phase is the sporophyte (2n), which is the main plant body with roots, stem, and leaves. The gametophyte (prothallus) is small, independent, and short-lived.',
    category: 'kcet', difficulty: 'medium', year: '2019'
  },
  {
    id: 'q_024', chapterId: 'ch_plant_kingdom', conceptId: 'con_3_4',
    question: 'Gymnosperms differ from angiosperms in:',
    options: [
      'Having vascular bundles',
      'Producing seeds',
      'Having ovules not enclosed in an ovary',
      'Having leaves'
    ],
    correctAnswer: 2,
    explanation: 'Gymnosperms have naked seeds – their ovules are not enclosed in an ovary (Greek: gymnos = naked, sperma = seed). Angiosperms have ovules enclosed within an ovary which develops into a fruit.',
    category: 'pu', difficulty: 'easy', year: '2020'
  },
  {
    id: 'q_025', chapterId: 'ch_plant_kingdom', conceptId: 'con_3_5',
    question: 'Double fertilisation is a characteristic feature of:',
    options: ['Gymnosperms', 'Pteridophytes', 'Angiosperms', 'Bryophytes'],
    correctAnswer: 2,
    explanation: 'Double fertilisation is unique to angiosperms. One male gamete fuses with the egg cell (syngamy) to form the zygote, and the other fuses with the two polar nuclei (triple fusion) to form the primary endosperm nucleus.',
    category: 'neet', difficulty: 'easy', year: '2018'
  },
  {
    id: 'q_026', chapterId: 'ch_plant_kingdom', conceptId: 'con_3_6',
    question: 'In a haplo-diplontic life cycle:',
    options: [
      'Only the sporophyte is multicellular',
      'Only the gametophyte is multicellular',
      'Both sporophyte and gametophyte are multicellular',
      'Neither phase is multicellular'
    ],
    correctAnswer: 2,
    explanation: 'In a haplo-diplontic life cycle, both the sporophytic (2n) and gametophytic (n) phases are multicellular. This is seen in bryophytes (dominant gametophyte) and pteridophytes (dominant sporophyte).',
    category: 'kcet', difficulty: 'hard', year: null
  },
  {
    id: 'q_027', chapterId: 'ch_plant_kingdom', conceptId: 'con_3_1',
    question: 'Agar, a commercially important product, is obtained from:',
    options: ['Green algae', 'Brown algae', 'Red algae', 'Blue-green algae'],
    correctAnswer: 2,
    explanation: 'Agar is obtained from red algae (Rhodophyceae), particularly from Gelidium and Gracilaria. It is used as a culture medium in microbiology, in food industry, and in cosmetics.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_028', chapterId: 'ch_plant_kingdom', conceptId: 'con_3_2',
    question: 'Which of the following bryophytes is used as packing material?',
    options: ['Marchantia', 'Riccia', 'Sphagnum', 'Funaria'],
    correctAnswer: 2,
    explanation: 'Sphagnum (peat moss) is used as packing material for trans-shipment of living material because of its ability to hold water. It is also used as fuel (peat) and as a soil conditioner.',
    category: 'neet', difficulty: 'medium', year: '2022'
  },
  {
    id: 'q_029', chapterId: 'ch_plant_kingdom', conceptId: 'con_3_3',
    question: 'Heterospory is first observed in:',
    options: ['Bryophytes', 'Pteridophytes', 'Gymnosperms', 'Angiosperms'],
    correctAnswer: 1,
    explanation: 'Heterospory (production of two types of spores – microspores and megaspores) is first observed in pteridophytes like Selaginella and Salvinia. This is considered an important step in plant evolution leading to seed habit.',
    category: 'kcet', difficulty: 'medium', year: null
  },
  {
    id: 'q_030', chapterId: 'ch_plant_kingdom', conceptId: 'con_3_1',
    question: 'The main photosynthetic pigments of brown algae (Phaeophyceae) are:',
    options: [
      'Chlorophyll a and b',
      'Chlorophyll a and c, fucoxanthin',
      'Chlorophyll a and phycoerythrin',
      'Chlorophyll a and phycocyanin'
    ],
    correctAnswer: 1,
    explanation: 'Brown algae contain chlorophyll a, chlorophyll c, and fucoxanthin (a brown xanthophyll pigment) as their major photosynthetic pigments. Fucoxanthin gives them their characteristic brown colour.',
    category: 'neet', difficulty: 'hard', year: null
  },

  // ═══════════════════════════════════════════════════════
  //  CHAPTER 4 – ANIMAL KINGDOM  (10 questions)
  // ═══════════════════════════════════════════════════════

  {
    id: 'q_031', chapterId: 'ch_animal_kingdom', conceptId: 'con_4_1',
    question: 'Animals with bilateral symmetry and three germ layers but no true body cavity are called:',
    options: ['Coelomates', 'Pseudocoelomates', 'Acoelomates', 'Haemocoelomates'],
    correctAnswer: 2,
    explanation: 'Acoelomates are triploblastic animals that lack a true body cavity (coelom). The space between the body wall and gut is filled with mesenchyme. Example: Platyhelminthes (flatworms).',
    category: 'neet', difficulty: 'medium', year: '2021'
  },
  {
    id: 'q_032', chapterId: 'ch_animal_kingdom', conceptId: 'con_4_2',
    question: 'Cnidarians are characterised by the presence of:',
    options: ['Pseudocoelom', 'Nematocysts', 'Jointed appendages', 'Notochord'],
    correctAnswer: 1,
    explanation: 'Cnidarians (formerly Coelenterata) are characterised by the presence of cnidoblasts or cnidocytes which contain stinging capsules called nematocysts. These are used for defence and capturing prey.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_033', chapterId: 'ch_animal_kingdom', conceptId: 'con_4_4',
    question: 'Which of the following is the largest phylum of the animal kingdom?',
    options: ['Chordata', 'Mollusca', 'Arthropoda', 'Annelida'],
    correctAnswer: 2,
    explanation: 'Arthropoda is the largest phylum of the animal kingdom, comprising about 80% of all known animal species. It includes insects, crustaceans, arachnids, and myriapods.',
    category: 'pu', difficulty: 'easy', year: '2022'
  },
  {
    id: 'q_034', chapterId: 'ch_animal_kingdom', conceptId: 'con_4_3',
    question: 'The body cavity of roundworms (Aschelminthes) is called:',
    options: ['True coelom', 'Pseudocoelom', 'Haemocoel', 'Atrium'],
    correctAnswer: 1,
    explanation: 'Roundworms (phylum Aschelminthes or Nematoda) have a pseudocoelom – a body cavity that is not lined by mesoderm on both sides. It is derived from the blastocoel of the embryo.',
    category: 'kcet', difficulty: 'medium', year: null
  },
  {
    id: 'q_035', chapterId: 'ch_animal_kingdom', conceptId: 'con_4_5',
    question: 'Which of the following features is exclusive to chordates?',
    options: ['Dorsal nerve cord', 'Ventral nerve cord', 'Bilateral symmetry', 'Segmentation'],
    correctAnswer: 0,
    explanation: 'A dorsal hollow nerve cord is one of the three defining features exclusive to chordates, along with notochord and pharyngeal gill slits (at some stage of life). Non-chordates have a ventral, solid nerve cord.',
    category: 'neet', difficulty: 'medium', year: null
  },
  {
    id: 'q_036', chapterId: 'ch_animal_kingdom', conceptId: 'con_4_2',
    question: 'Porifera (sponges) have a water canal system that helps in:',
    options: [
      'Locomotion only',
      'Food gathering, respiration and excretion',
      'Reproduction only',
      'Hormone transport'
    ],
    correctAnswer: 1,
    explanation: 'The water canal system in Porifera (sponges) helps in food gathering, respiratory exchange, and removal of waste products. Water enters through ostia and exits through the osculum.',
    category: 'pu', difficulty: 'medium', year: null
  },
  {
    id: 'q_037', chapterId: 'ch_animal_kingdom', conceptId: 'con_4_5',
    question: 'Cyclostomes are characterised by:',
    options: [
      'Presence of jaws and paired fins',
      'Absence of jaws and paired fins',
      'Presence of scales',
      'Four-chambered heart'
    ],
    correctAnswer: 1,
    explanation: 'Cyclostomes (e.g., Petromyzon – lamprey, Myxine – hagfish) are jawless vertebrates that lack paired fins. They have a circular, sucking mouth and are ectoparasites on fish.',
    category: 'kcet', difficulty: 'hard', year: '2020'
  },
  {
    id: 'q_038', chapterId: 'ch_animal_kingdom', conceptId: 'con_4_4',
    question: 'The water vascular system is the distinctive feature of:',
    options: ['Arthropoda', 'Echinodermata', 'Mollusca', 'Annelida'],
    correctAnswer: 1,
    explanation: 'The water vascular system (ambulacral system) is the distinctive feature of phylum Echinodermata. It helps in locomotion, capture of food, and respiration. Examples: starfish, sea urchin.',
    category: 'neet', difficulty: 'easy', year: '2016'
  },
  {
    id: 'q_039', chapterId: 'ch_animal_kingdom', conceptId: 'con_4_1',
    question: 'Diploblastic animals have:',
    options: [
      'Three germ layers',
      'Two germ layers – ectoderm and endoderm',
      'Only one germ layer',
      'No germ layers'
    ],
    correctAnswer: 1,
    explanation: 'Diploblastic animals have two germ layers – an outer ectoderm and an inner endoderm with an undifferentiated mesoglea in between. Examples: Cnidaria and Ctenophora.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_040', chapterId: 'ch_animal_kingdom', conceptId: 'con_4_3',
    question: 'Metamerism (true segmentation) is a characteristic feature of:',
    options: ['Platyhelminthes', 'Aschelminthes', 'Annelida', 'Mollusca'],
    correctAnswer: 2,
    explanation: 'Metamerism or true segmentation is the characteristic feature of phylum Annelida, where the body is divided into metameres (segments) both externally and internally. Examples: earthworm, leech, Nereis.',
    category: 'kcet', difficulty: 'medium', year: null
  },

  // ═══════════════════════════════════════════════════════
  //  CHAPTER 5 – CELL: THE UNIT OF LIFE  (10 questions)
  // ═══════════════════════════════════════════════════════

  {
    id: 'q_041', chapterId: 'ch_cell', conceptId: 'con_8_1',
    question: 'Cell theory was proposed by:',
    options: [
      'Robert Hooke and Robert Brown',
      'Schleiden and Schwann',
      'Watson and Crick',
      'Darwin and Wallace'
    ],
    correctAnswer: 1,
    explanation: 'Cell theory was proposed by Matthias Schleiden (1838) and Theodor Schwann (1839). It states that all living organisms are composed of cells and that the cell is the basic unit of life.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_042', chapterId: 'ch_cell', conceptId: 'con_8_2',
    question: 'Which of the following is absent in prokaryotic cells?',
    options: ['Cell wall', 'Ribosome', 'Membrane-bound nucleus', 'DNA'],
    correctAnswer: 2,
    explanation: 'Prokaryotic cells lack a membrane-bound nucleus. Their genetic material (DNA) lies in the nucleoid region without a nuclear envelope. They also lack other membrane-bound organelles like mitochondria, ER, and Golgi body.',
    category: 'pu', difficulty: 'easy', year: '2021'
  },
  {
    id: 'q_043', chapterId: 'ch_cell', conceptId: 'con_8_3',
    question: 'The "suicide bags" of the cell are:',
    options: ['Ribosomes', 'Lysosomes', 'Golgi bodies', 'Mitochondria'],
    correctAnswer: 1,
    explanation: 'Lysosomes are called "suicide bags" or "suicidal bags" because they contain powerful hydrolytic enzymes. If the membrane of a lysosome ruptures, the enzymes are released and can digest the entire cell (autolysis).',
    category: 'kcet', difficulty: 'easy', year: null
  },
  {
    id: 'q_044', chapterId: 'ch_cell', conceptId: 'con_8_4',
    question: 'Mitochondria are called "powerhouses of the cell" because they:',
    options: [
      'Contain DNA',
      'Generate ATP through oxidative phosphorylation',
      'Are the largest organelles',
      'Contain ribosomes'
    ],
    correctAnswer: 1,
    explanation: 'Mitochondria are called powerhouses of the cell because they are the sites of aerobic respiration where ATP (adenosine triphosphate), the energy currency of the cell, is produced through oxidative phosphorylation.',
    category: 'neet', difficulty: 'easy', year: null
  },
  {
    id: 'q_045', chapterId: 'ch_cell', conceptId: 'con_8_5',
    question: 'The number of chromosomes in a human somatic cell is:',
    options: ['23', '46', '44', '48'],
    correctAnswer: 1,
    explanation: 'Human somatic cells contain 46 chromosomes (23 pairs) – 22 pairs of autosomes and 1 pair of sex chromosomes (XX in females, XY in males). Gametes contain 23 chromosomes (haploid).',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_046', chapterId: 'ch_cell', conceptId: 'con_8_3',
    question: 'The endoplasmic reticulum studded with ribosomes is called:',
    options: [
      'Smooth endoplasmic reticulum (SER)',
      'Rough endoplasmic reticulum (RER)',
      'Sarcoplasmic reticulum',
      'Trans-Golgi network'
    ],
    correctAnswer: 1,
    explanation: 'Rough endoplasmic reticulum (RER) has ribosomes attached to its surface, giving it a rough appearance. It is primarily involved in protein synthesis and secretion. SER lacks ribosomes and is involved in lipid synthesis.',
    category: 'kcet', difficulty: 'easy', year: '2022'
  },
  {
    id: 'q_047', chapterId: 'ch_cell', conceptId: 'con_8_4',
    question: 'Which of the following organelles are semi-autonomous?',
    options: [
      'Ribosomes and lysosomes',
      'Mitochondria and chloroplasts',
      'Golgi body and ER',
      'Centrioles and vacuoles'
    ],
    correctAnswer: 1,
    explanation: 'Mitochondria and chloroplasts are semi-autonomous organelles because they possess their own DNA, RNA, and ribosomes (70S type), and can synthesize some of their own proteins. However, they depend on the nucleus for most of their proteins.',
    category: 'neet', difficulty: 'medium', year: '2018'
  },
  {
    id: 'q_048', chapterId: 'ch_cell', conceptId: 'con_8_2',
    question: 'Ribosomes of prokaryotes are:',
    options: ['80S type', '70S type', '60S type', '100S type'],
    correctAnswer: 1,
    explanation: 'Prokaryotic cells contain 70S ribosomes (with 50S and 30S subunits), while eukaryotic cytoplasmic ribosomes are 80S (with 60S and 40S subunits). The "S" stands for Svedberg units.',
    category: 'pu', difficulty: 'medium', year: null
  },
  {
    id: 'q_049', chapterId: 'ch_cell', conceptId: 'con_8_3',
    question: 'The cis face of the Golgi apparatus is called the:',
    options: ['Maturing face', 'Forming face', 'Trans face', 'Medial face'],
    correctAnswer: 1,
    explanation: 'The cis face (forming face) of the Golgi apparatus is convex and faces the ER. It receives materials from the ER in transport vesicles. The trans face (maturing face) is concave and releases modified materials.',
    category: 'neet', difficulty: 'hard', year: null
  },
  {
    id: 'q_050', chapterId: 'ch_cell', conceptId: 'con_8_1',
    question: '"Omnis cellula-e-cellula" (all cells arise from pre-existing cells) was stated by:',
    options: ['Robert Hooke', 'Schleiden', 'Rudolf Virchow', 'Robert Brown'],
    correctAnswer: 2,
    explanation: 'Rudolf Virchow (1855) stated "Omnis cellula-e-cellula," meaning all cells arise from pre-existing cells. This was an important modification to the cell theory originally proposed by Schleiden and Schwann.',
    category: 'kcet', difficulty: 'medium', year: '2023'
  },

  // ═══════════════════════════════════════════════════════
  //  CHAPTER 6 – BIOMOLECULES  (10 questions)
  // ═══════════════════════════════════════════════════════

  {
    id: 'q_051', chapterId: 'ch_biomolecules', conceptId: 'con_9_1',
    question: 'Sucrose is a disaccharide composed of:',
    options: [
      'Glucose + Glucose',
      'Glucose + Fructose',
      'Glucose + Galactose',
      'Fructose + Galactose'
    ],
    correctAnswer: 1,
    explanation: 'Sucrose (table sugar) is a disaccharide made up of one molecule of glucose and one molecule of fructose linked by a glycosidic bond. Maltose = glucose + glucose; Lactose = glucose + galactose.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_052', chapterId: 'ch_biomolecules', conceptId: 'con_9_2',
    question: 'The bond that links amino acids in a protein is:',
    options: ['Glycosidic bond', 'Peptide bond', 'Phosphodiester bond', 'Hydrogen bond'],
    correctAnswer: 1,
    explanation: 'Amino acids are linked by peptide bonds. A peptide bond is formed between the carboxyl group (–COOH) of one amino acid and the amino group (–NH₂) of the next amino acid, with the release of a water molecule.',
    category: 'pu', difficulty: 'easy', year: '2020'
  },
  {
    id: 'q_053', chapterId: 'ch_biomolecules', conceptId: 'con_9_5',
    question: 'Enzymes are chemically:',
    options: ['Carbohydrates', 'Lipids', 'Proteins', 'Nucleic acids'],
    correctAnswer: 2,
    explanation: 'Almost all enzymes are proteins (except ribozymes which are catalytic RNA). They are biological catalysts that speed up biochemical reactions by lowering the activation energy without being consumed.',
    category: 'kcet', difficulty: 'easy', year: null
  },
  {
    id: 'q_054', chapterId: 'ch_biomolecules', conceptId: 'con_9_4',
    question: 'The nucleotide of DNA contains:',
    options: [
      'Ribose sugar, phosphate, nitrogenous base',
      'Deoxyribose sugar, phosphate, nitrogenous base',
      'Ribose sugar, sulphate, nitrogenous base',
      'Deoxyribose sugar, sulphate, amino acid'
    ],
    correctAnswer: 1,
    explanation: 'A DNA nucleotide consists of three components: a deoxyribose sugar, a phosphate group, and a nitrogenous base (adenine, guanine, cytosine, or thymine). RNA has ribose sugar and uracil instead of thymine.',
    category: 'neet', difficulty: 'easy', year: null
  },
  {
    id: 'q_055', chapterId: 'ch_biomolecules', conceptId: 'con_9_5',
    question: 'The lock and key model of enzyme action was proposed by:',
    options: ['Koshland', 'Fischer', 'Buchner', 'Pasteur'],
    correctAnswer: 1,
    explanation: 'The lock and key hypothesis of enzyme action was proposed by Emil Fischer (1894). According to this model, the active site of the enzyme (lock) has a rigid structure that exactly fits the substrate (key).',
    category: 'neet', difficulty: 'medium', year: '2017'
  },
  {
    id: 'q_056', chapterId: 'ch_biomolecules', conceptId: 'con_9_3',
    question: 'Which of the following is a saturated fatty acid?',
    options: ['Oleic acid', 'Linoleic acid', 'Palmitic acid', 'Arachidonic acid'],
    correctAnswer: 2,
    explanation: 'Palmitic acid (C₁₆H₃₂O₂) is a saturated fatty acid – it has no double bonds between carbon atoms. Oleic, linoleic, and arachidonic acids are unsaturated fatty acids with one or more double bonds.',
    category: 'kcet', difficulty: 'medium', year: null
  },
  {
    id: 'q_057', chapterId: 'ch_biomolecules', conceptId: 'con_9_1',
    question: 'Cellulose is a polymer of:',
    options: ['α-glucose', 'β-glucose', 'Fructose', 'Galactose'],
    correctAnswer: 1,
    explanation: 'Cellulose is a polysaccharide composed of β-glucose monomers linked by β-1,4 glycosidic bonds. Starch and glycogen are polymers of α-glucose. Cellulose is the most abundant organic compound in the biosphere.',
    category: 'neet', difficulty: 'medium', year: '2019'
  },
  {
    id: 'q_058', chapterId: 'ch_biomolecules', conceptId: 'con_9_2',
    question: 'The secondary structure of a protein is stabilised by:',
    options: ['Peptide bonds', 'Hydrogen bonds', 'Disulphide bonds', 'Ionic bonds'],
    correctAnswer: 1,
    explanation: 'The secondary structure of proteins (α-helix and β-pleated sheet) is stabilised by hydrogen bonds formed between the C=O of one amino acid and the N–H of another amino acid in the polypeptide backbone.',
    category: 'neet', difficulty: 'hard', year: null
  },
  {
    id: 'q_059', chapterId: 'ch_biomolecules', conceptId: 'con_9_5',
    question: 'The non-protein part of an enzyme is called:',
    options: ['Apoenzyme', 'Cofactor', 'Holoenzyme', 'Coenzyme'],
    correctAnswer: 1,
    explanation: 'The non-protein part of an enzyme is called a cofactor. Cofactors can be metal ions (e.g., Zn²⁺) or organic molecules (coenzymes like NAD⁺). The protein part is called apoenzyme. Together they form the holoenzyme.',
    category: 'pu', difficulty: 'medium', year: '2023'
  },
  {
    id: 'q_060', chapterId: 'ch_biomolecules', conceptId: 'con_9_4',
    question: 'The bases present in RNA but not in DNA are:',
    options: ['Adenine', 'Guanine', 'Uracil', 'Cytosine'],
    correctAnswer: 2,
    explanation: 'Uracil is present in RNA but not in DNA. DNA contains thymine instead of uracil. Both DNA and RNA contain adenine, guanine, and cytosine.',
    category: 'pu', difficulty: 'easy', year: null
  },

  // ═══════════════════════════════════════════════════════
  //  CHAPTER 7 – SEXUAL REPRODUCTION IN FLOWERING PLANTS  (10 questions)
  // ═══════════════════════════════════════════════════════

  {
    id: 'q_061', chapterId: 'ch_sexual_repro_plants', conceptId: 'con_20_1',
    question: 'The wall of a microsporangium consists of how many layers?',
    options: ['Two', 'Three', 'Four', 'Five'],
    correctAnswer: 2,
    explanation: 'The wall of a microsporangium (pollen sac) consists of four layers: epidermis, endothecium, middle layers, and tapetum. The tapetum is the innermost layer that nourishes the developing pollen grains.',
    category: 'neet', difficulty: 'medium', year: '2020'
  },
  {
    id: 'q_062', chapterId: 'ch_sexual_repro_plants', conceptId: 'con_20_2',
    question: 'A mature embryo sac in angiosperms is:',
    options: [
      '7-celled, 7-nucleate',
      '8-celled, 7-nucleate',
      '7-celled, 8-nucleate',
      '8-celled, 8-nucleate'
    ],
    correctAnswer: 2,
    explanation: 'A mature embryo sac (female gametophyte) is 7-celled and 8-nucleate. It contains 3 antipodal cells, 2 synergids, 1 egg cell, and 1 central cell with 2 polar nuclei.',
    category: 'pu', difficulty: 'medium', year: '2022'
  },
  {
    id: 'q_063', chapterId: 'ch_sexual_repro_plants', conceptId: 'con_20_4',
    question: 'Triple fusion involves the fusion of:',
    options: [
      'Two male gametes with one egg',
      'One male gamete with two polar nuclei',
      'One male gamete with one egg',
      'Two polar nuclei with each other'
    ],
    correctAnswer: 1,
    explanation: 'Triple fusion is the fusion of one male gamete with two polar nuclei in the central cell to form the triploid Primary Endosperm Nucleus (PEN, 3n). This is one of the two fusions in double fertilisation.',
    category: 'kcet', difficulty: 'medium', year: null
  },
  {
    id: 'q_064', chapterId: 'ch_sexual_repro_plants', conceptId: 'con_20_3',
    question: 'Anemophily refers to pollination by:',
    options: ['Water', 'Wind', 'Insects', 'Animals'],
    correctAnswer: 1,
    explanation: 'Anemophily is pollination by wind. Wind-pollinated flowers produce large quantities of light, dry, non-sticky pollen. Examples: grasses, cereals, Typha. Entomophily = by insects; Hydrophily = by water.',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_065', chapterId: 'ch_sexual_repro_plants', conceptId: 'con_20_5',
    question: 'The endosperm in angiosperms is:',
    options: ['Haploid', 'Diploid', 'Triploid', 'Tetraploid'],
    correctAnswer: 2,
    explanation: 'The endosperm in angiosperms is triploid (3n) because it develops from the Primary Endosperm Nucleus (PEN), which is formed by the fusion of two polar nuclei (n+n = 2n) with one male gamete (n), giving 3n.',
    category: 'neet', difficulty: 'easy', year: '2016'
  },
  {
    id: 'q_066', chapterId: 'ch_sexual_repro_plants', conceptId: 'con_20_6',
    question: 'Development of fruit without fertilisation is called:',
    options: ['Polyembryony', 'Apomixis', 'Parthenocarpy', 'Parthenogenesis'],
    correctAnswer: 2,
    explanation: 'Parthenocarpy is the development of fruit without fertilisation (and hence without seeds). Example: banana. Parthenocarpic fruits can be induced by application of growth hormones.',
    category: 'kcet', difficulty: 'easy', year: '2019'
  },
  {
    id: 'q_067', chapterId: 'ch_sexual_repro_plants', conceptId: 'con_20_1',
    question: 'The outermost and innermost layers of a pollen grain wall are respectively:',
    options: [
      'Intine and exine',
      'Exine and intine',
      'Tapetum and endothecium',
      'Endothecium and tapetum'
    ],
    correctAnswer: 1,
    explanation: 'The pollen grain wall has two layers: the outer exine (made of sporopollenin, one of the most resistant biological materials) and the inner intine (made of cellulose and pectin).',
    category: 'neet', difficulty: 'medium', year: null
  },
  {
    id: 'q_068', chapterId: 'ch_sexual_repro_plants', conceptId: 'con_20_6',
    question: 'Formation of seed without fertilisation from an unfertilised ovule is called:',
    options: ['Parthenocarpy', 'Parthenogenesis', 'Apomixis', 'Polyembryony'],
    correctAnswer: 2,
    explanation: 'Apomixis is the formation of seeds without fertilisation. It is a form of asexual reproduction through seeds. The embryo develops from the diploid egg cell or nucellar cells without meiosis and fertilisation.',
    category: 'pu', difficulty: 'medium', year: '2021'
  },
  {
    id: 'q_069', chapterId: 'ch_sexual_repro_plants', conceptId: 'con_20_3',
    question: 'Self-incompatibility prevents:',
    options: [
      'Cross-pollination',
      'Self-pollination from resulting in seed formation',
      'Fruit formation',
      'Endosperm development'
    ],
    correctAnswer: 1,
    explanation: 'Self-incompatibility is a genetic mechanism that prevents self-pollination from leading to seed formation (even if pollen lands on the stigma of the same flower). It promotes outcrossing and genetic diversity.',
    category: 'neet', difficulty: 'hard', year: '2018'
  },
  {
    id: 'q_070', chapterId: 'ch_sexual_repro_plants', conceptId: 'con_20_2',
    question: 'The filiform apparatus is found in:',
    options: ['Antipodal cells', 'Synergids', 'Egg cell', 'Central cell'],
    correctAnswer: 1,
    explanation: 'The filiform apparatus is a special cellular thickening found at the micropylar end of the synergids in the embryo sac. It guides the pollen tube into the embryo sac for fertilisation.',
    category: 'kcet', difficulty: 'hard', year: null
  },

  // ═══════════════════════════════════════════════════════
  //  CHAPTER 8 – PRINCIPLES OF INHERITANCE & VARIATION  (10 questions)
  // ═══════════════════════════════════════════════════════

  {
    id: 'q_071', chapterId: 'ch_inheritance', conceptId: 'con_23_1',
    question: 'In a monohybrid cross, the phenotypic ratio of F₂ generation is:',
    options: ['1:2:1', '3:1', '9:3:3:1', '1:1:1:1'],
    correctAnswer: 1,
    explanation: 'In a monohybrid cross, the F₂ generation shows a phenotypic ratio of 3:1 (3 dominant : 1 recessive). The genotypic ratio is 1:2:1 (1 homozygous dominant : 2 heterozygous : 1 homozygous recessive).',
    category: 'pu', difficulty: 'easy', year: null
  },
  {
    id: 'q_072', chapterId: 'ch_inheritance', conceptId: 'con_23_1',
    question: 'Mendel\'s law of independent assortment is applicable to genes located on:',
    options: [
      'Same chromosome',
      'Different chromosomes',
      'Homologous chromosomes',
      'Sex chromosomes only'
    ],
    correctAnswer: 1,
    explanation: 'Mendel\'s law of independent assortment states that alleles of different genes are inherited independently during gamete formation. This holds true for genes located on different (non-homologous) chromosomes. Linked genes on the same chromosome tend to be inherited together.',
    category: 'neet', difficulty: 'medium', year: '2021'
  },
  {
    id: 'q_073', chapterId: 'ch_inheritance', conceptId: 'con_23_2',
    question: 'In incomplete dominance, the F₂ phenotypic ratio is:',
    options: ['3:1', '1:2:1', '9:3:3:1', '1:1'],
    correctAnswer: 1,
    explanation: 'In incomplete dominance, neither allele is completely dominant. The F₁ heterozygote shows an intermediate phenotype. The F₂ phenotypic ratio is 1:2:1 (same as the genotypic ratio). Example: flower colour in snapdragon (Antirrhinum).',
    category: 'kcet', difficulty: 'medium', year: '2020'
  },
  {
    id: 'q_074', chapterId: 'ch_inheritance', conceptId: 'con_23_3',
    question: 'A person with blood group AB has:',
    options: [
      'Both A and B antigens on RBCs, no antibodies in plasma',
      'Only A antigen on RBCs',
      'Only B antigen on RBCs',
      'No antigens on RBCs, both antibodies in plasma'
    ],
    correctAnswer: 0,
    explanation: 'A person with blood group AB has both A and B antigens on their red blood cells and neither anti-A nor anti-B antibodies in their plasma. AB blood group is an example of co-dominance, where both alleles Iᴬ and Iᴮ are equally expressed.',
    category: 'pu', difficulty: 'medium', year: '2022'
  },
  {
    id: 'q_075', chapterId: 'ch_inheritance', conceptId: 'con_23_5',
    question: 'Colour blindness is inherited as:',
    options: [
      'Autosomal dominant',
      'Autosomal recessive',
      'X-linked recessive',
      'X-linked dominant'
    ],
    correctAnswer: 2,
    explanation: 'Colour blindness is an X-linked recessive disorder. The gene for colour vision is located on the X chromosome. A carrier female (X^cX) can pass the gene to her son who will be colour blind (X^cY).',
    category: 'neet', difficulty: 'easy', year: null
  },
  {
    id: 'q_076', chapterId: 'ch_inheritance', conceptId: 'con_23_4',
    question: 'Linkage was discovered by:',
    options: ['Mendel', 'Morgan', 'Bateson and Punnett', 'Hugo de Vries'],
    correctAnswer: 2,
    explanation: 'Linkage was first reported by Bateson and Punnett (1906) in sweet pea (Lathyrus odoratus). However, T.H. Morgan coined the term "linkage" and explained the phenomenon through his experiments on Drosophila.',
    category: 'kcet', difficulty: 'hard', year: null
  },
  {
    id: 'q_077', chapterId: 'ch_inheritance', conceptId: 'con_23_6',
    question: 'Down syndrome is caused by trisomy of chromosome number:',
    options: ['18', '21', '13', '22'],
    correctAnswer: 1,
    explanation: 'Down syndrome (mongolism) is caused by trisomy of chromosome 21 (2n = 47). It is characterised by short stature, round face, mental retardation, and a partially open mouth. It was first described by Langdon Down.',
    category: 'neet', difficulty: 'easy', year: '2019'
  },
  {
    id: 'q_078', chapterId: 'ch_inheritance', conceptId: 'con_23_5',
    question: 'In haplodiploidy sex determination (as in bees), males are:',
    options: ['Diploid', 'Haploid', 'Triploid', 'Tetraploid'],
    correctAnswer: 1,
    explanation: 'In haplodiploidy sex determination (seen in honeybees), males (drones) develop from unfertilised eggs and are haploid (n = 16). Females (queen and workers) develop from fertilised eggs and are diploid (2n = 32).',
    category: 'neet', difficulty: 'medium', year: null
  },
  {
    id: 'q_079', chapterId: 'ch_inheritance', conceptId: 'con_23_6',
    question: 'Turner syndrome is characterised by the karyotype:',
    options: ['47, XXY', '45, XO', '47, XXX', '47, XYY'],
    correctAnswer: 1,
    explanation: 'Turner syndrome occurs in females with karyotype 45, XO (monosomy of X chromosome). Features include short stature, webbed neck, shield chest, and infertility. Klinefelter syndrome is 47, XXY.',
    category: 'pu', difficulty: 'medium', year: '2023'
  },
  {
    id: 'q_080', chapterId: 'ch_inheritance', conceptId: 'con_23_1',
    question: 'A test cross is a cross between:',
    options: [
      'Two homozygous parents',
      'Two F₁ hybrids',
      'F₁ hybrid and homozygous recessive parent',
      'F₁ hybrid and homozygous dominant parent'
    ],
    correctAnswer: 2,
    explanation: 'A test cross is a cross between an organism showing the dominant phenotype (whose genotype is unknown) and a homozygous recessive organism. It helps determine whether the dominant organism is homozygous or heterozygous.',
    category: 'kcet', difficulty: 'easy', year: null
  }
];

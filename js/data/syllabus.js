// Complete Karnataka PU Biology Syllabus Data
// 1st PU: Units I-V (16 chapters)
// 2nd PU: Units VI-X (13 chapters)

export const syllabusData = [

  // ══════════════════════════════════════════════
  //  1ST PU BIOLOGY
  // ══════════════════════════════════════════════

  {
    id: 'unit_1', number: 'I', title: 'Diversity in the Living World',
    classId: 'pu1', icon: '🌍',
    description: 'Explore the vast diversity of life forms, their classification systems, and the principles of taxonomy.',
    chapters: [
      {
        id: 'ch_living_world', title: 'The Living World', order: 1, icon: '🌱',
        description: 'What is living? Biodiversity, need for classification, taxonomy, systematics, and taxonomical aids.',
        concepts: [
          { id: 'con_1_1', title: 'What is Living?', description: 'Growth, reproduction, metabolism, cellular organization, consciousness.', order: 1 },
          { id: 'con_1_2', title: 'Biodiversity', description: 'Number and types of organisms, diversity of habitats.', order: 2 },
          { id: 'con_1_3', title: 'Need for Classification', description: 'Nomenclature – binomial, rules of ICBN & ICZN.', order: 3 },
          { id: 'con_1_4', title: 'Taxonomic Categories', description: 'Species, genus, family, order, class, phylum, kingdom.', order: 4 },
          { id: 'con_1_5', title: 'Taxonomical Aids', description: 'Herbarium, botanical gardens, museum, zoological parks, keys.', order: 5 },
        ]
      },
      {
        id: 'ch_bio_classification', title: 'Biological Classification', order: 2, icon: '🔬',
        description: 'Kingdom Monera, Protista, Fungi, Plantae, Animalia – Whittaker\'s five-kingdom classification.',
        concepts: [
          { id: 'con_2_1', title: 'Kingdom Monera', description: 'Bacteria – archaebacteria, eubacteria, structure, nutrition, reproduction.', order: 1 },
          { id: 'con_2_2', title: 'Kingdom Protista', description: 'Chrysophytes, dinoflagellates, euglenoids, slime moulds, protozoans.', order: 2 },
          { id: 'con_2_3', title: 'Kingdom Fungi', description: 'Structure, reproduction, classification – Phycomycetes to Deuteromycetes.', order: 3 },
          { id: 'con_2_4', title: 'Kingdom Plantae', description: 'Salient features and classification of plants into major groups.', order: 4 },
          { id: 'con_2_5', title: 'Kingdom Animalia', description: 'Basis of classification, salient features of animal phyla.', order: 5 },
          { id: 'con_2_6', title: 'Viruses, Viroids and Lichens', description: 'Discovery, structure, diseases; viroids; lichens.', order: 6 },
        ]
      },
      {
        id: 'ch_plant_kingdom', title: 'Plant Kingdom', order: 3, icon: '🌿',
        description: 'Algae, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms – alternation of generations.',
        concepts: [
          { id: 'con_3_1', title: 'Algae', description: 'Chlorophyceae, Phaeophyceae, Rhodophyceae – characteristics and examples.', order: 1 },
          { id: 'con_3_2', title: 'Bryophytes', description: 'Liverworts, mosses – amphibians of the plant kingdom.', order: 2 },
          { id: 'con_3_3', title: 'Pteridophytes', description: 'General characteristics, classification, life cycle.', order: 3 },
          { id: 'con_3_4', title: 'Gymnosperms', description: 'General characteristics, life cycle of Pinus.', order: 4 },
          { id: 'con_3_5', title: 'Angiosperms', description: 'Classification, life cycle, double fertilization.', order: 5 },
          { id: 'con_3_6', title: 'Plant Life Cycles & Alternation of Generations', description: 'Haplontic, diplontic, haplo-diplontic life cycles.', order: 6 },
        ]
      },
      {
        id: 'ch_animal_kingdom', title: 'Animal Kingdom', order: 4, icon: '🦋',
        description: 'Basis of classification – symmetry, coelom, segmentation. Classification of animal phyla.',
        concepts: [
          { id: 'con_4_1', title: 'Basis of Classification', description: 'Levels of organization, symmetry, diploblastic, triploblastic, coelom.', order: 1 },
          { id: 'con_4_2', title: 'Phylum Porifera to Ctenophora', description: 'Porifera, Cnidaria, Ctenophora – characteristics and examples.', order: 2 },
          { id: 'con_4_3', title: 'Phylum Platyhelminthes to Annelida', description: 'Flatworms, roundworms, segmented worms.', order: 3 },
          { id: 'con_4_4', title: 'Phylum Arthropoda to Hemichordata', description: 'Arthropoda, Mollusca, Echinodermata, Hemichordata.', order: 4 },
          { id: 'con_4_5', title: 'Phylum Chordata', description: 'Subphyla, classes of vertebrates – Pisces to Mammalia.', order: 5 },
        ]
      }
    ]
  },

  {
    id: 'unit_2', number: 'II', title: 'Structural Organisation in Plants and Animals',
    classId: 'pu1', icon: '🏗️',
    description: 'Study the morphology and anatomy of flowering plants and structural organization in animals.',
    chapters: [
      {
        id: 'ch_morphology', title: 'Morphology of Flowering Plants', order: 5, icon: '🌸',
        description: 'Root, stem, leaf, flower, fruit, seed – modifications and functions.',
        concepts: [
          { id: 'con_5_1', title: 'The Root', description: 'Types of root systems, regions of root, modifications.', order: 1 },
          { id: 'con_5_2', title: 'The Stem', description: 'Characteristics, modifications of stem.', order: 2 },
          { id: 'con_5_3', title: 'The Leaf', description: 'Parts, venation, types, phyllotaxy, modifications.', order: 3 },
          { id: 'con_5_4', title: 'The Flower', description: 'Parts of flower, aestivation, placentation.', order: 4 },
          { id: 'con_5_5', title: 'Fruit and Seed', description: 'Types of fruits, seed structure – monocot and dicot.', order: 5 },
          { id: 'con_5_6', title: 'Floral Formula & Family Description', description: 'Solanaceae, Fabaceae, Liliaceae – floral characters.', order: 6 },
        ]
      },
      {
        id: 'ch_anatomy', title: 'Anatomy of Flowering Plants', order: 6, icon: '🔍',
        description: 'Tissues – meristematic and permanent. Anatomy of dicot and monocot organs.',
        concepts: [
          { id: 'con_6_1', title: 'Tissue System', description: 'Meristematic tissue – apical, lateral, intercalary.', order: 1 },
          { id: 'con_6_2', title: 'Permanent Tissues', description: 'Simple tissues – parenchyma, collenchyma, sclerenchyma.', order: 2 },
          { id: 'con_6_3', title: 'Complex Tissues', description: 'Xylem and phloem – composition and functions.', order: 3 },
          { id: 'con_6_4', title: 'Anatomy of Dicot and Monocot', description: 'Root, stem, leaf internal structure comparison.', order: 4 },
          { id: 'con_6_5', title: 'Secondary Growth', description: 'Vascular cambium, cork cambium, annual rings.', order: 5 },
        ]
      },
      {
        id: 'ch_structural_org', title: 'Structural Organisation in Animals', order: 7, icon: '🐸',
        description: 'Animal tissues – epithelial, connective, muscular, neural. Morphology of earthworm, cockroach, frog.',
        concepts: [
          { id: 'con_7_1', title: 'Animal Tissues', description: 'Epithelial, connective, muscular, neural tissues.', order: 1 },
          { id: 'con_7_2', title: 'Morphology of Earthworm', description: 'External and internal structure, systems.', order: 2 },
          { id: 'con_7_3', title: 'Morphology of Cockroach', description: 'Body regions, systems – digestive, circulatory, reproductive.', order: 3 },
          { id: 'con_7_4', title: 'Morphology of Frog', description: 'External features, internal anatomy, systems.', order: 4 },
        ]
      }
    ]
  },

  {
    id: 'unit_3', number: 'III', title: 'Cell: Structure and Functions',
    classId: 'pu1', icon: '🧫',
    description: 'Understand cell structure, biomolecules, cell cycle and the molecular basis of cell division.',
    chapters: [
      {
        id: 'ch_cell', title: 'Cell: The Unit of Life', order: 8, icon: '🔴',
        description: 'Cell theory, prokaryotic and eukaryotic cells, cell organelles.',
        concepts: [
          { id: 'con_8_1', title: 'Cell Theory', description: 'History, Schleiden and Schwann, modern cell theory.', order: 1 },
          { id: 'con_8_2', title: 'Prokaryotic Cell', description: 'Cell wall, plasma membrane, ribosomes, nucleoid, flagella.', order: 2 },
          { id: 'con_8_3', title: 'Eukaryotic Cell', description: 'Endomembrane system – ER, Golgi, lysosomes, vacuoles.', order: 3 },
          { id: 'con_8_4', title: 'Mitochondria and Plastids', description: 'Structure, function, semi-autonomous nature.', order: 4 },
          { id: 'con_8_5', title: 'Nucleus', description: 'Nuclear envelope, chromatin, nucleolus, chromosomes.', order: 5 },
        ]
      },
      {
        id: 'ch_biomolecules', title: 'Biomolecules', order: 9, icon: '🧪',
        description: 'Carbohydrates, proteins, lipids, nucleic acids, enzymes – structure and function.',
        concepts: [
          { id: 'con_9_1', title: 'Carbohydrates', description: 'Monosaccharides, disaccharides, polysaccharides.', order: 1 },
          { id: 'con_9_2', title: 'Proteins', description: 'Amino acids, peptide bond, primary to quaternary structure.', order: 2 },
          { id: 'con_9_3', title: 'Lipids', description: 'Fatty acids, glycerol, phospholipids, steroids.', order: 3 },
          { id: 'con_9_4', title: 'Nucleic Acids', description: 'DNA and RNA – structure, types, functions.', order: 4 },
          { id: 'con_9_5', title: 'Enzymes', description: 'Properties, classification, mechanism, factors affecting activity.', order: 5 },
        ]
      },
      {
        id: 'ch_cell_cycle', title: 'Cell Cycle and Cell Division', order: 10, icon: '🔄',
        description: 'Cell cycle phases, mitosis, meiosis – significance and comparison.',
        concepts: [
          { id: 'con_10_1', title: 'Cell Cycle', description: 'Interphase (G1, S, G2) and M phase, regulation.', order: 1 },
          { id: 'con_10_2', title: 'Mitosis', description: 'Prophase, metaphase, anaphase, telophase, cytokinesis.', order: 2 },
          { id: 'con_10_3', title: 'Meiosis', description: 'Meiosis I and II – stages, significance, crossing over.', order: 3 },
        ]
      }
    ]
  },

  {
    id: 'unit_4', number: 'IV', title: 'Plant Physiology',
    classId: 'pu1', icon: '☀️',
    description: 'Learn about photosynthesis, respiration, and growth & development in plants.',
    chapters: [
      {
        id: 'ch_photosynthesis', title: 'Photosynthesis in Higher Plants', order: 11, icon: '🌞',
        description: 'Light reaction, dark reaction (Calvin cycle), C3, C4 pathways, photorespiration.',
        concepts: [
          { id: 'con_11_1', title: 'Early Experiments', description: 'Priestley, Ingenhousz, Hill reaction, Emerson.', order: 1 },
          { id: 'con_11_2', title: 'Photosynthetic Pigments', description: 'Chlorophyll a, b, carotenoids, absorption spectra.', order: 2 },
          { id: 'con_11_3', title: 'Light Reactions', description: 'Photosystem I & II, electron transport, photophosphorylation.', order: 3 },
          { id: 'con_11_4', title: 'Calvin Cycle (C3 Pathway)', description: 'Carbon fixation, reduction, regeneration of RuBP.', order: 4 },
          { id: 'con_11_5', title: 'C4 Pathway & Photorespiration', description: 'Hatch-Slack pathway, Kranz anatomy, photorespiration.', order: 5 },
          { id: 'con_11_6', title: 'Factors Affecting Photosynthesis', description: 'Light, CO2, temperature, water – Blackman\'s law.', order: 6 },
        ]
      },
      {
        id: 'ch_respiration', title: 'Respiration in Plants', order: 12, icon: '💨',
        description: 'Glycolysis, TCA cycle, ETS, fermentation, respiratory quotient.',
        concepts: [
          { id: 'con_12_1', title: 'Glycolysis', description: 'Steps, enzymes, net gain of ATP, pyruvate fate.', order: 1 },
          { id: 'con_12_2', title: 'Fermentation', description: 'Alcoholic and lactic acid fermentation.', order: 2 },
          { id: 'con_12_3', title: 'Aerobic Respiration – TCA Cycle', description: 'Krebs cycle steps, enzymes, energy yield.', order: 3 },
          { id: 'con_12_4', title: 'Electron Transport System', description: 'Complexes I-IV, chemiosmosis, ATP synthase, 36 ATP.', order: 4 },
          { id: 'con_12_5', title: 'Respiratory Quotient', description: 'RQ of carbohydrates, fats, proteins, organic acids.', order: 5 },
        ]
      },
      {
        id: 'ch_plant_growth', title: 'Plant Growth and Development', order: 13, icon: '🌳',
        description: 'Growth phases, plant hormones, photoperiodism, vernalisation, seed dormancy.',
        concepts: [
          { id: 'con_13_1', title: 'Growth Phases', description: 'Meristematic, elongation, maturation, arithmetic & geometric growth.', order: 1 },
          { id: 'con_13_2', title: 'Plant Growth Regulators', description: 'Auxins, gibberellins, cytokinins, ABA, ethylene.', order: 2 },
          { id: 'con_13_3', title: 'Photoperiodism', description: 'Short-day, long-day, day-neutral plants, phytochrome.', order: 3 },
          { id: 'con_13_4', title: 'Vernalisation & Seed Dormancy', description: 'Cold treatment, dormancy breaking mechanisms.', order: 4 },
        ]
      }
    ]
  },

  {
    id: 'unit_5', number: 'V', title: 'Human Physiology',
    classId: 'pu1', icon: '🫀',
    description: 'Study human organ systems – breathing, circulation, excretion, locomotion, neural and chemical coordination.',
    chapters: [
      {
        id: 'ch_breathing', title: 'Breathing and Exchange of Gases', order: 14, icon: '🫁',
        description: 'Respiratory organs, mechanism of breathing, exchange of gases, transport of gases.',
        concepts: [
          { id: 'con_14_1', title: 'Respiratory Organs', description: 'Human respiratory system – nose, pharynx, trachea, lungs.', order: 1 },
          { id: 'con_14_2', title: 'Mechanism of Breathing', description: 'Inspiration, expiration, lung volumes and capacities.', order: 2 },
          { id: 'con_14_3', title: 'Exchange & Transport of Gases', description: 'Diffusion, oxygen-haemoglobin dissociation curve.', order: 3 },
          { id: 'con_14_4', title: 'Disorders of Respiratory System', description: 'Asthma, emphysema, occupational respiratory disorders.', order: 4 },
        ]
      },
      {
        id: 'ch_circulation', title: 'Body Fluids and Circulation', order: 15, icon: '❤️',
        description: 'Blood composition, blood groups, heart structure, cardiac cycle, ECG, circulatory pathways.',
        concepts: [
          { id: 'con_15_1', title: 'Blood – Composition & Functions', description: 'Plasma, RBC, WBC, platelets, blood groups, coagulation.', order: 1 },
          { id: 'con_15_2', title: 'Lymph', description: 'Composition, formation, functions of lymphatic system.', order: 2 },
          { id: 'con_15_3', title: 'Human Heart', description: 'Structure, chambers, valves, cardiac cycle, heart sounds.', order: 3 },
          { id: 'con_15_4', title: 'ECG and Cardiac Output', description: 'Electrocardiography, cardiac output, regulation.', order: 4 },
          { id: 'con_15_5', title: 'Circulatory Pathways', description: 'Double circulation, portal system, coronary circulation.', order: 5 },
        ]
      },
      {
        id: 'ch_excretion', title: 'Excretory Products and their Elimination', order: 16, icon: '🔧',
        description: 'Human excretory system, urine formation, kidney function, disorders.',
        concepts: [
          { id: 'con_16_1', title: 'Human Excretory System', description: 'Kidneys – structure of nephron, types of nephrons.', order: 1 },
          { id: 'con_16_2', title: 'Urine Formation', description: 'Glomerular filtration, reabsorption, secretion, counter-current.', order: 2 },
          { id: 'con_16_3', title: 'Regulation of Kidney Function', description: 'ADH, aldosterone, ANF, renin-angiotensin, osmolarity.', order: 3 },
          { id: 'con_16_4', title: 'Disorders', description: 'Uremia, renal failure, kidney stones, dialysis, transplant.', order: 4 },
        ]
      },
      {
        id: 'ch_locomotion', title: 'Locomotion and Movement', order: 17, icon: '🦴',
        description: 'Types of movement, skeletal system, joints, muscle structure and contraction.',
        concepts: [
          { id: 'con_17_1', title: 'Types of Movement', description: 'Amoeboid, ciliary, muscular movement in humans.', order: 1 },
          { id: 'con_17_2', title: 'Skeletal System', description: 'Axial and appendicular skeleton, types of bones.', order: 2 },
          { id: 'con_17_3', title: 'Joints', description: 'Fibrous, cartilaginous, synovial joints.', order: 3 },
          { id: 'con_17_4', title: 'Muscle & Contraction', description: 'Structure of skeletal muscle, sliding filament theory, rigor mortis.', order: 4 },
          { id: 'con_17_5', title: 'Disorders', description: 'Myasthenia gravis, muscular dystrophy, osteoporosis, arthritis.', order: 5 },
        ]
      },
      {
        id: 'ch_neural', title: 'Neural Control and Coordination', order: 18, icon: '🧠',
        description: 'Neuron structure, nerve impulse, central and peripheral nervous system, reflex action.',
        concepts: [
          { id: 'con_18_1', title: 'Neuron & Nerve Impulse', description: 'Structure, resting potential, action potential, synapse.', order: 1 },
          { id: 'con_18_2', title: 'Central Nervous System', description: 'Brain – cerebrum, cerebellum, medulla; spinal cord.', order: 2 },
          { id: 'con_18_3', title: 'Peripheral Nervous System', description: 'Somatic and autonomic nervous system.', order: 3 },
          { id: 'con_18_4', title: 'Reflex Action', description: 'Reflex arc, types of reflexes.', order: 4 },
          { id: 'con_18_5', title: 'Sensory Organs – Eye & Ear', description: 'Structure, photoreception, mechanism of hearing and balance.', order: 5 },
        ]
      },
      {
        id: 'ch_chemical_coord', title: 'Chemical Coordination and Integration', order: 19, icon: '⚗️',
        description: 'Endocrine glands, hormones, mechanism of hormone action, disorders.',
        concepts: [
          { id: 'con_19_1', title: 'Endocrine Glands', description: 'Hypothalamus, pituitary, pineal, thyroid, parathyroid, adrenal.', order: 1 },
          { id: 'con_19_2', title: 'Hormones & Their Functions', description: 'Types, mechanism – peptide and steroid hormones.', order: 2 },
          { id: 'con_19_3', title: 'Pancreas and Gonads', description: 'Insulin, glucagon, testosterone, estrogen, progesterone.', order: 3 },
          { id: 'con_19_4', title: 'Disorders', description: 'Dwarfism, acromegaly, goitre, diabetes, Addison\'s, Cushing\'s.', order: 4 },
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════
  //  2ND PU BIOLOGY
  // ══════════════════════════════════════════════

  {
    id: 'unit_6', number: 'VI', title: 'Reproduction',
    classId: 'pu2', icon: '🌺',
    description: 'Study sexual reproduction in flowering plants, human reproduction, and reproductive health.',
    chapters: [
      {
        id: 'ch_sexual_repro_plants', title: 'Sexual Reproduction in Flowering Plants', order: 1, icon: '🌼',
        description: 'Flower structure, microsporogenesis, megasporogenesis, pollination, fertilisation, endosperm, embryo.',
        concepts: [
          { id: 'con_20_1', title: 'Stamen – Microsporangium & Pollen', description: 'Structure, microsporogenesis, pollen grain development.', order: 1 },
          { id: 'con_20_2', title: 'Pistil – Megasporangium & Embryo Sac', description: 'Megasporogenesis, 7-celled 8-nucleate embryo sac.', order: 2 },
          { id: 'con_20_3', title: 'Pollination', description: 'Self and cross-pollination, agents, outbreeding devices.', order: 3 },
          { id: 'con_20_4', title: 'Double Fertilisation', description: 'Pollen tube entry, syngamy, triple fusion.', order: 4 },
          { id: 'con_20_5', title: 'Endosperm & Embryo Development', description: 'Nuclear, cellular endosperm; embryo stages, dicot vs monocot.', order: 5 },
          { id: 'con_20_6', title: 'Seed & Fruit Formation', description: 'Seed structure, apomixis, polyembryony, parthenocarpy.', order: 6 },
        ]
      },
      {
        id: 'ch_human_repro', title: 'Human Reproduction', order: 2, icon: '👶',
        description: 'Male and female reproductive systems, gametogenesis, menstrual cycle, fertilisation, pregnancy, parturition.',
        concepts: [
          { id: 'con_21_1', title: 'Male Reproductive System', description: 'Testes, accessory ducts, glands, spermatogenesis.', order: 1 },
          { id: 'con_21_2', title: 'Female Reproductive System', description: 'Ovaries, oviducts, uterus, oogenesis.', order: 2 },
          { id: 'con_21_3', title: 'Menstrual Cycle', description: 'Phases – menstrual, follicular, ovulatory, luteal.', order: 3 },
          { id: 'con_21_4', title: 'Fertilisation & Implantation', description: 'Events, zygote formation, implantation in uterus.', order: 4 },
          { id: 'con_21_5', title: 'Pregnancy & Embryonic Development', description: 'Placenta formation, embryo development, parturition, lactation.', order: 5 },
        ]
      },
      {
        id: 'ch_repro_health', title: 'Reproductive Health', order: 3, icon: '🏥',
        description: 'Population control, contraception, MTP, STDs, infertility, ART.',
        concepts: [
          { id: 'con_22_1', title: 'Reproductive Health & Awareness', description: 'Programmes, awareness about reproductive health.', order: 1 },
          { id: 'con_22_2', title: 'Population Control & Contraception', description: 'Natural, barrier, hormonal, IUD, surgical methods.', order: 2 },
          { id: 'con_22_3', title: 'MTP & Amniocentesis', description: 'Medical termination, prenatal diagnostic techniques.', order: 3 },
          { id: 'con_22_4', title: 'STDs & Infertility', description: 'Gonorrhoea, syphilis, AIDS, hepatitis B, IVF, ZIFT, GIFT.', order: 4 },
        ]
      }
    ]
  },

  {
    id: 'unit_7', number: 'VII', title: 'Genetics and Evolution',
    classId: 'pu2', icon: '🧬',
    description: 'Principles of inheritance, molecular basis of inheritance, and the theory of evolution.',
    chapters: [
      {
        id: 'ch_inheritance', title: 'Principles of Inheritance and Variation', order: 4, icon: '🎲',
        description: 'Mendel\'s laws, incomplete dominance, co-dominance, multiple alleles, linkage, sex determination.',
        concepts: [
          { id: 'con_23_1', title: 'Mendel\'s Laws', description: 'Law of dominance, segregation, independent assortment.', order: 1 },
          { id: 'con_23_2', title: 'Deviations from Mendelism', description: 'Incomplete dominance, co-dominance, pleiotropy.', order: 2 },
          { id: 'con_23_3', title: 'Multiple Alleles – Blood Groups', description: 'ABO blood groups, Rh factor, erythroblastosis foetalis.', order: 3 },
          { id: 'con_23_4', title: 'Linkage and Crossing Over', description: 'Morgan\'s experiments, recombination frequency.', order: 4 },
          { id: 'con_23_5', title: 'Sex Determination & Sex-linked Inheritance', description: 'XX-XY, ZW-ZZ, haplodiploidy, colour blindness, haemophilia.', order: 5 },
          { id: 'con_23_6', title: 'Chromosomal Disorders', description: 'Down syndrome, Turner, Klinefelter syndrome.', order: 6 },
        ]
      },
      {
        id: 'ch_molecular_inheritance', title: 'Molecular Basis of Inheritance', order: 5, icon: '🧫',
        description: 'DNA structure, replication, transcription, translation, regulation, Human Genome Project.',
        concepts: [
          { id: 'con_24_1', title: 'DNA Structure', description: 'Watson-Crick model, packaging of DNA in chromosomes.', order: 1 },
          { id: 'con_24_2', title: 'DNA Replication', description: 'Semi-conservative, enzymes – helicase, polymerase, ligase.', order: 2 },
          { id: 'con_24_3', title: 'Transcription', description: 'Process, RNA polymerase, splicing, mRNA processing.', order: 3 },
          { id: 'con_24_4', title: 'Translation', description: 'Genetic code, tRNA, ribosome, steps of translation.', order: 4 },
          { id: 'con_24_5', title: 'Gene Regulation – Lac Operon', description: 'Operon concept, lac operon as inducible system.', order: 5 },
          { id: 'con_24_6', title: 'Human Genome Project', description: 'Goals, methodologies, salient features, applications.', order: 6 },
          { id: 'con_24_7', title: 'DNA Fingerprinting', description: 'VNTR, process, applications in forensics.', order: 7 },
        ]
      },
      {
        id: 'ch_evolution', title: 'Evolution', order: 6, icon: '🦕',
        description: 'Origin of life, theories of evolution, evidences, Hardy-Weinberg principle, human evolution.',
        concepts: [
          { id: 'con_25_1', title: 'Origin of Life', description: 'Oparin-Haldane hypothesis, Miller-Urey experiment.', order: 1 },
          { id: 'con_25_2', title: 'Evidences of Evolution', description: 'Homology, analogy, fossils, biogeography.', order: 2 },
          { id: 'con_25_3', title: 'Darwin\'s Theory & Natural Selection', description: 'Natural selection, fitness, types of selection.', order: 3 },
          { id: 'con_25_4', title: 'Hardy-Weinberg Principle', description: 'Allele frequency, genetic drift, gene flow.', order: 4 },
          { id: 'con_25_5', title: 'Human Evolution', description: 'Dryopithecus to Homo sapiens, brain size, tools.', order: 5 },
        ]
      }
    ]
  },

  {
    id: 'unit_8', number: 'VIII', title: 'Biology in Human Welfare',
    classId: 'pu2', icon: '🏥',
    description: 'Human health and diseases, immunity, and beneficial roles of microbes.',
    chapters: [
      {
        id: 'ch_health_disease', title: 'Human Health and Disease', order: 7, icon: '🦠',
        description: 'Common diseases, immunity – innate and adaptive, AIDS, cancer, drugs and alcohol abuse.',
        concepts: [
          { id: 'con_26_1', title: 'Common Diseases', description: 'Typhoid, pneumonia, malaria, amoebiasis, ascariasis, filariasis.', order: 1 },
          { id: 'con_26_2', title: 'Immunity', description: 'Innate and adaptive immunity, humoral and cell-mediated.', order: 2 },
          { id: 'con_26_3', title: 'AIDS', description: 'HIV structure, replication, transmission, prevention, treatment.', order: 3 },
          { id: 'con_26_4', title: 'Cancer', description: 'Types, causes, oncogenes, tumour suppressors, treatment.', order: 4 },
          { id: 'con_26_5', title: 'Drugs & Alcohol Abuse', description: 'Opioids, cannabinoids, coca alkaloids, effects, prevention.', order: 5 },
        ]
      },
      {
        id: 'ch_microbes', title: 'Microbes in Human Welfare', order: 8, icon: '🍞',
        description: 'Microbes in food, industrial products, sewage treatment, biogas, biocontrol, biofertilisers.',
        concepts: [
          { id: 'con_27_1', title: 'Microbes in Food & Industry', description: 'Fermented beverages, antibiotics, chemicals, enzymes.', order: 1 },
          { id: 'con_27_2', title: 'Microbes in Sewage Treatment', description: 'Primary, secondary treatment, activated sludge, BOD.', order: 2 },
          { id: 'con_27_3', title: 'Biogas Production', description: 'Methanogens, biogas plant design, applications.', order: 3 },
          { id: 'con_27_4', title: 'Biocontrol & Biofertilisers', description: 'Baculovirus, Trichoderma, Rhizobium, mycorrhiza, cyanobacteria.', order: 4 },
        ]
      }
    ]
  },

  {
    id: 'unit_9', number: 'IX', title: 'Biotechnology',
    classId: 'pu2', icon: '🔬',
    description: 'Principles and processes of biotechnology, genetic engineering, and its applications.',
    chapters: [
      {
        id: 'ch_biotech_principles', title: 'Biotechnology: Principles and Processes', order: 9, icon: '⚙️',
        description: 'Genetic engineering, tools – restriction enzymes, vectors, PCR, gel electrophoresis.',
        concepts: [
          { id: 'con_28_1', title: 'Principles of Biotechnology', description: 'Genetic engineering and bioprocess engineering.', order: 1 },
          { id: 'con_28_2', title: 'Tools of rDNA Technology', description: 'Restriction enzymes, cloning vectors (pBR322, Ti plasmid).', order: 2 },
          { id: 'con_28_3', title: 'Processes of rDNA Technology', description: 'Isolation, cutting, amplification (PCR), ligation, transfer.', order: 3 },
          { id: 'con_28_4', title: 'Gel Electrophoresis & Bioreactors', description: 'Separation techniques, stirred tank, sparged bioreactors.', order: 4 },
        ]
      },
      {
        id: 'ch_biotech_applications', title: 'Biotechnology and its Applications', order: 10, icon: '🌾',
        description: 'Bt crops, transgenic animals, gene therapy, molecular diagnostics, bioethics, biopiracy.',
        concepts: [
          { id: 'con_29_1', title: 'Bt Crops & GM Foods', description: 'Bt cotton, Bt brinjal, Flavr Savr tomato, golden rice.', order: 1 },
          { id: 'con_29_2', title: 'Gene Therapy', description: 'ADA deficiency, ex-vivo gene therapy approach.', order: 2 },
          { id: 'con_29_3', title: 'Molecular Diagnostics', description: 'PCR, ELISA – techniques and applications.', order: 3 },
          { id: 'con_29_4', title: 'Transgenic Animals', description: 'Applications – drug testing, vaccines, chemical safety.', order: 4 },
          { id: 'con_29_5', title: 'Bioethics & Biopiracy', description: 'Ethical issues, GEAC, patent issues, biopiracy examples.', order: 5 },
        ]
      }
    ]
  },

  {
    id: 'unit_10', number: 'X', title: 'Ecology and Environment',
    classId: 'pu2', icon: '🌏',
    description: 'Organisms and populations, ecosystems, biodiversity, and conservation strategies.',
    chapters: [
      {
        id: 'ch_organisms_populations', title: 'Organisms and Populations', order: 11, icon: '🐾',
        description: 'Ecology, abiotic factors, population attributes, growth models, interactions.',
        concepts: [
          { id: 'con_30_1', title: 'Organisms & Environment', description: 'Abiotic factors – temperature, water, light, soil.', order: 1 },
          { id: 'con_30_2', title: 'Adaptations', description: 'Morphological, physiological, behavioral adaptations.', order: 2 },
          { id: 'con_30_3', title: 'Population Attributes', description: 'Birth rate, death rate, age distribution, sex ratio.', order: 3 },
          { id: 'con_30_4', title: 'Population Growth', description: 'Exponential and logistic growth, carrying capacity.', order: 4 },
          { id: 'con_30_5', title: 'Population Interactions', description: 'Mutualism, competition, predation, parasitism, commensalism.', order: 5 },
        ]
      },
      {
        id: 'ch_ecosystem', title: 'Ecosystem', order: 12, icon: '🌿',
        description: 'Structure, productivity, decomposition, energy flow, nutrient cycling, ecological succession.',
        concepts: [
          { id: 'con_31_1', title: 'Ecosystem Structure & Function', description: 'Biotic and abiotic components, producers, consumers, decomposers.', order: 1 },
          { id: 'con_31_2', title: 'Productivity', description: 'GPP, NPP, secondary productivity, global patterns.', order: 2 },
          { id: 'con_31_3', title: 'Energy Flow', description: 'Trophic levels, food chains, food webs, 10% law.', order: 3 },
          { id: 'con_31_4', title: 'Ecological Pyramids', description: 'Pyramids of number, biomass, energy – upright and inverted.', order: 4 },
          { id: 'con_31_5', title: 'Nutrient Cycling', description: 'Carbon cycle, phosphorus cycle, nitrogen cycle.', order: 5 },
          { id: 'con_31_6', title: 'Ecological Succession', description: 'Primary and secondary succession, sere, climax community.', order: 6 },
        ]
      },
      {
        id: 'ch_biodiversity', title: 'Biodiversity and Conservation', order: 13, icon: '🐘',
        description: 'Biodiversity types, patterns, loss of biodiversity, conservation strategies.',
        concepts: [
          { id: 'con_32_1', title: 'Biodiversity', description: 'Genetic, species, ecological diversity; patterns.', order: 1 },
          { id: 'con_32_2', title: 'Importance of Biodiversity', description: 'Ecological, economic, ethical importance; rivet popper hypothesis.', order: 2 },
          { id: 'con_32_3', title: 'Loss of Biodiversity', description: 'The Evil Quartet – habitat loss, overexploitation, invasive species, co-extinctions.', order: 3 },
          { id: 'con_32_4', title: 'Conservation Strategies', description: 'In-situ (national parks, sanctuaries), ex-situ (seed banks, zoos).', order: 4 },
          { id: 'con_32_5', title: 'Biodiversity Hotspots', description: 'Criteria, global hotspots, Western Ghats, India\'s biodiversity.', order: 5 },
        ]
      }
    ]
  }
];

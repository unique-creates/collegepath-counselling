import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/auth-crypto'

async function main() {
  console.log('🌱 Seeding database...')

  // 1) Admin user
  const admin = await db.user.upsert({
    where: { email: 'admin@collegepath.in' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@collegepath.in',
      passwordHash: hashPassword('admin@123'),
      role: 'ADMIN',
      status: 'ACTIVE',
      phone: '+91-99999-11111',
    },
  })
  console.log('✓ Admin user:', admin.email)

  // 2) Sample counsellor
  const counsellor = await db.user.upsert({
    where: { email: 'counsellor@collegepath.in' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'counsellor@collegepath.in',
      passwordHash: hashPassword('counsellor@123'),
      role: 'COUNSELLOR',
      status: 'ACTIVE',
      phone: '+91-99999-22222',
    },
  })

  // 3) Sample student
  const student = await db.user.upsert({
    where: { email: 'student@collegepath.in' },
    update: {},
    create: {
      name: 'Rahul Verma',
      email: 'student@collegepath.in',
      passwordHash: hashPassword('student@123'),
      role: 'STUDENT',
      status: 'ACTIVE',
      phone: '+91-99999-33333',
    },
  })
  await db.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      fullName: 'Rahul Verma',
      phone: '+91-99999-33333',
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      examType: 'JEE_MAIN',
      examRank: '45200',
      examPercentile: '95.34',
      category: 'General',
      preferredCourse: 'B.Tech',
      preferredBranch: 'CSE',
      targetYear: '2026',
      classLevel: '12th_pass',
    },
  })
  console.log('✓ Sample users created')

  // 4) Site settings
  await db.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'CollegePath',
      tagline: 'Your trusted guide to college admissions',
      description:
        'CollegePath provides expert college counselling, branch preference guidance and admission support for engineering, medical and management aspirants across India.',
      contactEmail: 'support@collegepath.in',
      contactPhone: '+91-99999-00000',
      whatsappNumber: '+91-99999-00000',
      address: '2nd Floor, Education Hub, New Delhi, India - 110001',
      twitterHandle: '@collegepath',
      facebookUrl: 'https://facebook.com/collegepath',
      twitterUrl: 'https://twitter.com/collegepath',
      instagramUrl: 'https://instagram.com/collegepath',
      youtubeUrl: 'https://youtube.com/@collegepath',
      linkedinUrl: 'https://linkedin.com/company/collegepath',
    },
  })
  console.log('✓ Site settings')

  // 5) Counselling programs (compact seed)
  const programs = [
    {
      slug: 'jee-main-counselling',
      title: 'JEE Main Counselling Guidance',
      shortDescription: 'Complete JoSAA & UPTAC counselling guidance for JEE Main qualified students.',
      description: 'Get end-to-end expert guidance for JEE Main counselling through JoSAA, UPTAC, CSAB and state-level counselling processes. Our experienced counsellors help you analyse your rank, understand college-wise cutoffs, build a smart preference order, and maximise your chances of securing the best possible college + branch combination.',
      eligibility: 'JEE Main qualified candidates with a valid rank. Open to students from all categories (General, OBC, SC, ST, EWS, PwD).',
      whatIncluded: ['1-on-1 session with senior counsellor', 'Detailed rank analysis & expected colleges', 'Personalised college + branch preference order', 'Step-by-step document checklist', 'Choice-filling walk-through on JoSAA/UPTAC portal', 'Mock allotment analysis', 'WhatsApp support during counselling window'],
      benefits: ['Maximise college+branch within your rank', 'Avoid common choice-filling mistakes', 'Understand real placement & fee differences', 'Save 50+ hours of research'],
      process: ['Register & share your JEE rank and category', 'Counsellor shares expected college list within 24 hours', 'Schedule a 1-on-1 video session', 'Receive final preference order on dashboard', 'Live support during JoSAA/UPTAC choice filling'],
      duration: '7-10 days',
      price: 1499,
      isPaid: true,
      featured: true,
      status: 'PUBLISHED',
      faqs: [
        { q: 'What documents do I need for JEE Main counselling?', a: 'You will need JEE Main admit card, rank card, Class 10 & 12 marksheets, caste/category certificate (if applicable), income certificate, Aadhaar card, passport-size photos, and the JoSAA/UPTAC registration printout.' },
        { q: 'Is this guidance useful for both JoSAA and UPTAC?', a: 'Yes. Our experts cover JoSAA (for NITs/IIITs/GFTIs), UPTAC (for Uttar Pradesh colleges), CSAB (special rounds), and major state counsellings.' },
      ],
    },
    {
      slug: 'jee-advanced-counselling',
      title: 'JEE Advanced Counselling & IIT Selection',
      shortDescription: 'Targeted guidance for IIT aspirants through JoSAA counselling for IIT seats.',
      description: 'Crack the IIT selection process with our expert-led JEE Advanced counselling package. We help you build a sharp preference order across all 23 IITs, understand branch-vs-college trade-offs, and submit choices that maximise your outcome at your AIR.',
      eligibility: 'JEE Advanced qualified candidates with a valid All India Rank.',
      whatIncluded: ['Dedicated IIT counsellor', 'Branch-vs-IIT trade-off analysis', 'Detailed placement report of each IIT branch', 'Personalised preference order (up to 100 choices)', 'Live JoSAA choice filling support', '3 rounds of revision based on mock allotment'],
      benefits: ['Optimise branch selection at top IITs', 'Avoid dead-end branches at lower IITs', 'Understand real placement differences', 'Get backup options for IIT + NIT + IIIT'],
      process: ['Register & share your AIR', 'Receive expected IIT + branch list within 24 hours', 'Schedule a 60-min counselling call', 'Get final preference order on dashboard', 'Live WhatsApp support during JoSAA rounds'],
      duration: '7-12 days',
      price: 2999,
      isPaid: true,
      featured: true,
      status: 'PUBLISHED',
      faqs: [
        { q: 'Should I prefer a lower branch at an old IIT or CSE at a new IIT?', a: 'This depends on your career goals. If you want placements in top tech companies, CSE (even at a new IIT) often outperforms lower branches at old IITs.' },
      ],
    },
    {
      slug: 'uptac-counselling',
      title: 'UPTAC Uttar Pradesh Counselling',
      shortDescription: 'AKTU/UPTAC counselling guidance for engineering colleges across UP.',
      description: 'Confused about UPTAC choice filling for UP engineering colleges? Our UPTAC counselling package helps you shortlist the best colleges across AKTU, private universities and institutions affiliated to UPTAC, build a smart preference order, and secure admission to a top branch at a college within your rank.',
      eligibility: 'UP domicile or JEE Main qualified candidates applying through UPTAC for B.Tech admissions in UP.',
      whatIncluded: ['Top UPTAC college list for your rank', 'Personalised preference order', 'Cutoff analysis for top 30 colleges', 'Branch-wise placement comparison', 'Choice filling guidance', 'WhatsApp support during counselling'],
      benefits: ['Best branch at best UP college for your rank', 'Avoid overrated private colleges', 'Save time on research', 'Updated cutoffs from last 3 years'],
      process: ['Register & share JEE Main rank and domicile status', 'Counsellor shares expected college list', 'Schedule call & discuss preferences', 'Receive final preference order', 'Live support during choice filling'],
      duration: '5-7 days',
      price: 999,
      isPaid: true,
      featured: false,
      status: 'PUBLISHED',
      faqs: [
        { q: 'Is UPTAC counselling only for UP domicile students?', a: 'No. UPTAC has both UP quota and All-India quota seats. JEE Main qualified candidates from any state can participate.' },
      ],
    },
    {
      slug: 'csab-special-round',
      title: 'CSAB Special Round Counselling',
      shortDescription: 'Special-round guidance for vacant NIT/IIIT/GFTI seats after JoSAA.',
      description: 'Did not get your dream college in JoSAA? The CSAB special rounds offer another chance to grab vacant seats at NITs, IIITs and GFTIs. Our counsellors help you identify the best CSAB seat options based on JoSAA trends.',
      eligibility: 'JoSAA registered candidates who could not get a seat or want to upgrade.',
      whatIncluded: ['CSAB vacancy analysis', 'Top college list for special rounds', 'Personalised preference order', 'Round-wise strategy', 'Live support during CSAB choice filling'],
      benefits: ['Realistic expectations from CSAB', 'Best seat for your rank in special rounds', 'Avoid seat surrender mistakes', 'Backup plan if CSAB fails'],
      process: ['Register & share JoSAA result', 'Receive expected CSAB seat list', 'Schedule call with counsellor', 'Get final preference order', 'Live support during CSAB rounds'],
      duration: '3-5 days',
      price: 999,
      isPaid: true,
      featured: false,
      status: 'PUBLISHED',
      faqs: [
        { q: 'Is CSAB only for students who did not get any seat in JoSAA?', a: 'No. CSAB special rounds are open to anyone who participated in JoSAA. You can surrender your JoSAA seat and try for a better one in CSAB.' },
      ],
    },
    {
      slug: 'free-college-shortlist',
      title: 'Free College Shortlist',
      shortDescription: 'Get a free shortlist of colleges for your JEE Main / NEET rank.',
      description: 'Not sure which colleges you can target? Get a free shortlist of colleges based on your rank, category and preference. A counsellor will review your profile and share 5-8 realistic college options within 48 hours.',
      eligibility: 'Any student preparing for or appearing in JEE Main, NEET or state CET.',
      whatIncluded: ['Free college shortlist (5-8 colleges)', 'Basic rank analysis', 'Email summary'],
      benefits: ['Understand realistic college options', 'Plan your applications better', 'No cost - completely free'],
      process: ['Register with your rank', 'Counsellor reviews your profile', 'Receive college shortlist on email/dashboard'],
      duration: '2 days',
      price: 0,
      isPaid: false,
      featured: false,
      status: 'PUBLISHED',
      faqs: [
        { q: 'Is this really free?', a: 'Yes. The free college shortlist is a one-time service to help you understand your options.' },
      ],
    },
    {
      slug: 'state-cet-counselling',
      title: 'State CET Counselling',
      shortDescription: 'Guidance for MHT-CET, KCET, WBJEE, COMEDK, AP/TS EAMCET and more.',
      description: 'Confused about state-level counselling for engineering? Our state CET counselling package covers MHT-CET, KCET, WBJEE, COMEDK, AP/TS EAMCET, TNEA, and other state-level B.Tech admissions.',
      eligibility: 'Students appearing in any state engineering CET.',
      whatIncluded: ['State-specific college list', 'Personalised preference order', 'Cutoff analysis for top colleges', 'Choice filling guidance', 'WhatsApp support'],
      benefits: ['Best colleges for your state rank', 'Avoid low-quality private colleges', 'Save research time'],
      process: ['Register & share your state CET rank', 'Counsellor shares expected college list', 'Schedule call & get preference order', 'Live support during choice filling'],
      duration: '5-7 days',
      price: 1199,
      isPaid: true,
      featured: false,
      status: 'PUBLISHED',
      faqs: [
        { q: 'Which state CETs do you cover?', a: 'MHT-CET, KCET, WBJEE, COMEDK, AP EAMCET, TS EAMCET, TNEA, KEAM, GUJCET and others.' },
      ],
    },
  ]

  for (const p of programs) {
    const exists = await db.counsellingProgram.findUnique({ where: { slug: p.slug } })
    if (exists) continue
    await db.counsellingProgram.create({
      data: {
        slug: p.slug,
        title: p.title,
        shortDescription: p.shortDescription,
        description: p.description,
        eligibility: p.eligibility,
        whatIncluded: JSON.stringify(p.whatIncluded),
        benefits: JSON.stringify(p.benefits),
        process: JSON.stringify(p.process),
        duration: p.duration,
        price: p.price,
        isPaid: p.isPaid,
        featured: p.featured,
        status: p.status,
        regStartDate: new Date(),
        regEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        faqs: JSON.stringify(p.faqs),
      } as any,
    })
  }
  console.log('✓ Counselling programs')

  // 6) Blog categories
  const categories = [
    { slug: 'college-admissions', name: 'College Admissions', description: 'Latest updates on college admissions across India.' },
    { slug: 'counselling', name: 'Counselling', description: 'Counselling process guides and tips.' },
    { slug: 'jee', name: 'JEE', description: 'JEE Main and Advanced preparation, counselling and college selection.' },
    { slug: 'uptac', name: 'UPTAC', description: 'Uttar Pradesh counselling updates and guides.' },
    { slug: 'josaa', name: 'JoSAA', description: 'JoSAA counselling process for NITs, IIITs and GFTIs.' },
    { slug: 'csab', name: 'CSAB', description: 'CSAB special rounds and vacancy guidance.' },
    { slug: 'college-comparison', name: 'College Comparison', description: 'Detailed comparisons between popular colleges.' },
    { slug: 'cse-colleges', name: 'CSE Colleges', description: 'Best colleges for Computer Science engineering.' },
    { slug: 'engineering-colleges', name: 'Engineering Colleges', description: 'Engineering college rankings and reviews.' },
    { slug: 'admission-updates', name: 'Admission Updates', description: 'Latest admission notifications and deadlines.' },
    { slug: 'career-guidance', name: 'Career Guidance', description: 'Career options after class 12 and during B.Tech.' },
  ]
  const catMap: Record<string, string> = {}
  for (const c of categories) {
    const existing = await db.blogCategory.findUnique({ where: { slug: c.slug } })
    if (existing) { catMap[c.slug] = existing.id; continue }
    const created = await db.blogCategory.create({ data: c })
    catMap[c.slug] = created.id
  }
  console.log('✓ Blog categories')

  // 7) Colleges (compact)
  const colleges = [
    { slug: 'iit-delhi', name: 'Indian Institute of Technology Delhi', shortName: 'IIT Delhi', description: 'IIT Delhi is one of the premier engineering institutes of India, established in 1961. Located in Hauz Khas, New Delhi, it is consistently ranked among the top engineering colleges in the country and offers undergraduate, postgraduate and doctoral programs across engineering, science and management disciplines.', state: 'Delhi', city: 'New Delhi', type: 'GOVT', established: 1961, website: 'https://home.iitd.ac.in', counsellingBody: 'JoSAA', feesMin: 110000, feesMax: 230000, rating: 4.8, featured: true, admissionProcess: 'Admission to B.Tech at IIT Delhi is through JEE Advanced rank followed by JoSAA counselling. Candidates must qualify JEE Main first to be eligible for JEE Advanced.', placementSummary: { avgPackage: 21, highestPackage: 200, topRecruiters: ['Google', 'Microsoft', 'Goldman Sachs', 'Uber', 'Amazon', 'Qualcomm', 'Adobe'], placementRate: 92 }, address: 'Hauz Khas, New Delhi, Delhi 110016' },
    { slug: 'iit-bombay', name: 'Indian Institute of Technology Bombay', shortName: 'IIT Bombay', description: 'IIT Bombay, established in 1958, is the second-oldest IIT and ranks among the top engineering institutes in India. Located in Powai, Mumbai, it has a strong industry connect and a vibrant campus life, attracting top JEE Advanced rankers every year.', state: 'Maharashtra', city: 'Mumbai', type: 'GOVT', established: 1958, website: 'https://www.iitb.ac.in', counsellingBody: 'JoSAA', feesMin: 120000, feesMax: 240000, rating: 4.9, featured: true, admissionProcess: 'JEE Advanced rank + JoSAA counselling', placementSummary: { avgPackage: 23, highestPackage: 220, topRecruiters: ['Google', 'Microsoft', 'Apple', 'Adobe', 'Goldman Sachs', 'Intel'], placementRate: 95 }, address: 'Powai, Mumbai, Maharashtra 400076' },
    { slug: 'iit-kanpur', name: 'Indian Institute of Technology Kanpur', shortName: 'IIT Kanpur', description: 'IIT Kanpur, established in 1959, is known for its rigorous academic curriculum and strong research output. It offers B.Tech programs across multiple engineering branches and is famous for its strong computer science and aerospace departments.', state: 'Uttar Pradesh', city: 'Kanpur', type: 'GOVT', established: 1959, website: 'https://www.iitk.ac.in', counsellingBody: 'JoSAA', feesMin: 115000, feesMax: 230000, rating: 4.7, featured: false, admissionProcess: 'JEE Advanced rank + JoSAA counselling', placementSummary: { avgPackage: 19, highestPackage: 190, topRecruiters: ['Microsoft', 'Google', 'Amazon', 'Adobe', 'Samsung', 'Uber'], placementRate: 90 }, address: 'Kalyanpur, Kanpur, Uttar Pradesh 208016' },
    { slug: 'nit-trichy', name: 'National Institute of Technology Tiruchirappalli', shortName: 'NIT Trichy', description: 'NIT Trichy is the top-ranked NIT in India, established in 1964. It offers B.Tech programs across engineering branches and is highly regarded for its Computer Science, Mechanical and Electrical engineering departments.', state: 'Tamil Nadu', city: 'Tiruchirappalli', type: 'GOVT', established: 1964, website: 'https://www.nitt.edu', counsellingBody: 'JoSAA', feesMin: 70000, feesMax: 175000, rating: 4.6, featured: true, admissionProcess: 'JEE Main rank + JoSAA counselling', placementSummary: { avgPackage: 14, highestPackage: 135, topRecruiters: ['Microsoft', 'Goldman Sachs', 'Amazon', 'Texas Instruments', 'Samsung'], placementRate: 90 }, address: 'Tiruchirappalli, Tamil Nadu 620015' },
    { slug: 'bits-pilani', name: 'Birla Institute of Technology and Science Pilani', shortName: 'BITS Pilani', description: 'BITS Pilani is one of the most prestigious private engineering institutes in India, established in 1964. Admission is through the BITSAT entrance exam. The Pilani campus is known for its strong alumni network and excellent placements across computer science, electronics and mechanical branches.', state: 'Rajasthan', city: 'Pilani', type: 'DEEMED', established: 1964, website: 'https://www.bits-pilani.ac.in', counsellingBody: 'BITSAT', feesMin: 220000, feesMax: 510000, rating: 4.7, featured: true, admissionProcess: 'BITSAT entrance exam conducted by BITS', placementSummary: { avgPackage: 18, highestPackage: 60, topRecruiters: ['Microsoft', 'Oracle', 'Google', 'Adobe', 'Flipkart', 'Amazon'], placementRate: 90 }, address: 'Vidya Vihar, Pilani, Rajasthan 333031' },
    { slug: 'iiit-hyderabad', name: 'International Institute of Information Technology Hyderabad', shortName: 'IIIT Hyderabad', description: 'IIIT Hyderabad is widely regarded as the best IIIT in India, established in 1998. It is known for its strong Computer Science and research programs, with placements comparable to top IITs. Admission is through JEE Main, UGEE and other modes.', state: 'Telangana', city: 'Hyderabad', type: 'DEEMED', established: 1998, website: 'https://www.iiit.ac.in', counsellingBody: 'JoSAA', feesMin: 130000, feesMax: 320000, rating: 4.7, featured: true, admissionProcess: 'JEE Main rank through JoSAA + UGEE for dual-degree research programs', placementSummary: { avgPackage: 27, highestPackage: 80, topRecruiters: ['Google', 'Microsoft', 'Adobe', 'Amazon', 'Samsung', 'Uber'], placementRate: 95 }, address: 'Gachibowli, Hyderabad, Telangana 500032' },
    { slug: 'dtu-delhi', name: 'Delhi Technological University', shortName: 'DTU', description: 'DTU (formerly Delhi College of Engineering) is one of the top engineering colleges in North India. Established in 1941, it offers B.Tech programs across engineering branches and is known for excellent placements and strong industry connect.', state: 'Delhi', city: 'New Delhi', type: 'GOVT', established: 1941, website: 'https://dtu.ac.in', counsellingBody: 'JAC Delhi', feesMin: 95000, feesMax: 240000, rating: 4.5, featured: false, admissionProcess: 'JEE Main rank through JAC Delhi counselling', placementSummary: { avgPackage: 13, highestPackage: 100, topRecruiters: ['Microsoft', 'Amazon', 'Adobe', 'Samsung', 'Uber', 'Accenture'], placementRate: 88 }, address: 'Bawana Road, Delhi 110042' },
    { slug: 'iiit-delhi', name: 'Indraprastha Institute of Information Technology Delhi', shortName: 'IIIT Delhi', description: 'IIIT Delhi is a state university established in 2008, known for its strong Computer Science and Applied AI programs. It has quickly become one of the top choices for JEE Main qualified students looking for CSE-focused education.', state: 'Delhi', city: 'New Delhi', type: 'AUTONOMOUS', established: 2008, website: 'https://www.iiitd.ac.in', counsellingBody: 'JAC Delhi', feesMin: 180000, feesMax: 420000, rating: 4.5, featured: false, admissionProcess: 'JEE Main rank through JAC Delhi counselling', placementSummary: { avgPackage: 24, highestPackage: 70, topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Samsung'], placementRate: 92 }, address: 'Okhla Industrial Estate, Phase III, New Delhi 110020' },
    { slug: 'vit-vellore', name: 'Vellore Institute of Technology Vellore', shortName: 'VIT Vellore', description: 'VIT Vellore is one of the top private engineering institutes in India. Established in 1984, it admits students through VITEEE exam and offers a wide range of B.Tech specializations including CSE, ECE, Mechanical, and emerging fields like AI & Data Science.', state: 'Tamil Nadu', city: 'Vellore', type: 'DEEMED', established: 1984, website: 'https://vit.ac.in', counsellingBody: 'VITEEE', feesMin: 198000, feesMax: 396000, rating: 4.4, featured: false, admissionProcess: 'VITEEE entrance exam conducted by VIT', placementSummary: { avgPackage: 9.5, highestPackage: 75, topRecruiters: ['Microsoft', 'Amazon', 'Accenture', 'Cisco', 'TCS Digital', 'Cognizant'], placementRate: 85 }, address: 'Vellore, Tamil Nadu 632014' },
    { slug: 'srm-chennai', name: 'SRM Institute of Science and Technology Chennai', shortName: 'SRM Chennai', description: 'SRM Chennai is a well-known private deemed university offering a wide range of B.Tech programs. Admission is through SRMJEEE. The university has a large campus with strong placement support across CSE, IT, ECE and Mechanical branches.', state: 'Tamil Nadu', city: 'Chennai', type: 'DEEMED', established: 1985, website: 'https://www.srmist.edu.in', counsellingBody: 'SRMJEEE', feesMin: 250000, feesMax: 450000, rating: 4.1, featured: false, admissionProcess: 'SRMJEEE entrance exam', placementSummary: { avgPackage: 7.5, highestPackage: 50, topRecruiters: ['Amazon', 'Accenture', 'TCS Digital', 'Cognizant', 'Wipro'], placementRate: 80 }, address: 'Kattankulathur, Chennai, Tamil Nadu 603203' },
    { slug: 'hbtu-kanpur', name: 'Harcourt Butler Technical University Kanpur', shortName: 'HBTU Kanpur', description: 'HBTU Kanpur, established in 1921, is one of the oldest engineering colleges in India. Admissions are through UPTAC based on JEE Main rank. The college is known for its strong alumni network and affordable fees.', state: 'Uttar Pradesh', city: 'Kanpur', type: 'GOVT', established: 1921, website: 'https://hbtu.ac.in', counsellingBody: 'UPTAC', feesMin: 70000, feesMax: 180000, rating: 4.2, featured: false, admissionProcess: 'JEE Main rank through UPTAC counselling', placementSummary: { avgPackage: 8, highestPackage: 45, topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Adobe', 'L&T', 'Samsung'], placementRate: 78 }, address: 'Nawabganj, Kanpur, Uttar Pradesh 208002' },
    { slug: 'knit-sultanpur', name: 'Kamla Nehru Institute of Technology Sultanpur', shortName: 'KNIT Sultanpur', description: 'KNIT Sultanpur is a government-aided engineering college in Uttar Pradesh, established in 1976. Admissions are through UPTAC. The college offers B.Tech programs in CSE, IT, ECE, EE, ME and Civil branches with affordable fees and decent placements.', state: 'Uttar Pradesh', city: 'Sultanpur', type: 'GOVT', established: 1976, website: 'https://knit.ac.in', counsellingBody: 'UPTAC', feesMin: 55000, feesMax: 145000, rating: 3.9, featured: false, admissionProcess: 'JEE Main rank through UPTAC counselling', placementSummary: { avgPackage: 5.5, highestPackage: 25, topRecruiters: ['TCS', 'Wipro', 'Infosys', 'Cognizant', 'L&T'], placementRate: 65 }, address: 'Sultanpur, Uttar Pradesh 228118' },
  ]

  for (const c of colleges) {
    const existing = await db.college.findUnique({ where: { slug: c.slug } })
    if (existing) continue
    await db.college.create({
      data: {
        ...c,
        placementSummary: c.placementSummary ? JSON.stringify(c.placementSummary) : null,
        status: 'PUBLISHED',
      } as any,
    })
  }
  console.log('✓ Colleges')

  // 8) Branches
  const branchesData = [
    { name: 'CSE', fullName: 'Computer Science & Engineering', duration: '4 years', seats: 120, placement: 95 },
    { name: 'ECE', fullName: 'Electronics & Communication Engineering', duration: '4 years', seats: 90, placement: 88 },
    { name: 'EE', fullName: 'Electrical Engineering', duration: '4 years', seats: 90, placement: 80 },
    { name: 'ME', fullName: 'Mechanical Engineering', duration: '4 years', seats: 120, placement: 75 },
    { name: 'CE', fullName: 'Civil Engineering', duration: '4 years', seats: 60, placement: 65 },
    { name: 'IT', fullName: 'Information Technology', duration: '4 years', seats: 90, placement: 92 },
  ]
  const allColleges = await db.college.findMany()
  for (const college of allColleges) {
    const numBranches = Math.min(6, branchesData.length)
    for (let i = 0; i < numBranches; i++) {
      const b = branchesData[i]
      const existing = await db.branch.findFirst({ where: { collegeId: college.id, name: b.name } })
      if (existing) continue
      const ps = college.placementSummary ? JSON.parse(college.placementSummary as string) : null
      await db.branch.create({
        data: {
          collegeId: college.id,
          name: b.name,
          fullName: b.fullName,
          duration: b.duration,
          totalSeats: b.seats,
          feesAnnual: college.feesMin,
          placementRate: b.placement,
          avgPackage: ps?.avgPackage || null,
          highestPackage: ps?.highestPackage || null,
          topRecruiters: ps?.topRecruiters ? JSON.stringify(ps.topRecruiters) : null,
          description: `${b.fullName} at ${college.name}.`,
        },
      })
    }
  }
  console.log('✓ Branches')

  // 9) Blog posts (compact)
  const posts = [
    { slug: 'josaa-counselling-complete-guide-2026', title: 'JoSAA Counselling 2026: Complete Step-by-Step Guide', excerpt: 'JoSAA counselling for admission to NITs, IIITs and GFTIs is the most important step after JEE Main and Advanced. Here is a complete guide covering registration, choice filling, mock allotment, seat allotment and reporting.', category: 'josaa', tags: ['josaa','jee main','counselling','nit','iiit'], content: `JoSAA (Joint Seat Allocation Authority) conducts counselling for admission to undergraduate engineering programs at NITs, IIITs and other Government Funded Technical Institutions (GFTIs) based on JEE Main and JEE Advanced ranks.

## What is JoSAA Counselling?

JoSAA is a centralised counselling process that allocates seats across 23 IITs, 31 NITs, 26 IIITs and 33 GFTIs. The counselling is conducted in multiple rounds, typically 6 rounds, with each round allowing candidates to either accept, float or freeze their allotted seat.

## Eligibility

To participate in JoSAA counselling, you must:
- Qualify JEE Main 2026 (for NITs, IIITs, GFTIs)
- Qualify JEE Advanced 2026 (for IITs)
- Have a valid category certificate if applying under reserved category

## Step-by-Step Process

1. **Registration**: Visit josaa.nic.in and register using JEE Main roll number and password.
2. **Choice Filling**: Add colleges and branches in order of preference. You can fill up to 250+ choices.
3. **Choice Locking**: Lock your choices before the deadline. Unlocked choices are not considered.
4. **Mock Allotment (2 rounds)**: JoSAA conducts 2 mock allotments to give you an idea of probable seat.
5. **Seat Allotment (6 rounds)**: Seats are allotted based on rank, category and availability.
6. **Reporting**: If allotted a seat, report to the Reporting Centre (or online) to confirm acceptance.

## Choice Filling Strategy

The most critical step is choice filling. Always start with dream colleges, then realistic colleges, and end with safe colleges. Do not over-fill with unrealistic choices — they will simply be skipped. Use mock allotment data to refine your list.

## Float, Freeze and Withdraw

- **Freeze**: Accept the current seat and do not want upgrade.
- **Float**: Accept the current seat but want upgrade in next rounds.
- **Withdraw**: Surrender the seat and exit counselling.

## Important Tips

- Always keep backup documents ready (rank card, marksheets, category certificate, photo, Aadhaar).
- Do not miss choice locking deadline under any circumstance.
- Use the mock allotment results to revise your preference list.
- Float only if you are confident of upgrade; otherwise freeze.

## Conclusion

JoSAA counselling, if done strategically, can get you the best possible college+branch for your rank. Take time to understand the process, build a smart preference order, and do not hesitate to seek expert help.`, tableOfContents: [{ id: 'what-is-josaa-counselling', title: 'What is JoSAA Counselling?', level: 2 },{ id: 'eligibility', title: 'Eligibility', level: 2 },{ id: 'step-by-step-process', title: 'Step-by-Step Process', level: 2 },{ id: 'choice-filling-strategy', title: 'Choice Filling Strategy', level: 2 },{ id: 'float-freeze-and-withdraw', title: 'Float, Freeze and Withdraw', level: 2 },{ id: 'important-tips', title: 'Important Tips', level: 2 },{ id: 'conclusion', title: 'Conclusion', level: 2 }], faqs: [{ q: 'How many choices can I fill in JoSAA?', a: 'You can fill up to 250+ choices in JoSAA, but quality matters more than quantity. Build a focused list of 50-100 realistic choices based on your rank.' },{ q: 'Can I change choices after mock allotment?', a: 'Yes, after each mock allotment you can re-order, add or delete choices. Final list must be locked before Round 1.' }] },
    { slug: 'uptac-counselling-process-2026', title: 'UPTAC Counselling 2026: Process, Eligibility and Choice Filling', excerpt: 'UPTAC (Uttar Pradesh Technical Admission Counselling) is the counselling process for B.Tech admissions in UP engineering colleges. Here is the complete guide for 2026 aspirants.', category: 'uptac', tags: ['uptac','uttar pradesh','counselling','b.tech','aktu'], content: `UPTAC is conducted by Dr. APJ Abdul Kalam Technical University (AKTU) for admission to B.Tech programs in Uttar Pradesh engineering colleges. Admission is based on JEE Main rank.

## UPTAC Eligibility

- Candidate must have passed Class 12 with Physics, Maths and one of Chemistry/Biotech/Bio/Technical Vocational
- Must have valid JEE Main 2026 score
- For UP quota seats: candidate must have UP domicile
- For All India quota: open to all JEE Main qualified candidates

## Counselling Process

1. **Registration**: Register at uptac.admissions.nic.in
2. **Document Verification**: Uploading documents and verification (online for most candidates)
3. **Choice Filling**: Add colleges and branches in preference order
4. **Choice Locking**: Lock choices before deadline
5. **Seat Allotment (multiple rounds)**: Typically 4-5 rounds
6. **Seat Acceptance**: Pay seat acceptance fee and confirm
7. **Reporting at College**: Report to allotted college with documents

## Top Colleges Under UPTAC

- HBTU Kanpur
- KNIT Sultanpur
- IET Lucknow
- Bundelkhand Institute of Engineering & Technology, Jhansi
- Kamla Nehru Institute of Technology, Sultanpur
- Rajkiya Engineering Colleges (various districts)
- AKTU affiliated private colleges (KIET, AKGEC, Galgotias, ABES, etc.)

## Choice Filling Tips

- Always fill government colleges first (HBTU, IET, KNIT)
- Add top private colleges next (KIET, AKGEC, Galgotias, ABES)
- Always keep 3-5 backup safe colleges
- Prefer CSE/IT over other branches at top private colleges for placements
- Check actual placement records from college websites

## Documents Required

- JEE Main 2026 rank card
- Class 10 and 12 marksheets and certificates
- UP domicile certificate (for UP quota)
- Category certificate (if applicable)
- Aadhaar card
- Passport size photos

## Conclusion

UPTAC counselling offers great opportunities for JEE Main qualified students across UP. Strategic choice filling can help you secure a top branch at a top college within your rank.`, tableOfContents: [{ id: 'uptac-eligibility', title: 'UPTAC Eligibility', level: 2 },{ id: 'counselling-process', title: 'Counselling Process', level: 2 },{ id: 'top-colleges-under-uptac', title: 'Top Colleges Under UPTAC', level: 2 },{ id: 'choice-filling-tips', title: 'Choice Filling Tips', level: 2 },{ id: 'documents-required', title: 'Documents Required', level: 2 },{ id: 'conclusion', title: 'Conclusion', level: 2 }], faqs: [{ q: 'Can non-UP candidates participate in UPTAC?', a: 'Yes, there is an All India quota (typically 10-15%) in private colleges for non-UP candidates.' }] },
    { slug: 'csab-special-round-guide-2026', title: 'CSAB Special Round 2026: Last Chance for NIT/IIIT/GFTI Seats', excerpt: 'CSAB special rounds are conducted after JoSAA to fill vacant seats at NITs, IIITs and GFTIs. Here is what you need to know before participating.', category: 'csab', tags: ['csab','special round','nit','iiit','gfti'], content: `CSAB (Central Seat Allocation Board) conducts special rounds after JoSAA counselling to fill vacant seats at NITs, IIITs and GFTIs. CSAB offers another opportunity for candidates who could not get their preferred seat in JoSAA.

## CSAB Special Rounds Explained

CSAB conducts typically 2 special rounds. These rounds are open to:
- Candidates who did not register for JoSAA
- Candidates who participated in JoSAA but did not get any seat
- Candidates who want to surrender their JoSAA seat and try for a different one

## Important: Seat Surrender Rule

If you have been allotted a seat in JoSAA and want to participate in CSAB:
- You must surrender the JoSAA seat before CSAB registration
- Surrendered seats are added to the CSAB vacancy pool

## CSAB Process

1. **Registration**: Register at csab.nic.in
2. **Choice Filling**: Fill CSAB-specific choices
3. **Seat Allotment**: 1-2 rounds of allotment
4. **Reporting**: Report to allotted college

## Should You Participate in CSAB?

Participating in CSAB makes sense if:
- You did not get your dream branch/college in JoSAA
- You want to take risk for a better seat
- You have backup options like private colleges

## Conclusion

CSAB special rounds are an opportunity but also a risk. Analyse your JoSAA result, understand your risk appetite, and make an informed decision.`, tableOfContents: [{ id: 'csab-special-rounds-explained', title: 'CSAB Special Rounds Explained', level: 2 },{ id: 'important-seat-surrender-rule', title: 'Important: Seat Surrender Rule', level: 2 },{ id: 'csab-process', title: 'CSAB Process', level: 2 },{ id: 'should-you-participate-in-csab', title: 'Should You Participate in CSAB?', level: 2 },{ id: 'conclusion', title: 'Conclusion', level: 2 }], faqs: [{ q: 'Will I get a better seat in CSAB than JoSAA?', a: 'Not necessarily. CSAB offers vacant seats which are typically in lower branches or less preferred colleges.' }] },
    { slug: 'best-cse-colleges-india-jee-main', title: 'Best CSE Colleges in India via JEE Main (2026)', excerpt: 'Looking for the best Computer Science Engineering colleges accessible through JEE Main? Here is a curated list with cutoffs, fees and placement highlights.', category: 'cse-colleges', tags: ['cse','computer science','jee main','best colleges'], content: `Computer Science Engineering (CSE) remains the most sought-after branch in India. Here is a curated list of the best CSE colleges accessible through JEE Main rank.

## Top Government Colleges for CSE via JEE Main

### 1. NIT Trichy
- Avg package: 14 LPA
- Highest: 135 LPA
- Top recruiters: Microsoft, Goldman Sachs, Amazon

### 2. NIT Surathkal
- Avg package: 13 LPA

### 3. NIT Warangal
- Avg package: 13 LPA

### 4. IIIT Hyderabad
- Avg package: 27 LPA

### 5. IIIT Delhi
- Avg package: 24 LPA

### 6. IIIT Allahabad
- Avg package: 14 LPA

### 7. DTU Delhi
- Avg package: 13 LPA

### 8. NSUT Delhi
- Avg package: 12 LPA

## Top Private Colleges for CSE

### 1. BITS Pilani
- Avg package: 18 LPA

### 2. IIIT Hyderabad (Dual Degree)
- Avg package: 27 LPA

### 3. VIT Vellore
- Avg package: 9.5 LPA

## How to Choose?

When choosing a CSE college, consider:
1. Placement record (avg and median, not just highest)
2. Branch quality (faculty, research output)
3. Location (affects off-campus opportunities)
4. Fees (4-year total cost)
5. Alumni network strength

## Conclusion

The above list is based on placement data, college reputation and cutoff trends. Make sure to verify the latest data on official college websites before making a final decision.`, tableOfContents: [{ id: 'top-government-colleges-for-cse-via-jee-main', title: 'Top Government Colleges for CSE via JEE Main', level: 2 },{ id: 'top-private-colleges-for-cse', title: 'Top Private Colleges for CSE', level: 2 },{ id: 'how-to-choose', title: 'How to Choose?', level: 2 },{ id: 'conclusion', title: 'Conclusion', level: 2 }], faqs: [{ q: 'What is a good JEE Main rank for CSE at top NITs?', a: 'For top NITs (Trichy, Surathkal, Warangal), you typically need an All India Rank below 1500 for CSE in General category.' }] },
    { slug: 'iit-vs-nit-vs-bits-comparison', title: 'IIT vs NIT vs BITS: Which is Better for Engineering?', excerpt: 'Confused between IIT, NIT and BITS for engineering? Here is a detailed comparison across parameters like admissions, placements, fees, alumni network and career prospects.', category: 'college-comparison', tags: ['iit','nit','bits','comparison','engineering'], content: `Choosing between IIT, NIT and BITS is one of the most common dilemmas for engineering aspirants in India. Here is a detailed comparison to help you make an informed decision.

## Admission Process

- **IIT**: JEE Advanced (after qualifying JEE Main). Most competitive - top 15-20k rank in JEE Advanced.
- **NIT**: JEE Main rank. Top NITs accept ranks below 5000 for CSE.
- **BITS**: BITSAT exam. Competitive but slightly easier than JEE Advanced.

## Fees (4-year B.Tech)

- **IIT**: 8-12 Lakh (general category)
- **NIT**: 5-8 Lakh (general category)
- **BITS Pilani**: 18-20 Lakh (private)

## Placements (CSE)

- **IIT (top 5)**: Avg 20+ LPA, Highest 1.5-2 Cr
- **NIT (top 3)**: Avg 13-14 LPA, Highest 50-80 LPA
- **BITS Pilani**: Avg 18 LPA, Highest 50-60 LPA

## Brand Value

IITs have the strongest brand globally, especially top 7 IITs (Bombay, Delhi, Madras, Kanpur, Kharagpur, Roorkee, Guwahati). NITs have strong national brand. BITS Pilani has strong industry reputation especially in IT/software.

## Conclusion

There is no single right answer. The choice depends on your JEE Advanced rank, financial situation, career goals, and preferred location. In general: Top IIT > BITS Pilani > Top NIT > Lower IIT > Lower NIT.`, tableOfContents: [{ id: 'admission-process', title: 'Admission Process', level: 2 },{ id: 'fees-4-year-b.tech', title: 'Fees (4-year B.Tech)', level: 2 },{ id: 'placements-cse', title: 'Placements (CSE)', level: 2 },{ id: 'brand-value', title: 'Brand Value', level: 2 },{ id: 'conclusion', title: 'Conclusion', level: 2 }], faqs: [{ q: 'Can I get direct admission in BITS without BITSAT?', a: 'No, BITSAT is the only admission route for BITS Pilani, Goa and Hyderabad campuses for B.Tech programs.' }] },
    { slug: 'documents-required-counselling-checklist', title: 'Documents Required for College Counselling: Complete Checklist', excerpt: 'A complete document checklist for JoSAA, UPTAC, CSAB and other engineering college counselling processes in India.', category: 'college-admissions', tags: ['documents','counselling','checklist','admission'], content: `Documentation is one of the most critical steps in college counselling. Missing documents can lead to seat cancellation. Here is a comprehensive checklist for Indian engineering college counselling.

## Mandatory Documents

1. JEE Main 2026 Admit Card
2. JEE Main 2026 Rank Card
3. Class 10 Marksheet & Certificate (date of birth proof)
4. Class 12 Marksheet & Certificate
5. Category Certificate (if applicable - SC/ST/OBC/EWS)
6. PwD Certificate (if applicable)
7. Aadhaar Card (or any valid photo ID)
8. Passport Size Photographs (6-8 copies)
9. Counselling Registration Printout

## Category-Specific Documents

### For OBC-NCL
- OBC-NCL Certificate (non-creamy layer) issued after April 1, 2026

### For SC/ST
- Caste Certificate issued by competent authority

### For EWS
- EWS Certificate issued after April 1, 2026

## Tips

1. Original + Photocopies: Always carry both original and 2-3 photocopies of each document.
2. Self-Attested Copies: Self-attest (sign) each photocopy.
3. Digital Copies: Keep scanned copies in your email/cloud for emergency access.
4. Verify Dates: All category certificates must be issued as per counselling guidelines.

## Conclusion

Documentation is non-negotiable. Start preparing documents as soon as your JEE result is out. Do not wait for last minute - many certificates take 2-4 weeks to be issued.`, tableOfContents: [{ id: 'mandatory-documents', title: 'Mandatory Documents', level: 2 },{ id: 'category-specific-documents', title: 'Category-Specific Documents', level: 2 },{ id: 'tips', title: 'Tips', level: 2 },{ id: 'conclusion', title: 'Conclusion', level: 2 }], faqs: [{ q: 'Do I need original documents during counselling registration?', a: 'Most counselling registrations are online and require scanned document uploads. Originals are checked only during physical reporting at the college.' }] },
    { slug: 'how-to-prepare-counselling-choice-filling', title: 'How to Prepare for Counselling Choice Filling Like a Pro', excerpt: 'Choice filling is the most critical decision in counselling. Learn the strategic approach to build a winning preference order.', category: 'counselling', tags: ['choice filling','counselling','strategy','preference order'], content: `Choice filling determines which college+branch you will finally get. A small mistake can cost you a great opportunity. Here is a strategic approach to choice filling.

## Understanding Choice Filling

In counselling, you list colleges+branches in order of preference. The counselling authority allocates seats based on:
- Your rank
- Your category
- Availability of seats
- Your preference order

The first available choice (matching your rank) in your list is allotted to you.

## Step 1: Know Your Rank Reality

Before choice filling, understand:
- Your All India Rank (AIR)
- Category Rank (if applicable)
- Home State Rank (for state quota seats)
- Previous year cutoffs at your rank

## Step 2: Prepare Your Master List

1. List dream colleges (top 5-10% probability)
2. List realistic colleges (40-70% probability)
3. List safe colleges (90%+ probability)

## Step 3: Order Matters

The most preferred choice should be at the top. The system scans top to bottom - first available match is allotted. So:
- Top: Most preferred even if probability is low (no harm)
- Middle: Realistic options
- Bottom: Safe options you would accept if nothing else works

## Step 4: Use Mock Allotment Data

If counselling provides mock allotment rounds (like JoSAA does), use that data to refine your list.

## Step 5: Common Mistakes to Avoid

1. Too few choices: Always fill at least 50-100 choices for top counselling bodies.
2. Random ordering: Do not put unrealistic choices at the top.
3. Ignoring branch preference: Be clear whether you want a specific branch.
4. Missing deadline: Most counsellings have strict choice locking deadlines.

## Step 6: Branch vs College Trade-off

General guidance:
- For CSE/IT: Always prefer branch over college (placements matter most)
- For ECE/EE: Branch matters, but college reputation also matters
- For ME/CE: College reputation matters more than branch

## Conclusion

Choice filling is both art and science. Take time to research, use mock data, avoid common mistakes, and consult experts when in doubt. A well-prepared preference order can get you a significantly better outcome than your rank might suggest.`, tableOfContents: [{ id: 'understanding-choice-filling', title: 'Understanding Choice Filling', level: 2 },{ id: 'step-1-know-your-rank-reality', title: 'Step 1: Know Your Rank Reality', level: 2 },{ id: 'step-2-prepare-your-master-list', title: 'Step 2: Prepare Your Master List', level: 2 },{ id: 'step-3-order-matters', title: 'Step 3: Order Matters', level: 2 },{ id: 'step-4-use-mock-allotment-data', title: 'Step 4: Use Mock Allotment Data', level: 2 },{ id: 'step-5-common-mistakes-to-avoid', title: 'Step 5: Common Mistakes to Avoid', level: 2 },{ id: 'step-6-branch-vs-college-trade-off', title: 'Step 6: Branch vs College Trade-off', level: 2 },{ id: 'conclusion', title: 'Conclusion', level: 2 }], faqs: [{ q: 'How many choices should I fill in JoSAA?', a: 'Aim for 50-150 realistic choices. Quality over quantity - each choice should be a genuine preference you would accept.' }] },
    { slug: 'jee-main-cutoff-trends-2026', title: 'JEE Main Cutoff Trends 2026: What to Expect', excerpt: 'Analysis of JEE Main cutoff trends over the past 5 years and what 2026 aspirants can expect for top colleges.', category: 'admission-updates', tags: ['jee main','cutoff','trends','analysis'], content: `JEE Main cutoffs change every year based on difficulty, number of candidates and seat availability. Understanding trends helps you plan better.

## What is a JEE Main Cutoff?

Cutoff is the closing rank for admission to a specific college+branch+category combination. Candidates with rank above cutoff are not eligible for that seat.

## Top NIT Cutoff Trends (CSE, General Category)

| NIT | 2022 | 2023 | 2024 | 2025 | Trend |
|-----|------|------|------|------|-------|
| NIT Trichy | 750 | 820 | 910 | 880 | Stable |
| NIT Surathkal | 1100 | 1250 | 1400 | 1320 | Slightly rising |
| NIT Warangal | 1250 | 1380 | 1500 | 1450 | Slightly rising |

## Top IIIT Cutoff Trends (CSE, General Category)

| IIIT | 2022 | 2023 | 2024 | 2025 | Trend |
|------|------|------|------|------|-------|
| IIIT Hyderabad | 1200 | 1300 | 1400 | 1350 | Stable |
| IIIT Delhi | 1800 | 1900 | 2100 | 2050 | Stable |
| IIIT Allahabad | 2200 | 2400 | 2600 | 2550 | Slightly rising |

## Factors Affecting Cutoffs

1. Paper Difficulty: Harder paper → lower cutoffs (more students get lower ranks)
2. Number of Candidates: More candidates → tougher competition → higher cutoffs
3. Seat Increase: New seats → lower cutoffs
4. Reservation Changes: Any change in reservation policy affects cutoffs

## What 2026 Aspirants Can Expect

Based on trends:
- Top NIT CSE cutoffs likely to remain around 800-1500 for General category
- IIIT cutoffs likely to remain stable
- Lower branches may see slightly lower cutoffs due to increased seat availability

## Conclusion

Cutoff trends help set realistic expectations but cannot guarantee admission. Build a flexible preference list that covers both optimistic and safe options.`, tableOfContents: [{ id: 'what-is-a-jee-main-cutoff', title: 'What is a JEE Main Cutoff?', level: 2 },{ id: 'top-nit-cutoff-trends-cse-general-category', title: 'Top NIT Cutoff Trends (CSE, General Category)', level: 2 },{ id: 'top-iiit-cutoff-trends-cse-general-category', title: 'Top IIIT Cutoff Trends (CSE, General Category)', level: 2 },{ id: 'factors-affecting-cutoffs', title: 'Factors Affecting Cutoffs', level: 2 },{ id: 'what-2026-aspirants-can-expect', title: 'What 2026 Aspirants Can Expect', level: 2 },{ id: 'conclusion', title: 'Conclusion', level: 2 }], faqs: [{ q: 'Are cutoffs going to increase in 2026?', a: 'Cutoffs typically rise slightly each year due to increased competition. Use last year cutoffs as baseline.' }] },
    { slug: 'career-options-after-btech-cse', title: 'Career Options After B.Tech CSE: A Complete Guide', excerpt: 'Confused about career options after B.Tech CSE? Here is a comprehensive guide covering jobs, higher studies, entrepreneurship and emerging fields.', category: 'career-guidance', tags: ['career','cse','b.tech','jobs','higher studies'], content: `After completing B.Tech in Computer Science Engineering, students have multiple career paths. Here is a comprehensive guide to help you choose.

## 1. Software Engineering Jobs

The most common path. Roles include:
- Software Developer / Engineer
- Backend / Frontend Developer
- Full-stack Developer
- Mobile App Developer
- DevOps Engineer

Top recruiters: Google, Microsoft, Amazon, Adobe, Atlassian, Flipkart, Uber, etc.

## 2. Data Science & Machine Learning

Fast-growing field with high demand.
- Data Scientist
- ML Engineer
- Data Engineer
- AI Researcher

Skills required: Python, R, SQL, ML algorithms, statistics, cloud platforms.

## 3. Higher Studies (M.Tech / MS)

Options:
- M.Tech at IITs/NITs/IISc (via GATE)
- MS at top US/EU universities (via GRE)
- Specialized MS in AI/ML, Cybersecurity, Data Science

## 4. MBA

For management career:
- MBA from IIMs, ISB, FMS (via CAT/GMAT)
- Specialized MBA in Tech, Analytics

## 5. Government Jobs

- ISRO, DRDO, BEL, BHEL scientist/engineer posts
- Indian Engineering Services (IES)
- Public sector bank IT officers
- PSU recruitment via GATE

## 6. Entrepreneurship / Startups

Many CSE graduates start their own ventures. Indian startup ecosystem is strong in fintech, edtech, healthtech, deeptech.

## 7. Emerging Fields

- Cybersecurity
- Cloud Computing
- Blockchain / Web3
- AR/VR
- Quantum Computing

## Conclusion

Career options are vast for CSE graduates. Choose based on your interests, skills and long-term goals. Early focus on skill-building (internships, projects, open source) is more important than the specific path you choose.`, tableOfContents: [{ id: '1-software-engineering-jobs', title: '1. Software Engineering Jobs', level: 2 },{ id: '2-data-science-machine-learning', title: '2. Data Science & Machine Learning', level: 2 },{ id: '3-higher-studies-m.tech-ms', title: '3. Higher Studies (M.Tech / MS)', level: 2 },{ id: '4-mba', title: '4. MBA', level: 2 },{ id: '5-government-jobs', title: '5. Government Jobs', level: 2 },{ id: '6-entrepreneurship-startups', title: '6. Entrepreneurship / Startups', level: 2 },{ id: '7-emerging-fields', title: '7. Emerging Fields', level: 2 },{ id: 'conclusion', title: 'Conclusion', level: 2 }], faqs: [{ q: 'Should I do M.Tech after B.Tech CSE?', a: 'M.Tech is useful if you want to specialise in a field (AI, cybersecurity, etc.) or pursue research/teaching. For pure software engineering jobs, M.Tech is usually not necessary.' }] },
    { slug: 'top-10-engineering-colleges-india-2026', title: 'Top 10 Engineering Colleges in India 2026 (Ranking)', excerpt: 'A ranking of the top 10 engineering colleges in India for 2026 based on placement, reputation, faculty and research output.', category: 'engineering-colleges', tags: ['top colleges','ranking','engineering','india'], content: `Choosing the right engineering college is one of the most important decisions of a student's career. Here is a curated list of top 10 engineering colleges in India for 2026.

## 1. IIT Bombay
- Location: Mumbai
- Avg CSE package: 23 LPA
- Top recruiters: Google, Microsoft, Apple, Adobe

## 2. IIT Delhi
- Location: New Delhi
- Avg CSE package: 21 LPA
- Top recruiters: Google, Microsoft, Goldman Sachs, Uber

## 3. IIT Madras
- Location: Chennai
- Avg CSE package: 20 LPA

## 4. IIT Kanpur
- Location: Kanpur
- Avg CSE package: 19 LPA

## 5. IIT Kharagpur
- Location: Kharagpur
- Avg CSE package: 18 LPA

## 6. IIT Roorkee
- Location: Roorkee
- Avg CSE package: 17 LPA

## 7. BITS Pilani
- Location: Pilani
- Avg CSE package: 18 LPA

## 8. IIIT Hyderabad
- Location: Hyderabad
- Avg CSE package: 27 LPA

## 9. NIT Trichy
- Location: Tiruchirappalli
- Avg CSE package: 14 LPA

## 10. IIT Guwahati
- Location: Guwahati
- Avg CSE package: 16 LPA

## Conclusion

These rankings are based on placement data, reputation and research output. However, the best college for you depends on your rank, branch preference, location preference and financial situation.`, tableOfContents: [{ id: '1-iit-bombay', title: '1. IIT Bombay', level: 2 },{ id: '2-iit-delhi', title: '2. IIT Delhi', level: 2 },{ id: '3-iit-madras', title: '3. IIT Madras', level: 2 },{ id: '4-iit-kanpur', title: '4. IIT Kanpur', level: 2 },{ id: '5-iit-kharagpur', title: '5. IIT Kharagpur', level: 2 },{ id: '6-iit-roorkee', title: '6. IIT Roorkee', level: 2 },{ id: '7-bits-pilani', title: '7. BITS Pilani', level: 2 },{ id: '8-iiit-hyderabad', title: '8. IIIT Hyderabad', level: 2 },{ id: '9-nit-trichy', title: '9. NIT Trichy', level: 2 },{ id: '10-iit-guwahati', title: '10. IIT Guwahati', level: 2 },{ id: 'conclusion', title: 'Conclusion', level: 2 }], faqs: [{ q: 'Which is better: IIT or BITS Pilani?', a: 'Top IITs (Bombay, Delhi, Madras) are better in terms of brand value and opportunities. BITS Pilani is comparable to mid-tier IITs and is excellent for CSE/IT.' }] },
  ]

  for (const p of posts) {
    const existing = await db.blogPost.findUnique({ where: { slug: p.slug } })
    if (existing) continue
    const cat = catMap[p.category]
    await db.blogPost.create({
      data: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: counsellor.id,
        categoryId: cat,
        tags: JSON.stringify(p.tags),
        tableOfContents: JSON.stringify(p.tableOfContents),
        faqs: JSON.stringify(p.faqs),
        seoTitle: p.title,
        seoDescription: p.excerpt,
      } as any,
    })
  }
  console.log('✓ Blog posts')

  // 10) FAQs
  const faqs = [
    { category: 'GENERAL', question: 'What is CollegePath?', answer: 'CollegePath is a college counselling platform that provides expert guidance for engineering, medical and management admissions across India. We help students with college shortlisting, preference order building, choice filling support and 1-on-1 counselling sessions.' },
    { category: 'GENERAL', question: 'How can I contact CollegePath?', answer: 'You can contact us through the contact form on our website, or email us at support@collegepath.in. Our team typically responds within 24 hours.' },
    { category: 'GENERAL', question: 'Is CollegePath free?', answer: 'CollegePath offers both free and paid services. Free services include college shortlist and basic guidance. Paid services include 1-on-1 counselling, personalised preference order and live support during counselling.' },
    { category: 'COUNSELLING', question: 'What counselling bodies do you cover?', answer: 'We cover all major counselling bodies: JoSAA, UPTAC, CSAB, MHT-CET, KCET, WBJEE, COMEDK, AP/TS EAMCET, TNEA and others.' },
    { category: 'COUNSELLING', question: 'When should I register for counselling guidance?', answer: 'We recommend registering as soon as your JEE/NEET result is declared. This gives our counsellors enough time to analyse your rank and build a personalised preference order before choice filling starts.' },
    { category: 'COUNSELLING', question: 'Can I get a refund if I am not satisfied?', answer: 'Yes, we offer a 100% refund if no counselling session has been conducted and no preference order has been delivered. After delivery of services, refunds are pro-rated based on services availed.' },
    { category: 'ADMISSION', question: 'What documents do I need for counselling?', answer: 'Common documents include JEE rank card, Class 10 & 12 marksheets, category certificate (if applicable), Aadhaar card, passport-size photos and counselling registration printout. Our counsellor shares a personalised checklist after registration.' },
    { category: 'ADMISSION', question: 'Do you guarantee admission to a specific college?', answer: 'No. Admission depends on your rank, category, choices and seat availability. We help you build the best possible preference order to maximise your outcome, but we cannot guarantee admission to any specific college.' },
    { category: 'COLLEGE', question: 'How many colleges do you have in your database?', answer: 'Our database includes 500+ engineering colleges across India, including IITs, NITs, IIITs, BITS, VIT, SRM and top private colleges. Each college page includes courses, fees, placement and counselling information.' },
    { category: 'COLLEGE', question: 'How do I compare colleges on CollegePath?', answer: 'Visit the College Explorer page, select colleges you want to compare, and click "Compare". You can compare up to 3 colleges side by side on parameters like fees, placement, location and admission process.' },
    { category: 'PAYMENT', question: 'What payment methods do you accept?', answer: 'We accept all major credit/debit cards, UPI, net banking and popular wallets. All payments are processed through secure payment gateways.' },
    { category: 'PAYMENT', question: 'Is my payment information secure?', answer: 'Yes. We do not store your payment information on our servers. All payments are processed through PCI-DSS compliant payment gateways like Razorpay and Cashfree.' },
  ]
  for (const f of faqs) {
    const existing = await db.fAQ.findFirst({ where: { question: f.question } })
    if (existing) continue
    await db.fAQ.create({ data: { ...f, published: true, order: 0 } })
  }
  console.log('✓ FAQs')

  // 11) Testimonials
  const testimonials = [
    { name: 'Arjun Mehta', role: 'B.Tech CSE student', content: 'CollegePath helped me secure CSE at IIIT Hyderabad with AIR 1850. Their preference order was spot on and the 1-on-1 session clarified all my doubts. Highly recommend!', rating: 5, college: 'IIIT Hyderabad', exam: 'JEE Main', rank: 'AIR 1850' },
    { name: 'Sneha Patel', role: 'B.Tech ECE student', content: 'I was confused between ECE at NIT Surathkal and CSE at NIT Calicut. The counsellor at CollegePath gave me a detailed comparison with placement data and helped me choose ECE at Surathkal. Best decision ever!', rating: 5, college: 'NIT Surathkal', exam: 'JEE Main', rank: 'AIR 4200' },
    { name: 'Rohit Singh', role: 'B.Tech CSE student', content: 'The UPTAC counselling guidance was excellent. Got CSE at HBTU Kanpur with AIR 28000. Without CollegePath, I would have missed this opportunity.', rating: 5, college: 'HBTU Kanpur', exam: 'JEE Main', rank: 'AIR 28000' },
    { name: 'Priya Gupta', role: 'B.Tech IT student', content: 'CSAB special round guidance was a game changer. Got IT at IIIT Allahabad in the second CSAB round after my JoSAA seat was not great. Worth every rupee.', rating: 5, college: 'IIIT Allahabad', exam: 'JEE Main', rank: 'AIR 12000' },
    { name: 'Karan Agarwal', role: 'B.Tech CSE student', content: 'The free college shortlist service is amazing! Got a realistic list of colleges for my rank within 24 hours. Later upgraded to paid counselling for choice filling support.', rating: 4, college: 'VIT Vellore', exam: 'JEE Main + VITEEE', rank: 'AIR 45000' },
    { name: 'Ananya Iyer', role: 'B.Tech CSE student', content: 'The detailed preference order with ranks for each college+branch was very helpful. Live WhatsApp support during JoSAA choice filling was the highlight.', rating: 5, college: 'DTU Delhi', exam: 'JEE Main', rank: 'AIR 8500' },
  ]
  for (const t of testimonials) {
    const existing = await db.testimonial.findFirst({ where: { name: t.name } })
    if (existing) continue
    await db.testimonial.create({ data: { ...t, status: 'PUBLISHED' } })
  }
  console.log('✓ Testimonials')

  console.log('✅ Seed completed!')
  console.log('   Admin:      admin@collegepath.in / admin@123')
  console.log('   Student:    student@collegepath.in / student@123')
  console.log('   Counsellor: counsellor@collegepath.in / counsellor@123')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

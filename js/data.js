// Nexus Portal — static bookmark dataset.
// Every bookmark has a stable unique id. Edit / delete / hide always go by id,
// never by URL, so two bookmarks sharing a URL can never collide.

const CATEGORIES = [
  {
    id: 'academic',
    title: 'Academic Resources',
    icon: 'fa-graduation-cap',
    bookmarks: [
      { id: 'bm-001', name: 'Gmail', url: 'https://mail.google.com/mail/u/0/?ogbl#inbox', icon: 'fa-solid fa-envelope', description: 'Open inbox' },
      { id: 'bm-002', name: 'SRM Student Portal', url: 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp', icon: 'fa-solid fa-university', description: 'Student login' },
      { id: 'bm-003', name: 'Academia', url: 'https://academia.srmist.edu.in/#Page:My_Attendance', icon: 'fa-solid fa-clipboard-user', description: 'Attendance' },
      { id: 'bm-004', name: 'Campus Web', url: 'https://campusweb.vercel.app/student', icon: 'fa-solid fa-globe', description: 'Campus dashboard' },
      { id: 'bm-005', name: 'ClassPro', url: 'https://academi.cc/academia', icon: 'fa-solid fa-chalkboard-user', description: 'Manage classes' },
      { id: 'bm-006', name: 'Studique', url: 'https://studique.in/', icon: 'fa-solid fa-book-open-reader', description: 'Study tools' },
      { id: 'bm-007', name: 'ELAB', url: 'https://dld.srmist.edu.in/ktretelab2024/#/ktretelab2024/student/home', icon: 'fa-solid fa-flask', description: 'Lab practice' },
      { id: 'bm-008', name: 'Curricula', url: 'https://dld.srmist.edu.in/ktretecurricula2024/#/', icon: 'fa-solid fa-scroll', description: 'Course plans' },
      { id: 'bm-009', name: 'Research', url: 'https://www.bohrium.com/', icon: 'fa-solid fa-atom', description: 'Bohrium workspace' },
      { id: 'bm-010', name: 'Study Planner', url: 'https://www.notion.so/248417a13af980179240f5fe3098ac9e?v=248417a13af980599bb8000c2fe6cb24&source=copy_link', icon: 'fa-solid fa-calendar-check', description: 'Notion planner' }
    ]
  },
  {
    id: 'dev',
    title: 'Development & Tools',
    icon: 'fa-code',
    bookmarks: [
      { id: 'bm-011', name: 'Claude', url: 'https://claude.ai/', icon: 'fa-solid fa-brain', description: 'AI assistant' },
      { id: 'bm-012', name: 'Vercel', url: 'https://vercel.com/', icon: 'fa-solid fa-triangle-exclamation', description: 'Deployments' },
      { id: 'bm-013', name: 'Render', url: 'https://render.com/', icon: 'fa-solid fa-server', description: 'Cloud hosting' },
      { id: 'bm-014', name: 'MongoDB', url: 'https://www.mongodb.com/', icon: 'fa-solid fa-database', description: 'Database' },
      { id: 'bm-015', name: 'GitHub', url: 'https://github.com', icon: 'fa-brands fa-github', description: 'Repositories' },
      { id: 'bm-016', name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'fa-brands fa-stack-overflow', description: 'Q&A' },
      { id: 'bm-017', name: 'Lovable Dev', url: 'https://lovable.dev/', icon: 'fa-solid fa-heart', description: 'App builder' },
      { id: 'bm-018', name: 'ChatGPT', url: 'https://chatgpt.com/', icon: 'fa-solid fa-robot', description: 'AI assistant' },
      { id: 'bm-019', name: 'Base44', url: 'https://base44.com/', icon: 'fa-solid fa-cube', description: 'App builder' },
      { id: 'bm-020', name: 'DeepSeek', url: 'https://chat.deepseek.com/', icon: 'fa-solid fa-brain', description: 'AI research' },
      { id: 'bm-021', name: 'Grammarly AI', url: 'https://www.grammarly.com/ai-humanizer', icon: 'fa-solid fa-pen-nib', description: 'AI humanizer' }
    ]
  },
  {
    id: 'video',
    title: 'Video Learning',
    icon: 'fa-youtube',
    bookmarks: [
      { id: 'bm-022', name: 'YouTube', url: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', description: 'Watch' },
      { id: 'bm-023', name: 'DSA C/C++', url: 'https://youtu.be/B31LgI4Y4DQ?feature=shared', icon: 'fa-solid fa-play', description: 'Full tutorial' },
      { id: 'bm-024', name: 'The Net Ninja', url: 'https://www.youtube.com/@TheNetNinja', icon: 'fa-solid fa-user-ninja', description: 'Web dev series' },
      { id: 'bm-025', name: 'CS Dojo', url: 'https://www.youtube.com/@CSDojo', icon: 'fa-solid fa-khanda', description: 'CS concepts' },
      { id: 'bm-026', name: 'Simplilearn', url: 'https://youtube.com/@simplilearnofficial', icon: 'fa-solid fa-s', description: 'Courses' },
      { id: 'bm-027', name: 'Apna College', url: 'https://youtube.com/@apnacollegeofficial', icon: 'fa-solid fa-graduation-cap', description: 'Placement prep' },
      { id: 'bm-028', name: 'Neso Academy', url: 'https://youtube.com/@nesoacademy', icon: 'fa-solid fa-lightbulb', description: 'Engineering' }
    ]
  },
  {
    id: 'platforms',
    title: 'Learning Platforms',
    icon: 'fa-laptop-file',
    bookmarks: [
      { id: 'bm-029', name: 'CodeWithHarry', url: 'https://www.codewithharry.com/courses/the-ultimate-job-ready-data-science-course', icon: 'fa-solid fa-code', description: 'Data science course' },
      { id: 'bm-030', name: 'Alison Course', url: 'https://alison.com/topic/learn/93257/reasoning-under-uncertainty', icon: 'fa-solid fa-a', description: 'Reasoning module' },
      { id: 'bm-031', name: 'Swayam', url: 'https://swayam.gov.in/mycourses', icon: 'fa-solid fa-book-journal-whills', description: 'Gov courses' },
      { id: 'bm-032', name: 'MyCaptain', url: 'https://app.mycaptain.in/lms/my-courses', icon: 'fa-solid fa-ship', description: 'LMS' },
      { id: 'bm-033', name: 'IBM SkillsBuild', url: 'https://skills.yourlearning.ibm.com/', icon: 'fa-brands fa-ibm', description: 'Certifications' }
    ]
  },
  {
    id: 'compilers',
    title: 'Online Compilers',
    icon: 'fa-terminal',
    bookmarks: [
      { id: 'bm-034', name: 'LeetCode', url: 'https://leetcode.com', icon: 'fa-solid fa-code-branch', description: 'Problem practice' },
      { id: 'bm-035', name: 'C Compiler', url: 'https://www.programiz.com/c-programming/online-compiler/', icon: 'fa-solid fa-c', description: 'Programiz' },
      { id: 'bm-036', name: 'Java Compiler', url: 'https://www.programiz.com/java-programming/online-compiler/', icon: 'fa-brands fa-java', description: 'Programiz' },
      { id: 'bm-037', name: 'Python Compiler', url: 'https://www.programiz.com/python-programming/online-compiler/', icon: 'fa-brands fa-python', description: 'Programiz' }
    ]
  },
  {
    id: 'docs',
    title: 'Docs & References',
    icon: 'fa-book',
    bookmarks: [
      { id: 'bm-038', name: 'HTML Tutorial', url: 'https://www.w3schools.com/html/default.asp', icon: 'fa-brands fa-html5', description: 'w3schools' },
      { id: 'bm-039', name: 'CSS Tutorial', url: 'https://www.w3schools.com/css/default.asp', icon: 'fa-brands fa-css3-alt', description: 'w3schools' },
      { id: 'bm-040', name: 'JS Tutorial', url: 'https://www.w3schools.com/js/default.asp', icon: 'fa-brands fa-js', description: 'w3schools' },
      { id: 'bm-041', name: 'Python Tutorial', url: 'https://www.w3schools.com/python/default.asp', icon: 'fa-brands fa-python', description: 'w3schools' },
      { id: 'bm-042', name: 'Java Tutorial', url: 'https://www.w3schools.com/java/default.asp', icon: 'fa-brands fa-java', description: 'w3schools' },
      { id: 'bm-043', name: 'C Tutorial', url: 'https://www.w3schools.com/c/index.php', icon: 'fa-solid fa-c', description: 'w3schools' },
      { id: 'bm-044', name: 'C++ Tutorial', url: 'https://www.w3schools.com/cpp/default.asp', icon: 'fa-solid fa-code', description: 'w3schools' },
      { id: 'bm-045', name: 'Bootstrap', url: 'https://www.w3schools.com/bootstrap/bootstrap_ver.asp', icon: 'fa-brands fa-bootstrap', description: 'w3schools' },
      { id: 'bm-046', name: 'React', url: 'https://www.w3schools.com/react/default.asp', icon: 'fa-brands fa-react', description: 'w3schools' },
      { id: 'bm-047', name: 'MySQL', url: 'https://www.w3schools.com/mysql/default.asp', icon: 'fa-solid fa-database', description: 'w3schools' },
      { id: 'bm-048', name: 'jQuery', url: 'https://www.w3schools.com/jquery/default.asp', icon: 'fa-solid fa-dollar-sign', description: 'w3schools' }
    ]
  },
  {
    id: 'utils',
    title: 'Utilities & Others',
    icon: 'fa-layer-group',
    bookmarks: [
      { id: 'bm-049', name: 'Google', url: 'https://www.google.com', icon: 'fa-brands fa-google', description: 'Search' },
      { id: 'bm-050', name: 'My Player', url: 'https://myplayer-youtube-play.lovable.app/', icon: 'fa-solid fa-music', description: 'Music player' },
      { id: 'bm-051', name: 'Timer', url: 'https://bankutech.github.io/timer/', icon: 'fa-solid fa-stopwatch', description: 'Focus timer' },
      { id: 'bm-052', name: 'The Helpers', url: 'https://thehelpers.vercel.app/', icon: 'fa-solid fa-handshake-angle', description: 'Support tools' },
      { id: 'bm-053', name: 'LinkedIn', url: 'https://www.linkedin.com/feed/', icon: 'fa-brands fa-linkedin', description: 'Network feed' },
      { id: 'bm-054', name: 'WhatsApp Web', url: 'https://web.whatsapp.com/', icon: 'fa-brands fa-whatsapp', description: 'Messaging' },
      { id: 'bm-055', name: 'Filmyzilla', url: 'https://www.filmyzilla20.com/', icon: 'fa-solid fa-film', description: 'Movies' },
      { id: 'bm-056', name: 'Amazon', url: 'https://www.amazon.in/', icon: 'fa-brands fa-amazon', description: 'Shopping' },
      { id: 'bm-057', name: 'Zepto', url: 'https://www.zeptonow.com/', icon: 'fa-solid fa-cart-shopping', description: 'Groceries' }
    ]
  },
  {
    id: 'projects',
    title: 'My Active Projects',
    icon: 'fa-diagram-project',
    bookmarks: [
      { id: 'bm-058', name: 'ACN+ Social', url: 'https://social-acn.vercel.app/', icon: 'fa-solid fa-users-viewfinder', description: 'Vibe coding' }
    ]
  }
];

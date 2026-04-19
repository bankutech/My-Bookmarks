var categories = [
  {
    id: 'academic',
    title: 'Academic Resources',
    icon: 'fa-graduation-cap',
    bookmarks: [
      { name: 'Gmail', url: 'https://mail.google.com/mail/u/0/?ogbl#inbox', icon: 'fa-envelope', action: 'Open Inbox' },
      { name: 'SRM Student Portal', url: 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp', icon: 'fa-university', action: 'Login' },
      { name: 'Academia', url: 'https://academia.srmist.edu.in/#Page:My_Attendance', icon: 'fa-clipboard-user', action: 'Attendance' },
      { name: 'Campus Web', url: 'https://campusweb.vercel.app/student', icon: 'fa-globe', action: 'Visit' },
      { name: 'ClassPro', url: 'https://academi.cc/academia', icon: 'fa-chalkboard-user', action: 'Manage' },
      { name: 'Studique', url: 'https://studique.in/', icon: 'fa-book-open-reader', action: 'Learn' },
      { name: 'ELAB', url: 'https://dld.srmist.edu.in/ktretelab2024/#/ktretelab2024/student/home', icon: 'fa-flask', action: 'Practice' },
      { name: 'Curricula', url: 'https://dld.srmist.edu.in/ktretecurricula2024/#/', icon: 'fa-scroll', action: 'View' },
      { name: 'Research', url: 'https://www.bohrium.com/', icon: 'fa-atom', action: 'Bohrium' },
      { name: 'Study Planner', url: 'https://www.notion.so/248417a13af980179240f5fe3098ac9e?v=248417a13af980599bb8000c2fe6cb24&source=copy_link', icon: 'fa-calendar-check', action: 'Notion' }
    ]
  },
  {
    id: 'dev',
    title: 'Development & Tools',
    icon: 'fa-code',
    bookmarks: [
      { name: 'Claude', url: 'https://claude.ai/', icon: 'fa-brain', action: 'AI Hub' },
      { name: 'Vercel', url: 'https://vercel.com/', icon: 'fa-triangle-exclamation', action: 'Deploy' },
      { name: 'Render', url: 'https://render.com/', icon: 'fa-server', action: 'Hosting' },
      { name: 'MongoDB', url: 'https://www.mongodb.com/', icon: 'fa-database', action: 'Database' },
      { name: 'GitHub', url: 'https://github.com', icon: 'fa-brands fa-github', action: 'Repo' },
      { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'fa-brands fa-stack-overflow', action: 'Solve' },
      { name: 'Lovable Dev', url: 'https://lovable.dev/', icon: 'fa-heart', action: 'Tools' },
      { name: 'ChatGPT', url: 'https://chatgpt.com/', icon: 'fa-robot', action: 'AI Assistant' },
      { name: 'Base44', url: 'https://base44.com/', icon: 'fa-cube', action: 'Visit' },
      { name: 'DeepSeek', url: 'https://chat.deepseek.com/', icon: 'fa-brain', action: 'AI Research' },
      { name: 'Grammarly AI', url: 'https://www.grammarly.com/ai-humanizer', icon: 'fa-pen-nib', action: 'Humanizer' }
    ]
  },
  {
    id: 'video',
    title: 'Video Learning',
    icon: 'fa-youtube',
    bookmarks: [
      { name: 'YouTube', url: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', action: 'Watch' },
      { name: 'DSA C/C++', url: 'https://youtu.be/B31LgI4Y4DQ?feature=shared', icon: 'fa-play', action: 'Tutorial' },
      { name: 'The Net Ninja', url: 'https://www.youtube.com/@TheNetNinja', icon: 'fa-user-ninja', action: 'Web Dev' },
      { name: 'CS Dojo', url: 'https://www.youtube.com/@CSDojo', icon: 'fa-khanda', action: 'Learn' },
      { name: 'Simplilearn', url: 'https://youtube.com/@simplilearnofficial', icon: 'fa-s', action: 'Courses' },
      { name: 'Apna College', url: 'https://youtube.com/@apnacollegeofficial', icon: 'fa-graduation-cap', action: 'Learn' },
      { name: 'Neso Academy', url: 'https://youtube.com/@nesoacademy', icon: 'fa-lightbulb', action: 'Engineering' }
    ]
  },
  {
    id: 'platforms',
    title: 'Learning Platforms',
    icon: 'fa-laptop-file',
    bookmarks: [
      { name: 'CodeWithHarry', url: 'https://www.codewithharry.com/courses/the-ultimate-job-ready-data-science-course', icon: 'fa-code', action: 'Data Science' },
      { name: 'Alison Course', url: 'https://alison.com/topic/learn/93257/reasoning-under-uncertainty', icon: 'fa-a', action: 'Study' },
      { name: 'Swayam', url: 'https://swayam.gov.in/mycourses', icon: 'fa-book-journal-whills', action: 'Gov Courses' },
      { name: 'MyCaptain', url: 'https://app.mycaptain.in/lms/my-courses', icon: 'fa-ship', action: 'LMS' },
      { name: 'IBM SkillsBuild', url: 'https://skills.yourlearning.ibm.com/', icon: 'fa-brands fa-ibm', action: 'Certify' }
    ]
  },
  {
    id: 'compilers',
    title: 'Online Compilers',
    icon: 'fa-terminal',
    bookmarks: [
      { name: 'LeetCode', url: 'https://leetcode.com', icon: 'fa-code-branch', action: 'Solve' },
      { name: 'C Compiler', url: 'https://www.programiz.com/c-programming/online-compiler/', icon: 'fa-c', action: 'Programiz' },
      { name: 'Java Compiler', url: 'https://www.programiz.com/java-programming/online-compiler/', icon: 'fa-brands fa-java', action: 'Programiz' },
      { name: 'Python Compiler', url: 'https://www.programiz.com/python-programming/online-compiler/', icon: 'fa-brands fa-python', action: 'Programiz' }
    ]
  },
  {
    id: 'docs',
    title: 'Docs & References',
    icon: 'fa-book',
    bookmarks: [
      { name: 'HTML Tutorial', url: 'https://www.w3schools.com/html/default.asp', icon: 'fa-brands fa-html5', action: 'w3schools' },
      { name: 'CSS Tutorial', url: 'https://www.w3schools.com/css/default.asp', icon: 'fa-brands fa-css3-alt', action: 'w3schools' },
      { name: 'JS Tutorial', url: 'https://www.w3schools.com/js/default.asp', icon: 'fa-brands fa-js', action: 'w3schools' },
      { name: 'Python Tutorial', url: 'https://www.w3schools.com/python/default.asp', icon: 'fa-brands fa-python', action: 'w3schools' },
      { name: 'Java Tutorial', url: 'https://www.w3schools.com/java/default.asp', icon: 'fa-brands fa-java', action: 'w3schools' },
      { name: 'C Tutorial', url: 'https://www.w3schools.com/c/index.php', icon: 'fa-c', action: 'w3schools' },
      { name: 'C++ Tutorial', url: 'https://www.w3schools.com/cpp/default.asp', icon: 'fa-code', action: 'w3schools' },
      { name: 'Bootstrap', url: 'https://www.w3schools.com/bootstrap/bootstrap_ver.asp', icon: 'fa-brands fa-bootstrap', action: 'w3schools' },
      { name: 'React', url: 'https://www.w3schools.com/react/default.asp', icon: 'fa-brands fa-react', action: 'w3schools' },
      { name: 'MySQL', url: 'https://www.w3schools.com/mysql/default.asp', icon: 'fa-database', action: 'w3schools' },
      { name: 'jQuery', url: 'https://www.w3schools.com/jquery/default.asp', icon: 'fa-dollar-sign', action: 'w3schools' }
    ]
  },
  {
    id: 'utils',
    title: 'Utilities & Others',
    icon: 'fa-layer-group',
    bookmarks: [
      { name: 'Google', url: 'https://www.google.com', icon: 'fa-brands fa-google', action: 'Search' },
      { name: 'My Player', url: 'https://myplayer-youtube-play.lovable.app/', icon: 'fa-music', action: 'Music' },
      { name: 'Timer', url: 'https://bankutech.github.io/timer/', icon: 'fa-stopwatch', action: 'Focus' },
      { name: 'The Helpers', url: 'https://thehelpers.vercel.app/', icon: 'fa-handshake-angle', action: 'Support' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/feed/', icon: 'fa-brands fa-linkedin', action: 'Connect' },
      { name: 'WhatsApp Web', url: 'https://web.whatsapp.com/', icon: 'fa-brands fa-whatsapp', action: 'Chat' },
      { name: 'Filmyzilla', url: 'https://www.filmyzilla20.com/', icon: 'fa-film', action: 'Movies' },
      { name: 'Amazon', url: 'https://www.amazon.in/', icon: 'fa-brands fa-amazon', action: 'Shop' },
      { name: 'Zepto', url: 'https://www.zeptonow.com/', icon: 'fa-cart-shopping', action: 'Grocery' }
    ]
  },
  {
    id: 'projects',
    title: 'My Active Projects',
    icon: 'fa-diagram-project',
    bookmarks: [
      { name: 'ACN+ Social', url: 'https://social-acn.vercel.app/', icon: 'fa-users-viewfinder', action: 'Vibe Coding' }
    ]
  }
];

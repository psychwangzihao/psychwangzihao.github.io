// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-",
    title: "",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-news",
          title: "news",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/news/";
          },
        },{id: "nav-demos",
          title: "demos",
          description: "Things I have built and can be opened in a browser — talks I give, and experiments you can run.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/demos/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Peer-reviewed publications and preprints.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "news-completed-the-oxford-prospects-winter-visit-jan-feb-2026-in-psychology-receiving-the-best-presentation-award-and-best-film-award",
          title: 'Completed the Oxford Prospects Winter Visit (Jan–Feb 2026) in Psychology, receiving the Best...',
          description: "",
          section: "News",},{id: "news-won-the-excellent-poster-award-at-the-psychology-honor-s-program-research-exhibition-zhejiang-university",
          title: 'Won the Excellent Poster Award at the Psychology (Honor’s Program) Research Exhibition, Zhejiang...',
          description: "",
          section: "News",},{id: "news-gave-a-psychology-science-outreach-talk-at-hangzhou-no-2-high-school-sharing-how-psychology-and-brain-science-are-actually-done-with-high-school-students",
          title: 'Gave a psychology science-outreach talk at Hangzhou No. 2 High School, sharing how...',
          description: "",
          section: "News",},{id: "news-led-the-psychology-outreach-series-at-the-2050-2026-global-youth-gathering-as-lead-organizer-amp-amp-initiator",
          title: 'Led the Psychology Outreach Series at the 2050@2026 Global Youth Gathering as Lead...',
          description: "",
          section: "News",},{id: "news-launched-consciousness-observers-co-lab-an-interdisciplinary-platform-for-consciousness-research-based-at-zhejiang-university",
          title: 'Launched Consciousness Observers (CO-LAB), an interdisciplinary platform for consciousness research based at Zhejiang...',
          description: "",
          section: "News",},{id: "news-invited-by-westlake-university-and-the-joint-academy-on-future-humanity-to-participate-in-the-future-civilization-sandbox-as-a-theme-advocate-leading-the-discussion-topic-decoding-social-interaction-what-ai-can-and-cannot-replace",
          title: 'Invited by Westlake University and the Joint Academy on Future Humanity to participate...',
          description: "",
          section: "News",},{id: "news-won-first-prize-at-the-mind-science-and-intelligent-future-international-summer-school-for-top-students-in-psychology-faculty-of-psychology-beijing-normal-university-as-an-outstanding-student-representative",
          title: 'Won First Prize at the “Mind Science and Intelligent Future” International Summer School...',
          description: "",
          section: "News",},{id: "news-volunteered-at-the-sino-european-international-conference-on-human-cognition-and-artificial-intelligence-aug-31-sep-4-2026",
          title: 'Volunteered at the Sino-European International Conference on Human Cognition and Artificial Intelligence (Aug...',
          description: "",
          section: "News",},{id: "news-gave-an-interactive-talk-connecting-the-dots-to-the-incoming-cohort-of-the-department-of-psychology-zhejiang-university-an-interactive-visual-journey-across-interdisciplinary-science-the-2050-gathering-studying-abroad-and-consciousness-research-it-was-also-my-20th-birthday",
          title: 'Gave an interactive talk, Connecting the Dots, to the incoming cohort of the...',
          description: "",
          section: "News",},{id: "news-gave-a-psychology-science-outreach-talk-at-yuqian-high-school-lin-an-hangzhou-bringing-mind-and-brain-science-to-high-school-students-built-an-interactive-demo-for-the-talk-眼见为实吗-is-seeing-believing-fourteen-hands-on-scenes-asking-a-single-question-is-seeing-believing-and-closing-on-one-i-can-t-answer-does-a-tree-feel-pain",
          title: 'Gave a psychology science-outreach talk at Yuqian High School (Lin’an, Hangzhou), bringing mind...',
          description: "",
          section: "News",},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/CV_WangZihao_ZJU.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%70%73%79%63%68%77%61%6E%67%7A%69%68%61%6F@%7A%6A%75.%65%64%75.%63%6E", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/psychwangzihao", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];

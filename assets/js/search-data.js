// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
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
        },{id: "nav-publications",
          title: "publications",
          description: "Peer-reviewed publications and preprints.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "My full curriculum vitae. Download the PDF version below.",
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
          section: "News",},{id: "news-led-the-psychology-outreach-series-at-the-2050-2026-global-youth-gathering-as-lead-organizer-amp-amp-initiator",
          title: 'Led the Psychology Outreach Series at the 2050@2026 Global Youth Gathering as Lead...',
          description: "",
          section: "News",},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/CV_WangZihao_ZJU.docx", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%70%73%79%63%68%77%61%6E%67%7A%69%68%61%6F@%7A%6A%75.%65%64%75.%63%6E", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Zwang414", "_blank");
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

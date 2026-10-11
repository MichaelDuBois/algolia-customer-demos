/* global instantsearch algoliasearch aa */

const searchClient = algoliasearch(
  'Q9LC2GEA1O',
  'c030f37ad1a54fbd801c7bc3bae4ce20'
);

const userToken = 'demo_usertoken';

const insightsMiddleware = instantsearch.middlewares.createInsightsMiddleware({
  insightsClient: window.aa,
});

const search = instantsearch({
  indexName: 'help_center_articles',
  searchClient: searchClient,
});

search.use(insightsMiddleware);

aa('setUserToken', userToken);

const helpCenterArticleTemplate = (hit, bindEvent) => {
  return `
    <div>
      <div class="hit-name">
        <a
          href="${hit.url}?objectID=${hit.objectID}&queryID=${hit.__queryID}"
          ${bindEvent('click', hit, 'Help Center Article Clicked')}>
          ${instantsearch.highlight({ attribute: 'title', hit })}
        </a>
      </div>
    </div>
  `;
};

const communityQuestionTemplate = (hit, bindEvent) => {
  return `
    <div>
      <div class="hit-name">
        <a
          href="${hit.url}?objectID=${hit.objectID}&queryID=${hit.__queryID}"
          ${bindEvent('click', hit, 'Community Question Clicked')}>
          ${instantsearch.highlight({ attribute: 'title', hit })}
        </a>
      </div>
      <div class="hit-description">
        ${instantsearch.snippet({ attribute: 'content', hit })}
      </div>
    </div>
  `;
};

const academyCourseTemplate = (hit, bindEvent) => {
  return `
    <div>
      <div class="hit-name">
        <a
          href="${hit.course_url}?objectID=${hit.objectID}&queryID=${
    hit.__queryID
  }"
          ${bindEvent('click', hit, 'Academy Course Clicked')}>
          ${instantsearch.highlight({ attribute: 'course_title', hit })}
        </a>
      </div>
      <div class="hit-description">
        ${instantsearch.snippet({ attribute: 'course_short_description', hit })}
      </div>
    </div>
  `;
};

// `
// <div>
//   <img src="{{image}}" align="left" alt="{{name}}" />
//   <div class="hit-name">
//     {{#helpers.highlight}}{ "attribute": "course_title" }{{/helpers.highlight}}
//   </div>
//   <div class="hit-description">
//     {{#helpers.snippet}}{ "attribute": "course_short_description" }{{/helpers.snippet}}
//   </div>
// </div>
// `;

const baseWidgets = [
  instantsearch.widgets.configure({
    // analytics: false,
    userToken: userToken,
  }),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
];
search.addWidgets(baseWidgets);
let widgets;

const createPanel = (options) => {
  return instantsearch.widgets.panel({
    templates: {
      header(opts) {
        return options.title;
      },
      collapseButtonText:
        '{{#collapsed}}+{{/collapsed}}{{^collapsed}}-{{/collapsed}}',
    },
    collapsed: ({ state }) => {
      return false;
    },
  })(options.widget);
};

const addWidgets = (hash) => {
  let newWidgets;
  let classToShow = 'single-tab';
  if (hash === '#helpcenter') {
    newWidgets = [
      instantsearch.widgets
        .index({
          indexName: 'help_center_articles',
          indexId: 'help-tab',
        })
        .addWidgets([
          instantsearch.widgets.configure({
            analyticsTags: ['help-tab'],
          }),
          instantsearch.widgets.hits({
            container: '#hits',
            templates: {
              item: helpCenterArticleTemplate,
            },
          }),
          instantsearch.widgets.pagination({
            container: '#pagination',
          }),
        ]),
    ];
  } else if (hash === '#community') {
    newWidgets = [
      instantsearch.widgets
        .index({
          indexName: 'community_forum_questions',
          indexId: 'community-tab',
        })
        .addWidgets([
          instantsearch.widgets.configure({
            analyticsTags: ['community-tab'],
          }),
          instantsearch.widgets.hits({
            container: '#hits',
            templates: {
              item: communityQuestionTemplate,
            },
          }),
          instantsearch.widgets.pagination({
            container: '#pagination',
          }),
          createPanel({
            title: 'Tags',
            widget: instantsearch.widgets.refinementList,
          })({
            container: '#tags-list',
            attribute: 'tags',
          }),
        ]),
    ];
  } else if (hash === '#academy') {
    newWidgets = [
      instantsearch.widgets
        .index({
          indexName: 'academy_courses',
          indexId: 'academy-tab',
        })
        .addWidgets([
          instantsearch.widgets.configure({
            analyticsTags: ['academy-tab'],
          }),
          instantsearch.widgets.hits({
            container: '#hits',
            templates: {
              item: academyCourseTemplate,
            },
          }),
          instantsearch.widgets.pagination({
            container: '#pagination',
          }),
          createPanel({
            title: 'Tags',
            widget: instantsearch.widgets.refinementList,
          })({
            container: '#tags-list',
            attribute: 'tags',
          }),
        ]),
    ];
  } else {
    classToShow = 'all-tab';
    newWidgets = [
      instantsearch.widgets.configure({
        hitsPerPage: 6,
      }),
      instantsearch.widgets
        .index({
          indexName: 'community_forum_questions',
          indexId: 'community-all-tab',
        })
        .addWidgets([
          instantsearch.widgets.hits({
            container: '#community-forum-hits',
            templates: {
              item: communityQuestionTemplate,
            },
          }),
        ]),
      instantsearch.widgets
        .index({
          indexName: 'help_center_articles',
          indexId: 'help-all-tab',
        })
        .addWidgets([
          instantsearch.widgets.hits({
            container: '#help-center-hits',
            templates: {
              item: helpCenterArticleTemplate,
            },
          }),
        ]),
      instantsearch.widgets
        .index({
          indexName: 'academy_courses',
          indexId: 'academy-all-tab',
        })
        .addWidgets([
          instantsearch.widgets.hits({
            container: '#academy-courses-hits',
            templates: {
              item: academyCourseTemplate,
            },
          }),
        ]),
    ];
  }
  document.querySelectorAll('.bottom-panel').forEach(function (el) {
    el.style.display = 'none';
  });
  document.querySelectorAll(`.${classToShow}`).forEach(function (el) {
    el.style.display = '';
  });
  if (widgets && widgets.length > 0) {
    search.removeWidgets(widgets);
  }
  if (newWidgets && newWidgets.length > 0) {
    search.addWidgets(newWidgets);
  }
  widgets = newWidgets;
};

addWidgets(window.location.hash);
search.start();

window.addEventListener('hashchange', () => {
  addWidgets(window.location.hash);
});

const config = {
  default: {
    require: [
      'tests/features/step-definitions/**/*.js',
      'tests/features/support/**/*.js'
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber/results.json',
      'html:reports/cucumber/index.html',
      '@cucumber/pretty-formatter'
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      snippetSyntax: 'tests/features/support/snippet-syntax.js'
    },
    publishQuiet: true,
    parallel: 2,
    retry: 1,
    timeout: 10000
  },
  ci: {
    format: ['json:reports/cucumber/results.json'],
    parallel: 4,
    retry: 2
  }
};

module.exports = config;
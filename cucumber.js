module.exports = {
  default: {
    require: [
      'features/step_definitions/steps.ts',
      'features/hooks/hooks.ts'
    ],
    paths: [
      'features/*.feature'
    ],
    requireModule: [
      'ts-node/register'
    ],
    format: [
      'progress',
      'html:reports/cucumber-report.html'
    ],
    publishQuiet: true
  }
};

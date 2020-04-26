(() => {
  var action = new PlugIn.Action(function (selection, sender) {
    // CONFIGURATION
    config = this.completedReportConfig;
    dayOneJournalName = config.dayOneJournalName();

    // FUNCTIONS FROM LIBRARY
    lib = this.completedReportLib;
    promptAndRunReport = lib.promptAndRunReport;

    urlTemplate =
      "dayone://post?entry={{LIST}}&journal=" +
      encodeURIComponent(dayOneJournalName);

    report = lib.promptAndRunReport(urlTemplate);
  });

  action.validate = function (selection, sender) {
    // only valid if nothing is selected - so does not show in share menu
    return selection.tasks.length == 0 && selection.projects.length == 0;
  };

  return action;
})();

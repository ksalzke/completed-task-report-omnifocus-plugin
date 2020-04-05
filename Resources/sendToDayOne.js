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
    return true;
  };

  return action;
})();

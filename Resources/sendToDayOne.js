var _ = (function() {
  var action = new PlugIn.Action(function(selection, sender) {
    // CONFIGURATION
    config = this.completedReportConfig;
    dayOneJournalName = config.dayOneJournalName();

    // FUNCTIONS FROM LIBRARY
    lib = this.completedReportLib;
    runReport = lib.runReport;

    urlTemplate =
      "dayone://post?entry={{LIST}}&journal=" +
      encodeURIComponent(dayOneJournalName);

    report = lib.runReport(urlTemplate);
  });

  action.validate = function(selection, sender) {
    return true;
  };

  return action;
})();
_;

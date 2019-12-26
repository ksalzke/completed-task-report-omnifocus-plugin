var _ = (function() {
  var action = new PlugIn.Action(function(selection, sender) {
    // CONFIGURATION
    config = this.completedReportConfig;
    tagsToExclude = config.tagsToExclude();
    dayOneJournalName = config.dayOneJournalName();

    // FUNCTIONS FROM LIBRARY
    lib = this.completedReportLib;
    runReport = lib.runReport;

    report = runReport("aaa");
  });

  action.validate = function(selection, sender) {
    return true;
  };

  return action;
})();
_;

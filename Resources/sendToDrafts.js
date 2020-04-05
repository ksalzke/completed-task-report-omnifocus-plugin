(() => {
  var action = new PlugIn.Action(function (selection, sender) {
    // CONFIGURATION
    config = this.completedReportConfig;

    // FUNCTIONS FROM LIBRARY
    lib = this.completedReportLib;
    promptAndRunReport = lib.promptAndRunReport;

    urlTemplate = "drafts5://create?text={{LIST}}";

    report = lib.promptAndRunReport(urlTemplate);
  });

  action.validate = function (selection, sender) {
    return true;
  };

  return action;
})();

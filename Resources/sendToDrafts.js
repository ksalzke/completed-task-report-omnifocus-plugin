var _ = (function() {
  var action = new PlugIn.Action(function(selection, sender) {
    // CONFIGURATION
    config = this.completedReportConfig;

    // FUNCTIONS FROM LIBRARY
    lib = this.completedReportLib;
    runReport = lib.runReport;

    urlTemplate = "drafts5://create?text={{LIST}}";

    report = lib.runReport(urlTemplate);
  });

  action.validate = function(selection, sender) {
    return true;
  };

  return action;
})();
_;

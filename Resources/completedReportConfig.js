var _ = (function() {
    var completedReportConfig = new PlugIn.Library(new Version("1.0"));
  
    completedReportConfig.tagsToExclude = () => {
        // edit the below to configure the tags that should be ignored -
        // tasks that have these tags will be excluded from the report
        // THIS SHOULD BE AN ARRAY OF TAGS
        return [tagNamed("Activity Type").tagNamed("⏳ Waiting")];
    }

    completedReportConfig.dayOneJournalName = () => {
        // configure the name of the Day One Journal for the report
        // to be sent to below
        // THIS SHOULD BE A STRING
        return "Done Today";
    }
  
    return completedReportConfig;
  })();
  _;
  
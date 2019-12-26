var _ = (function() {
  var action = new PlugIn.Action(function(selection, sender) {
    // CONFIGURATION
    config = this.completedReportConfig;
    tagsToExclude = config.tagsToExclude();
    dayOneJournalName = config.dayOneJournalName();

    // FUNCTIONS FROM LIBRARY
    lib = this.completedReportLib;
    getTasksCompletedOnDate = lib.getTasksCompletedOnDate;
    runReportForDay = lib.runReportForDay;

    functionLibrary = PlugIn.find("com.KaitlinSalzke.functionLibrary").library(
      "functionLibrary"
    );

    var now = new Date();
    var today = Calendar.current.startOfDay(now);
    var yesterday = functionLibrary.removeOneDayFromDate(today);

    // basic selection form - select today, tomorrow, or other
    var selectDayForm = new Form();
    selectDayPopupMenu = new Form.Field.Option(
      "selectedDay",
      "Day",
      ["Today", "Yesterday", "Other"],
      null,
      "Today"
    );
    selectDayForm.addField(selectDayPopupMenu);
    selectDayFormPrompt = "Which day?";
    selectDayFormPromise = selectDayForm.show(selectDayFormPrompt, "Continue");

    // form for when 'other' is selected - to enter alternative date
    var selectOtherDateForm = new Form();
    selectOtherDateDateField = new Form.Field.Date("dateInput", "Date", today);
    selectOtherDateForm.addField(selectOtherDateDateField);
    selectOtherDateFormPrompt = "Select date:";

    // show forms
    selectDayFormPromise.then(function(formObject) {
      optionSelected = formObject.values["selectedDay"];
      console.log(optionSelected);
      console.log(today);
      switch (optionSelected) {
        case "Today":
          runReportForDay(today);
          break;
        case "Yesterday":
          runReportForDay(yesterday);
          break;
        case "Other":
          selectOtherDateFormPromise = selectOtherDateForm.show(
            selectOtherDateFormPrompt,
            "Continue"
          );
          selectOtherDateFormPromise.then(function(formObject) {
            runReportForDay(formObject.values["dateInput"]);
          });
          selectOtherDateFormPromise.catch(function(err) {
            console.log("form cancelled", err.message);
          });
          break;
        default:
      }
    });

    selectDayFormPromise.catch(function(err) {
      console.log("form cancelled", err.message);
    });
  });

  action.validate = function(selection, sender) {
    return true;
  };

  return action;
})();
_;

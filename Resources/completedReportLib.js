var _ = (function() {
  var completedReportLib = new PlugIn.Library(new Version("1.0"));

  completedReportLib.functionLibrary = () => {
    functionLibrary = PlugIn.find("com.KaitlinSalzke.functionLibrary");
    if (functionLibrary !== null) {
      return functionLibrary.library("functionLibrary");
    } else {
      let alert = new Alert(
        "Function Library Required",
        "For this plug-in bundle (Completed Task Report) to work correctly, my Function Library for OmniFocus (https://github.com/ksalzke/function-library-for-omnifocus) is currently also required and needs to be added to the your OmniFocus plug-in folder separately. Either you do not currently have this library file installed, or it is not installed correctly."
      );
      alert.show();
    }
  };

  completedReportLib.getTasksCompletedOnDate = date => {
    // function to check if a tag is included in 'excluded tags'
    config = PlugIn.find("com.KaitlinSalzke.completedTaskReport").library(
      "completedReportConfig"
    );
    isHidden = element => {
      return config.tagsToExclude().includes(element);
    };

    // create an array to store completed tasks
    var tasksCompleted = new Array();

    // function to check if a task was completed today
    completedToday = item => {
      if (
        item.completed &&
        Calendar.current.startOfDay(item.completionDate).getTime() ==
          date.getTime() &&
        !item.tags.some(isHidden)
      ) {
        return true;
      } else return false;
    };

    // get completed tasks from inbox
    inbox.apply(item => {
      if (completedToday(item)) {
        tasksCompleted.push(item);
        return ApplyResult.SkipChildren;
      }
    });

    // get other tasks (the top-most completed)
    library.apply(function(item) {
      if (item instanceof Project && item.task.hasChildren) {
        item.task.apply(tsk => {
          if (completedToday(tsk)) {
            tasksCompleted.push(tsk);
            return ApplyResult.SkipChildren;
          }
        });
      }
    });
    return tasksCompleted;
  };

  completedReportLib.getMarkdownReport = date => {
    // generate TaskPaper and send to Day One
    tasksCompleted = completedReportLib.getTasksCompletedOnDate(date);
    markdown = "# Tasks Completed on " + date.toDateString() + "\n";
    currentFolder = "No Folder";
    tasksCompleted.forEach(function(completedTask) {
      containingFolder = completedReportLib
        .functionLibrary()
        .getContainingFolder(completedTask).name;
      if (currentFolder !== containingFolder) {
        markdown = markdown.concat("\n**", containingFolder, "** \n");
        currentFolder = containingFolder;
      }
      markdown = markdown.concat(" * ", completedTask.name, "\n");
    });
    return markdown;
  };

  completedReportLib.runReportForDay = (date, templateUrl) => {
    let markdown = completedReportLib.getMarkdownReport(date);

    fullUrl = templateUrl.replace("{{LIST}}", encodeURIComponent(markdown));

    URL.fromString(fullUrl).call(() => {});
  };

  completedReportLib.runReport = templateUrl => {
    functionLibrary = completedReportLib.functionLibrary();

    var now = new Date();
    var today = Calendar.current.startOfDay(now);
    var yesterday = completedReportLib
      .functionLibrary()
      .removeOneDayFromDate(today);

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
      switch (optionSelected) {
        case "Today":
          completedReportLib.runReportForDay(today, templateUrl);
          break;
        case "Yesterday":
          completedReportLib.runReportForDay(yesterday, templateUrl);
          break;
        case "Other":
          selectOtherDateFormPromise = selectOtherDateForm.show(
            selectOtherDateFormPrompt,
            "Continue"
          );
          selectOtherDateFormPromise.then(function(formObject) {
            completedReportLib.runReportForDay(
              formObject.values["dateInput"],
              templateUrl
            );
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
  };

  return completedReportLib;
})();
_;

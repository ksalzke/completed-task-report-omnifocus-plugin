var _ = (function() {
  var completedReportLib = new PlugIn.Library(new Version("1.0"));

  completedReportLib.getTasksCompletedOnDate = date => {
    // function to check if a tag is included in 'excluded tags'
    isHidden = element => {
      return tagsToExclude.includes(element);
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

  completedReportLib.runReportForDay = date => {
    // generate TaskPaper and send to Day One
    tasksCompleted = getTasksCompletedOnDate(date);
    markdown = "# Tasks Completed on " + date.toDateString() + "\n";
    currentFolder = "No Folder";
    tasksCompleted.forEach(function(completedTask) {
      containingFolder = functionLibrary.getContainingFolder(completedTask)
        .name;
      if (currentFolder !== containingFolder) {
        markdown = markdown.concat("\n**", containingFolder, "** \n");
        currentFolder = containingFolder;
      }
      markdown = markdown.concat(" * ", completedTask.name, "\n");
    });

    var dayOneUrlStr =
      "dayone://post?entry=" +
      encodeURIComponent(markdown) +
      "&journal=" +
      encodeURIComponent(dayOneJournalName);

    URL.fromString(dayOneUrlStr).call(() => {});
  };

  completedReportLib.runReport = resultUrl => {
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
  };

  return completedReportLib;
})();
_;

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

  return completedReportLib;
})();
_;

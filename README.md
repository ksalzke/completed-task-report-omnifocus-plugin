# About

This is an Omni Automation plug-in bundle for OmniFocus that sends a list of completed tasks to a Day One journal or to Drafts, and also includes functions that allow the user to use their own custom URL schemes. Further details are provided below.

_Please note that Omni Automation for OmniFocus is still in development and details are subject to change before it officially ships. If you have questions, please refer to [Omni's Slack #automation channel](https://www.omnigroup.com/slack/)._

_In addition, please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from a random amateur on the internet!)_

## Known issues 

### Running a report for a day other than today

Although this plugin will allow a report to be run for any period of time, the Day One URL scheme does not allow for a day to be specified (nor does Drafts). Therefore, the report will be added ton the current date at the current time. This can then be edited in Day One if desired.

Also bear in mind that if a report is run for a date in the past, tasks will only be included in the report if they are still in the database (e.g. if tasks from that date have been archived they will not appear in the report).

### Trailing spaces in project or folder names

If project or folder names end with trailing spaces, the Markdown formatting will not be applied correctly. 

# Installation & Set-Up

(For instructions on getting started with Omni Automation, see [here](https://kaitlinsalzke.com/how-to/how-to-add-a-omnijs-plug-in-to-omnifocus-and-assign-a-keyboard-shortcut/).)

**Important note: for this plug-in bundle to work correctly, my [Function Library for OmniFocus](https://github.com/ksalzke/function-library-for-omnifocus) is currently also required and needs to be added to the your OmniFocus plug-in folder separately.**

1. Click on the green `Clone or download` button above to download a `.zip` file of all the files in this GitHub repository.
2. Unzip the downloaded file.
3. Open the file located at `Resources/completedReportConfig.js` and make any changes to the configuration needed to reflect your OmniFocus set-up. Further explanations of the options are included within that file as comments.
4. Rename the entire folder to anything you like, with the extension `.omnifocusjs`
5. Move the resulting file to your OmniFocus plug-in library folder.

For instructions on adding additional actions to run custom reports or different URL schemes, refer to `Adding New Actions` in the `Actions` section below.

# Actions

This plug-in bundle contains two actions, `To Day One` and `To Drafts`.

In both cases, the action:
1. Asks the user to select a day for the report. The options are:
    * Today (default)
    * Yesterday
    * Other Date - If this is selected, the user will also be prompted for a specific date. (A time is shown but may be ignored.)
    * Custom Period - If this is selected, the user will also be prompted to enter a start and end time. (In this case, the specific times will be used.)
2. Identifies tasks that have been completed on the entered date (in the first three cases) or between the specified times (if a Custom Period is entered), provided they do not have any of the tags from the `tagsToExclude` list set up in the configuration. If `showTopLevelOnly` is set to true in the configuration file, this stops at the top-level task that has been completed; e.g if a task or project "Buy groceries" has subtasks "Buy potatoes" and "Buy milk", only "Buy groceries" will be included in the final list. If this is set to false, the report will include all completed tasks that do not have children, or whose children are all hidden.
3. Generates a report including those tasks in Markdown, with:
    * A `h1` heading such as `Tasks Completed on Mon Dec 23 2019` (for the first three options, or if the custom period begins and ends on the same date) or `Tasks Completed from Mon Dec 23 2019 to Wed Dec 25 2019`.
    * (If `includeFolderHeadings` is set to true) a bold heading for each top-level folder (where the folder has completed tasks)
    * (If `includeProjectHeadings` is set to true) an italic heading for each project (where the project has completed tasks).
    * A list of completed tasks, grouped under the applicable folder and project headings if shown (Note that the root project task will not be included in the 'task' listing if a project heading is already shown.) If there are multiple tasks with the same name in a row (for example as the result of a repeating task) the task will only be listed once with (for example) `(x5)` appended.

## To Day One

This action generates the report as described above and sends it to the Day One journal specified as `dayOneJournalName` in the configuration (using Day One's URL scheme). The report is shown in Day One.

## To Drafts

This action generates the report as described above and creates a new draft in Drafts (using the Drafts URL scheme).

## Adding New Actions

Given a particular URL scheme, a new action can be added by:
1. Creating an additional `sendToSomewhere.js` file in the `Resources` folder of this bundle with code similar to the sample code below; for a basic case, all that needs to be changed is the `urlTemplate = URL` line (to reflect the URL scheme of the app you are using). The placeholder `{{LIST}}` can be used where the list needs to go.
2. Creating an additional `sendToSomewhere.strings` file in the `Resources/en.lproj` folder of this bundle. Its content should be similar to the existing `.strings` files.
3. Add `{ "identifier": "sendToDrafts" }` to the actions array in `manifest.json`.

If you do create a new action, consider creating a pull request so that it can be included here for others to use.

**Sample code:**
```
var _ = (function() {
  var action = new PlugIn.Action(function(selection, sender) {

    // FUNCTIONS FROM LIBRARY
    lib = this.completedReportLib;
    runReport = lib.runReport;

    urlTemplate =
      "someapp://post?entry={{LIST}}"

    report = lib.runReport(urlTemplate);
  });

  action.validate = function(selection, sender) {
    return true;
  };

  return action;
})();
_;
```

# Functions

This plug-in bundle also contains several functions in the `completedReportLib` which may be useful in adapting it to fit your own needs or in creating other plugins.

## getTasksCompletedBetweenDates (startDate, endDate)

This function takes a start time and end time (in the Date format) as input and returns an array of the tasks that have been completed between the two times.

## getMarkdownReport (startDate, endDate)

This function takes a start time and end time as input (in the Date format) and returns a string which a report showing the tasks that have been completed between the two times (in Markdown format).

## runReportForPeriod (startDate, endDate, templateUrl)

This function takes a start time and end time as input (in the Date format) as well as a string which uses a URL scheme. The placeholder `{{LIST}}` can be used in the URL to indicate where the Markdown list of tasks which have been completed between the two times should be included.

The function will generate the Markdown list using `getMarkdownReport` and then call the specified URL.

## promptAndRunReport (templateUrl)

This function will complete steps 1-3 directly under `Actions` above (most noteably prompting the user for input), then call `runReportForPeriod` to create the report.
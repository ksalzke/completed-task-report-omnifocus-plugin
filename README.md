# About

This is an single-action Omni Automation plug-in for OmniFocus that sends a list of completed tasks to a Day One journal. Further details are provided below.

_Please note that Omni Automation for OmniFocus is still in development and details are subject to change before it officially ships. If you have questions, please refer to [Omni's Slack #automation channel](https://www.omnigroup.com/slack/)._

_In addition, please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from a random amateur on the internet!)_

## Known issues 

### Running a report for a day other than today

Although this plugin will allow a report to be run for any day, the Day One URL scheme does not allow for a day to be specified. Therefore, the report will be added to the Day One journal on the current date at the current time. This can then be edited in Day One if desired.

Also bear in mind that if a report is run for a date in the past, tasks will only be included in the report if they are still in the database (e.g. if tasks from that date have been archived they will not appear in the report).

# Installation & Set-Up

(For instructions on getting started with Omni Automation, see [here](https://kaitlinsalzke.com/how-to/how-to-add-a-omnijs-plug-in-to-omnifocus-and-assign-a-keyboard-shortcut/).)

1. Click on the green `Clone or download` button above to download a `.zip` file of the file in this GitHub repository.
2. Unzip the downloaded file.
3. Move the `.omnijs` file to your OmniFocus plug-in library folder.
4. Update the CONFIGURATION information in that file.

# Actions

## Completed Task Report
This action can be run at any time. It:
1. Asks the user to select a day for the report. The options are Today (default), Yesterday and Other. If 'Other' is selected, the user will also be prompted for a specific date. A time is shown but may be ignored.
2. Identifies tasks that have been completed on the entered date, provided they do not have any of the tags from the `tagsToExclude` list set up in the configuration. This stops at the top-level task that has been completed; e.g if a task or project "Buy groceries" has subtasks "Buy potatoes" and "Buy milk", only "Buy groceries" will be included in the final list.
3. Generates a report including those tasks in Markdown, with:
    * a `h1` heading such as `Tasks Completed on Mon Dec 23 2019`
    * a `h2` heading for each Folder Name (where the folder has completed tasks), followed by a list of completed tasks
4. Sends the report to the Day One journal specified as `dayOneJournalName` in the configuration (using Day One's URL scheme). The report is shown in Day One.


/* global PlugIn */
(() => {
  const action = new PlugIn.Action(function (selection, sender) {
    // FUNCTIONS FROM LIBRARY
    const lib = this.completedReportLib

    const urlTemplate = 'drafts5://create?text={{LIST}}'

    lib.promptAndRunReport(urlTemplate)
  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()

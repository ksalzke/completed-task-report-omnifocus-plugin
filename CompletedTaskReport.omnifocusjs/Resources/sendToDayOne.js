/* global PlugIn */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const lib = this.completedReportLib
    const journal = await lib.getDayOneJournalName()

    const urlTemplate =
      'dayone://post?entry={{LIST}}&journal=' +
      encodeURIComponent(journal)

    lib.promptAndRunReport(urlTemplate)
  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()

/* global PlugIn Form flattenedTags flattenedProjects Tag Project */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const preferences = this.completedReportLib.loadSyncedPrefs()

    // get current preferences or set defaults if they don't yet exist
    const dayOneJournalName = preferences.readString('dayOneJournalName')
    const showTopLevelOnly = (preferences.read('showTopLevelOnly') !== null) ? preferences.readBoolean('showTopLevelOnly') : true
    const includeFolderHeadings = (preferences.read('includeFolderHeadings') !== null) ? preferences.read('includeFolderHeadings') : true
    const includeProjectHeadings = (preferences.read('includeProjectHeadings') !== null) ? preferences.read('includeProjectHeadings') : false
    const bulletPoint = (preferences.readString('bulletPoint') !== null) ? preferences.readString('bulletPoint') : ' * '
    const tagsToExclude = (preferences.read('tagsToExclude') !== null) ? preferences.read('tagsToExclude').map(id => Tag.byIdentifier(id)) : []
    const projectsToExclude = (preferences.read('projectsToExclude') !== null) ? preferences.read('projectsToExclude').map(id => Project.byIdentifier(id)) : []

    // create and show form
    const prefForm = new Form()
    prefForm.addField(new Form.Field.String('dayOneJournalName', 'Day One Journal Name', dayOneJournalName, null))
    prefForm.addField(new Form.Field.Checkbox('showTopLevelOnly', 'Show Top Level Only', showTopLevelOnly))
    prefForm.addField(new Form.Field.Checkbox('includeFolderHeadings', 'Include Folder Headings', includeFolderHeadings))
    prefForm.addField(new Form.Field.Checkbox('includeProjectHeadings', 'Include Project Headings', includeProjectHeadings))
    prefForm.addField(new Form.Field.String('bulletPoint', 'Bullet Point', bulletPoint, null))
    prefForm.addField(new Form.Field.MultipleOptions('tagsToExclude', 'Tags To Exclude', flattenedTags, flattenedTags.map(t => t.name), tagsToExclude))
    prefForm.addField(new Form.Field.MultipleOptions('projectsToExclude', 'Projects To Exclude', flattenedProjects, flattenedProjects.map(p => p.name), projectsToExclude))
    await prefForm.show('Preferences: Completed Task Report', 'OK')

    // save preferences
    preferences.write('dayOneJournalName', prefForm.values.dayOneJournalName)
    preferences.write('showTopLevelOnly', prefForm.values.showTopLevelOnly)
    preferences.write('includeFolderHeadings', prefForm.values.includeFolderHeadings)
    preferences.write('includeProjectHeadings', prefForm.values.includeProjectHeadings)
    preferences.write('bulletPoint', prefForm.values.bulletPoint)
    preferences.write('tagsToExclude', prefForm.values.tagsToExclude.map(t => t.id.primaryKey))
    preferences.write('projectsToExclude', prefForm.values.projectsToExclude.map(p => p.id.primaryKey))
  })

  action.validate = function (selection, sender) {
    // only show when nothing is selected
    return selection.tasks.length === 0 && selection.projects.length === 0
  }

  return action
})()

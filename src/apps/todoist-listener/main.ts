export {}

declare const global: {
    doGet: (e: GoogleAppsScript.Events.DoGet) => GoogleAppsScript.Content.TextOutput
    doPost: (e: GoogleAppsScript.Events.DoPost) => GoogleAppsScript.Content.TextOutput
}

export type Properties = {
    spreadsheetId: string
}

const properties = PropertiesService.getScriptProperties().getProperties() as Properties

type Key = string

type Value = number | string | boolean | Date

type Record = {
    [key: Key]: Value
}

class Table {
    constructor(private readonly sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

    public addRecord<T extends Record>(record: T): void {
        const recordKeys = Object.keys(record)
        const newKeys = Array.from(new Set([...this.getKeys(), ...recordKeys]))

        this.sheet.getRange(1, 1, 1, newKeys.length).setValues([newKeys])

        const row = newKeys.map((key: Key) => record[key])

        this.sheet.appendRow(row)
    }

    private getKeys(): Key[] {
        if (this.sheet.getLastRow() < 1) {
            return []
        }
        return this.sheet.getRange(1, 1, this.sheet.getLastRow(), this.sheet.getLastColumn()).getValues()[0]
    }
}

type TodoistEventRequest = {
    event_name: string
    event_data: object
}

type TodoistEvent = {
    id: string
    eventName: string
    eventData: string
    dateCreated: Date
}

global.doGet = (e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput => {
    console.warn(e)
    return ContentService.createTextOutput()
}

global.doPost = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
    const request: TodoistEventRequest = JSON.parse(e.postData.contents)

    const sheet = SpreadsheetApp.openById(properties.spreadsheetId).getSheetByName("todoist_event")
    if (!sheet) {
        throw new Error()
    }

    const table = new Table(sheet)

    const todoistEvent: TodoistEvent = {
        id: Utilities.getUuid(),
        eventName: request.event_name,
        eventData: JSON.stringify(request.event_data),
        dateCreated: new Date(),
    }

    table.addRecord(todoistEvent)

    return ContentService.createTextOutput()
}

import { EventType, TodoistEvent, validateEventType } from "../share/entity/todoist-event"
import { TodoistEventTable } from "../share/table/todoist-event-table"

import { ScriptProperties } from "./config/script-properties"

export {}

declare const global: {
    doGet: (e: GoogleAppsScript.Events.DoGet) => GoogleAppsScript.Content.TextOutput
    doPost: (e: GoogleAppsScript.Events.DoPost) => GoogleAppsScript.Content.TextOutput
}

const scriptProperties = PropertiesService.getScriptProperties().getProperties() as ScriptProperties

type TodoistEventRequest = {
    event_name: string
    event_data: object
}

global.doGet = (e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput => {
    console.warn(e)
    return ContentService.createTextOutput()
}

global.doPost = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
    const todoistEventTable = new TodoistEventTable(scriptProperties.spreadsheetId)

    const req: TodoistEventRequest = JSON.parse(e.postData.contents)

    // save new event
    const todoistEvent: TodoistEvent = {
        id: Utilities.getUuid(),
        eventType: validateEventType(req.event_name),
        eventData: JSON.stringify(req.event_data),
        dateCreated: new Date(),
    }
    todoistEventTable.insert(todoistEvent)

    // run workflows
    switch (todoistEvent.eventType) {
        case EventType.ITEM_ADDED:
            console.log("item added!")
            break
        case EventType.ITEM_UPDATED:
            console.log("item updated!")
            break
        default:
            console.log(`ignored event: ${todoistEvent.eventType}`)
            return ContentService.createTextOutput()
    }

    // mark event as consumed
    todoistEvent.dateConsumed = new Date()
    todoistEventTable.update(todoistEvent)

    return ContentService.createTextOutput()
}

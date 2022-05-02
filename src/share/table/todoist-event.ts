import { Table } from "../lib/table"

export type TodoistEvent = {
    id: string
    eventName: string
    eventData: string
    dateCreated: Date
    dateConsumed?: Date
}

export class TodoistEventTable extends Table<TodoistEvent> {
    constructor(spreadsheetId: string) {
        super(spreadsheetId, "todoist_event")
    }
}

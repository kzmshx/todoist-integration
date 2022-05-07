import { TodoistEvent } from "../entity/todoist-event"

import { Table } from "./table"

export class TodoistEventTable extends Table<TodoistEvent> {
    constructor(spreadsheetId: string) {
        super(spreadsheetId, "todoist_event")
    }
}

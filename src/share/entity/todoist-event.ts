export type DueDate = {
    date: string
    timezone: string | null
    string: string
    lang: string
    is_recurring: boolean
}

export type Item = {
    id: number
    sync_id: number | null
    parent_id: number | null
    project_id: number
    section_id: number | null
    user_id: number
    added_by_uid: number | null
    assigned_by_uid: number
    responsible_uid: number | null
    content: string
    description: string
    due: DueDate | null
    priority: number
    child_order: number
    day_order: number
    labels: number[]
    collapsed: boolean
    checked: boolean
    is_deleted: boolean
    date_added: string
    date_completed: string | null
    legacy_id?: number
    legacy_parent_id?: number
    legacy_project_id?: number
}

export const EventType = {
    ITEM_ADDED: "item:added",
    ITEM_UPDATED: "item:updated",
    ITEM_DELETED: "item:deleted",
    ITEM_COMPLETED: "item:completed",
    ITEM_UNCOMPLETED: "item:uncompleted",
    NOTE_ADDED: "note:added",
    NOTE_UPDATED: "note:updated",
    NOTE_DELETED: "note:deleted",
    PROJECT_ADDED: "project:added",
    PROJECT_UPDATED: "project:updated",
    PROJECT_DELETED: "project:deleted",
    PROJECT_ARCHIVED: "project:archived",
    PROJECT_UNARCHIVED: "project:unarchived",
    SECTION_ADDED: "section:added",
    SECTION_UPDATED: "section:updated",
    SECTION_DELETED: "section:deleted",
    SECTION_ARCHIVED: "section:archived",
    SECTION_UNARCHIVED: "section:unarchived",
    LABEL_ADDED: "label:added",
    LABEL_UPDATED: "label:updated",
    LABEL_DELETED: "label:deleted",
    FILTER_ADDED: "filter:added",
    FILTER_UPDATED: "filter:updated",
    FILTER_DELETED: "filter:deleted",
    REMINDER_FIRED: "reminder:fired",
} as const

export type EventType = typeof EventType[keyof typeof EventType]

function eventTypeValues(): string[] {
    return Object.values(EventType)
}

export function validateEventType(value: string): EventType {
    if (!eventTypeValues().includes(value)) {
        throw new Error("unsupported event type")
    }

    return value as EventType
}

export type TodoistEvent = {
    id: string
    eventType: EventType
    eventData: string
    dateCreated: Date
    dateConsumed?: Date
}

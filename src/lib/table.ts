let SPREADSHEET_ID = ""

export function setSpreadsheetId(spreadsheetId: string): void {
    SPREADSHEET_ID = spreadsheetId
}

type Key = string

type Value = number | string | boolean | Date

type Record = {
    [key: Key]: Value
    id: string
}

function getKeys(sheet: GoogleAppsScript.Spreadsheet.Sheet): Key[] {
    if (sheet.getLastRow() < 1) {
        return []
    }

    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
}

function setKeys(sheet: GoogleAppsScript.Spreadsheet.Sheet, newKeys: Key[]): void {
    if (sheet.getLastRow() < 1) {
        sheet.appendRow(newKeys)
        return
    }

    sheet.getRange(1, 1, 1, newKeys.length).setValues([newKeys])
}

function getValues(sheet: GoogleAppsScript.Spreadsheet.Sheet): Value[][] {
    if (sheet.getLastRow() < 2) {
        return []
    }

    return sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues()
}

function getColumnValues(sheet: GoogleAppsScript.Spreadsheet.Sheet, columnKey: Key): Value[] {
    const columnIndex = getKeys(sheet).indexOf(columnKey)
    if (columnIndex === -1) {
        return Array(sheet.getLastRow() - 1)
    }

    return sheet
        .getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn())
        .getValues()
        .map((row: Value[]) => row[columnIndex])
}

function appendRow(sheet: GoogleAppsScript.Spreadsheet.Sheet, values: Value[]): void {
    sheet.appendRow(values)
}

function existsRowById(sheet: GoogleAppsScript.Spreadsheet.Sheet, id: string): boolean {
    return getColumnValues(sheet, "id").includes(id)
}

function setRowById(sheet: GoogleAppsScript.Spreadsheet.Sheet, id: string, values: Value[]): void {
    const rowIndex = getColumnValues(sheet, "id").indexOf(id)
    if (rowIndex === -1) {
        throw new Error(`record not found with id: ${id}`)
    }

    sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).setValues([values])
}

export abstract class Table<T extends Record> {
    private readonly sheet: GoogleAppsScript.Spreadsheet.Sheet

    protected constructor(name: string) {
        const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name)
        if (!sheet) {
            throw new Error(`sheet not found with name: ${name}`)
        }

        this.sheet = sheet
    }

    public insert(record: T): void {
        const newKeys = Array.from(new Set([...getKeys(this.sheet), ...Object.keys(record)]))
        setKeys(this.sheet, newKeys)

        if (existsRowById(this.sheet, record.id)) {
            throw new Error(`record already exists with id: ${record.id}`)
        }

        const values = newKeys.map((key: Key) => record[key])
        appendRow(this.sheet, values)
    }

    public update(record: T): void {
        const newKeys = Array.from(new Set([...getKeys(this.sheet), ...Object.keys(record)]))
        setKeys(this.sheet, newKeys)

        if (!existsRowById(this.sheet, record.id)) {
            throw new Error(`record not found with id: ${record.id}`)
        }

        const values = newKeys.map((key: Key) => record[key])
        setRowById(this.sheet, record.id, values)
    }

    public selectAll(): T[] {
        const keys = getKeys(this.sheet)
        const values = getValues(this.sheet)

        return values.map((row) => Object.assign({}, ...keys.map((k, i) => Object.fromEntries([[keys[i], row[i]]]))))
    }

    public selectOneById(id: string): T | null {
        return this.selectAll().filter((record: T): boolean => record.id === id)[0] ?? null
    }
}

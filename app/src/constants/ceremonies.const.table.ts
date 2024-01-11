import { TableConfig, TableType } from "../models/table.config";

export const CEREMONIES_TABLE_CONFIG = {
    title: "Δεξιώσες",
    subTitle: "Προβολή όλων των δεξιώσεων",
    tabs: [
        { label: "Ημερομηνία", value: "cdate" },
        { label: "Άτομα", value: "people" },
        { label: "Σημαντικότητα", value: "cpriority" },
        { label: "Σχόλεια", value: "details" },
        { label: "Ώρα", value: "ctime" },
    ] as { label: string, value: string }[],
    columns: [
        { label: "Ημερομηνία Δεξίωσης", value: "cdate" },
        { label: "Άτομα", value: "people" },
        { label: "Σημαντικότητα", value: "cpriority" },
        { label: "", value: "" }
    ] as { label: string, value: string }[],
    tableType: TableType.CEREMONIES,
} as TableConfig;


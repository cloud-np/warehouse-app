export interface TableConfig {
    title: string;
    subTitle: string;
    tabs: { label: string, value: string }[];
    columns: { label: string, value: string }[];
    tableType: TableType;
    children: React.ReactNode;
};

export enum TableType {
    CEREMONIES = "CEREMONIES",
    PEOPLE = "PEOPLE",
};



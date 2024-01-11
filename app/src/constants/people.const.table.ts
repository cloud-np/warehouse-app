export const PEOPLE_TABLE_CONFIG = {
    title: "Πελάτες",
    subTitle: "Προβολή όλων των πελατών",
    tabs: [
        { label: "Όλοι", value: "all" },
        { label: "Γαμπρός", value: "groom" },
        { label: "Νύφη", value: "bride" },
        { label: "Άλλοι", value: "other" }
    ] as { label: string, value: string }[],
    columns: ["Ονοματεπώνυμο", "Τηλέφωνο", "Συμαντικότητα", "Ημερομηνία Δεξίωσης", ""] as string[],
} as const;


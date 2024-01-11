export function formatDate(givenDate: Date | string) {
    const date = new Date(givenDate);
    const day = date.getDate().toString();
    let month: number | string = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function parseDate(dateStr: Date) {
    const parts = dateStr.toString().split('/');
    return new Date(+parts[2], +parts[1] - 1, +parts[0]);
}

export function formatTime(time: Date | string) {
    return `${time.toString().slice(0, 5)}`;
}

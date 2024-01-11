export function formatDate(givenDate: Date | string) {
    const date = new Date(givenDate);
    const day = date.getDate().toString();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function formatTime(time: Date | string) {
    return `${time.toString().slice(0, 5)}`;
}

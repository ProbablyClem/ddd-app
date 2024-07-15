export function compare_month(a, b) {
    const [yearA, monthA] = a.split('-');
    const [yearB, monthB] = b.split('-');
    if (yearA === yearB) {
        return +monthA - +monthB;
    }
    return +yearA - +yearB;
}

// 2018-07-24 20:41:37
export function parseDate(date) {
    const [year, month, day] = date.split(' ')[0].split('-');
    return new Date(year, month - 1, day);
}

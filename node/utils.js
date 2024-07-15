export function compare_month(a, b) {
    const [yearA, monthA] = a.split('-');
    const [yearB, monthB] = b.split('-');
    if (yearA === yearB) {
        return +monthA - +monthB;
    }
    return +yearA - +yearB;
}
export function roundNumber(value: number, decimals: number) {
    const rounder = Math.pow(10, decimals);
    return Math.round(value * rounder) / rounder;
}

export function calculatePercent(value: number, total: number) {
    return (value / total) * 100;
}

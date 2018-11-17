export function toSum(accumulator: number, current: number) {
    return accumulator + current;
}

export function toMean(accumulator: number, current: number, index: number, array: number[]) {
    accumulator += current;
    if (index === array.length - 1) {
        return accumulator / array.length;
    } else {
        return accumulator;
    }
}

export function toAbsoluteMean(accumulator: number, current: number, index: number, array: number[]) {
    current = current >= 0 ? current : current * -1;
    accumulator += current;
    if (index === array.length - 1) {
        return accumulator / array.length;
    } else {
        return accumulator;
    }
}

export function toMax(accumulator: number, current: number) {
    return current > accumulator ? current : accumulator;
}

export function toMin(accumulator: number, current: number) {
    return current < accumulator ? current : accumulator;
}

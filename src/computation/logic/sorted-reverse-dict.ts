export class SortedReverseDict {
    reverseDict: KeyValuePair[] = [];

    insert(pair: KeyValuePair): void {
        this.reverseDict.push(pair);
        let index = this.reverseDict.length - 1;
        const item = this.reverseDict[index];
        while (index > 0 && item.value > this.reverseDict[index - 1].value) {
            this.reverseDict[index] = this.reverseDict[index - 1];
            index -= 1;
        }
        this.reverseDict[index] = item;
    }

    popTop(): KeyValuePair[] {
        const start = this.reverseDict[0].value;
        let num = 0;

        while (num < this.reverseDict.length && this.reverseDict[num].value === start) {
            num++;
        }

        const top = this.reverseDict.slice(0, num);
        this.reverseDict = this.reverseDict.slice(num, this.reverseDict.length);
        return top;
    }

    length(): number {
        return this.reverseDict.length;
    }

    print() {
        console.log([...this.reverseDict]);
    }
}

export interface KeyValuePair {
    key: string;
    value: number;
}

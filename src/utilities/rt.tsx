import * as React from "react";
import { Filter } from "react-table";

/**
 * Helper function for select-based filters.
 *
 * @param onChange function that takes a value and returns void
 * @returns function that accepts a React.ChangeEvent and returns the onChange
 * function passed in given a value from the event.
 */
function handleSelectChange(onChange: (value: any) => void) {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };
}

/**
 * Function to generate a react-table Filter with custom option.
 * @param options options to generate a Filter from
 * @returns function that accepts a filter and an onChange that returns a JSX.Element
 */
export function selectFilterWithOptions(options: { value: string; title: string }[]) {
    return ({ filter, onChange }: { filter: any; onChange: (value?: any) => void }) => {
        return (
            <div className="select is-fullwidth">
                <select
                    className="is-primary"
                    value={filter ? filter.value : options[0].value}
                    onChange={handleSelectChange(onChange)}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.title}
                        </option>
                    ))}
                </select>
            </div>
        );
    };
}

export function allGreaterThanEqualsMethod(filter: Filter, rows: any) {
    if (filter.value === "all") {
        return true;
    }
    if (filter.value === "true") {
        return rows[filter.id] > 0;
    }
    if (filter.value === "false") {
        return rows[filter.id] === 0;
    }
    return false;
}

/**
 * filterMethod that for an "all-true-false" option set that evaluates rows
 * that are either zero or not zero (or the filter is disabled with "all").
 *
 * @param filter contains the id of the column and value from the select filter.
 * @param rows holds the data of all the rows.
 */
export function zeroNotZeroFilterMethod(filter: Filter, rows: any) {
    if (filter.value === "all") {
        return true;
    }
    if (filter.value === "true") {
        return rows[filter.id] !== 0;
    }
    if (filter.value === "false") {
        return rows[filter.id] === 0;
    }
    return false;
}

/**
 * filterMethod for comparing values to an inclusive threshold.
 *
 * @param threshold threshold to compare the row to.
 * @returns a function that uses the threshold as a "greater than or equals",
 * or "less than" comparison.
 * @example thresholdFilterMethod(5) => (filter: Filter, row: any) => {
 * if (filter.value === "all") {
 *     return true;
 * }
 * if (filter.value === "gteq") {
 *     return row[filter.id] >= 5
 * }
 * if (filter.value === "lt") {
 *     return row[filter.id] < 5
 * }
 * return false;
 */
export function thresholdFilterMethod(threshold: number) {
    return (filter: Filter, rows: any) => {
        if (filter.value === "all") {
            return true;
        }
        if (filter.value === "gteq") {
            return rows[filter.id] >= threshold;
        }
        if (filter.value === "lt") {
            return rows[filter.id] < threshold;
        }
        return false;
    };
}

/**
 * filterMethod that wraps the thresholdFilterMethod and passes 0. In other
 * words it filters on gteq (greater than or equals) 0 or lt (less than) 0.
 *
 * @param filter contains the id of the column and value from the select filter
 * @param rows holds the data of all the rows
 */
export function positiveOrNegativeFilterMethod() {
    return thresholdFilterMethod(0);
}

/**
 * filterMethod that slightly modifies the default to be case insensitive.
 *
 * @param filter contains the id of the column and value from the select filter
 * @param rows holds the data of all the rows
 */
export function caseInsensitiveFilterMethod(filter: Filter, rows: any) {
    const id = filter.pivotId || filter.id;
    const value: string = filter.value;
    const lowerCaseInput = value.toLowerCase();
    return rows[id] !== undefined ? String(rows[id]).toLowerCase().startsWith(lowerCaseInput) : true;
}

/**
 * Contains all the translateable fields for a ReactTable component.
 */
interface ReactTableTranslation {
    pageText: string;
    ofText: string;
    nextText: string;
    previousText: string;
    loadingText: string;
    noDataText: string;
    rowsText: string;
}

/**
 * Norwegian implementation of ReactTableTranslation
 */
export const norwegian: ReactTableTranslation = {
    pageText: "Side",
    loadingText: "Laster inn...",
    nextText: "Neste",
    previousText: "Forrige",
    noDataText: "Ingen data",
    ofText: "av",
    rowsText: "rader",
};

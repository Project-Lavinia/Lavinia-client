import * as React from "react";

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
            <select
                style={{ width: "100%" }}
                value={filter ? filter.value : options[0].value}
                onChange={handleSelectChange(onChange)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.title}
                    </option>
                ))}
            </select>
        );
    };
}

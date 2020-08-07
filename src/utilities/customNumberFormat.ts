
    /**
     *  Replace '.'  with ','  
     *  Add space between thousands.
     *  Optional: round number.
     * @param value the value to be formatted. 
     * @param decimals number of decimals. 
     */
    export function numberFormat(value: number, decimals?: number | undefined) {
        const fractionDigits = decimals ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals } : {};
        return new Intl.NumberFormat("nb-NO", fractionDigits).format(value);
    }
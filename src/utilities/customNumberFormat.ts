
    /**
     *  Replace '.'  with ','  
     *  Add space between thousands.
     * @param value the value to be formatted. 
     */
   export function numberFormat(value:number){
        return new Intl.NumberFormat("nb-NO").format(value);
    }

    /**
     *  The difference between this method and numberFormat is the specified number of fraction digits. 
     *  Replace '.'  with ','  
     *  Add space between thousands.
     * @param value the value to be formatted. 
     * @param decimals exact number of decimals to be presented
     */
   export function numberFormatFraction(value:number, decimals:number){
        return new Intl.NumberFormat("nb-NO", {minimumFractionDigits: decimals, maximumFractionDigits: decimals}).format(value);
    }

    /**
     * 
     * Replace  '.' with ','
     */
    export function replaceComma(value:string){
        return value.replace(".", ",");
    }

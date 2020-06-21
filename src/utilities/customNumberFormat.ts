
    /**
     *  Replace '.'  with ','  
     *  Add space between thousands.
     * @param value the value to be formatted. 
     */
   export function numberFormat(value:number){
        return new Intl.NumberFormat('nb-NO').format(value);
    };


    /**
     * 
     * Replace  '.' with ','
     */
    export function replaceComma(value:string){
        return value.replace(".", ",")
    }

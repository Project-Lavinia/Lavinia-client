import * as React from "react";

export interface SmartNumericInputProps {
    name: string;
    title: string;
    onChange: (stringValue: string, numericValue: number) => any;
    value: string;
    defaultValue: number;
    min: number;
    max: number;
    originalValue?: string;
    integer?: boolean;
    slider?: boolean;
    style?: React.CSSProperties;
    hidden?: boolean;
    tooltip?: React.ReactNode;
    isHiddenTouch?: boolean;
}

export class SmartNumericInput<T extends SmartNumericInputProps> extends React.Component<T, {}> {
    render() {
        const value = this.validateInput(this.props.value);
        const settingWasChanged = this.props.originalValue && this.props.originalValue !== this.props.value;
        const isHiddenTouch = this.props.isHiddenTouch === true ? "is-hidden-touch" : "";
        return (
            <div hidden={this.props.hidden} className={"field " + isHiddenTouch}>
                <label htmlFor={this.props.name} className="label">
                    {this.props.title} {this.props.tooltip}
                </label>
                <div className="control">
                    <input
                        className="input is-primary is-fullwidth"
                        type={"number"}
                        name={this.props.name}
                        onChange={this.updateNumeric}
                        placeholder={value.numericValue.toString()}
                        value={value.stringValue}
                        min={this.props.min}
                        step={this.props.integer ? 1 : 0.1}
                        max={this.props.max}
                    />

                    {this.props.slider && (
                        <input
                            className="is-primary is-fullwidth"
                            type={"range"}
                            onChange={this.updateSlider}
                            value={value.numericValue}
                            min={this.props.min}
                            step={this.props.integer ? 1 : 0.1}
                            max={this.props.max}
                        />
                    )}
                </div>
                {settingWasChanged && <p className="help">Originalt: {this.props.originalValue}</p>}
            </div>
        );
    }

    updateNumeric = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = this.validateInput(event.target.value);
        this.props.onChange(input.stringValue, input.numericValue);
    };

    updateSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = this.props.integer ? parseInt(event.target.value) : parseFloat(event.target.value);
        this.props.onChange(event.target.value, value);
    };

    validateInput(input: string): { stringValue: string; numericValue: number } {
        const regex = RegExp(/(^-$)|(^-?\d+(\.\d*)?$)/);
        const defaultValue = this.props.defaultValue;
        let value: number;

        if (this.props.hidden) {
            return { numericValue: defaultValue, stringValue: input };
        }

        if (regex.test(input) === false && input !== "") {
            // Matches any numbers as well as "", "-" and "3."
            return this.validateInput(this.props.value);
        }

        if (input.indexOf("-") === 0 && this.props.min >= 0) {
            return this.validateInput(this.props.value);
        }

        if (input === "" || input === "-") {
            return { stringValue: input, numericValue: defaultValue };
        }

        if (input.indexOf(".") !== -1) {
            if (this.props.integer) {
                return this.validateInput(this.props.value);
            } else {
                if (input.indexOf(".") === input.length - 1) {
                    const prefix = input.substring(0, input.indexOf("."));
                    value = parseInt(prefix);
                } else {
                    value = parseFloat(input);
                }
            }
        } else {
            value = parseInt(input);
        }

        if (value >= this.props.min && value <= this.props.max) {
            return { stringValue: input, numericValue: value };
        } else {
            return this.validateInput(this.props.value);
        }
    }
}

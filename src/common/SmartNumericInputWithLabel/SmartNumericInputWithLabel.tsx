import * as React from "react";
import { SmartNumericInputProps, SmartNumericInput } from "../SmartNumericInput";

export interface SmartNumericInputWithLabelProps extends SmartNumericInputProps {
    label: string;
}

export class SmartNumericInputWithLabel extends SmartNumericInput<SmartNumericInputWithLabelProps> {
    render() {
        const value = this.validateInput(this.props.value);
        const settingWasChanged = this.props.originalValue && this.props.originalValue !== this.props.value;
        const label = this.props.label;
        const isHiddenTouch = this.props.isHiddenTouch === true ? "is-hidden-touch" : "";
        return (
            <div hidden={this.props.hidden} className={"field " + isHiddenTouch}>
                <label htmlFor={this.props.name} className="label">
                    {this.props.title} {this.props.tooltip}
                </label>
                <div className="control has-icons-right">
                    <input
                        className="input is-primary is-fullwidth"
                        type={"number"}
                        name={this.props.name}
                        id={this.props.name}
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
                    <span className="icon has-text-dark is-medium is-right">
                        <p>{label}</p>
                    </span>
                </div>
                {settingWasChanged && <p className="help">Originalt: {this.props.originalValue}</p>}
            </div>
        );
    }
}

import * as React from "react";
import { SmartNumericInputProps, SmartNumericInput } from "../SmartNumericInput";

export interface SmartNumericInputWithLabelProps extends SmartNumericInputProps {
    label?: string;
}

export class SmartNumericInputWithLabel extends SmartNumericInput<SmartNumericInputWithLabelProps> {
    render() {
        const value = this.validateInput(this.props.value);
        const settingWasChanged = this.props.originalValue && this.props.originalValue !== this.props.value;
        const label = this.props.label;
        return (
            <div hidden={this.props.hidden} className="field">
                <label htmlFor={this.props.name} className="label">
                    {this.props.title}
                </label>
                <div className="field is-horizontal is-grouped">
                    <div className={"control is-expanded"}>
                        <input
                            className="input is-dark"
                            type={"number"}
                            style={this.props.slider ? { width: "100%" } : {}}
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
                                className="form-control"
                                type={"range"}
                                style={{ width: "100%" }}
                                onChange={this.updateSlider}
                                value={value.numericValue}
                                min={this.props.min}
                                step={this.props.integer ? 1 : 0.1}
                                max={this.props.max}
                            />
                        )}
                    </div>
                    <div className="field-label is-normal has-text-left">
                        <label className="label">{label}</label>
                    </div>
                </div>
                {settingWasChanged && <label>Orginalt: {this.props.originalValue}</label>}
            </div>
        );
    }
}

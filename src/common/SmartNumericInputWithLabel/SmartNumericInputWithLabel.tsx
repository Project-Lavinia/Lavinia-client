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
        const tooltip = this.props.tooltip ? (
            <span
                className="icon has-text-info has-tooltip-multiline has-tooltip-arrow"
                data-tooltip={this.props.tooltip}
            >
                {" "}
                <i className="fas fa-info-circle" />
            </span>
        ) : null;
        return (
            <div hidden={this.props.hidden} className="field">
                <label htmlFor={this.props.name} className="label">
                    {this.props.title}&nbsp;{tooltip}
                </label>
                <div className="control has-icons-right">
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
                    <span className="icon is-medium is-right">
                        <p>{label}</p>
                    </span>
                </div>
                {settingWasChanged && <label>Orginalt: {this.props.originalValue}</label>}
            </div>
        );
    }
}

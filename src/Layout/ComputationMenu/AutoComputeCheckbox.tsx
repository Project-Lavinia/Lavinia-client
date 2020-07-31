import * as React from "react";

export interface AutoComputeCheckboxProps {
    autoCompute: boolean;
    toggleAutoCompute: (event: React.ChangeEvent<HTMLInputElement>) => void;
    computeManually: () => void;
}

export class AutoComputeCheckbox extends React.Component<AutoComputeCheckboxProps> {
    render() {
        return (
            <div className="field">
                <input
                    type="checkbox"
                    className="switch"
                    name="autoCompute"
                    id="autoCompute"
                    checked={this.props.autoCompute}
                    onChange={this.props.toggleAutoCompute}
                />
                <label htmlFor="autoCompute" className="checkbox">
                    Oppdater automatisk
                </label>
            </div>
        );
    }
}

import * as React from "react";

export interface AutoComputeCheckboxProps {
    autoCompute: boolean;
    toggleAutoCompute: (event: React.ChangeEvent<HTMLInputElement>) => void;
    computeManually: () => void;
}

export class AutoComputeCheckbox extends React.Component<AutoComputeCheckboxProps> {
    render() {
        return (
            <label htmlFor="autoCompute" className="checkbox">
                <input
                    type="checkbox"
                    name="autoCompute"
                    checked={this.props.autoCompute}
                    onChange={this.props.toggleAutoCompute}
                />
                &nbsp;Oppdater automatisk
            </label>
        );
    }
}

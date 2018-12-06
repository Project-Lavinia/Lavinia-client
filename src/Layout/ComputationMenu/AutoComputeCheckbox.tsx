import * as React from "react";
import { Button } from "../../common";

export interface AutoComputeCheckboxProps {
    autoCompute: boolean;
    toggleAutoCompute: (event: React.ChangeEvent<HTMLInputElement>) => void;
    computeManually: () => void;
}

export class AutoComputeCheckbox extends React.Component<AutoComputeCheckboxProps> {
    render() {
        return (
            <div className="form-group row">
                <label htmlFor="autoCompute" className="text-left col-sm-10 col-form-label">
                    Oppdater automatisk
                </label>
                <div className="col-sm-2">
                    <input
                        className="form-control"
                        type="checkbox"
                        name="autoCompute"
                        checked={this.props.autoCompute}
                        onChange={this.props.toggleAutoCompute}
                    />
                    {!this.props.autoCompute && (
                        <Button title={"Kalkuler"} onPress={this.props.computeManually} type="button" />
                    )}
                </div>
            </div>
        );
    }
}

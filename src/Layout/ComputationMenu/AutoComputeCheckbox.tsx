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
            <React.Fragment>
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
                    </div>
                </div>
                {!this.props.autoCompute ? (
                    <div className="form-group row">
                        <label className="text-left col-sm-6">Manuell beregning</label>
                        <div className="btn-group-vertical col-sm-6">
                            <Button
                                id="compute_manually"
                                title={"Beregn"}
                                onPress={this.props.computeManually}
                                type="button"
                            />
                        </div>
                    </div>
                ) : null}
            </React.Fragment>
        );
    }
}

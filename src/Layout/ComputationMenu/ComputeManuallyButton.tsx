import * as React from "react";

export interface ComputeManuallyButtonProps {
    autoCompute: boolean;
    computeManually: () => void;
}

export class ComputeManuallyButton extends React.Component<ComputeManuallyButtonProps> {
    render() {
        return (
            <div hidden={this.props.autoCompute}>
                <button
                    id="compute_manually"
                    className="button is-info is-fullwidth"
                    title={"Beregn manuelt"}
                    onClick={this.props.computeManually}
                    type="button"
                    hidden={this.props.autoCompute}
                >
                    Beregn manuelt
                </button>
            </div>
        );
    }
}

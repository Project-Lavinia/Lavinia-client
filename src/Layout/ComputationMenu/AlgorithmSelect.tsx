import * as React from "react";
import { AlgorithmType } from "../../computation";
import { getAlgorithmNameFromType } from "../../computation/logic";

export interface AlgorithmSelectProps {
    algorithm: AlgorithmType;
    onAlgorithmChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    tooltip?: React.ReactNode;
}

export class AlgorithmSelect extends React.Component<AlgorithmSelectProps> {
    render() {
        return (
            <div className="field">
                <label className="label" htmlFor="algorithm_select">
                    Valgt metode {this.props.tooltip}
                </label>
                <div className="control">
                    <div className="select is-primary is-fullwidth">
                        <select
                            title="Beregningsmetode"
                            id="algorithm_select"
                            name="calcMethod"
                            value={this.props.algorithm}
                            onChange={this.props.onAlgorithmChange}
                        >
                            <option value={AlgorithmType.SAINTE_LAGUE}>
                                {getAlgorithmNameFromType(AlgorithmType.SAINTE_LAGUE)}
                            </option>
                            <option value={AlgorithmType.D_HONDT}>
                                {getAlgorithmNameFromType(AlgorithmType.D_HONDT)}
                            </option>
                            <option value={AlgorithmType.LARGEST_FRACTION_HARE}>
                                {getAlgorithmNameFromType(AlgorithmType.LARGEST_FRACTION_HARE)}
                            </option>
                            <option value={AlgorithmType.LARGEST_FRACTION_DROOP}>
                                {getAlgorithmNameFromType(AlgorithmType.LARGEST_FRACTION_DROOP)}
                            </option>
                            <option value={AlgorithmType.LARGEST_FRACTION_HAGENBACH_BISCHOFF}>
                                {getAlgorithmNameFromType(AlgorithmType.LARGEST_FRACTION_HAGENBACH_BISCHOFF)}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

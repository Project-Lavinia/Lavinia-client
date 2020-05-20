import * as React from "react";
import { AlgorithmType } from "../../computation";
import { getAlgorithmNameFromType } from "../../computation/logic";

export interface AlgorithmSelectProps {
    algorithm: AlgorithmType;
    defaultAlgorithm: AlgorithmType;
    onAlgorithmChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    tooltip?: React.ReactNode;
}

export class AlgorithmSelect extends React.Component<AlgorithmSelectProps> {
    render() {
        const setttingWasChanged = this.props.algorithm !== this.props.defaultAlgorithm;
        return (
            <div className="field">
                <label className="label" htmlFor="algorithm_select">
                    Valgt metode {this.props.tooltip}
                </label>
                <div className="control">
                    <div className="select is-dark is-fullwidth">
                        <select
                            title="Beregningsmetode"
                            className="form-control"
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
                {setttingWasChanged && <label>Orginalt: {getAlgorithmNameFromType(this.props.defaultAlgorithm)}</label>}
            </div>
        );
    }
}

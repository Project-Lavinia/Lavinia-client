import * as React from "react";

export interface AlgorithmSelectProps {
    algorithm: number;
    onAlgorithmChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export class AlgorithmSelect extends React.Component<AlgorithmSelectProps> {
    render() {
        return (
            <div className="form-group row">
                <label className="col-sm-5 col-form-label">Algoritme</label>
                <div className="col-sm-7">
                    <select
                        className="form-control"
                        name="calcMethod"
                        value={this.props.algorithm.toString()}
                        onChange={this.props.onAlgorithmChange}
                    >
                        <option value="1">Sainte-Lagüe</option>
                        <option value="2">d'Hondt</option>>
                    </select>
                </div>
            </div>
        );
    }
}

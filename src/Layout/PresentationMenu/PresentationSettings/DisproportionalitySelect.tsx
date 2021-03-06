import * as React from "react";
import { DisproportionalityIndex } from "../../Presentation/presentation-models";

export interface DisproportionalitySelectProps {
    hidden: boolean;
    tooltip?: React.ReactNode;
    disproportionalityIndex: DisproportionalityIndex;
    changeDisproportionalityIndex: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export class DisproportionalitySelect extends React.Component<DisproportionalitySelectProps> {
    render() {
        return (
            <div hidden={this.props.hidden} className="field">
                <label className="label" htmlFor="disproportionality">
                    Disproporsjonalitetsindeks {this.props.tooltip}
                </label>
                <div className="control">
                    <div className="select is-primary is-fullwidth">
                        <select
                            id="disproportionality"
                            onChange={this.props.changeDisproportionalityIndex}
                            value={this.props.disproportionalityIndex}
                        >
                            <option key={DisproportionalityIndex.GALLAGHER} value={DisproportionalityIndex.GALLAGHER}>
                                Gallagher
                            </option>
                            <option
                                key={DisproportionalityIndex.LOOSEMORE_HANBY}
                                value={DisproportionalityIndex.LOOSEMORE_HANBY}
                            >
                                Loosemore-Hanby
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

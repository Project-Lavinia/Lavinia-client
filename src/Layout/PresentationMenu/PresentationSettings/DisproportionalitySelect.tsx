import * as React from "react";
import { DisproportionalityIndex } from "../../Presentation/presentation-models";

export interface DisproportionalitySelectProps {
    hidden: boolean;
    disproportionalityIndex: DisproportionalityIndex;
    changeDisproportionalityIndex: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export class DisproportionalitySelect extends React.Component<DisproportionalitySelectProps> {
    render() {
        return (
            <div hidden={this.props.hidden} className="form-group">
                <label htmlFor="disproportionality">Disproporsjonalitetsindeks</label>
                <select
                    id="disproportionality"
                    onChange={this.props.changeDisproportionalityIndex}
                    className="form-control"
                    value={this.props.disproportionalityIndex}
                >
                    <option
                        key={DisproportionalityIndex.LOOSEMORE_HANBY}
                        value={DisproportionalityIndex.LOOSEMORE_HANBY}
                    >
                        Loosemore-Hanby
                    </option>
                    <option key={DisproportionalityIndex.GALLAGHER} value={DisproportionalityIndex.GALLAGHER}>
                        Gallagher
                    </option>
                </select>
            </div>
        );
    }
}

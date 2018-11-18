import * as React from "react";
import { DisproportionalityIndex } from "../../Presentation/presentation-models";

export interface DisproportionalityProps {
    hidden: boolean;
    disproportionalityIndex: DisproportionalityIndex;
    changeDisproportionalityIndex: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export class Disproportionality extends React.Component<DisproportionalityProps> {
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

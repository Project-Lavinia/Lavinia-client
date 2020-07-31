import * as React from "react";

interface MergeDistrictsCheckboxProps {
    hidden: boolean;
    mergeDistricts: boolean;
    toggleMergeDistricts: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export class MergeDistrictsCheckbox extends React.Component<MergeDistrictsCheckboxProps> {
    render() {
        return (
            <div className="field" hidden={this.props.hidden}>
                <input
                        type="checkbox"
                        className="switch"
                        name="merge-setting"
                        id="merge-setting"
                        checked={this.props.mergeDistricts}
                        onChange={this.props.toggleMergeDistricts}
                    />
                <label className="checkbox" htmlFor="merge-setting">
                    Slå sammen 19 fylker til 11 fylker
                </label>
            </div>
        );
    }
}

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
                <label className="label" htmlFor="merge-setting">
                    <input
                        className="checkbox"
                        type="checkbox"
                        name="merge-setting"
                        checked={this.props.mergeDistricts}
                        onChange={this.props.toggleMergeDistricts}
                    />
                    &nbsp;Slå sammen 19 fylker (før 2020) til 11 fylker (etter 2020)
                </label>
            </div>
        );
    }
}

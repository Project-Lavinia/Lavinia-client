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
                <label className="checkbox" htmlFor="merge-setting">
                    <input
                        type="checkbox"
                        id="merge_to_11_districts_checkbox"
                        name="merge-setting"
                        checked={this.props.mergeDistricts}
                        onChange={this.props.toggleMergeDistricts}
                    />
                    &nbsp;Slå sammen 19 fylker til 11 fylker
                </label>
            </div>
        );
    }
}

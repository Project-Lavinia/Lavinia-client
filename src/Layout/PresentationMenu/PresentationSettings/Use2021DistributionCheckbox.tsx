import * as React from "react";

interface Use2021DistributionCheckboxProps {
    hidden: boolean;
    use2021Distribution: boolean;
    toggleUse2021Distribution: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export class Use2021DistributionCheckbox extends React.Component<Use2021DistributionCheckboxProps> {
    render() {
        return (
            <div className="field" hidden={this.props.hidden}>
                <label className="checkbox" htmlFor="2021-distribution-setting">
                    <input
                        type="checkbox"
                        name="2021-distribution-setting"
                        checked={this.props.use2021Distribution}
                        onChange={this.props.toggleUse2021Distribution}
                    />
                    &nbsp;Bruk fylkesdata fra 2021
                </label>
            </div>
        );
    }
}

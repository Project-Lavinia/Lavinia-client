import * as React from "react";
import { SaveComparisonButton, SaveComparisonButtonProps } from "./SaveComparisonButton";
import { ResetComparisonButtonProps, ResetComparisonButton } from "./ResetComparisonButton";

export interface ComparisonOptionsProps extends SaveComparisonButtonProps, ResetComparisonButtonProps {
    showComparison: boolean;
}

export class ComparisonOptions extends React.Component<ComparisonOptionsProps> {
    render() {
        return (
            <div hidden={!this.props.showComparison}>
                <label className="label has-text-centered">Sammenlikning</label>
                <div>
                    <ResetComparisonButton resetComparison={this.props.resetComparison} />
                    <SaveComparisonButton saveComparison={this.props.saveComparison} />
                </div>
            </div>
        );
    }
}

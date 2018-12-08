import * as React from "react";
import { Button } from "../../common";

export interface ResetComparisonButtonProps {
    resetComparison: () => void;
}

export class ResetComparisonButton extends React.Component<ResetComparisonButtonProps> {
    render() {
        return (
            <Button
                title={"Gjenopprett"}
                accessibilityLabel={"Gjenopprett sammenlikning"}
                id="resetComparison"
                onPress={this.props.resetComparison}
                type="button"
            />
        );
    }
}

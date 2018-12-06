import * as React from "react";
import { Button } from "../../common";

export interface SaveComparisonButtonProps {
    saveComparison: () => void;
}

export class SaveComparisonButton extends React.Component<SaveComparisonButtonProps> {
    render() {
        return (
            <Button
                title={"Lagre"}
                accessibilityLabel={"Lagre sammenlikning"}
                id="saveComparison"
                onPress={this.props.saveComparison}
                type="button"
            />
        );
    }
}

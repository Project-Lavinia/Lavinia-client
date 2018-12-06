import * as React from "react";
import { Button } from "../../common";

export interface SaveComparisonButtonProps {
    saveComparison: () => void;
}

export class SaveComparisonButton extends React.Component<SaveComparisonButtonProps> {
    render() {
        return (
            <div className="form-group row">
                <label htmlFor="saveComparison" className="col-sm-5 col-form-label">
                    Sammenlikning
                </label>
                <div className="col-sm-7">
                    <Button title={"Lagre"} id="saveComparison" onPress={this.props.saveComparison} type="button" />
                </div>
            </div>
        );
    }
}

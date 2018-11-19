import * as React from "react";
import { Button } from "../../common";

export interface ResetButtonProps {
    restoreToDefault: () => void;
}

export class ResetButton extends React.Component<ResetButtonProps> {
    render() {
        return (
            <div className="form-group row">
                <label htmlFor="reset" className="col-sm-5 col-form-label">
                    Historiske instillinger
                </label>
                <div className="col-sm-7">
                    <Button title={"Gjenopprett"} onPress={this.props.restoreToDefault} type="button" />
                </div>
            </div>
        );
    }
}

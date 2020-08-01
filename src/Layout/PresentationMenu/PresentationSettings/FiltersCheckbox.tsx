import * as React from "react";

interface FiltersCheckboxProps {
    hidden: boolean;
    showFilters: boolean;
    toggleShowFilters: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export class FiltersCheckbox extends React.Component<FiltersCheckboxProps> {
    render() {
        return (
            <div className="field" hidden={this.props.hidden}>
                <input
                    type="checkbox"
                    className="switch"
                    id="filters-setting"
                    name="filters-setting"
                    checked={this.props.showFilters}
                    onChange={this.props.toggleShowFilters}
                />

                <label className="checkbox" htmlFor="filters-setting">
                    Vis tabellfiltre
                </label>
            </div>
        );
    }
}

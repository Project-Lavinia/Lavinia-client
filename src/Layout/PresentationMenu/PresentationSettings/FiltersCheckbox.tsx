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
                <label className="label" htmlFor="filters-setting">
                    <input
                        className="checkbox"
                        type="checkbox"
                        name="filters-setting"
                        checked={this.props.showFilters}
                        onChange={this.props.toggleShowFilters}
                    />
                    &nbsp;Vis tabellfiltere
                </label>
            </div>
        );
    }
}

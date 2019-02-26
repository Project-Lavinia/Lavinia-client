import * as React from "react";

interface FiltersCheckboxProps {
    hidden: boolean;
    showFilters: boolean;
    toggleShowFilters: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export class FiltersCheckbox extends React.Component<FiltersCheckboxProps> {
    render() {
        return (
            <div className="form-group mb-3" hidden={this.props.hidden}>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="filters-setting"
                        checked={this.props.showFilters}
                        onChange={this.props.toggleShowFilters}
                    />
                    <label className="form-check-label" htmlFor="filters-setting">
                        Vis filtere
                    </label>
                </div>
            </div>
        );
    }
}

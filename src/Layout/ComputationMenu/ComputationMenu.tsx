import * as React from "react";
import { SmartNumericInput, Button } from "../../common";
import * as style from "./ComputationMenu.css";
import { ElectionType, Election } from "../../requested-data/requested-data-models";
import { ComputationPayload, AlgorithmType } from "../../computation";
import { getAlgorithmType } from "../../computation/logic";
import { ComputationMenuPayload } from "./computation-menu-models";
import { YearSelect } from "./YearSelect";
import { AlgorithmSelect } from "./AlgorithmSelect";
import { AutoComputeCheckbox } from "./AutoComputeCheckbox";

export interface ComputationMenuProps {
    electionType: ElectionType;
    settingsPayload: ComputationMenuPayload;
    computationPayload: ComputationPayload;
    updateCalculation: (computationPayload: ComputationPayload, autoCompute: boolean, forceCompute: boolean) => any;
    updateSettings: (settingsPayload: ComputationMenuPayload) => any;
    toggleAutoCompute: (autoCompute: boolean) => any;
    resetToHistoricalSettings: (settingsPayload: ComputationMenuPayload, election: Election) => any;
}

export class ComputationMenu extends React.Component<ComputationMenuProps, {}> {
    shouldHideFirstDivisor(): boolean {
        return this.props.computationPayload.algorithm === AlgorithmType.DHondt;
    }
    onYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = parseInt(event.target.value);
        const election = this.props.electionType.elections.find((election) => election.year === year);
        if (election !== undefined) {
            this.props.updateCalculation(
                {
                    ...this.props.computationPayload,
                    election
                },
                this.props.settingsPayload.autoCompute,
                false
            );
            this.props.updateSettings({
                ...this.props.settingsPayload,
                year: event.target.value
            });
        }
    };
    onAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const algorithm = parseInt(event.target.value);
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                algorithm: getAlgorithmType(algorithm)
            },
            this.props.settingsPayload.autoCompute,
            false
        );
        this.props.updateSettings({
            ...this.props.settingsPayload,
            algorithm
        });
    };
    onFirstDivisorChange = (stringValue: string, numericValue: number) => {
        this.props.updateSettings({
            ...this.props.settingsPayload,
            firstDivisor: stringValue
        });
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                firstDivisor: numericValue
            },
            this.props.settingsPayload.autoCompute,
            false
        );
    };
    onThresholdChange = (stringValue: string, numericValue: number) => {
        this.props.updateSettings({
            ...this.props.settingsPayload,
            electionThreshold: stringValue
        });
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                electionThreshold: numericValue
            },
            this.props.settingsPayload.autoCompute,
            false
        );
    };
    onLevelingSeatsChange = (stringValue: string, numericValue: number) => {
        this.props.updateSettings({
            ...this.props.settingsPayload,
            levelingSeats: stringValue
        });
        this.props.updateCalculation(
            {
                ...this.props.computationPayload,
                levelingSeats: numericValue
            },
            this.props.settingsPayload.autoCompute,
            false
        );
    };
    toggleAutoCompute = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.toggleAutoCompute(event.target.checked);
        this.computeManually();
    };
    computeManually = () => {
        const year = parseInt(this.props.settingsPayload.year);
        const election = this.props.electionType.elections.find((e) => e.year === year);
        if (election !== undefined && election !== null) {
            this.props.updateCalculation(
                {
                    election,
                    algorithm: getAlgorithmType(this.props.settingsPayload.algorithm),
                    firstDivisor: parseFloat(this.props.settingsPayload.firstDivisor),
                    electionThreshold: parseFloat(this.props.settingsPayload.electionThreshold),
                    districtSeats: parseInt(this.props.settingsPayload.districtSeats),
                    levelingSeats: parseInt(this.props.settingsPayload.levelingSeats)
                },
                this.props.settingsPayload.autoCompute,
                true
            );
        }
    };
    restoreToDefault = () => {
        this.props.resetToHistoricalSettings(this.props.settingsPayload, this.props.computationPayload.election);
    };

    render() {
        return (
            <div className={style.menu}>
                <h1 className="h2">Stortingsvalg</h1>
                <form>
                    <YearSelect
                        electionYears={this.props.settingsPayload.electionYears}
                        onYearChange={this.onYearChange}
                        year={this.props.settingsPayload.year}
                    />
                    <AlgorithmSelect
                        algorithm={this.props.settingsPayload.algorithm}
                        onAlgorithmChange={this.onAlgorithmChange}
                    />
                    <SmartNumericInput
                        hidden={this.shouldHideFirstDivisor()}
                        name="firstDivisor"
                        title="Første delingstall"
                        value={this.props.settingsPayload.firstDivisor}
                        onChange={this.onFirstDivisorChange}
                        min={1}
                        max={5}
                        defaultValue={this.props.computationPayload.election.firstDivisor}
                        integer={false}
                        slider={true}
                    />
                    <SmartNumericInput
                        name="electionThreshold"
                        title="Sperregrense"
                        value={this.props.settingsPayload.electionThreshold}
                        onChange={this.onThresholdChange}
                        min={0}
                        max={15}
                        defaultValue={this.props.computationPayload.election.threshold}
                        integer={false}
                        slider={true}
                    />
                    <SmartNumericInput
                        name="levelingSeats"
                        title="Utjevningsmandater"
                        value={this.props.settingsPayload.levelingSeats}
                        onChange={this.onLevelingSeatsChange}
                        min={0}
                        max={100}
                        defaultValue={this.props.computationPayload.election.levelingSeats}
                        integer={true}
                        slider={true}
                    />
                    <AutoComputeCheckbox
                        autoCompute={this.props.settingsPayload.autoCompute}
                        computeManually={this.computeManually}
                        toggleAutoCompute={this.toggleAutoCompute}
                    />
                    <div className="form-group row">
                        <label htmlFor="reset" className="col-sm-5 col-form-label">
                            Historiske instillinger
                        </label>
                        <div className="col-sm-7">
                            <Button title={"Gjenopprett"} onPress={this.restoreToDefault} type="button" />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

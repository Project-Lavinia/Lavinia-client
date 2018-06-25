export enum RequestedDataAction {
    InitializeRequestedData = "INITIALIZE_REQUESTED_DATA"
}

export enum SettingAction {
    InitializeSettings = "INITIALIZE_SETTINGS",
    UpdateSettings = "UPDATE_SETTINGS",
    ToggleAutoCompute = "TOGGLE_AUTO_COMPUTE"
}

export enum ComputationAction {
    InitializeComputation = "INITIALIZE_COMPUTATION",
    UpdateResults = "UPDATE_CALCULATION",
}

export enum PresentationAction {
    InitializePresentation = "INITIALIZE_PRESENTATION",
    ChangePresentation = "CHANGE_PRESENTATION",
    ChangeDecimals = "CHANGE_DECIMALS",
    ShowPartiesNoSeats = "SHOW_PARTIES_WITH_NO_SEATS"
}
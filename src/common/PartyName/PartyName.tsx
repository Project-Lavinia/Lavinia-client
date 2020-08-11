import * as React from "react";

export interface PartyNameProps {
    name: string;
    partyMap: _.Dictionary<string> | undefined;
}

export class PartyName extends React.Component<PartyNameProps, {}> {
    render() {
        const partyMap = this.props.partyMap;
        const name = this.props.name;
        const displayName = partyMap ? partyMap[name] : name;
        return <b>{displayName}</b>;
    }
}

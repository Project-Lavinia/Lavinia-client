import * as React from "react";

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="nav_container">
                <ul>
                    <li className="laviniaLogo">
                        <a href="">Lavinia</a>
                    </li>
                    <li>
                        <a target="_blank" href="/swagger">
                            API
                        </a>
                    </li>
                    <li>
                        <a href="">Om Lavinia</a>
                    </li>
                    <li>
                        <a href="">Hjelp</a>
                    </li>
                </ul>
            </div>
        );
    }
}

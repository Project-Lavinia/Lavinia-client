import * as React from "react";
import * as style from "./Navigation.css";

export class Navigation extends React.Component<{}, {}> {
    public render() {
        return (
            <div className={style.container}>
                <ul>
                    <li className={style.customHeader}>
                        <a href="">Lavinia</a>
                    </li>
                    <li>
                        <a target="_blank" href="https://mandater-testing.azurewebsites.net/swagger">
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

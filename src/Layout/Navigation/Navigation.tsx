import * as React from "react";
import { LaviniaSVGLogo } from "../../common";

export interface NavigationProps {
    hamburgerExpanded?: boolean;
    toggleHamburger?: (hamburgerExpanded: boolean) => void;
}

export class Navigation extends React.Component<NavigationProps> {
    handleHamburgerClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        this.props.toggleHamburger!(this.props.hamburgerExpanded!);
    };
    public render() {
        const wikiUrl = process.env.WIKI;
        const swaggerUiUrl = process.env.SWAGGERUI;
        const style = {
            menuButton: "navbar-burger burger",
            menu: "navbar-menu",
        };
        if (this.props.hamburgerExpanded) {
            style.menuButton += " is-active";
            style.menu += " is-active";
        }
        return (
            <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="./">
                        <LaviniaSVGLogo title={"LAVINIA"} />
                    </a>

                    <a
                        role="button"
                        className={style.menuButton}
                        aria-label="menu"
                        aria-expanded={this.props.hamburgerExpanded}
                        onClick={this.handleHamburgerClick}
                    >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </a>
                </div>

                <div id="toggleable-menu" className={style.menu}>
                    <div className="navbar-start">
                        <a target="_blank" href={wikiUrl} rel="noopener noreferrer" className="navbar-item">
                            Hjelp
                        </a>

                        <div className="navbar-item has-dropdown is-hoverable">
                            <a
                                className="navbar-link"
                                target="_blank"
                                href={wikiUrl?.concat("#Lavinia")}
                                rel="noopener noreferrer"
                            >
                                Om Lavinia
                            </a>
                            <div className="navbar-dropdown">
                                <a
                                    target="_blank"
                                    href={swaggerUiUrl}
                                    rel="noopener noreferrer"
                                    className="navbar-item"
                                >
                                    API
                                </a>
                                <a  className="navbar-item"
                                    target="_blank"
                                    href="https://www.github.com/Project-Lavinia/"
                                    rel="noopener noreferrer"
                                >Github</a>
                                <hr className="navbar-divider" />
                                <a
                                    target="_blank"
                                    href="https://www.github.com/Project-Lavinia/Lavinia-Client/issues"
                                    rel="noopener noreferrer"
                                    className="navbar-item"
                                >
                                    Gi en tilbakemelding
                                </a>
                                <a
                                    target="_blank"
                                    href="https://www.github.com/Project-Lavinia"
                                    rel="noopener noreferrer"
                                    className="navbar-item"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

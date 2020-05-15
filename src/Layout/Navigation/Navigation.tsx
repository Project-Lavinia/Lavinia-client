import * as React from "react";
import LaviniaLogo from "../../assets/lavinia_logo.png";

export interface NavigationProps {
    hamburgerExpanded?: boolean;
    toggleHamburger?: (hamburgerExpanded: boolean) => void;
}

export class Navigation extends React.Component<NavigationProps> {
    handleHamburgerClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        this.props.toggleHamburger!(this.props.hamburgerExpanded!);
    };
    public render() {
        const style = {
            menuButton: "navbar-burger burger",
            menu: "navbar-menu",
        };
        if (this.props.hamburgerExpanded) {
            style.menuButton += " is-active";
            style.menu += " is-active";
        }
        return (
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="./">
                        <img src={LaviniaLogo} width="112" height="28" />
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
                        <a className="navbar-item">Home</a>

                        <a target="_blank" href="https://project-lavinia.github.io/" rel="noopener noreferrer" className="navbar-item">
                            Hjelp
                        </a>

                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">Mer</a>

                            <div className="navbar-dropdown">
                                <a
                                    target="_blank"
                                    href="https://www.github.com/Project-Lavinia/"
                                    rel="noopener noreferrer"
                                    className="navbar-item"
                                >
                                    Om Lavinia
                                </a>
                                <a target="_blank" href={process.env.SWAGGERUI} rel="noopener noreferrer" className="navbar-item">
                                    API
                                </a>
                                <hr className="navbar-divider" />
                                <a
                                    target="_blank"
                                    href="https://www.github.com/Project-Lavinia/Lavinia-Client/issues"
                                    rel="noopener noreferrer"
                                    className="navbar-item"
                                >
                                    Gi en tilbakemelding
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

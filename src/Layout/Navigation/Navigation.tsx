import * as React from "react";
import * as LaviniaLogo from "../../assets/lavinia_logo.png";

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
                    <a className="navbar-item" href="https://bulma.io">
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

                        <a target="_blank" href="https://www.github.com/Project-Lavinia/wiki" className="navbar-item">
                            Hjelp
                        </a>

                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">Mer</a>

                            <div className="navbar-dropdown">
                                <a
                                    target="_blank"
                                    href="https://www.github.com/Project-Lavinia/"
                                    className="navbar-item"
                                >
                                    Om Lavinia
                                </a>
                                <a href={process.env.SWAGGERUI} className="navbar-item">
                                    API
                                </a>
                                <hr className="navbar-divider" />
                                <a
                                    href="https://www.github.com/Project-Lavinia/Lavinia-Client/issues"
                                    className="navbar-item"
                                >
                                    Gi en tilbakemelding
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <a className="button is-primary">
                                    <strong>Sign up</strong>
                                </a>
                                <a className="button is-light">Log in</a>
                            </div>
                        </div>
                    </div> */}
                </div>
            </nav>
        );
    }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import AppToolbar from "../../containers/AppToolbar";
import BackgroundsPage from "../../containers/pages/BackgroundsPage";
import SpritesPage from "../../containers/pages/SpritesPage";
import DialoguePage from "../../containers/pages/DialoguePage";
import BuildPage from "../../containers/pages/BuildPage";
import WorldPage from "../../containers/pages/WorldPage";
import UIPage from "../../containers/pages/UIPage";
import MusicPage from "../../containers/pages/MusicPage";
import l10n from "../../lib/helpers/l10n";

class App extends Component {
  constructor() {
    super();
    this.state = {
      blur: false
    };
  }

  componentDidMount() {
    window.addEventListener("blur", this.onBlur);
    window.addEventListener("focus", this.onFocus);
  }

  onBlur = () => {
    this.setState({ blur: true });
  };

  onFocus = () => {
    this.setState({ blur: false });
  };

  render() {
    const { section } = this.props;
    const { blur } = this.state;
    return (
      <div
        className={cx("App", {
          "App--Blur": blur,
          "App--RTL": l10n("RTL") === true
        })}
      >
        <AppToolbar />
        <div className="App__Content">
          {section === "world" && <WorldPage />}
          {section === "backgrounds" && <BackgroundsPage />}
          {section === "sprites" && <SpritesPage />}
          {section === "ui" && <UIPage />}
          {section === "music" && <MusicPage />}
          {section === "dialogue" && <DialoguePage />}
          {section === "build" && <BuildPage />}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  section: PropTypes.oneOf([
    "world",
    "backgrounds",
    "sprites",
    "ui",
    "music",
    "dialogue",
    "build"
  ]).isRequired
};

function mapStateToProps(state) {
  return {
    section: state.navigation.section
  };
}

export default connect(mapStateToProps)(App);

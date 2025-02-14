import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { connect } from "react-redux";
import l10n from "../../lib/helpers/l10n";
import { FormField } from "../library/Forms";
import * as actions from "../../actions";
import { ProjectShape, SettingsShape } from "../../reducers/stateShape";

class CustomPalettePicker extends Component {
  constructor(props) {
    super(props);

    const { project } = this.props;
    const { settings } = project;

    this.state = {
      selectedPalette: -1,
      currentR: 0,
      currentG: 0,
      currentB: 0,
      whiteHex: settings.customColorsWhite || "E0F8D0",
      lightHex: settings.customColorsLight || "88C070",
      darkHex: settings.customColorsDark || "306850",
      blackHex: settings.customColorsBlack || "081820",
      currentCustomHex: ""
    };
  }

  paletteSelect = e => {    
    if (e.target.id == "customColor_0")
    {
      if (this.state.selectedPalette == 0) 
      {
        this.setState({selectedPalette: -1});
      }
      else 
      {
        this.setState({selectedPalette: 0});
        this.applyHexToState(this.state.whiteHex);
      }
    } 
    else if (e.target.id == "customColor_1")
    {
      if (this.state.selectedPalette == 1) 
      {
        this.setState({selectedPalette: -1});
      }
      else
      {
        this.setState({selectedPalette: 1});
        this.applyHexToState(this.state.lightHex);
      }
    }
    else if (e.target.id == "customColor_2")
    {
      if (this.state.selectedPalette == 2)
      { 
        this.setState({selectedPalette: -1});
      }
      else 
      {
        this.setState({selectedPalette: 2});
        this.applyHexToState(this.state.darkHex);
      }
    }
    else if (e.target.id == "customColor_3")
    {
      if (this.state.selectedPalette == 3) 
      {
        this.setState({selectedPalette: -1});
      }
      else
      {
        this.setState({selectedPalette: 3});
        this.applyHexToState(this.state.blackHex);
      }
    } 
  }

  applyHexToState(hex)
  {
    var r = this.hexToDecimal(hex.substring(0,2)) / 8;
    var g = this.hexToDecimal(hex.substring(2,4)) / 8;
    var b = this.hexToDecimal(hex.substring(4)) / 8;

    if (r > 31) r = 31;
    if (g > 31) g = 31;
    if (b > 31) b = 31;

    this.setState({ currentR: Math.floor(r), 
                    currentG: Math.floor(g),
                    currentB: Math.floor(b)});

    return {
      r: r,
      g: g,
      b: b
    }
  }

  decimalToHexString(number) {
    var ret = number.toString(16).toUpperCase();
    return ret.length == 1 ? "0" + ret : ret;
  }

  hexToDecimal(str) {
    return parseInt("0x" + str);
  }

  setCurrentColor(r, g, b) {
    const { editProjectSettings } = this.props;

    const hexString = this.decimalToHexString(r * 8) + 
                      this.decimalToHexString(g * 8) + 
                      this.decimalToHexString(b * 8);

    if (this.state.selectedPalette == 0)
    {    
      this.setState({ whiteHex: hexString });
      editProjectSettings({ customColorsWhite: hexString });
    } 
    else if (this.state.selectedPalette == 1)
    {
      this.setState({ lightHex: hexString });
      editProjectSettings({ customColorsLight: hexString });
    }
    else if (this.state.selectedPalette == 2)
    {
      this.setState({ darkHex: hexString });
      editProjectSettings({ customColorsDark: hexString });
    }
    else if (this.state.selectedPalette == 3)
    {
      this.setState({ blackHex: hexString });
      editProjectSettings({ customColorsBlack: hexString });
    }
  }

  hexChange = e => {
    this.setState({currentCustomHex: e.target.value});
  }

  colorChange = e => {
    const min = 0;
    const max = 31;
    const value = Math.max(min, Math.min(max, e.currentTarget.value))
    
    if (e.target.id === "colorR")
    {
      this.setState({currentR: value || ""});
      this.setCurrentColor(value, this.state.currentG, this.state.currentB);
    } 
    else if (e.target.id === "colorG")
    {
      this.setState({currentG: value || ""});
      this.setCurrentColor(this.state.currentR, value, this.state.currentB);
    }
    else if (e.target.id === "colorB")
    {
      this.setState({currentB: value || ""});
      this.setCurrentColor(this.state.currentR, this.state.currentG, value);
    }
  }

  handleHexConvertClick = e =>  {
    var hex = this.state.currentCustomHex.replace('#', '');
    
    if (hex.length == 6)
    {
      var result = this.applyHexToState(hex);
      this.setCurrentColor(result.r, result.g, result.b);
      this.setState({currentCustomHex: ""});
    }
    else
    {
      // Show error?
    }
  }

  handleDefaultPaletteClick = e =>  {
    var result;

    if (this.state.selectedPalette == 0)
    {
      result = this.applyHexToState("E0F8D0"); // White
    }
    else if (this.state.selectedPalette == 1)
    {
      result = this.applyHexToState("88C070"); // Light Green
    } 
    else if (this.state.selectedPalette == 2)
    {
      result = this.applyHexToState("306850"); // Dark Green
    } 
    else if (this.state.selectedPalette == 3)
    {
      result = this.applyHexToState("081820"); // Black
    }

    this.setCurrentColor(result.r, result.g, result.b);
  }

  render() {
    const { id } = this.props;

    return (
      <span>
        <div className="CustomPalettePicker">

          <div className="CustomPalettePicker__Legend">
            Original<br/>Custom
          </div>

          <label htmlFor="customColor_0" title={l10n('FIELD_COLOR1_NAME')}>
            <input id="customColor_0" type="checkbox" onChange={this.paletteSelect.bind()} checked={this.state.selectedPalette == 0} />
            <div className="CustomPalettePicker__Button CustomPalettePicker__Button--Left" style={{backgroundImage: `linear-gradient(#e0f8cf 48.5%, var(--input-border-color) 49.5%, #${this.state.whiteHex} 50%)`}}>
              &nbsp;
            </div>
          </label>
          <label htmlFor="customColor_1" title={l10n('FIELD_COLOR2_NAME')}>
            <input id="customColor_1" type="checkbox" onChange={this.paletteSelect.bind()} checked={this.state.selectedPalette == 1} />
            <div className="CustomPalettePicker__Button CustomPalettePicker__Button--Middle" style={{backgroundImage: `linear-gradient(#86c06c 48.9%, var(--input-border-color) 49.5%, #${this.state.lightHex} 50%)`}}>
              &nbsp;
            </div>
          </label>
          <label htmlFor="customColor_2" title={l10n('FIELD_COLOR3_NAME')}>
            <input id="customColor_2" type="checkbox" onChange={this.paletteSelect.bind()} checked={this.state.selectedPalette == 2} />
            <div className="CustomPalettePicker__Button CustomPalettePicker__Button--Middle" style={{backgroundImage: `linear-gradient(#306850 48.9%, var(--input-border-color) 49.5%, #${this.state.darkHex} 50%)`}}>
              &nbsp;
            </div>
          </label>
          <label htmlFor="customColor_3" title={l10n('FIELD_COLOR4_NAME')}>
            <input id="customColor_3" type="checkbox" onChange={this.paletteSelect.bind()} checked={this.state.selectedPalette == 3} />
            <div className="CustomPalettePicker__Button CustomPalettePicker__Button--Right" style={{backgroundImage: `linear-gradient(#071821 48.9%, var(--input-border-color) 49.5%, #${this.state.blackHex} 50%)`}}>
              &nbsp;
            </div>
          </label>
        </div>
      
        <div id="CustomPaletteEdit" style={this.state.selectedPalette == -1 ? {display: "none"} : {}}>
          <FormField thirdWidth>
            <label htmlFor="colorR">
              {l10n("FIELD_CUSTOM_RED")}<small> (0-31)</small>
              <input
                id="colorR"
                type="number"
                value={this.state.currentR}
                min={0}
                max={31}
                placeholder={0}
                onChange={this.colorChange.bind()}
              />
            </label>
          </FormField>

          <FormField thirdWidth>
            <label htmlFor="colorG">
              {l10n("FIELD_CUSTOM_GREEN")}<small> (0-31)</small>
              <input
                id="colorG"
                type="number"
                value={this.state.currentG}
                min={0}
                max={31}
                placeholder={0}
                onChange={this.colorChange.bind()}
              />
            </label>
          </FormField>

          <FormField thirdWidth>
            <label htmlFor="colorB">
              {l10n("FIELD_CUSTOM_BLUE")}<small> (0-31)</small>
              <input
                id="colorB"
                type="number"
                value={this.state.currentB}
                min={0}
                max={31}
                placeholder={0}
                onChange={this.colorChange.bind()}
              />
            </label>
          </FormField>        
        
          <FormField halfWidth>
            <label htmlFor="colorHex">
              <input
                id="colorHex"
                type="text"
                maxLength="7"
                placeholder="#000000"
                value={this.state.currentCustomHex}
                onChange={this.hexChange.bind()}
              />
            </label>
          </FormField>

          <FormField halfWidth>
            <button 
              id="btnConvertHex" 
              className="Button"
              style={{width: "100%"}}
              onClick={this.handleHexConvertClick}>
              {l10n("FIELD_CUSTOM_HEX")}
            </button>
          </FormField>

          <FormField>
            <button 
              id="btnDefaultPalette" 
              className="Button" 
              style={{width: "100%"}}
              onClick={this.handleDefaultPaletteClick}>
              {l10n("FIELD_CUSTOM_DEFAULT")}
            </button>
          </FormField>
        </div>
      </span>
    );
  }
}

CustomPalettePicker.propTypes = {
  id: PropTypes.string,
  project: ProjectShape.isRequired
};

CustomPalettePicker.defaultProps = {
  id: undefined
};

function mapStateToProps(state, props) {
  const project = state.entities.present.result;
  return {
    project
  };
}

const mapDispatchToProps = {
  editProjectSettings: actions.editProjectSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomPalettePicker);

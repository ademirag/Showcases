import React from "react";
import { connect } from "react-redux";
import { TextInput, Platform, View } from "react-native";
import { setKeyValue, setValidation } from "./ad-reducer";
import RNPickerSelect from "react-native-picker-select";
import AdValidation from "./ad-validation";
import AdIcon from "./ad-icon";

const thisProps = ["fieldName", "validation", "fieldTitle"];

class AdPicker extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      curLabel: null
    };
  }

  validate(val) {
    let isValid = this.props.validation
      ? AdValidation.validate(val, this.props.validation, this.props.fieldTitle)
      : true;

    return isValid;
  }

  onChange(val) {
    let isValid = this.validate(this.props.items[val]);

    if (
      typeof isValid === "string" &&
      this.props.validation.indexOf("showValidation:onChange") !== -1
    ) {
      this.showErrorMessage(isValid);
    }

    if (val > 0) {
      this.setState({
        curLabel: this.props.items[val - 1].label
      });
      this.props.setField(
        this.props.fieldName,
        this.props.items[val - 1].value,
        isValid
      );

      if (this.props.onChange) {
        this.props.onChange(this.props.items[val - 1].value);
      }
    } else {
      this.props.setField(this.props.fieldName, null, isValid);

      if (this.props.onChange) {
        this.props.onChange(null);
      }
    }
  }

  showErrorMessage(msg) {
    alert(msg);
  }

  getValue() {
    let v = this.props.fields[this.props.fieldName];

    v = typeof v !== "undefined" ? v : null;

    return v;
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1 && k !== "style") {
        nativeProps[k] = this.props[k];
      }
    }

    let v = this.getValue();

    const placeholder = {
      label: this.props.fieldTitle,
      value: null
    };

    const props = {
      items: this.props.items,
      onValueChange: (val, index) => this.onChange(index),
      placeholder: placeholder
    };

    if (typeof v === "number") {
      v = this.state.curLabel;
    } else {
      v = this.props.fieldTitle;
    }

    return (
      <RNPickerSelect {...props}>
        <View
          style={{
            alignItems: "center"
          }}
        >
          <TextInput
            style={[
              Platform.OS === "ios"
                ? this.props.style.inputIOS
                : this.props.style.inputAndroid,
              {
                width: "100%",
                top: 0,
                right: 0
              }
            ]}
            value={v}
            editable={false}
            {...nativeProps}
          />
        </View>
        <AdIcon
          style={[
            Platform.OS === "ios"
              ? this.props.style.inputIOS
              : this.props.style.inputAndroid,
            { borderWidth: 0, position: "absolute", right: 0 }
          ]}
          name={"caretDown"}
        />
      </RNPickerSelect>
    );
  }
}

const mapStateToProps = state => {
  return {
    fields: state.fields
  };
};

const mapDispatchToProps = dispatch => ({
  setField: (n, v, iv) => {
    dispatch(setKeyValue("fields", n, v));
    dispatch(setValidation(n, iv));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdPicker);

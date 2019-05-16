import React from "react";
import { connect } from "react-redux";
import { TextInput, View } from "react-native";
import { directSubmit } from "./ad-reducer";

const thisProps = ["style", "placeholder", "placeholderTextColor"];

import AdIcon from "./ad-icon";

class AdSearchFilter extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(text) {
    let o = {};
    o[this.props.fieldName] = text;
    this.props.submit(this.props.formName, o);
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    return (
      <View
        {...nativeProps}
        style={[this.props.style.view, { flexDirection: "row" }]}
      >
        <AdIcon name={"search"} style={this.props.style.icon} />
        <TextInput
          placeholder={this.props.fieldTitle}
          style={[this.props.style.input, { flex: 1 }]}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          onChangeText={text => this.onChange(text)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  submit: (fn, q) => {
    dispatch(directSubmit(fn, q));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdSearchFilter);

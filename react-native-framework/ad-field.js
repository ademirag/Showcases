import React from "react";
import { connect } from "react-redux";
import { View, FlatList, Text } from "react-native";
import { directSubmit } from "./ad-reducer";

const thisProps = ["formName", "fieldName", "style", "label"];

class AdField extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);

    this.state = {
      data: this.props.fields[this.props.fieldName],
      mode: this.props.formState
        ? this.props.formState[this.props.formName]
        : this.props.formState
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.fields[this.props.fieldName] !== this.state.data) {
      this.setState({
        data: this.props.fields[this.props.fieldName]
      });
    }

    if (
      this.props.formState &&
      this.props.formState[this.props.formName] !== this.state.formState
    ) {
      this.setState({
        formState: this.props.formState[this.props.formName]
      });
    }
  }

  onSelect(key) {
    console.log(key);
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    return (
      <View {...nativeProps} style={this.props.style.view}>
        <Text style={this.props.style.label}>{this.props.label}</Text>
        {this.state.formState !== "edit" && <Text>{this.state.data}</Text>}
        {this.state.formState === "edit" && this.props.children}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    formState: state.__formState,
    fields: state.fields
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdField);

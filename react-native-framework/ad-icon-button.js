/*

A button with an icon

*/

import React from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity, Text } from "react-native";
import AdIcon from "./ad-icon";

class AdIconButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={this.props.style.view}
      >
        <AdIcon name={this.props.name} style={this.props.style.icon} />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    fields: state.fields
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdIconButton);

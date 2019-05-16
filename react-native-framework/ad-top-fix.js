import React from "react";
import { View } from "react-native";
import { isIphoneX } from "./ad-utils";

export default class AdTopFix extends React.Component {
  render() {
    if (isIphoneX()) {
      return <View style={[this.props.style, { height: 44, width: "100%" }]} />;
    } else {
      return null;
    }
  }
}

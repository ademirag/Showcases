import React from "react";
import { connect } from "react-redux";
import { View, FlatList } from "react-native";
import { directSubmit, setKeyValue } from "./ad-reducer";

const thisProps = [
  "formName",
  "refreshing",
  "navigate",
  "itemComponent",
  "itemView"
];

class AdListView extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onScroll = this.onScroll.bind(this);

    this.element = null;

    this.state = {
      data: this.props.data[this.props.formName],
      iteration: 0,
      refreshing: false
    };
  }

  componentDidMount() {
    if (
      typeof this.props.cache[this.props.formName + ".scrollPos"] !==
      "undefined"
    ) {
      this.element.scrollToOffset({
        offset: Number(this.props.cache[this.props.formName + ".scrollPos"]),
        animated: false
      });
    } else {
      setTimeout(() => {
        this.props.submit(this.props.formName);
      }, 500);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data[this.props.formName] !== this.state.data) {
      this.setState({
        data: this.props.data[this.props.formName],
        refreshing: false
      });
    }
    if (this.props.itemComponent != prevProps.itemComponent) {
      this.setState({
        iteration: this.state.iteration + 1
      });
    }
  }

  onSelect(key) {
    if (this.props.navigate) {
      let fieldName = this.props.itemView + ".key";
      this.props.setField(fieldName, key);

      this.props.navigate(this.props.itemView);
    }
  }

  onRefresh() {
    this.props.submit(this.props.formName);
    this.setState({
      refreshing: true
    });
  }

  onScroll(e) {
    this.props.cacheIt(this.props.formName, e.nativeEvent.contentOffset.y);
  }

  render() {
    let nativeProps = {};

    for (let k in this.props) {
      if (thisProps.indexOf(k) === -1) {
        nativeProps[k] = this.props[k];
      }
    }

    let Item = this.props.itemComponent;

    let refreshHandle;

    if (this.props.refreshing) {
      refreshHandle = this.onRefresh;
    }

    return (
      <View {...nativeProps}>
        <FlatList
          ref={el => (this.element = el)}
          extraData={this.state.iteration}
          removeClippedSubviews={true}
          data={this.state.data}
          onRefresh={refreshHandle}
          onScroll={this.onScroll}
          scrollEventThrottle={100}
          refreshing={this.state.refreshing}
          keyExtractor={item => String(item.key)}
          renderItem={({ item }) => (
            <Item item={item} onSelect={() => this.onSelect(item.key)} />
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.formData,
    cache: state.cache
  };
};

const mapDispatchToProps = dispatch => ({
  submit: fn => {
    dispatch(directSubmit(fn));
  },
  setField: (fn, v) => {
    dispatch(setKeyValue("fields", fn, v));
  },
  cacheIt: (fn, v) => {
    dispatch(setKeyValue("cache", fn + ".scrollPos", v));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdListView);

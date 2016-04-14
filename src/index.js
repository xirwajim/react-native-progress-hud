'use strict';

var React = require('react-native');
var tweenState = require('react-tween-state');

var {
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
  } = React;

var styles = require('./styles');
var images = require('./images');

var SPIN_DURATION = 1000;


var ProgressHUD = React.createClass({
  mixins: [tweenState.Mixin],

  propTypes: {
    isDismissible: React.PropTypes.bool,
    isVisible: React.PropTypes.bool,
    color: React.PropTypes.string,
    textColor: React.PropTypes.string,
    fontName: React.PropTypes.string,
    viewColor: React.PropTypes.string,
    overlayColor: React.PropTypes.string
  },

  showProgressHUD(text) {

    if(typeof text !='undefind'){
      this.setState({
        is_hud_visible: true,
        text:text
      });
      return
    }
    this.setState({
      is_hud_visible: true,
    });

  },

  dismissProgressHUD() {
    this.setState({
      is_hud_visible: false
    });
  },

  getDefaultProps() {
    return {
      isDismissible: false,
      color: '#fff',
      textColor: '#fff',
      fontName: null,
      overlayColor: 'rgba(0, 0, 0, 0.11)',
      viewColor: 'rgba(0, 0, 0, 0.9)',
      is_hud_visible: false
    };
  },

  getInitialState() {
    return {
      rotate_deg: 0
    };
  },

  componentDidMount() {
    // Kick off rotation animation
    this._rotateSpinner();

    // Set rotation interval
    this.interval = setInterval(() => {
      this._rotateSpinner();
    }, SPIN_DURATION);
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  _rotateSpinner() {
    this.tweenState('rotate_deg', {
      easing: tweenState.easingTypes.linear,
      duration: SPIN_DURATION,
      endValue: this.state.rotate_deg === 0 ? 360 : this.state.rotate_deg + 360
    });
  },

  _clickHandler() {
    if (this.props.isDismissible) {
      this.dismissProgressHUD();
    }
  },

  render() {
    // Return early if not visible
    if (!this.state.is_hud_visible) {
      return <View />;
    }

    // Set rotation property value
    var deg = Math.floor(
        this.getTweeningValue('rotate_deg')
      ).toString() + 'deg';


    let text ;
    if(this.state.text){
      text =<Text style={[styles.text_style,{fontFamily:this.props.fontName,color:this.props.textColor}]}>{this.state.text}</Text>;
    }else{

    }

    return (
      /*jshint ignore:start */
      <TouchableHighlight
        key="ProgressHUD"
        style={[styles.overlay, {
          backgroundColor: this.props.overlayColor
        }]}
        onPress={this._clickHandler}
        underlayColor={this.props.overlayColor}
        activeOpacity={1}
      >
        <View
          style={[styles.container, {
            left: this.getTweeningValue('left'),
            backgroundColor: this.props.viewColor
          }]}
        >
          <Image
            style={[styles.spinner, {
              backgroundColor: this.props.color,
              transform: [
                {rotate: deg}
              ]
            }]}
            source={{
              uri: 'data:image/png;base64,' + images['2x'],
              isStatic: true
            }}
          >
            <View style={[styles.inner_spinner,{ backgroundColor:"rgba(0, 0, 0, 1)"}]}>
            </View>
          </Image>
          {text}
        </View>
      </TouchableHighlight>
      /*jshint ignore:end */
    );
  }
});


module.exports = ProgressHUD;

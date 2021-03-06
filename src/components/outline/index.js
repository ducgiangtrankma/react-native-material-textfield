import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import { View, Animated, I18nManager, Text } from 'react-native';

import styles, { borderRadius } from './styles';

export default class Line extends PureComponent {
  static defaultProps = {
    lineType: 'solid',
    disabled: false,
    restricted: false,
  };

  static propTypes = {
    lineType: PropTypes.oneOf(['solid', 'none']),

    disabled: PropTypes.bool,
    restricted: PropTypes.bool,

    tintColor: PropTypes.string,
    baseColor: PropTypes.string,
    errorColor: PropTypes.string,

    lineWidth: PropTypes.number,
    activeLineWidth: PropTypes.number,
    disabledLineWidth: PropTypes.number,

    focusAnimation: PropTypes.instanceOf(Animated.Value),
    labelAnimation: PropTypes.instanceOf(Animated.Value),
    labelWidth: PropTypes.instanceOf(Animated.Value),

    contentInset: PropTypes.shape({
      left: PropTypes.number,
      right: PropTypes.number,
    }),
  };

  borderProps() {
    let {
      disabled,
      restricted,
      lineType,
      lineWidth,
      activeLineWidth,
      disabledLineWidth,
      baseColor,
      tintColor,
      errorColor,
      focusAnimation,
      left
    } = this.props;

    if (disabled) {
      return {
        borderColor: baseColor,
        borderWidth: disabledLineWidth,
      };
    }

    if (restricted) {
      return {
        borderColor: errorColor,
        borderWidth: activeLineWidth,
      };
    }

    return {
      borderColor: focusAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [errorColor, baseColor, tintColor],
      }),

      borderWidth: focusAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [activeLineWidth, lineWidth, activeLineWidth],
      }),

      borderStyle: lineType,
    };
  }

  render() {
    let { lineType, labelWidth, labelAnimation, contentInset, left } = this.props;

    if ('none' === lineType) {
      return null;
    }

    let labelOffset = 5 * (contentInset.left - 1 * borderRadius);
    let lineOffset = Animated.add(labelWidth, labelOffset);

    let topLineContainerStyle = {
      transform: [{
        scaleX: I18nManager.isRTL? 1 : 3,
      }, {
        translateX: Animated.multiply(labelAnimation, lineOffset),
      }],
    };

    let leftContainerStyle = {
      width: contentInset.left - borderRadius +  (this.props.rangeLeft || 0) //0, // khoảng cách lỗ trống so với lề trái
    };

    let rightContainerStyle = {
      width: contentInset.right - borderRadius +  (this.props.sizeSpaceText || 0)//100, // chỉnh kích thước lỗ(lề phải)
    };

    let topContainerStyle = {
      left: leftContainerStyle.width , // chỉnh kích thước lỗ(lề phải) kể cả lúc chưa đẩy
      right: rightContainerStyle.width,
    };

    let lineStyle = this.borderProps();

    return (
      <Fragment>
        {/* <View>
          {this.props.left}
          </View> */}
        <View style={[styles.topContainer, topContainerStyle]} pointerEvents='none'>
          <Animated.View style={[styles.topLineContainer, topLineContainerStyle]}>
            <Animated.View style={[styles.borderTop, lineStyle]} />
          </Animated.View>
        </View>

        <View style={[styles.rightContainer, rightContainerStyle]} pointerEvents='none'>
          <Animated.View style={[styles.borderRight, lineStyle]} />
        </View>

        <View style={styles.bottomContainer} pointerEvents='none'>
          <Animated.View style={[styles.borderBottom, lineStyle]} />
        </View>

        <View style={[styles.leftContainer, leftContainerStyle]} pointerEvents='none'>
          <Animated.View style={[styles.borderLeft, lineStyle]} />
        </View>
      </Fragment>
    );
  }
}

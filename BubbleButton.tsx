import React, { FC, useRef } from 'react'
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import { Path, Svg } from 'react-native-svg'

import { COLORS, SIZES } from 'src/constants'

const AnimPath = Animated.createAnimatedComponent(Path)
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const screenSize = SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT

const size = 50

export const BubbleButton: FC = () => {
  const waveEffect = useRef(new Animated.Value(0)).current
  const bgColor = useRef(new Animated.Value(0)).current
  const clickPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current
  const buttonLayout = useRef({ width: 0, height: 0 })

  const handleAnimation = (value: number) => {
    Animated.timing(waveEffect, {
      toValue: value,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {})
    Animated.timing(bgColor, {
      toValue: value,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {})
  }

  const handlePresIn = (e: GestureResponderEvent) => {
    clickPosition.setValue({
      x: e.nativeEvent.locationX - size / 2,
      y: e.nativeEvent.locationY - size / 2,
    })
    handleAnimation(1)
  }

  const handlePresOut = (e: GestureResponderEvent) => {
    handleAnimation(0)
  }

  const textColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.NEUTRAL_500, 'rgba(255, 255, 255, 1)'],
  })
  const iconColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.BLUE_500, COLORS.WHITE],
  })

  const scale = waveEffect.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenSize / size],
  })

  return (
    <View>
      <Pressable
        onPressIn={handlePresIn}
        onPressOut={handlePresOut}
        style={styles.container}
        onLayout={({ nativeEvent: { layout } }) => {
          buttonLayout.current = { height: layout.height, width: layout.width }
        }}
      >
        <Animated.View pointerEvents='none' style={styles.buttonContainer}>
          <Animated.View
            pointerEvents='none'
            style={[
              styles.button,
              {
                backgroundColor: COLORS.BLUE_500,
                transform: [
                  { translateX: clickPosition.x },
                  { translateY: clickPosition.y },
                  { scale: scale },
                ],
              },
            ]}
          />

          <Animated.Text
            style={[
              styles.text,
              {
                color: textColor,
              },
            ]}
          >
            use my location
          </Animated.Text>
          <View style={styles.rightIcon}>
            <Svg width='30' height='30' viewBox='0 0 1024 1024'>
              <AnimPath
                d='M840.028 106.275l-760.474 253.492c-8.756 2.919-15.956 9.258-19.96 17.574-8.178 16.985-1.038 37.384 15.947 45.562l331.45 159.589 159.588 331.448c4.004 8.315 11.203 14.653 19.958 17.577 17.884 5.96 37.217-3.707 43.177-21.591l253.491-760.476c2.335-7.007 2.335-14.581 0-21.588-5.96-17.884-25.293-27.549-43.177-21.587zM769.869 219.611l-298.949 298.953-244.596-117.771 543.545-181.182z'
                fill={iconColor}
              />
            </Svg>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginTop: 100, marginHorizontal: 20 },
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: 25,
    width: '100%',
    height: 50,
    paddingHorizontal: 8,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0, 0, 0, 0)',
    borderWidth: 0,
    shadowColor: '#3e3e3e',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    position: 'absolute',
    borderRadius: 2000,
    width: size,
    height: size,
  },
  text: {
    marginHorizontal: SIZES.GUTTER * 2 + 20,
    textAlign: 'center',
  },
  rightIcon: {
    position: 'absolute',
    right: SIZES.GUTTER * 2,
  },
})

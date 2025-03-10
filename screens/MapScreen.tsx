import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

const MapScreen = () => {
  // Map image
  const mapImage = require('../assets/game_map.png');
  
  // Shared values for transformations
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);

  // Create pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      'worklet';
      // Update scale based on pinch gesture
      scale.value = Math.max(0.5, Math.min(event.scale, 3));
      
      // Adjust translation to keep the pinch centered at the focal point
      translateX.value = originX.value + event.focalX;
      translateY.value = originY.value + event.focalY;
    })
    .onEnd(() => {
      'worklet';
      // Save the final scale after pinch ends
      originX.value = translateX.value;
      originY.value = translateY.value;
    });

    // Create pan gesture
    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        'worklet';
        // Update translation based on pan gesture
        translateX.value = originX.value + event.translationX;
        translateY.value = originY.value + event.translationY;
      })
      .onEnd(() => {
        'worklet';
        // Save the final translation after pan ends
        originX.value = translateX.value;
        originY.value = translateY.value;
      });

      // Create double tap gesture for reset
      const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onStart(() => {
          'worklet';
          // Reset all transformations
          scale.value = withTiming(1);
          translateX.value = withTiming(0);
          translateY.value = withTiming(0);
          originX.value = 0;
          originY.value = 0;
        });

     // Combine gestures using the gesture composition API
     const combinedGestures = Gesture.Simultaneous(
        pinchGesture,
        panGesture,
        doubleTapGesture
     );

     // Animated styles for the image
     const animatedStyles = useAnimatedStyle(() => {
       return {
         transform: [
           { translateX: translateX.value },
           { translateY: translateY.value },
           { scale: scale.value }
         ]
       };
     });

     return (
        <View style={styles.container}>
          <GestureDetector gesture={combinedGestures}>
            <Animated.View style={styles.imageContainer}>
              <Animated.Image
                source={mapImage}
                style={[styles.map, animatedStyles]}
                resizeMode="contain"
              />
            </Animated.View>
          </GestureDetector>
        </View>
      );
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#000', // Dark background for map edges
        },
        imageContainer: {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        },
        map: {
          width: '100%',
          height: '100%',
        },
      });

    

export default MapScreen;

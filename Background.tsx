import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const backgroundImage = require('./assets/er_logo.png'); 

const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default Background;
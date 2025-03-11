
import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const backgroundImage = require('../assets/er_logo.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const DetailsScreen: React.FC<Props> = ({ route }) => {
  const { item } = route.params;

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.type}>Type: {item.type}</Text>
        <Text style={styles.passive}>Passive: {item.passive || 'None'}</Text>
        <Text style={styles.attackPower}>Attack Power:</Text>
        {item.attackPower?.length > 0 ? (
          item.attackPower.map((power, index) => (
            <Text key={index} style={styles.attackPowerItem}>
              {power.name}: {power.amount}
            </Text>
          ))
        ) : (
          <Text>No attack power info</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.47)', 
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
  type: {
    fontSize: 14,
    marginTop: 10,
  },
  passive: {
    fontSize: 14,
    marginTop: 10,
  },
  attackPower: {
    fontSize: 14,
    marginTop: 10,
  },
  attackPowerItem: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default DetailsScreen;
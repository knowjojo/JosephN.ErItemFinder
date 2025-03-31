import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Item } from '../types';
import { useFavorites } from '../context/FavoritesContext';


const backgroundImage = require('../assets/er_logo.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;


const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
    const { favorites, removeFavorite } = useFavorites();

    const renderItem = ({ item }: { item: Item }) => (
      <View style={styles.itemContainer}>
        <TouchableOpacity 
          style={styles.item}
          onPress={() => navigation.navigate('Details', { item })}
        >
          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFavorite(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  
    return (
      <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Favorites</Text>
          {favorites.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No favorites yet</Text>
            </View>
          ) : (
            <FlatList
              data={favorites}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          )}
        </SafeAreaView>
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
      backgroundColor: 'rgba(16, 15, 15, 0.54)',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: '#e2c792',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    item: {
      flex: 1,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 5,
    },
    name: {
      fontSize: 18,
    },
    removeButton: {
      backgroundColor: '#ff6b6b',
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    removeButtonText: {
      color: 'white',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 25,
      color: '#e2c792',
    },
  });

  export default FavoritesScreen;
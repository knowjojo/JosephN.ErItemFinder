
import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useFavorites } from '../context/FavoritesContext';

const backgroundImage = require('../assets/er_logo.png');


type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const DetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { item } = route.params;
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  const isItemFavorite = isFavorite(item.id);

  const toggleFavorite = () => {
    if (isItemFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  // Function to render item details based on item type (weapon, item, or ammo)
  const renderItemDetails = () => {
    // Common fields for all item types
    return (
      <>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{item.description || 'No description available'}</Text>
        
        <View style={styles.divider} />
        
        {/* Weapon-specific fields */}
        {item.category && (
          <>
            <Text style={styles.sectionTitle}>Properties</Text>
            <View style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>Category:</Text>
              <Text style={styles.propertyValue}>{item.category}</Text>
            </View>
          </>
        )}
        
        {item.weight && (
          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Weight:</Text>
            <Text style={styles.propertyValue}>{item.weight}</Text>
          </View>
        )}
        
       
        
        {/* Scaling properties (if available) */}
        {item.scalesWith && item.scalesWith.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Scaling</Text>
            {item.scalesWith.map((scaling: any, index: number) => (
              <View key={index} style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>{scaling.name}:</Text>
                <Text style={styles.propertyValue}>{scaling.scaling}</Text>
              </View>
            ))}
          </>
        )}
        
        {/* Required attributes (if available) */}
        {item.requiredAttributes && item.requiredAttributes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {item.requiredAttributes.map((attr: any, index: number) => (
              <View key={index} style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>{attr.name}:</Text>
                <Text style={styles.propertyValue}>{attr.amount}</Text>
              </View>
            ))}
          </>
        )}
        
        {/* Item-specific fields */}
        {item.effect && (
          <>
            <Text style={styles.sectionTitle}>Effect</Text>
            <Text style={styles.description}>{item.effect}</Text>
          </>
        )}
        
        {item.type && (
          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Type:</Text>
            <Text style={styles.propertyValue}>{item.type}</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{item.name}</Text>
            
            {/* Item Image */}
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.itemImage}
                  resizeMode="contain"
                />
              ) : (
                <Image 
                  source={{ uri: 'https://via.placeholder.com/300' }} 
                  style={styles.itemImage}
                  resizeMode="contain"
                />
              )}
            </View>
            
            <TouchableOpacity 
              style={[styles.favoriteButton, isItemFavorite ? styles.favoritedButton : {}]} 
              onPress={toggleFavorite}
            >
              <Text style={[styles.favoriteButtonText, isItemFavorite ? styles.favoritedButtonText : {}]}>
                {isItemFavorite ? '★ Favorited' : '☆ Add to Favorites'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContainer}>
            {renderItemDetails()}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back to Search</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: 'rgba(255, 253, 253, 0.3)',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 8,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  favoriteButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
    elevation: 3,
  },
  favoritedButton: {
    backgroundColor: '#f8d95c',
  },
  favoriteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  favoritedButtonText: {
    color: '#333',
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  propertyLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  propertyValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#555',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DetailsScreen;
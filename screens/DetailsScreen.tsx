
import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

  // Determine the item type
  const getItemType = () => {
    if (item.type?.toLowerCase().includes('sorcery') || item.type?.toLowerCase().includes('incantation')) {
      return 'spell';
    } else if (item.category || item.attack) {
      return 'weapon';
    } else if (item.type?.toLowerCase().includes('armor')) {
      return 'armor';
    } else {
      return 'item';
    }
  };

  const itemType = getItemType();

  // Function to render common details
  const renderCommonDetails = () => (
    <>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{item.description || 'No description available'}</Text>
      
      <View style={styles.divider} />
      
      {item.type && (
        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Type:</Text>
          <Text style={styles.propertyValue}>{item.type}</Text>
        </View>
      )}
    </>
  );

  // Function to render weapon-specific details
  const renderWeaponDetails = () => (
    <>
      {renderCommonDetails()}
      
      {item.category && (
        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Category:</Text>
          <Text style={styles.propertyValue}>{item.category}</Text>
        </View>
      )}
      
      {item.weight && (
        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Weight:</Text>
          <Text style={styles.propertyValue}>{item.weight}</Text>
        </View>
      )}
      

      
      {/* Scaling properties */}
      {item.scalesWith && item.scalesWith.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Scaling</Text>
          {item.scalesWith.map((scaling: { name: string; scaling: string }, index: number) => (
            <View key={`scaling-${index}`} style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>{scaling.name}:</Text>
              <Text style={styles.propertyValue}>{scaling.scaling}</Text>
            </View>
          ))}
        </>
      )}
      
      {/* Required attributes */}
      {item.requiredAttributes && item.requiredAttributes.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {item.requiredAttributes.map((attr: { name: string; amount: number }, index: number) => (
            <View key={`req-${index}`} style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>{attr.name}:</Text>
              <Text style={styles.propertyValue}>{attr.amount}</Text>
            </View>
          ))}
        </>
      )}
    </>
  );

  // Function to render spell-specific details (sorceries and incantations)
  const renderSpellDetails = () => (
    <>
      {renderCommonDetails()}
      
      {/* Spell cost */}
      {item.cost && (
        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>FP Cost:</Text>
          <Text style={styles.propertyValue}>{item.cost}</Text>
        </View>
      )}
      
      {/* Spell slots */}
      {item.slots && (
        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Slots Required:</Text>
          <Text style={styles.propertyValue}>{item.slots}</Text>
        </View>
      )}
      
      {/* Spell effects */}
      {item.effects && (
        <>
          <Text style={styles.sectionTitle}>Effects</Text>
          <Text style={styles.description}>{item.effects}</Text>
        </>
      )}
      
    
      
      {/* Required attributes */}
      {item.requires && item.requires.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {item.requires.map((attr: { name: string; amount: number }, index: number) => (
            <View key={`req-${index}`} style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>{attr.name}:</Text>
              <Text style={styles.propertyValue}>{attr.amount}</Text>
            </View>
          ))}
        </>
      )}
    </>
  );
   
  // Function to render item/consumable-specific details
  const renderItemDetails = () => (
    <>
      {renderCommonDetails()}
      
      {item.effect && (
        <>
          <Text style={styles.sectionTitle}>Effect</Text>
          <Text style={styles.description}>{item.effect}</Text>
        </>
      )}
    </>
  );

 

   // Render armor-specific details
  const renderArmorDetails = () => (
    <>
      {renderCommonDetails()}
      
      {item.weight && (
        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Weight:</Text>
          <Text style={styles.propertyValue}>{item.weight}</Text>
        </View>
      )}
      
      {/* Damage negation */}
      {Array.isArray(item.dmgNegation) && item.dmgNegation.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Damage Negation</Text>
          {item.dmgNegation.map((negation: { name: string; amount: number }, index: number) => (
            <View key={`dmg-neg-${index}`} style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>{negation.name}:</Text>
              <Text style={styles.propertyValue}>{negation.amount}</Text>
            </View>
          ))}
        </>
      )}
      
      {/* Resistance */}
      {Array.isArray(item.resistance) && item.resistance.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Resistance</Text>
          {item.resistance.map((resist: { name: string; amount: number }, index: number) => (
            <View key={`resistance-${index}`} style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>{resist.name}:</Text>
              <Text style={styles.propertyValue}>{resist.amount}</Text>
            </View>
          ))}
        </>
      )}
    </>
  );
  // Render the appropriate details based on item type
  const renderDetails = () => {
    switch (itemType) {
      case 'weapon':
        return renderWeaponDetails();
      case 'spell':
        return renderSpellDetails();
      case 'armor':
        return renderArmorDetails();
      default:
        return renderItemDetails();
    }
  };

  // Get icon based on item type
  const getItemIcon = () => {
    switch (itemType) {
      case 'weapon':
        return 'sword';
      case 'spell':
        return 'magic-staff';
      case 'armor':
        return 'shield-alt';
      default:
        return 'flask';
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.header}>
            <View style={styles.typeIndicator}>
              <MaterialCommunityIcons name={getItemIcon()} size={16} color="#fff" />
              <Text style={styles.typeText}>{itemType.charAt(0).toUpperCase() + itemType.slice(1)}</Text>
            </View>
            
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
                <View style={styles.placeholderImage}>
                  <MaterialCommunityIcons name={getItemIcon()} size={60} color="#888" />
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              style={[styles.favoriteButton, isItemFavorite ? styles.favoritedButton : {}]} 
              onPress={toggleFavorite}
            >
              <MaterialCommunityIcons
                name={isItemFavorite ? 'star' : 'star-outline'} 
                size={16} 
                color={isItemFavorite ? '#333' : '#fff'} 
                style={styles.favoriteIcon} 
              />
              <Text style={[styles.favoriteButtonText, isItemFavorite ? styles.favoritedButtonText : {}]}>
                {isItemFavorite ? 'Favorited' : 'Add to Favorites'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContainer}>
            {renderDetails()}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={14} color="#fff" style={styles.buttonIcon} />
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
    backgroundColor: 'rgba(20, 20, 20, 0.75)',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 128, 101, 0.8)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  typeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#e2c792',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  favoriteButton: {
    flexDirection: 'row',
    backgroundColor: '#9b8065',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '80%',
    elevation: 3,
  },
  favoritedButton: {
    backgroundColor: '#e2c792',
  },
  favoriteIcon: {
    marginRight: 8,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    lineHeight: 24,
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
    paddingVertical: 8,
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
    flexDirection: 'row',
    backgroundColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DetailsScreen;
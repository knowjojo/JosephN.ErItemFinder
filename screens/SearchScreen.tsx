import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ImageBackground,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Item } from '../types.ts';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const backgroundImage = require('../assets/er_logo.png');


type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

type CategoryOption = {
  label: string;
  value: string;
  endpoint: string;
};

const CATEGORIES: CategoryOption[] = [
  { label: 'Weapons', value: 'weapons', endpoint: 'weapons' },
  { label: 'Items', value: 'items', endpoint: 'items' },
  { label: 'Ammo Types', value: 'ammos', endpoint: 'ammos' },
  { label: 'Armors', value: 'armors', endpoint: 'armors' },
  { label: 'Talismans', value: 'talismans', endpoint: 'talismans' },
  { label: 'Sorceries', value: 'sorceries', endpoint: 'sorceries' },
  { label: 'Incantations', value: 'incantations', endpoint: 'incantations' },
];

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('weapons');
  const [isLoading, setIsLoading] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);



  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    const selectedCategory = CATEGORIES.find(c => c.value === category) || CATEGORIES[0];
    const url = `https://eldenring.fanapis.com/api/${selectedCategory.endpoint}?name=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(url);
      setResults(response.data.data || []);
      setError(null);
      
      setShowRecentSearches(false);
    } catch (error) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => navigation.navigate('Details', { item })}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.type && <Text style={styles.itemType}>{item.type}</Text>}
        <FontAwesome name="chevron-right" size={16} color="#666" style={styles.chevron} />
      </View>
    </TouchableOpacity>

  

  );

  useEffect(() => {
    setResults([]); // Clear search results when the category changes
    setQuery('');   // clear the search query as well
  }, [category]);
  

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.background} 
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Elden Ring Item Guide</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <FontAwesome name="search" size={20} color="#4F8EF7" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
              onFocus={() => setShowRecentSearches(true)}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {query !== '' && (
              <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
                <FontAwesome name="times-circle" size={18} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          
          <Picker
            selectedValue={category}
            style={styles.picker}
            dropdownIconColor="#fff"
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            {CATEGORIES.map((cat) => (
              <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Picker>
          
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>
        
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        {results.length > 0 ? (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.resultsList}
            contentContainerStyle={styles.resultsContent}
            ListHeaderComponent={
              <Text style={styles.resultsHeader}>
                Found {results.length} {results.length === 1 ? 'result' : 'results'}
              </Text>
            }
          />
        ) : (
          !isLoading && !error && query && (
            <View style={styles.noResultsContainer}>
              <FontAwesome name="exclamation-circle" size={50} color="#9b8065" />
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>Try another search term or category</Text>
            </View>
          )
        )}
        
        {!query && !results.length && !showRecentSearches && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome, Tarnished</Text>
            <Text style={styles.welcomeSubtext}>
              Search for weapons, items, and more from the Lands Between
            </Text>
          </View>
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
    backgroundColor: 'rgba(20, 20, 20, 0.75)',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2c792',
    textAlign: 'center',
    marginVertical: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 46,
    color: '#333',
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  picker: {
    height: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    borderRadius: 8,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#9b8065',
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  itemName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  itemType: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  chevron: {
    marginLeft: 8,
  },
  errorText: {
    color: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  resultsHeader: {
    color: '#e2c792',
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  noResultsText: {
    color: '#e2c792',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  noResultsSubtext: {
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  welcomeText: {
    color: '#e2c792',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  welcomeSubtext: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
  },

});

export default SearchScreen;
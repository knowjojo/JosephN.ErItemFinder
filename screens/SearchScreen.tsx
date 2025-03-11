import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Item } from '../types.ts';
import { Image } from 'react-native-reanimated/lib/typescript/Animated';

const backgroundImage = require('../assets/er_logo.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;



const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('weapons');

  const handleSearch = async () => {
    let url = '';
    switch (category) {
      case 'weapons':
        url = `https://eldenring.fanapis.com/api/weapons?name=${query}`;
        break;
      case 'items':
        url = `https://eldenring.fanapis.com/api/items?name=${query}`;
        break;
      case 'ammos':
        url = `https://eldenring.fanapis.com/api/ammos?name=${query}`;
        break;
      default:
        url = `https://eldenring.fanapis.com/api/weapons?name=${query}`;
    }

    try {
      const response = await axios.get(url);
      setResults(response.data.data || []); // Ensure it's always an array
      setError(null);
    } catch (error) {
      setError('Error fetching data');
      console.error('Error fetching data:', error);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { item })}>
      <View style={styles.item}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={query}
        onChangeText={setQuery}
      />
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Weapons" value="weapons" />
        <Picker.Item label="Items" value="items" />
        <Picker.Item label="Ammos" value="ammos" />
      </Picker>
      <Button title="Search" onPress={handleSearch} />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
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
    backgroundColor: 'rgba(255, 253, 253, 0.3)', 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  name: {
    fontSize: 18,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
  },
});

export default SearchScreen;
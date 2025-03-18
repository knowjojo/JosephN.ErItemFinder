import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types';

interface FavoritesContextType {
    favorites: Item[];
    addFavorite: (item: Item) => void;
    removeFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }  > = ({ children }) => {
    const [favorites, setFavorites] = useState<Item[]>([]);

    // Load favorites from AsyncStorage on component mount
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem('favorites');
                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites));
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        loadFavorites();
    }, []);
    // Save favorites to AsyncStorage whenever the favorites state changes
    useEffect(() => {
        const saveFavorites = async () => {
            try {
                await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            } catch (error) {
                console.error('Error saving favorites:', error);
            }
        };
        saveFavorites();
    }, [favorites]);

    const addFavorite = (item: Item) => {
        //Avoid duplicates
        if (!favorites.some(fav=> fav.id === item.id)) {
            setFavorites([...favorites, item]);
        }
    };

    const removeFavorite = (id: string) => {
        setFavorites(favorites.filter(item => item.id !== id));
      };
    
      const isFavorite = (id: string) => {
        return favorites.some(item => item.id === id);
      };
    
      return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
          {children}
        </FavoritesContext.Provider>
      );
    };
    
    export const useFavorites = () => {
      const context = useContext(FavoritesContext);
      if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
      }
      return context;
    };

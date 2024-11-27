import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    Image, 
    TouchableOpacity, 
    Alert, 
    Dimensions 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function FavoritesPage({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  // Fungsi untuk memuat resep favorit dari AsyncStorage
  const loadFavorites = async () => {
    try {
      const favoritesString = await AsyncStorage.getItem('favoriteRecipes');
      const storedFavorites = favoritesString ? JSON.parse(favoritesString) : [];
      setFavorites(storedFavorites);
    } catch (error) {
      console.error('Error loading favorites', error);
    }
  };

  // Fungsi untuk menghapus resep dari favorit
  const removeFavorite = async (recipeId) => {
    try {
      // Konfirmasi penghapusan
      Alert.alert(
        'Hapus Favorit',
        'Apakah Anda yakin ingin menghapus resep ini dari favorit?',
        [
          {
            text: 'Batal',
            style: 'cancel'
          },
          {
            text: 'Hapus',
            onPress: async () => {
              const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);

              // Simpan ke AsyncStorage
              await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));

              // Update state
              setFavorites(updatedFavorites);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error removing favorite', error);
    }
  };

  // Muat favorit saat komponen pertama kali render
  useEffect(() => {
    loadFavorites();

    // Tambahkan listener untuk memuat ulang favorit saat navigasi kembali ke halaman
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  // Render item favorit
  const renderFavoriteItem = ({ item }) => (
    <View style={styles.recipeItem}>
      <TouchableOpacity
        style={styles.recipeContent}
      >
        <Image
          source={{ uri: item.thumbnail_url || item.image_url }}
          style={styles.recipeImage}
          resizeMode="cover"
        />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFavorite(item.id)}
      >
        <Text style={styles.removeButtonText}>✖</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada resep favorit</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
  recipeItem: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 15,
    alignItems: 'center',
  },
  recipeContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 15,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: 'red',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

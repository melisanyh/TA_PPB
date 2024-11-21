import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

export default function HomePage({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.request({
        method: 'GET',
        url: 'https://tasty.p.rapidapi.com/recipes/list',
        params: {
          from: '0',
          size: '20',
          tags: 'under_30_minutes'
        },
        headers: {
          'x-rapidapi-key': 'd7267aca32msh5dd71fe5d271dd2p10cb11jsnc243b3b9172d',
          'x-rapidapi-host': 'tasty.p.rapidapi.com'
        }
      });
      setRecipes(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  const renderRecipeItem = ({ item, index }) => (
      <TouchableOpacity
          style={styles.recipeCard}
          onPress={() => navigation.navigate('Detail', { recipe: item })}
      >
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
        <Image
            source={{ uri: item.thumbnail_url || item.image_url }}
            style={styles.recipeImage}
            resizeMode="cover"
        />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.recipeDescription} numberOfLines={2}>
            {item.description || 'Tidak ada deskripsi'}
          </Text>
          <View style={styles.recipeDetails}>
            <Text style={styles.recipeDuration}>
              🕒 {item.cook_time_minutes || '-'} menit
            </Text>
            <Text style={styles.recipeDifficulty}>
              🍳 {item.nutrition ? 'Sedang' : 'Mudah'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
  );

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text>Memuat Resep...</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <FlatList
            data={recipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 10,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  numberBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  recipeInfo: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeDescription: {
    color: 'gray',
    marginBottom: 10,
  },
  recipeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeDuration: {
    color: '#4a90e2',
  },
  recipeDifficulty: {
    color: '#4a90e2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
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
  const [recipes, setRecipes] = useState([]); // Daftar resep
  const [loading, setLoading] = useState(true); // Status loading
  const [page, setPage] = useState(1); // Halaman saat ini untuk pagination
  const [loadingMore, setLoadingMore] = useState(false); // Menandakan apakah lebih banyak data sedang dimuat

  // Fungsi untuk mengambil resep
  const fetchRecipes = async () => {
    if (loadingMore) return; // Jangan lakukan request jika data sedang dimuat

    try {
      setLoadingMore(true); // Menandakan sedang mengambil data
      const response = await axios.request({
        method: 'GET',
        url: 'https://tasty.p.rapidapi.com/recipes/list',
        params: {
          from: (page - 1) * 20,
          size: '20',
          tags: 'under_30_minutes',
        },
        headers: {
          'x-rapidapi-key': 'd7267aca32msh5dd71fe5d271dd2p10cb11jsnc243b3b9172d',
          'x-rapidapi-host': 'tasty.p.rapidapi.com'
        }
      });

      setRecipes(prevRecipes => [...prevRecipes, ...response.data.results]); // Menambahkan resep baru ke daftar yang sudah ada
      setLoading(false); // Mengubah status loading menjadi false setelah data dimuat
      setLoadingMore(false); // Menghentikan indikator pemuatan lebih banyak
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1); // Menambah halaman untuk memuat lebih banyak data
  };

  useEffect(() => {
    fetchRecipes(); // Memuat resep pertama kali saat komponen pertama kali dimuat
  }, [page]); // Setiap kali halaman berubah, muat resep baru

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

  // Jika masih loading data pertama kali
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
        onEndReached={handleLoadMore} // Panggil fungsi saat mencapai bagian bawah
        onEndReachedThreshold={0.5} // Memulai pemuatan lebih banyak saat 50% dari daftar terlihat
        ListFooterComponent={loadingMore ? (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#4a90e2" />
            <Text>Memuat lebih banyak...</Text>
          </View>
        ) : null}
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
  loadingMoreContainer: {
    padding: 10,
    alignItems: 'center',
  },
});

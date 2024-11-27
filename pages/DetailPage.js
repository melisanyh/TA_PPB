import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    Image, 
    TouchableOpacity, 
    Dimensions 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function DetailPage({ route, navigation }) {
    const { recipe } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const favoritesString = await AsyncStorage.getItem('favoriteRecipes');
                const favorites = favoritesString ? JSON.parse(favoritesString) : [];
                const isAlreadyFavorite = favorites.some(fav => fav.id === recipe.id);
                setIsFavorite(isAlreadyFavorite);
            } catch (error) {
                console.error('Error checking favorite status', error);
            }
        };

        checkFavoriteStatus();
    }, [recipe.id]);

    const toggleFavorite = async () => {
        try {
            // Ambil daftar favorit yang sudah ada
            const favoritesString = await AsyncStorage.getItem('favoriteRecipes');
            let favorites = favoritesString ? JSON.parse(favoritesString) : [];

            if (isFavorite) {
                // Hapus dari favorit
                favorites = favorites.filter(fav => fav.id !== recipe.id);
            } else {
                // Tambahkan ke favorit
                favorites.push(recipe);
            }

            // Simpan kembali ke AsyncStorage
            await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(favorites));

            // Update state
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error managing favorites', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Gambar Masakan */}
            <Image
                source={{ uri: recipe.thumbnail_url || recipe.image_url }}
                style={styles.recipeImage}
                resizeMode="cover"
            />

            {/* Tombol Favorit */}
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={toggleFavorite}
            >
                <Text style={styles.favoriteButtonText}>
                    {isFavorite ? '❤️ Favorit' : '♡ Tambah Favorit'}
                </Text>
            </TouchableOpacity>

            {/* Judul Resep */}
            <Text style={styles.title}>{recipe.name}</Text>

            {/* Deskripsi Resep */}
            <Text style={styles.description}>
                {recipe.description || 'Deskripsi tidak tersedia'}
            </Text>

            {/* Bahan-Bahan */}
            <Text style={styles.sectionTitle}>Bahan-Bahan</Text>
            {recipe.sections && recipe.sections[0]?.components ? (
                recipe.sections[0].components.map((ingredient, index) => (
                    <Text key={index} style={styles.ingredient}>
                        • {ingredient.ingredient.name || ingredient.raw_text}
                    </Text>
                ))
            ) : (
                <Text style={styles.noData}>Bahan tidak tersedia</Text>
            )}

            {/* Langkah-Langkah Memasak */}
            <Text style={styles.sectionTitle}>Langkah Memasak</Text>
            {recipe.instructions ? (
                recipe.instructions.map((step, index) => (
                    <View key={index} style={styles.instructionStep}>
                        <Text style={styles.stepNumber}>Langkah {index + 1}</Text>
                        <Text style={styles.stepText}>{step.display_text}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.noData}>Instruksi tidak tersedia</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    recipeImage: {
        width: width,
        height: 250,
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    favoriteButtonText: {
        color: 'red',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: 'gray',
        paddingHorizontal: 15,
        textAlign: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 15,
        marginTop: 15,
        marginBottom: 10,
    },
    ingredient: {
        paddingHorizontal: 15,
        fontSize: 16,
    },
    instructionStep: {
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    stepNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    stepText: {
        fontSize: 16,
    },
    noData: {
        paddingHorizontal: 15,
        color: 'gray',
        fontStyle: 'italic',
    },
});

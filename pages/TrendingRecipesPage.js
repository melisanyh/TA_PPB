import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Dimensions
} from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TrendingRecipesPage({ navigation }) {
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchTrendingRecipes = async () => {
        try {
            setError(null);
            const response = await axios.request({
                method: 'GET',
                url: 'https://tasty.p.rapidapi.com/recipes/list',
                params: {
                    from: '0',
                    size: '20',
                    tags: 'trending'
                },
                headers: {
                    'X-RapidAPI-Key': 'd7267aca32msh5dd71fe5d271dd2p10cb11jsnc243b3b9172d',
                    'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
                }
            });

            // Filter dan proses data untuk menampilkan resep yang relevan
            const processedRecipes = response.data.results.map(recipe => ({
                ...recipe,
                difficulty: calculateDifficulty(recipe),
                preparationTime: calculateTotalTime(recipe)
            }));

            setTrendingRecipes(processedRecipes);
        } catch (err) {
            setError('Gagal memuat resep trending. Silakan coba lagi.');
            console.error('Error fetching recipes:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTrendingRecipes();
    }, []);

    const calculateDifficulty = (recipe) => {
        const totalTime = recipe.total_time_minutes || 0;
        const numIngredients = recipe.sections?.[0]?.components?.length || 0;

        if (totalTime > 60 || numIngredients > 10) return 'Sulit';
        if (totalTime > 30 || numIngredients > 5) return 'Sedang';
        return 'Mudah';
    };

    const calculateTotalTime = (recipe) => {
        const prepTime = recipe.prep_time_minutes || 0;
        const cookTime = recipe.cook_time_minutes || 0;
        return prepTime + cookTime;
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchTrendingRecipes();
    };

    const renderRecipeCard = ({ item, index }) => (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate('Detail', { recipe: item })}
        >
            <Image
                source={{ uri: item.thumbnail_url }}
                style={styles.recipeImage}
                resizeMode="cover"
            />

            {/* Ranking Badge */}
            <View style={styles.rankingBadge}>
                <Text style={styles.rankingText}>#{index + 1}</Text>
            </View>

            {/* Recipe Info */}
            <View style={styles.recipeInfo}>
                <View style={styles.badgeContainer}>
                    <View style={styles.trendingBadge}>
                        <MaterialIcons name="local-fire-department" size={16} color="white" />
                        <Text style={styles.trendingText}>Trending</Text>
                    </View>
                    <View style={[styles.difficultyBadge,
                        { backgroundColor:
                                item.difficulty === 'Sulit' ? '#ff4757' :
                                    item.difficulty === 'Sedang' ? '#ffa502' : '#2ed573'
                        }
                    ]}>
                        <Text style={styles.difficultyText}>{item.difficulty}</Text>
                    </View>
                </View>

                <Text style={styles.recipeName} numberOfLines={2}>
                    {item.name}
                </Text>

                <Text style={styles.recipeDescription} numberOfLines={2}>
                    {item.description || 'Tidak ada deskripsi'}
                </Text>

                <View style={styles.recipeStats}>
                    <View style={styles.statItem}>
                        <MaterialIcons name="timer" size={16} color="#666" />
                        <Text style={styles.statText}>
                            {item.preparationTime} menit
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialIcons name="people" size={16} color="#666" />
                        <Text style={styles.statText}>
                            {item.num_servings || '-'} Porsi
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialIcons name="restaurant" size={16} color="#666" />
                        <Text style={styles.statText}>
                            {item.sections?.[0]?.components?.length || 0} Bahan
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#ff4757" />
                <Text style={styles.loadingText}>Memuat Resep Trending...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <MaterialIcons name="error-outline" size={48} color="#ff4757" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchTrendingRecipes}
                >
                    <Text style={styles.retryText}>Coba Lagi</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={trendingRecipes}
                renderItem={renderRecipeCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Trending Minggu Ini 🔥</Text>
                        <Text style={styles.headerSubtitle}>
                            Temukan resep-resep yang paling banyak dicari dan dibuat minggu ini
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <MaterialIcons name="no-meals" size={48} color="#666" />
                        <Text style={styles.emptyText}>Tidak ada resep trending saat ini</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 10
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 8
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#636e72',
        lineHeight: 22
    },
    listContainer: {
        padding: 10
    },
    recipeCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5
    },
    recipeImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    rankingBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },
    rankingText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14
    },
    recipeInfo: {
        padding: 15
    },
    badgeContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    trendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff4757',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        marginRight: 10
    },
    trendingText: {
        color: '#fff',
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '600'
    },
    difficultyBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12
    },
    difficultyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600'
    },
    recipeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 8
    },
    recipeDescription: {
        fontSize: 14,
        color: '#636e72',
        marginBottom: 12,
        lineHeight: 20
    },
    recipeStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
        marginTop: 8
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statText: {
        marginLeft: 4,
        fontSize: 13,
        color: '#636e72'
    },
    loadingText: {
        marginTop: 10,
        color: '#636e72',
        fontSize: 16
    },
    errorText: {
        marginTop: 10,
        color: '#ff4757',
        fontSize: 16,
        textAlign: 'center'
    },
    retryButton: {
        marginTop: 15,
        backgroundColor: '#ff4757',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    emptyText: {
        marginTop: 10,
        color: '#636e72',
        fontSize: 16,
        textAlign: 'center'
    }
});
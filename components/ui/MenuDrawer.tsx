import { useMenu } from '@/app/context/MenuContext';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

export default function MenuDrawer() {
    const { isOpen, toggleMenu } = useMenu();
    const router = useRouter();

    if (!isOpen) return null;

    const navigate = (path: string) => {
        toggleMenu();
        router.push(`../(tabs)/${path}`);
    };

    return (
        <TouchableWithoutFeedback onPress={toggleMenu}>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback>
                    <View style={styles.drawer}>
                        <Text style={styles.header}>Menu</Text>


                        <View style={styles.divider} />

                        <TouchableOpacity onPress={() => router.push('/')}
                            style={styles.item}>
                            <Text style={styles.text}>🏠 Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigate('search')} style={styles.item}>
                            <Text style={styles.text}>🔎 Search</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigate('locations')} style={styles.item}>
                            <Text style={styles.text}>📍 Locations</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigate('categories')} style={styles.item}>
                            <Text style={styles.text}>🗂️ Categories</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigate('host')} style={styles.item}>
                            <Text style={styles.text}>🎤 Host</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigate('likes')} style={styles.item}>
                            <Text style={styles.text}>♥️ Likes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/pages/credits')} style={styles.item}>
                            <Text style={styles.text}>👸🏽 Credits</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    drawer: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 220,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        color: '#222',
    },
    subheader: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 8,
    },
    item: {
        paddingVertical: 12,
        borderRadius: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111',
    },
});

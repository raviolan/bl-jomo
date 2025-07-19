import { useMenu } from '@/app/context/MenuContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MenuDrawer() {
    const { isOpen, toggleMenu } = useMenu();
    const router = useRouter();

    if (!isOpen) return null;

    const navigate = (path: string) => {
        toggleMenu();
        router.push({ pathname: '/(tabs)/locations' });
    };

    return (
        <View style={styles.drawer}>
            <TouchableOpacity onPress={() => navigate('/')} style={styles.item}>
                <Text style={styles.text}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/locations')} style={styles.item}>
                <Text style={styles.text}>Locations</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/categories')} style={styles.item}>
                <Text style={styles.text}>Categories</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('/host')} style={styles.item}>
                <Text style={styles.text}>Host</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    drawer: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.85)',
        borderRadius: 10,
        padding: 16,
        zIndex: 1000,
    },
    item: {
        paddingVertical: 12,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

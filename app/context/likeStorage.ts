// app/context/likeStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIKES_KEY = 'likedEvents';

export async function getLikedEvents(): Promise<string[]> {
    const stored = await AsyncStorage.getItem(LIKES_KEY);
    return stored ? JSON.parse(stored) : [];
}

export async function toggleLikedEvent(eventId: string): Promise<void> {
    const current = await getLikedEvents();
    const updated = current.includes(eventId)
        ? current.filter(id => id !== eventId)
        : [...current, eventId];

    await AsyncStorage.setItem(LIKES_KEY, JSON.stringify(updated));
}

export async function isEventLiked(eventId: string): Promise<boolean> {
    const current = await getLikedEvents();
    return current.includes(eventId);
}

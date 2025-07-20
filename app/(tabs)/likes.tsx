// app/(tabs)/likes.tsx
import { useLikedEvents } from '@/app/hooks/useLikedEvents';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Animated,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import eventsRaw from '../../assets/data/events.json';
import heartFilled from '../../assets/icons/heart-filled.png';
import bgImage from '../../assets/images/bg.jpg';

type Event = {
    id: string;
    event: string;
    category: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: string;
    symbols: string;
    host: string;
    location: string;
    tags: string[];
};

export default function LikesScreen() {
    const router = useRouter();
    const { likedIds, toggleLike } = useLikedEvents();

    const [lastRemoved, setLastRemoved] = useState<Event | null>(null);
    const [showUndo, setShowUndo] = useState(false);
    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const likedEvents = eventsRaw
        .filter(e => likedIds.includes(e.id))
        .sort((a, b) =>
            dayjs(`${a.date} ${a.startTime}`).diff(dayjs(`${b.date} ${b.startTime}`))
        );

    const handleToggleLike = (id: string) => {
        const removed = likedEvents.find(e => e.id === id);
        toggleLike(id);
        if (removed) {
            setLastRemoved(removed);
            setShowUndo(true);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

            if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
            undoTimerRef.current = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setShowUndo(false);
                    setLastRemoved(null);
                });
            }, 5000);
        }
    };

    const handleUndo = () => {
        if (lastRemoved) {
            toggleLike(lastRemoved.id);
            setShowUndo(false);
            setLastRemoved(null);
            if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        }
    };

    return (
        <View style={styles.screenWrapper}>
            <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Liked Events</Text>

                    {likedEvents.length === 0 ? (
                        <Text style={styles.empty}>No liked events yet.</Text>
                    ) : (
                        likedEvents.map(event => (
                            <View key={event.id} style={styles.card}>
                                <TouchableOpacity
                                    onPress={() =>
                                        router.push({
                                            pathname: '/event/[id]',
                                            params: { id: event.id },
                                        })
                                    }
                                >
                                    <Text style={styles.eventTitle}>{event.event}</Text>
                                    <Text style={styles.eventDetail}>
                                        {event.date} | {event.startTime}
                                    </Text>
                                    <Text style={styles.eventDetail}>{event.location}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleToggleLike(event.id)}
                                    style={styles.heartButton}
                                >
                                    <Image source={heartFilled} style={styles.heartIcon} />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </ScrollView>

                {showUndo && lastRemoved && (
                    <Animated.View style={[styles.undoContainer, { opacity: fadeAnim }]}>
                        <TouchableOpacity onPress={handleUndo}>
                            <Text style={styles.undoText}>Undo removed like</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        paddingTop: 60,
        paddingBottom: 100,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#222',
    },
    empty: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#666',
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        position: 'relative',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    eventDetail: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },
    heartButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        padding: 5,
        zIndex: 10,
    },
    heartIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    undoContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    undoText: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    screenWrapper: {
        flex: 1,
        position: 'relative',
    },
});

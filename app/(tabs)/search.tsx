import { useMenu } from '@/app/context/MenuContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import eventsRaw from '../../assets/data/events.json';
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

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [filtered, setFiltered] = useState<Event[]>([]);
    const router = useRouter();
    const { toggleMenu } = useMenu();

    useEffect(() => {
        if (!query.trim()) {
            setFiltered([]);
            return;
        }

        const q = query.toLowerCase();
        const result = eventsRaw.filter((event) =>
            [event.event, event.description, event.host, event.location, ...(event.tags || [])]
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
        setFiltered(result);
    }, [query]);

    const renderCard = (event: Event) => (
        <TouchableOpacity
            key={event.id}
            style={styles.card}
            onPress={() =>
                router.push({
                    pathname: '/event/[id]',
                    params: { id: event.id },
                })
            }
        >
            <Text style={styles.eventTitle}>{event.event}</Text>
            <Text style={styles.eventDetail}>{event.date} | {event.startTime}</Text>
            <Text style={styles.eventDetail}>{event.location}</Text>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.menuIconWrapper}>
                    <TouchableOpacity onPress={toggleMenu}>
                        <Text style={styles.menuIcon}>☰</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Search Events</Text>

                <TextInput
                    placeholder="Search..."
                    value={query}
                    onChangeText={setQuery}
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />

                {filtered.length > 0 ? (
                    filtered.map(renderCard)
                ) : (
                    query !== '' && <Text style={styles.noResults}>No events found.</Text>
                )}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 100,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#222',
    },
    input: {
        height: 44,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        marginBottom: 24,
        color: '#000',
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
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
    noResults: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 30,
    },
    menuIconWrapper: {
        position: 'absolute',
        top: 30,
        right: 20,
        zIndex: 100,
    },
    menuIcon: {
        fontSize: 26,
        color: '#000',
        fontWeight: '600',
    },
});

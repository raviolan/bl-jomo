import { useMenu } from '@/app/context/MenuContext';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
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

type GroupedEvents = {
    [location: string]: Event[];
};

export default function LocationsScreen() {
    const router = useRouter();
    const [groupedByLocation, setGroupedByLocation] = useState<GroupedEvents>({});
    const [expandedLocations, setExpandedLocations] = useState<{ [location: string]: boolean }>({});
    const { toggleMenu } = useMenu();

    useEffect(() => {
        const events = eventsRaw
            .map(e => ({
                ...e,
                parsedStartTime: dayjs(`${e.date} ${e.startTime}`, 'YYYY-MM-DD HH:mm'),
            }))
            .sort((a, b) => a.parsedStartTime.diff(b.parsedStartTime));

        const grouped: GroupedEvents = {};
        for (const event of events) {
            const location = event.location || 'Unknown Location';
            if (!grouped[location]) grouped[location] = [];
            grouped[location].push(event);
        }

        setGroupedByLocation(grouped);
    }, []);

    const toggleLocation = (location: string) => {
        setExpandedLocations(prev => ({
            ...prev,
            [location]: !prev[location],
        }));
    };

    const renderEventCard = (event: Event) => (
        <TouchableOpacity
            key={event.id}
            onPress={() =>
                router.push({
                    pathname: '/event/[id]',
                    params: { id: event.id },
                })
            }
            style={styles.card}
        >
            <Text style={styles.eventTitle}>{event.event}</Text>
            <Text style={styles.eventDetail}>{event.date} | {event.startTime}</Text>
            <Text style={styles.eventDetail}>{event.host}</Text>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Events by Location</Text>
                    <TouchableOpacity onPress={toggleMenu}>
                        <Text style={styles.menuIcon}>☰</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => router.push('/')} style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 16, color: '#007AFF' }}>← Back to Home</Text>
                </TouchableOpacity>

                {Object.entries(groupedByLocation)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([location, events]) => (
                        <View key={location} style={styles.section}>
                            <TouchableOpacity onPress={() => toggleLocation(location)}>
                                <Text style={styles.sectionHeader}>
                                    {expandedLocations[location] ? '▼' : '▶'} {location}
                                </Text>
                            </TouchableOpacity>
                            {expandedLocations[location] && events.map(renderEventCard)}
                        </View>
                    ))}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        justifyContent: 'space-between',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    container: {
        paddingTop: 5,
        paddingHorizontal: 20,
        paddingBottom: 100,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
    },
    menuIcon: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    section: {
        marginBottom: 40,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 4,
        color: 'rgba(255, 255, 255, 0.85)',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
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
});

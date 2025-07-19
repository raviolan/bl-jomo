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
    [category: string]: Event[];
};

export default function CategoriesScreen() {
    const router = useRouter();
    const { toggleMenu } = useMenu();
    const [groupedByCategory, setGroupedByCategory] = useState<GroupedEvents>({});
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const events = eventsRaw
            .map(e => ({
                ...e,
                parsedStartTime: dayjs(`${e.date} ${e.startTime}`, 'YYYY-MM-DD HH:mm'),
            }))
            .sort((a, b) => a.parsedStartTime.diff(b.parsedStartTime));

        const grouped: GroupedEvents = {};
        for (const event of events) {
            const category = event.category || 'Uncategorized';
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(event);
        }

        setGroupedByCategory(grouped);
    }, []);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category],
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
            <Text style={styles.eventDetail}>{event.location}</Text>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Events by Category</Text>
                    <TouchableOpacity onPress={toggleMenu}>
                        <Text style={styles.menuIcon}>☰</Text>
                    </TouchableOpacity>
                </View>

                {Object.entries(groupedByCategory)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([category, events]) => (
                        <View key={category} style={styles.section}>
                            <TouchableOpacity onPress={() => toggleCategory(category)}>
                                <Text style={styles.sectionHeader}>
                                    {expandedCategories[category] ? '▼' : '▶'} {category}
                                </Text>
                            </TouchableOpacity>
                            {expandedCategories[category] && events.map(renderEventCard)}
                        </View>
                    ))}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
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

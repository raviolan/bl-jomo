import { useMenu } from '@/app/context/MenuContext';
import { useLikedEvents } from '@/app/hooks/useLikedEvents';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    findNodeHandle,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import eventsRaw from '../../assets/data/events.json';
import bgImage from '../../assets/images/bg.jpg';

import heartFull from '../../assets/icons/heart-filled.png';
import heartEmpty from '../../assets/icons/heart-outline.png';

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
    [host: string]: Event[];
};

export default function HostsScreen() {
    const router = useRouter();
    const { toggleMenu } = useMenu();
    const { likedIds, toggleLike, isLiked } = useLikedEvents();

    const [groupedByHost, setGroupedByHost] = useState<GroupedEvents>({});
    const scrollViewRef = useRef<any>(null);
    const sectionRefs = useRef<{ [letter: string]: View | null }>({});

    useEffect(() => {
        const events = eventsRaw
            .map(e => ({
                ...e,
                parsedStartTime: dayjs(`${e.date} ${e.startTime}`, 'YYYY-MM-DD HH:mm'),
            }))
            .sort((a, b) => a.parsedStartTime.diff(b.parsedStartTime));

        const grouped: GroupedEvents = {};
        for (const event of events) {
            const host = event.host || 'Unknown Host';
            if (!grouped[host]) grouped[host] = [];
            grouped[host].push(event);
        }

        setGroupedByHost(grouped);
    }, []);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆ'.split('');

    const scrollToLetter = (letter: string) => {
        const ref = sectionRefs.current[letter];
        const nodeHandle = ref && findNodeHandle(ref);

        if (nodeHandle && Platform.OS !== 'web') {
            UIManager.measure(nodeHandle, (_x, _y, _w, _h, _px, py) => {
                scrollViewRef.current?.scrollTo({ y: py, animated: true });
            });
        } else if (Platform.OS === 'web') {
            const element = document.getElementById(`section-${letter}`);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const renderEventCard = (event: Event) => (
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
                <Text style={styles.eventDetail}>{event.date} | {event.startTime}</Text>
                <Text style={styles.eventDetail}>{event.location}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleLike(event.id)} style={styles.heartIcon}>
                <Image
                    source={isLiked(event.id) ? heartFull : heartEmpty}
                    style={{ width: 24, height: 24 }}
                />
            </TouchableOpacity>
        </View>
    );

    const groupedByLetter: { [letter: string]: [string, Event[]][] } = {};
    Object.entries(groupedByHost).forEach(([host, events]) => {
        const letter = host.charAt(0).toUpperCase();
        if (!groupedByLetter[letter]) groupedByLetter[letter] = [];
        groupedByLetter[letter].push([host, events]);
    });

    const renderContent = () => (
        <>
            <View style={styles.header}>
                <Text style={styles.title}>Events by Host</Text>
                <TouchableOpacity onPress={toggleMenu}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
            </View>

            {Object.entries(groupedByLetter)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([letter, hosts]) => {
                    if (Platform.OS === 'web') {
                        return (
                            <div key={letter} id={`section-${letter}`} style={styles.section as any}>
                                <Text style={styles.sectionHeader}>{letter}</Text>
                                {hosts
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([host, events]) => (
                                        <View key={host}>
                                            <Text style={styles.subHeader}>{host}</Text>
                                            {events.map(renderEventCard)}
                                        </View>
                                    ))}
                            </div>
                        );
                    } else {
                        return (
                            <View
                                key={letter}
                                ref={(ref: View | null) => {
                                    sectionRefs.current[letter] = ref;
                                }}
                                style={styles.section}
                            >
                                <Text style={styles.sectionHeader}>{letter}</Text>
                                {hosts
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([host, events]) => (
                                        <View key={host}>
                                            <Text style={styles.subHeader}>{host}</Text>
                                            {events.map(renderEventCard)}
                                        </View>
                                    ))}
                            </View>
                        );
                    }
                })}
        </>
    );

    return (
        <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
            <View style={{ flex: 1 }}>
                <View style={styles.stickyAlphabet}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {alphabet.map(letter => (
                            <TouchableOpacity key={letter} onPress={() => scrollToLetter(letter)}>
                                <Text style={styles.alphabetLetter}>{letter}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {Platform.OS === 'web' ? (
                    <div style={styles.webScrollContainer as any} ref={scrollViewRef}>
                        {renderContent()}
                    </div>
                ) : (
                    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
                        {renderContent()}
                    </ScrollView>
                )}
            </View>
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
    stickyAlphabet: {
        paddingTop: 70,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.6)',
        zIndex: 10,
    },
    alphabetLetter: {
        marginHorizontal: 6,
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
    section: {
        marginBottom: 40,
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 4,
        color: 'rgba(255, 255, 255, 0.85)',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    subHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 4,
        color: '#000',
    },
    card: {
        padding: 16,
        paddingBottom: 44,
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
        position: 'relative',
    },
    heartIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        padding: 4,
        zIndex: 10,
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
    webScrollContainer: {
        overflowY: 'scroll' as 'scroll',
        height: '100%',
        padding: 20,
        paddingBottom: 100,
    },
});

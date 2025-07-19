import { useLocalSearchParams } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import events from '../../assets/data/events.json';
import bgImage from '../../assets/images/bg.jpg'; // make sure the path is correct

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const event = events.find(e => e.id === id);

    if (!event) {
        return <Text>Event not found.</Text>;
    }

    return (
        <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
            <ScrollView contentContainerStyle={styles.container}>
                {/* Tags */}
                {event.tags?.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {event.tags.map((tag, index) => (
                            <Text key={index} style={styles.tag}>{tag}</Text>
                        ))}
                    </View>
                )}

                {/* Event Name */}
                <Text style={styles.title}>{event.event}</Text>

                {/* Description */}
                <View style={styles.section}>

                    <Text style={styles.detailText}>{event.description}</Text>
                </View>

                {/* Time */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Time</Text>
                    <Text style={styles.detailText}>{event.date} | {event.startTime} – {event.endTime}</Text>
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <Text style={styles.detailText}>{event.location}</Text>
                </View>

                {/* Host */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Host</Text>
                    <Text style={styles.detailText}>{event.host}</Text>
                </View>

                {/* Category */}
                {event.category && (
                    <View style={styles.section}>

                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{event.category}</Text>
                        </View>
                    </View>
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
        padding: 24,
        paddingBottom: 100,
        backgroundColor: 'rgba(255,255,255,0.1)', // translucent overlay
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 0,
        color: '#000',
        textShadowColor: 'rgba(255, 255, 255, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: 'rgba(0, 0, 0, 0.8)',
    },
    detailText: {
        fontSize: 16,
        color: '#000',
        lineHeight: 24,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginTop: 4,
    },
    badgeText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        fontSize: 14,
        marginRight: 8,
        marginBottom: 8,
        color: '#000',
    },
});
import { useMenu } from '@/app/context/MenuContext';
import { isEventLiked, toggleLikedEvent } from '@/app/context/likeStorage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
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
import heart from '../../assets/icons/heart-outline.png';
import bgImage from '../../assets/images/bg.jpg';


const availableTags = [
  'Kid Friendly',
  'Sex Positive',
  'Queer Inclusive',
  'Adult Only',
  'Sober Only',
  'Warning: Sensory content',
];

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

type ParsedEvent = Event & {
  parsedDate: dayjs.Dayjs;
  parsedStartTime: dayjs.Dayjs;
};

type GroupedEvents = {
  [date: string]: ParsedEvent[];
};

export default function TodayEvents() {
  const router = useRouter();
  const { toggleMenu } = useMenu();

  const [todayEvents, setTodayEvents] = useState<ParsedEvent[]>([]);
  const [tomorrowEvents, setTomorrowEvents] = useState<ParsedEvent[]>([]);
  const [otherFutureEvents, setOtherFutureEvents] = useState<GroupedEvents>({});
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});
  const [title, setTitle] = useState('');
  const [expandedSections, setExpandedSections] = useState<{ [date: string]: boolean }>({});
  const [activeTags, setActiveTags] = useState<string[]>([]);


  useFocusEffect(
    useCallback(() => {
      const today = dayjs().startOf('day');
      const tomorrow = today.add(1, 'day');

      const parsedEvents: ParsedEvent[] = eventsRaw.map(event => ({
        ...event,
        parsedDate: dayjs(event.date),
        parsedStartTime: dayjs(`${event.date} ${event.startTime}`, 'YYYY-MM-DD HH:mm'),
      }));
      const now = dayjs();

      const todayList = parsedEvents
        .filter(e =>
          e.parsedDate.isSame(today, 'day') &&
          e.parsedStartTime.isAfter(now)
        )
        .sort((a, b) => a.parsedStartTime.diff(b.parsedStartTime));

      const tomorrowList = parsedEvents
        .filter(e => e.parsedDate.isSame(tomorrow, 'day'))
        .sort((a, b) => a.parsedStartTime.diff(b.parsedStartTime));

      const futureEvents = parsedEvents
        .filter(e => e.parsedDate.isAfter(tomorrow, 'day'));

      const grouped: GroupedEvents = {};
      futureEvents.forEach(event => {
        const dateKey = event.parsedDate.format('YYYY-MM-DD');
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(event);
      });

      setTodayEvents(todayList);
      setTomorrowEvents(tomorrowList);
      setOtherFutureEvents(grouped);
      setExpandedSections({ [tomorrow.format('YYYY-MM-DD')]: true });

      if (todayList.length > 0) setTitle("Welcome To Borderland");
      else if (tomorrowList.length > 0) setTitle("Tomorrow's Events");
      else setTitle("Upcoming Events");

      const allEventIds = parsedEvents.map(e => e.id);
      Promise.all(allEventIds.map(id => isEventLiked(id))).then(results => {
        const map: { [id: string]: boolean } = {};
        allEventIds.forEach((id, idx) => {
          map[id] = results[idx];
        });
        setLikedMap(map);
      });
    }, [])
  );


  const toggleTag = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filterByTags = (events: ParsedEvent[]) => {
    if (activeTags.length === 0) return events;
    return events.filter(event =>
      activeTags.every(tag => event.tags.includes(tag))
    );
  };

  const toggleSection = (date: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleToggleLike = async (id: string) => {
    await toggleLikedEvent(id);
    setLikedMap(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderEventCard = (item: ParsedEvent) => (
    <View key={item.id} style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/event/[id]',
            params: { id: item.id },
          })
        }
      >
        <Text style={styles.event}>{item.event}</Text>
        <Text>{item.startTime} - {item.endTime}</Text>
        <Text>{item.location}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleToggleLike(item.id)} style={styles.heartButton}>
        <Image
          source={likedMap[item.id] ? heartFilled : heart}
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Filters */}
        <View style={styles.tagFilterContainer}>
          {availableTags.map((tag: string) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                activeTags.includes(tag) && styles.tagButtonActive,
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text
                style={[
                  styles.tagText,
                  activeTags.includes(tag) && styles.tagTextActive,
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ fontSize: 16, fontWeight: '700', marginVertical: 10, color: '#333' }}>
          Here's what's happening today 👇
        </Text>

        {filterByTags(todayEvents).map(renderEventCard)}

        {/* Tomorrow */}
        {tomorrowEvents.length > 0 && (
          <View>
            <TouchableOpacity onPress={() =>
              toggleSection(dayjs().add(1, 'day').format('YYYY-MM-DD'))
            }>
              <Text style={styles.foldHeader}>
                {expandedSections[dayjs().add(1, 'day').format('YYYY-MM-DD')] ? '▼' : '▶'} Tomorrow, {dayjs().add(1, 'day').format('MMMM D')}
              </Text>
            </TouchableOpacity>
            {expandedSections[dayjs().add(1, 'day').format('YYYY-MM-DD')] &&
              filterByTags(tomorrowEvents).map(renderEventCard)}
          </View>
        )}

        {/* Future */}
        {Object.entries(otherFutureEvents).map(([date, events]) => {
          const parsed = dayjs(date);
          const isExpanded = expandedSections[date] ?? false;

          return (
            <View key={date}>
              <TouchableOpacity onPress={() => toggleSection(date)}>
                <Text style={styles.foldHeader}>
                  {isExpanded ? '▼' : '▶'} {parsed.format('dddd')}, {parsed.format('MMMM D')}
                </Text>
              </TouchableOpacity>

              {isExpanded && filterByTags(events).map(renderEventCard)}
            </View>
          );
        })}
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
    marginBottom: 20,
    color: '#222',
  },
  tagFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  tagButton: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    elevation: 1,
  },
  tagButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  tagTextActive: {
    color: '#fff',
  },
  foldHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 32,
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
    position: 'relative',
  },
  event: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
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
});

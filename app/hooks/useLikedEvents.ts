import { getLikedEvents, toggleLikedEvent } from '@/app/context/likeStorage';
import { useEffect, useState } from 'react';

export function useLikedEvents() {
    const [likedIds, setLikedIds] = useState<string[]>([]);

    useEffect(() => {
        getLikedEvents().then(setLikedIds);
    }, []);

    const toggleLike = async (eventId: string) => {
        await toggleLikedEvent(eventId);
        const updated = await getLikedEvents();
        setLikedIds(updated);
    };

    const isLiked = (eventId: string) => likedIds.includes(eventId);

    return { likedIds, toggleLike, isLiked };
}

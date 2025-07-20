import { Link } from 'expo-router';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import bgImage from '../../assets/images/bg.jpg';

export default function CreditsPage() {
    return (
        <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
            <View style={styles.container}>
                <Text style={styles.foldHeader}>👸🏽 Credits</Text>

                <View style={styles.card}>
                    <Text style={styles.event}>This app was summoned from the void with code, caffeine, and determination</Text>
                    <Text style={styles.event}>Made by Raviolan for Alicia, queen of the timeline 🫶🏽💫</Text>

                    <Text style={{ fontSize: 16, marginTop: 12, color: '#333' }}>
                        Built using Expo, React Native, and lots of iced coffee.
                        Background image by <a href="https://unsplash.com/@vinhundred?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Vincent Maufay</a> on <a href="https://unsplash.com/photos/a-blurry-image-of-a-blue-and-pink-background-_8fQJo_S3-k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

                    </Text>
                </View>

                <Link href="/" style={styles.backLink}>
                    ← Back to Home
                </Link>
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
        justifyContent: 'flex-start',
    },
    container: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 100,
        backgroundColor: 'transparent',
        flex: 1,
    },
    foldHeader: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
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
    backLink: {
        marginTop: 30,
        fontSize: 16,
        color: '#444',
        textDecorationLine: 'underline',
        alignSelf: 'flex-start',
    },
});

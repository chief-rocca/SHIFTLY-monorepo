import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

// Using a require for the local asset
const placeholderImage = require('../assets/logo.png');

interface JobCardProps {
    title: string;
    company: string;
}

export default function JobCard({ title, company }: JobCardProps) {
    return (
        <View style={styles.container}>
            {/* Squircle Image Container */}
            <View style={styles.imageContainer}>
                <Image
                    source={placeholderImage}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={styles.company} numberOfLines={1}>
                    {company}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
    },
    imageContainer: {
        aspectRatio: 1,
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        marginTop: 8,
    },
    title: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 14,
    },
    company: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 2,
    },
});

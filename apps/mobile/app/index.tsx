import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, Heart, Briefcase, MessageSquare, User, MapPin, Clock, Filter } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Stack } from 'expo-router';

// Using a require for the local asset
const placeholderImage = require('../assets/logo.png');

// Job type definition
interface Job {
    id: string;
    job_title: string;
    industry: string;
    wage_amount: number;
    job_date: string;
    location_work_environment?: string; // Made optional to avoid runtime crashes if missing
    start_time: string;
    end_time: string;
}

// Mock data for calendar
const DATES = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
        day: d.getDate(),
        weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: d,
        isToday: i === 0,
    };
});

// Tab items
const TABS = [
    { name: 'Search', icon: SearchIcon },
    { name: 'Favourites', icon: Heart },
    { name: 'My Jobs', icon: Briefcase },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Profile', icon: User },
];

// Helper to format time (sliced to HH:MM)
const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
};

// Job Card Component
function JobCard({ job }: { job: Job }) {
    return (
        <View style={styles.jobCard}>
            <View style={styles.jobImageContainer}>
                <Image
                    source={placeholderImage}
                    style={styles.jobImage}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.jobTextContainer}>
                <Text style={styles.jobTitle} numberOfLines={1}>{job.job_title}</Text>
                <Text style={styles.jobCompany} numberOfLines={1}>{job.industry}</Text>

                {/* Metadata Section */}
                <View style={styles.metadataContainer}>
                    <View style={styles.metadataRow}>
                        <Clock size={12} color="#94a3b8" style={styles.metadataIcon} />
                        <Text style={styles.metadataText}>
                            {formatTime(job.start_time)}-{formatTime(job.end_time)}
                        </Text>
                    </View>
                    <View style={styles.metadataRow}>
                        <MapPin size={12} color="#94a3b8" style={styles.metadataIcon} />
                        <Text style={styles.metadataText} numberOfLines={1}>
                            {job.location_work_environment || 'Remote'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.jobWage}>R {job.wage_amount}</Text>
            </View>
        </View>
    );
}

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState(0);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const iconColor = '#94a3b8';

    const fetchJobs = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('job_postings')
                .select('id, job_title, industry, wage_amount, job_date, location_work_environment, start_time, end_time')
                .eq('status', 'published')
                .order('job_date', { ascending: true });

            if (data && !error) {
                setJobs(data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchJobs();
    }, [fetchJobs]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <SearchIcon size={20} color={iconColor} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search jobs..."
                        placeholderTextColor={iconColor}
                    />
                </View>

                {/* Calendar Strip */}
                <View style={styles.calendarContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {DATES.map((date, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dateItem,
                                    date.isToday ? styles.dateItemToday : styles.dateItemDefault,
                                ]}
                            >
                                <Text style={[styles.weekday, date.isToday && styles.weekdayToday]}>
                                    {date.weekday}
                                </Text>
                                <Text style={[styles.day, date.isToday && styles.dayToday]}>
                                    {date.day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Jobs Grid */}
                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.loadingText}>Loading jobs...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={jobs}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <JobCard job={item} />
                        )}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={styles.gridContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No jobs available</Text>
                            </View>
                        }
                    />
                )}
            </View>

            {/* Floating Filter Button */}
            <View style={styles.floatingButtonContainer}>
                <TouchableOpacity style={styles.filterButton}>
                    <Filter size={18} color="#000000" />
                    <Text style={styles.filterButtonText}>Filter</Text>
                </TouchableOpacity>
            </View>

            {/* Custom Tab Bar */}
            <View style={styles.tabBar}>
                {TABS.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = index === activeTab;
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.tabItem}
                            onPress={() => setActiveTab(index)}
                        >
                            <Icon size={24} color={isActive ? '#ffffff' : '#94a3b8'} />
                            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#18181b', // Matched to web bg-zinc-900 (#18181b)
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#27272a', // zinc-800
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 24,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        color: '#ffffff',
        fontSize: 16,
    },
    calendarContainer: {
        marginBottom: 24,
    },
    dateItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderRadius: 16,
        height: 80,
    },
    dateItemDefault: {
        width: 60,
        backgroundColor: '#27272a', // zinc-800
    },
    dateItemToday: {
        paddingHorizontal: 24,
        backgroundColor: '#f97316', // orange-500
    },
    weekday: {
        fontSize: 12,
        fontWeight: '500',
        color: '#94a3b8',
    },
    weekdayToday: {
        color: '#000000', // Black text on orange
    },
    day: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 4,
    },
    dayToday: {
        color: '#000000', // Black text on orange
    },
    gridContent: {
        paddingBottom: 100, // Space for float button and tab bar overlap prevention
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    jobCard: {
        flex: 1,
        marginBottom: 16,
        maxWidth: '48%', // Ensure 2 columns with spacing
    },
    jobImageContainer: {
        aspectRatio: 1,
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#27272a', // zinc-800
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    jobImage: {
        width: '100%',
        height: '100%',
    },
    jobTextContainer: {
        marginTop: 8,
    },
    jobTitle: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 2,
    },
    jobCompany: {
        color: '#94a3b8',
        fontSize: 12,
        marginBottom: 4,
    },
    metadataContainer: {
        marginTop: 4,
        gap: 2,
    },
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metadataIcon: {
        marginRight: 2,
    },
    metadataText: {
        color: '#94a3b8',
        fontSize: 11,
    },
    jobWage: {
        color: '#ffffff', // Changed from green to white based on modern feel, or keep generic
        fontSize: 14,
        fontWeight: '700',
        marginTop: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#94a3b8',
        marginTop: 12,
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 16,
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 90, // Above tab bar
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    filterButton: {
        flexDirection: 'row',
        backgroundColor: '#f97316', // orange-500
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        gap: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    filterButtonText: {
        color: '#000000',
        fontWeight: '600',
        fontSize: 14,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#18181b', // zinc-900
        borderTopWidth: 1,
        borderTopColor: '#27272a', // zinc-800
        paddingVertical: 10,
        paddingBottom: 25,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 10,
        color: '#94a3b8',
        marginTop: 4,
    },
    tabLabelActive: {
        color: '#ffffff',
    },
});

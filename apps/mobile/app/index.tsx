import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, Heart, Briefcase, MessageSquare, User } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Using a require for the local asset
const placeholderImage = require('../assets/logo.png');

// Job type definition
interface Job {
    id: string;
    job_title: string;
    industry: string;
    wage_amount: number;
    job_date: string;
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
                <Text style={styles.jobWage}>R{job.wage_amount}</Text>
            </View>
        </View>
    );
}

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState(0);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const iconColor = '#94a3b8';

    useEffect(() => {
        async function fetchJobs() {
            setLoading(true);
            const { data, error } = await supabase
                .from('job_postings')
                .select('id, job_title, industry, wage_amount, job_date')
                .eq('status', 'published')
                .order('job_date', { ascending: true });

            if (data && !error) {
                setJobs(data);
            }
            setLoading(false);
        }

        fetchJobs();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
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
                {loading ? (
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
                        contentContainerStyle={styles.gridContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No jobs available</Text>
                            </View>
                        }
                    />
                )}
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
        backgroundColor: '#020817',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
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
        backgroundColor: '#1e293b',
    },
    dateItemToday: {
        paddingHorizontal: 24,
        backgroundColor: '#ffffff',
    },
    weekday: {
        fontSize: 12,
        fontWeight: '500',
        color: '#94a3b8',
    },
    weekdayToday: {
        color: '#020817',
    },
    day: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 4,
    },
    dayToday: {
        color: '#020817',
    },
    gridContent: {
        paddingBottom: 20,
    },
    jobCard: {
        flex: 1,
        margin: 8,
    },
    jobImageContainer: {
        aspectRatio: 1,
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#1e293b',
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
    },
    jobCompany: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 2,
    },
    jobWage: {
        color: '#10b981',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 4,
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
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#020817',
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
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

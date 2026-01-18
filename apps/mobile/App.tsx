import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Use EXPO_PUBLIC prefix for environment variables
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App() {
  const [shifts, setShifts] = useState<any[]>([]);

  useEffect(() => {
    // 1. Initial Fetch
    fetchShifts();

    // 2. Real-time Subscription (The "Skill" Flex)
    const subscription = supabase
      .channel('public:shifts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shifts' }, (payload) => {
        setShifts((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchShifts() {
    const { data } = await supabase.from('shifts').select('*').order('created_at', { ascending: false });
    if (data) setShifts(data);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Shifts</Text>
      </View>
      <FlatList
        data={shifts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.shiftTitle}>{item.title}</Text>
            <Text style={styles.shiftDetail}>{item.location}</Text>
            <Text style={styles.shiftPrice}>${item.pay_rate}/hr</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
  list: { padding: 15 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  shiftTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  shiftDetail: { fontSize: 14, color: '#666', marginBottom: 8 },
  shiftPrice: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' }
});
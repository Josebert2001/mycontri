import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Settings, CircleHelp as HelpCircle, Bell } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import Header from '@/components/Header';
import { formatCurrency } from '@/utils/formatters';
import { useMockData } from '@/hooks/useMockData';

export default function ProfileScreen() {
  const { user, totalSavings, goals, groups } = useMockData();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
            style={styles.profileImage} 
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userInfo}>{user.email}</Text>
          <Text style={styles.userInfo}>{user.phone}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(totalSavings)}</Text>
            <Text style={styles.statLabel}>Total Savings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{goals.length}</Text>
            <Text style={styles.statLabel}>Savings Goals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{groups.length}</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Bell size={24} color={Colors.text} />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Settings size={24} color={Colors.text} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={24} color={Colors.text} />
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>MyContri v1.0</Text>
          <Text style={styles.footerText}>Built with ❤️ using Bolt</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  userInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  menuSection: {
    backgroundColor: Colors.white,
    marginTop: 16,
    borderRadius: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.error,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
});
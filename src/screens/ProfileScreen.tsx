import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from '../supabaseClient';
import { useAuth } from '../providers/AuthProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import Avatar from '../components/Avatar';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Profile'>) {
  const { session, signOut } = useAuth();
  const user = session?.user;
  const [profile, setProfile] = useState<{ full_name?: string; bio?: string; avatar_url?: string } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, bio, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Atualiza quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [user?.id])
  );

  // Atualiza também no mount inicial
  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return (
    <View style={{ flex: 1, gap: 12, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Avatar uri={profile?.avatar_url} size={120} />
      <Text style={{ fontSize: 20, fontWeight: '600' }}>{profile?.full_name || 'Sem nome'}</Text>
      <Text style={{ textAlign: 'center' }}>{profile?.bio || 'Sem descrição'}</Text>
      
      
      <Button title="Editar perfil" onPress={() => navigation.navigate('EditProfile')} />
      <Button title="Sair" onPress={signOut} />
    </View>
  );
}
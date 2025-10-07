import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabaseClient';
import { useAuth } from '../providers/AuthProvider';
import Avatar from '../components/Avatar';
import {decode} from 'base64-arraybuffer';



const BUCKET = (require('expo-constants').default.expoConfig?.extra?.AVATARS_BUCKET) || 'avatars';

export default function EditProfileScreen() {
    const { session } = useAuth();
    const user = session?.user;
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, bio, avatar_url')
                .eq('id', user.id)
                .single();
            if (error) console.warn(error);
            if (data) {
                setFullName(data.full_name || '');
                setBio(data.bio || '');
                setAvatarUrl(data.avatar_url || null);
            }
        };
        fetchProfile();
    }, [user?.id]);


    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, base64: true });
        if (res.canceled) return;
        const asset = res.assets[0];
        const file = await fetch(asset.uri);
        const blob = await file.blob();

        console.log(file);
        const path = `${user.id}.jpg`;
        const { error } = await supabase.storage.from("avatars").upload(path, decode(asset.base64 as string), { upsert: true, contentType: 'image/jpeg' });
        if (error) return Alert.alert('Upload falhou', error.message);


        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        setAvatarUrl(data.publicUrl);
    };


    const save = async () => {
        setLoading(true);
        const payload = { id: user.id, full_name: fullName, bio, avatar_url: avatarUrl };
        const { error } = await supabase.from('profiles').upsert(payload);
        setLoading(false);
        if (error) Alert.alert('Erro', error.message);
        else Alert.alert('Sucesso', 'Perfil atualizado!');
    };


    return (
        <View style={{ flex: 1, gap: 12, padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Foto</Text>
            <Avatar uri={avatarUrl} size={120} />
            <Button title="Selecionar foto" onPress={pickImage} />


            <Text style={{ fontSize: 18, fontWeight: '600' }}>Nome</Text>
            <TextInput value={fullName} onChangeText={setFullName} placeholder="Seu nome" style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />


            <Text style={{ fontSize: 18, fontWeight: '600' }}>Descrição</Text>
            <TextInput value={bio} onChangeText={setBio} placeholder="Escreva sobre você" style={{ borderWidth: 1, padding: 12, borderRadius: 8, minHeight: 80 }} multiline />


            <Button title={loading ? 'Salvando...' : 'Salvar'} onPress={save} disabled={loading} />
        </View>
    );
}
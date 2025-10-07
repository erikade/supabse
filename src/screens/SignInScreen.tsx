import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../providers/AuthProvider';


export default function SignInScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'SignIn'>) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const onSubmit = async () => {
        setLoading(true);
        const { error } = await signIn(email.trim(), password);
        setLoading(false);
        if (error) Alert.alert('Erro ao entrar', error.message);
    };


    return (
        <View style={{ flex: 1, gap: 12, padding: 16, justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Bem-vindo</Text>
            <TextInput placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />
            <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />
            <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={onSubmit} disabled={loading} />
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{ textAlign: 'center', marginTop: 8 }}>Não tem conta? Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    );
}
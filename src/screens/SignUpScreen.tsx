import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useAuth } from '../providers/AuthProvider';


export default function SignUpScreen() {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const onSubmit = async () => {
        setLoading(true);
        const { error } = await signUp(email.trim(), password);
        setLoading(false);
        if (error) Alert.alert('Erro ao cadastrar', error.message);
        else Alert.alert('Verifique seu e-mail', 'Enviamos um link de confirmação (se exigido nas configurações).');
    };


    return (
        <View style={{ flex: 1, gap: 12, padding: 16, justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Criar conta</Text>
            <TextInput placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />
            <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />
            <Button title={loading ? 'Enviando...' : 'Cadastrar'} onPress={onSubmit} disabled={loading} />
        </View>
    );
}
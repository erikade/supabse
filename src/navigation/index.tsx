import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../providers/AuthProvider';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';


export type RootStackParamList = {
SignIn: undefined;
SignUp: undefined;
Profile: undefined;
EditProfile: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();


const AppNavigator = () => {
const { session, loading } = useAuth();


if (loading) return null; // poderia exibir Splash/Loader


return (
<NavigationContainer>
<Stack.Navigator>
{session ? (
<>
<Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Meu Perfil' }} />
<Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
</>
) : (
<>
<Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Entrar' }} />
<Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Criar conta' }} />
</>
)}
</Stack.Navigator>
</NavigationContainer>
);
};


export default AppNavigator;
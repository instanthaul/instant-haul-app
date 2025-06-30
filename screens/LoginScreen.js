import { Button, Text, TextInput, View } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button title="Submit" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
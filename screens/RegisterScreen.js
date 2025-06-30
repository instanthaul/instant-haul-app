import { Button, Text, TextInput, View } from 'react-native';

export default function RegisterScreen({ navigation }) {
  return (
    <View>
      <Text>Register</Text>
      <TextInput placeholder="Name" />
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button title="Register" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
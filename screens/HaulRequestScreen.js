
import { StyleSheet, Text, View } from 'react-native';

export default function HaulRequestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Request a Haul</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
});
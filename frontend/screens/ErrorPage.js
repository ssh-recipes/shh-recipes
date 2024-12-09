import { StyleSheet, Text, View } from 'react-native';

export default function ErrorPage() {
  return (
    <View style={styles.container}>
      <Text>An error occured</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

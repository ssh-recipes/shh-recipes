import { StyleSheet, Text, View } from "react-native";

export default function Timetable() {
  return (
    <View style={styles.container}>
      <Text>Timetable Screen. This page is not a part of our prototype</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

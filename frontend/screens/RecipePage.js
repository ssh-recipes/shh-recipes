import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { WebView } from "react-native-webview";

const recipe = {
  title: "Spaghetti Carbonara",
  videoId: "3dBEz3kwzi0", // Replace with your YouTube video ID
  ingredients: [
    "200g Spaghetti",
    "100g Pancetta",
    "2 large eggs",
    "50g Parmesan cheese",
    "Salt and pepper to taste",
  ],
  steps: [
    { text: "Cook the spaghetti according to the package instructions.", timestamp: 0 },
    { text: "While the pasta is cooking, fry the pancetta until crispy.", timestamp: 10 },
    { text: "In a bowl, whisk the eggs and grated Parmesan together.", timestamp: 20 },
    { text: "Once the spaghetti is done, drain it and mix it with the pancetta.", timestamp: 30 },
    { text: "Add the egg mixture to the pasta and toss quickly to create a creamy sauce.", timestamp: 40 },
    { text: "Season with salt and pepper to taste and serve.", timestamp: 50 },
  ],
};

const RecipePage = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const scrollRef = useRef(null);
  const playerRef = useRef(null);

  const goToStage = (stageIndex) => {
    if (stageIndex < 0 || stageIndex >= recipe.steps.length) return;

    setCurrentStage(stageIndex);
    // Seek to the desired timestamp in the video
    playerRef.current?.seekTo(recipe.steps[stageIndex].timestamp, true);

    // Scroll to the respective step
    scrollRef.current?.scrollTo({
      y: stageIndex * 60, // Adjust based on step height
      animated: true,
    });
  };

  const nextStage = () => goToStage(currentStage + 1);
  const prevStage = () => goToStage(currentStage - 1);

  const onProgress = (currentTime) => {
    const nextStageIndex = recipe.steps.findIndex(
      (step, index) =>
        index > currentStage && currentTime >= step.timestamp
    );

    if (nextStageIndex !== -1) {
      setCurrentStage(nextStageIndex);

      // Scroll to the respective step
      scrollRef.current?.scrollTo({
        y: nextStageIndex * 60,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* YouTube Player */}
      <View style={styles.videoContainer}>
        {Platform.OS == "android" || Platform.OS == "ios" ? (
          // Use WebView for Android and iOS
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${recipe.videoId}?autoplay=1` }}
            style={{ width: "100%", height: 200 }}
            javaScriptEnabled={true}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
          />
        ) : (
          // Use YoutubePlayer for other platforms (e.g., web)
          <YoutubePlayer
            ref={playerRef}
            height={'100%'}
            videoId={recipe.videoId}
            play={true}
            onChangeState={(state) => {
              if (state === "ended") setCurrentStage(0); // Reset to first stage when video ends
            }}
            onProgress={onProgress}
          />
        )}
        <View style={styles.stageControls}>
          <TouchableOpacity onPress={prevStage} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={nextStage} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView ref={scrollRef} style={styles.scrollableContent}>
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.listContainer}>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.listItem}>
                - {ingredient}
              </Text>
            ))}
          </View>
        </View>

        {/* Steps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          <View style={styles.listContainer}>
            {recipe.steps.map((step, index) => (
              <Text
                key={index}
                style={[
                  styles.listItem,
                  index === currentStage && styles.highlightedStep, // Highlight current step
                ]}
              >
                {index + 1}. {step.text}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  stageControls: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#222",
  },
  controlButton: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  controlButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollableContent: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContainer: {
    paddingLeft: 20,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  highlightedStep: {
    backgroundColor: "#FFEB3B",
    padding: 5,
    borderRadius: 5,
  },
});

export default RecipePage;
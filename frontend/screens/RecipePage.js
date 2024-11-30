import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const recipe = {
  title: "Spaghetti Carbonara",
  videoId: "3dBEz3kwzi0",
  ingredients: [
    "200g Spaghetti",
    "100g Pancetta",
    "2 large eggs",
    "50g Parmesan cheese",
    "Salt and pepper to taste",
  ],
  steps: [
    { text: "Cook the spaghetti according to the package instructions.", timestamp: 0 },
    { text: "While the pasta is cooking, fry the pancetta until crispy.", timestamp: 50 },
    { text: "In a bowl, whisk the eggs and grated Parmesan together.", timestamp: 100 },
    { text: "Once the spaghetti is done, drain it and mix it with the pancetta.", timestamp: 150 },
    { text: "Add the egg mixture to the pasta and toss quickly to create a creamy sauce.", timestamp: 200 },
    { text: "Season with salt and pepper to taste and serve.", timestamp: 350 },
  ],
};

const RecipePage = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const scrollRef = useRef(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null); // To keep track of the interval

  useEffect(() => {
    // Start the interval when the component mounts
    intervalRef.current = setInterval(async () => {
      if (playerRef.current) {
        const time = await playerRef.current.getCurrentTime();
        setCurrentTime(time); // Update current time
      }
    }, 500); // Poll every 500ms

    return () => {
      // Clear the interval when the component unmounts
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const nextStageIndex = recipe.steps.findIndex(
      (step, index) =>
        currentTime >= step.timestamp &&
        currentTime < (recipe.steps[index + 1]?.timestamp || Infinity)
    );

    if (nextStageIndex !== -1 && nextStageIndex !== currentStage) {
      setCurrentStage(nextStageIndex);

      // Scroll to the respective step
      scrollRef.current?.scrollTo({
        y: nextStageIndex * 60, // Adjust based on step height
        animated: true,
      });
    }
  }, [currentTime]);

  const goToStage = (stageIndex) => {
    if (stageIndex < 0 || stageIndex >= recipe.steps.length) return;

    setCurrentStage(stageIndex);
    playerRef.current?.seekTo(recipe.steps[stageIndex].timestamp, true);

    // Scroll to the respective step
    scrollRef.current?.scrollTo({
      y: stageIndex * 60, // Adjust based on step height
      animated: true,
    });
  };

  const nextStage = () => goToStage(currentStage + 1);
  const prevStage = () => goToStage(currentStage - 1);

  const windowWidth = Dimensions.get("window").width;
  const videoHeight = windowWidth * 9 / 16;

  return (
    <View style={styles.container}>
      {/* YouTube Player */}
      <YoutubePlayer
          ref={playerRef}
          height={videoHeight}
          videoId={recipe.videoId}
          play={true}
          onChangeState={(state) => {
            if (state === "ended") setCurrentStage(0); // Reset to first stage when video ends
          }}
        />
        <View style={styles.stageControls}>
          <TouchableOpacity onPress={prevStage} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={nextStage} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Next</Text>
          </TouchableOpacity>
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
                  index === currentStage && styles.highlightedStep,
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
    width: "100%",
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

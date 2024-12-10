import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Audio, Video, ResizeMode } from "expo-av";
import { recordRecipeCooked, getStaticResource } from "../lib/api";

const timeOffset = 300; //300 miliseconds to fix errors with current stage

export default function RecipePage({ route }) {
  const { recipe } = route.params;
  const [recipeStarted, setRecipeStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [offsetAboveSteps, setOffsetAboveSteps] = useState(0);

  const scrollRef = useRef(null);
  const videoRef = useRef(null);
  const elementPositions = useRef([]);

  // this effect is for fixing audio on IOS
  useEffect(() => {
    const enableAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: 1, // DoNotMix
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeAndroid: 1, // DoNotMix
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error(error);
      }
    };
    enableAudio();
  }, []);

  //updates current time and fixes ios audio issue
  const handlePlaybackStatusUpdate = (status) => {
    setIsPlaying(status.isPlaying);

    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
    }
  };

  // to show alert with 2 questions
  const showAlert = async (question, onYes = undefined, onNo = undefined) => {
    if (Platform.OS === "web") {
      const responce = confirm(question);
      if (responce) {
        if (onYes) {
          onYes();
        }
      } else {
        if (onNo) {
          onNo();
        }
      }
    } else {
      Alert.alert(
        question,
        null,
        [
          {
            text: "Yes",
            onPress: () => {
              if (onYes) {
                onYes();
              }
            },
          },
          {
            text: "No",
            onPress: () => {
              if (onNo) {
                onNo();
              }
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  //to show alert with one question
  const showMessage = (message, action = undefined) => {
    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert(
        message,
        null,
        [
          {
            text: "Close",
            onPress: () => {
              if (action) {
                action();
              }
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  const onStartCooking = async () => {
    setRecipeStarted(true);
    showAlert("Would you like to book the kitchen for 35 minutes?", () => {
      // here should be api call to booking system
      showMessage("The kitchen has been booked for you for 35 minutes.");
    });
    const responce = await recordRecipeCooked(recipe.id);
    if (!responce || responce.success === false) {
      console.error("Error: could not startCookingRecipe");
    }
    setIsPlaying(true);
  };

  //starts/stops a video on isPlaying. Fixes IOS audio
  const handlePlayPause = async () => {
    if (videoRef.current && isPlaying) {
      await videoRef.current.playAsync();
    }
  };

  useEffect(() => {
    handlePlayPause();
  }, [isPlaying]);

  useEffect(() => {
    const nextStageIndex = recipe.steps.findIndex(
      (step, index) =>
        currentTime >= step.timestamp &&
        currentTime < (recipe.steps[index + 1]?.timestamp || Infinity),
    );

    if (
      nextStageIndex !== -1 &&
      nextStageIndex !== currentStage &&
      currentTime >= recipe.steps[0].timestamp
    ) {
      setCurrentStage(nextStageIndex);
    } else if (currentTime < recipe.steps[0].timestamp) {
      setCurrentStage(-1);
    }
  }, [currentTime]);

  useEffect(() => {
    if (currentStage >= 0 && elementPositions.current[currentStage]) {
      scrollToElement(currentStage);
    }
  }, [currentStage]);

  // measures offset before the steps
  const measureAboveSteps = (event) => {
    const { height } = event.nativeEvent.layout;
    setOffsetAboveSteps(height);
  };

  //gets positions of an element
  const handleLayout = (event, index) => {
    const { y } = event.nativeEvent.layout;
    elementPositions.current[index] = y;
  };

  const scrollToElement = (index) => {
    if (scrollRef.current && elementPositions.current[index] != null) {
      scrollRef.current.scrollTo({
        y: elementPositions.current[index] + offsetAboveSteps,
        animated: true,
      });
    }
  };

  //scrolls View and Video to the next/previous stage
  const goToStage = async (stageIndex) => {
    if (stageIndex < 0) {
      setCurrentStage(-1);
      scrollRef.current.scrollTo({ y: 0, animated: true });
      if (videoRef.current) {
        await videoRef.current.setPositionAsync(0);
      }
    } else if (stageIndex >= recipe.steps.length) {
      return;
    } else {
      setCurrentStage(stageIndex);
      if (videoRef.current) {
        await videoRef.current.setPositionAsync(
          recipe.steps[stageIndex].timestamp * 1000 + timeOffset,
        );
      }
      scrollToElement(stageIndex);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: getStaticResource(recipe.video) }}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        style={styles.video}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onReadyForDisplay={(videoData) => {
          if (Platform.OS === "web") {
            videoData.srcElement.style.position = "initial";
          }
        }}
      />
      <TouchableOpacity
        onPress={() => goToStage(currentStage - 1)}
        style={[styles.navButton, styles.leftButton]}
      >
        <Text style={styles.navButtonText}>{"<"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => goToStage(currentStage + 1)}
        style={[styles.navButton, styles.rightButton]}
      >
        <Text style={styles.navButtonText}>{">"}</Text>
      </TouchableOpacity>

      <ScrollView ref={scrollRef} style={styles.scrollableContent}>
        <View onLayout={measureAboveSteps}>
          <View style={styles.startContainer}>
            <Text style={styles.title}>{recipe.name}</Text>
            {!recipeStarted && (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => onStartCooking()}
              >
                <Text style={styles.startButtonText}>Start Cooking</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <Text
                key={index}
                style={[
                  styles.listItem,
                  !ingredient.fulfilled && styles.missingIngredientText,
                ]}
              >
                - {ingredient.name} {Math.floor(ingredient.quantity)}{" "}
                {ingredient.unit !== "quantity" ? ingredient.unit : ""}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          {recipe.steps.map((step, index) => (
            <View
              key={index}
              onLayout={(event) => handleLayout(event, index)}
              style={[
                styles.stepContainer,
                currentStage === index && styles.highlightedStep,
              ]}
            >
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  video: {
    width: "100%",
    // height: videoHeight,
    backgroundColor: "black",
    aspectRatio: 16 / 9,
  },
  scrollableContent: {
    flex: 1,
    padding: 25,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  stepContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "rgba(230, 230, 230, 0.4)",
    borderRadius: 5,
  },
  stepText: {
    fontSize: 16,
  },
  highlightedStep: {
    backgroundColor: "#FFB23F",
  },
  navButton: {
    position: "absolute",
    bottom: 20,
    width: 60,
    height: 60,
    backgroundColor: "rgba(30, 90, 10, 0.25)",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  startContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 10,
    // margin: 10,
  },
  startButton: {
    backgroundColor: "#148B4E",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    // marginLeft: 10,
    // marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    alignSelf: "flex-start",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  leftButton: {
    left: 20,
  },
  rightButton: {
    right: 20,
  },
  navButtonText: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
  },
  missingIngredientText: {
    color: "red",
  },
});

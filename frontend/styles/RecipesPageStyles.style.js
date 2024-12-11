import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    maxWidth: '65vh',
    width: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
    marginHorizontal: 'auto',
  },
  mainContainer: {
    flex: 1,
  },
  separator: {
    height: 25,
    width: 2,
    backgroundColor: "gray",

    marginLeft: 10,
    marginBottom: 10,
  },

  // Filter Section
  selectionView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: 10,
  },
  missingIngredientText: {
    color: "red",
  },
  filterButton: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    alignSelf: "flex-start",
  },
  filterButtonActive: {
    backgroundColor: "#FFB23F",
  },
  filterText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  filterTextActive: {
    color: "#000",
  },
  recipesContainer: {
    marginTop: 5,
    marginHorizontal: 10,
  },
  ingredientsScroll: {
    paddingVertical: 5,
  },
});

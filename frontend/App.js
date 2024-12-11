import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Home,
  Groceries,
  Recipes,
  RecipePage,
  ErrorPage,
  Timetable
} from "./screens/index";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator>

      </Stack.Navigator> */}
      <Drawer.Navigator
        initialRouteName="Recipes"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#148B4E", // Custom header color
            //for ios
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 4,
            // for android
            elevation: 4, // Shadow for Android
          },
          headerTintColor: "#FFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Recipes" component={Recipes} />
        <Drawer.Screen
          name="RecipePage"
          component={RecipePage}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="ErrorPage"
          component={ErrorPage}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen name="Groceries" component={Groceries} />
        <Drawer.Screen name="Timetable" component={Timetable} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

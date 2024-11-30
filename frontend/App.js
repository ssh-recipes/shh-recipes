import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home, Groceries, Recipes, RecipePage } from './screens/index';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="RecipePage"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#148B4E', // Custom header color
            shadowColor: '#000', // Shadow color for iOS
            shadowOpacity: 0.2, // Shadow opacity for iOS
            shadowOffset: { width: 0, height: 4 }, // Shadow offset for iOS
            shadowRadius: 4, // Shadow radius for iOS
            elevation: 4, // Shadow for Android
          },
          headerTintColor: '#FFF', // Text and icon color in header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Recipes" component={Recipes} />
        <Drawer.Screen name="RecipePage" component={RecipePage} />
        <Drawer.Screen name="Groceries" component={Groceries} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
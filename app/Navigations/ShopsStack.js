import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Shops from "../screens/Shops/Shops";
import AddShops from "../screens/Shops/AddShops";

const Stack = createStackNavigator();

export default function ShopsStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
         name="shops"
         component={Shops}
         options={{title: "Shops" }}
        /> 
        <Stack.Screen
           name="add-shops"
           component={AddShops}
           options={{title: "Add new shop" }}        
        /> 
      </Stack.Navigator>
    );
}
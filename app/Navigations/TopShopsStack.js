import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TopShops from "../screens/TopShops";

const Stack = createStackNavigator();

export default function TopShopsStack() {
    return (
       <Stack.Navigator>
        <Stack.Screen
         name="top-shops"
         component={TopShops}
         options={{title: "Top Shops" }}
        />
       </Stack.Navigator>
    );
}

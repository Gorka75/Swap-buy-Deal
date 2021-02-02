import React from "react";
import {LogBox} from "react-native";
import { firebaseApp } from "./app/utils/firebase";
import Navigation from "./app/Navigations/Navigation";
import { decode, encode } from "base-64";

LogBox.ignoreAllLogs(true);

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {
  return <Navigation />;  
}




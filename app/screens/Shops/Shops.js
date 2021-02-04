import React, { useState, useEffect} from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";


const db = firebase.firestore(firebaseApp);



export default function Shops(props) {
    const { navigation } = props;
    const [user, setUser] = useState(null);
    const [shops, setShops] = useState([]);
    const [totalShops, setTotalShops] = useState(0);
    const [startShops, setStartShops] = useState(null);
    const limitShops = 1;

    console.log(shops);
   

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
        });
    }, []);

    useEffect(() => {
        db.collection("shops")
        .get()
        .then((snap) => {
            setTotalShops(snap.size);
        });

        const resultShops = [];

        db.collection("shops")
          .orderBy("createAt", "desc")
          .limit(limitShops)
          .get()
          .then((response) => {
              setStartShops(response.docs[response.docs.length - 1]);

              response.forEach((doc) => {
                  const shops = doc.data();
                  shops.id = doc.id;
                  resultShops.push(shops);
              });
              setShops(resultShops);
          });
     }, []);

    return (
        <View style={styles.viewBody}>
            <Text>Shops...</Text>

            {user && (
              <Icon reverse
            type="material-community"
            name="plus"
            color="#00a680"
            containerStyle={styles.btnContainer}
            onPress={() => navigation.navigate("add-shops")}
            />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    btnContainer: {
        position:"absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
    },
});
import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import {map, size, filter} from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;



export default function AddShopsForm(props) {
     const { toastRef, setIsLoading, navigation } = props;
     const [shopsName, setShopsName] = useState("");
     const [shopsAddress, setShopsAddress] = useState("");
     const [shopsDescription, setShopsDescription] = useState("");
     const [imagesSelected, setImagesSelected] = useState([]);
     const [isVisibleMap, setIsVisibleMap] = useState(false);
     const [locationShops, setLocationShops] = useState(null);

     console.log(imagesSelected);

    const addShops = () => {
        if(!shopsName || !shopsAddress || !shopsDescription) {
            toastRef.current.show("All fields on this form are required");
        } else if (size(imagesSelected) === 0) {
            toastRef.current.show("The store must have at least one photo");
        } else if (!locationShops) {
            toastRef.current.show("It is mandatory to locate the store on the map");
        } else {
            setIsLoading(true);
        uploadImageStorage().then(response => {
             db.collection("Swap-buy-Deal")
              .add({
                  name: shopsName,
                  address: shopsAddress,
                  description: shopsDescription,
                  location: locationShops,
                  images: response,
                  rating: 0,
                  ratingTotal: 0,
                  quantityVoting: 0,
                  createAt: new Date(),
                  createBy: firebase.auth().currentUser.uid,
              })
              .then(() => {
                  setIsLoading(false);
                  navigation.navigate("Shops");
              })
              .catch(() => {
                  setIsLoading(false);
                  toastRef.current.show(
                      "Error when uploading the store, try again later"
                  );
              });

        });
        }
        
    };

    const uploadImageStorage = async () => {
        const imageBlob = [];

        await Promise.all(
           map(imagesSelected, async (image) => {
            const response = await fetch(image);
            const blob = await response.blob();
            const ref = firebase.storage().ref("Swap-buy-Deal").child(uuid());
            await ref.put(blob).then(async (result) => {
              await firebase
                       .storage()
                       .ref(`Swap-buy-Deal/${result.metadata.name}`)
                       .getDownloadURL()
                       .then((photoUrl) => {
                          imageBlob.push(photoUrl);
                       });
                    });
                  })
        );

        return imageBlob;
    }; 

    return (
        <ScrollView style={StyleSheet.scrollView}>
            <ImageShops imageShops={imagesSelected[0]} />
        <FormAdd
          setShopsName={setShopsName}
          setShopsAddress={setShopsAddress}
          setShopsDescription={setShopsDescription}
          setIsVisibleMap={setIsVisibleMap}
          locationShops={locationShops}
        />
        <UploadImage 
        toastRef={toastRef}
        imagesSelected={imagesSelected} 
        setImagesSelected={setImagesSelected} />

        <Button 
            title="Create Shop"
             onPress={addShops}  
             buttonStyle={styles.btnAddShops}     
        />
        <Map 
        isVisibleMap={isVisibleMap} 
        setIsVisibleMap={setIsVisibleMap} 
        setLocationShops={setLocationShops}
        toastRef={toastRef}
        />
        </ScrollView>
    );
}

function ImageShops(props) {
    const { imageShops } = props;

    return (
        <View style={styles.viewPhoto}>
             <Image
             source={imageShops ? {uri: imageShops }
             : require("../../../assets/img/no-image.png") 
            }
             style={{ width: widthScreen, height: 200 }}
             />
        </View>
    )
}

function FormAdd(props) {
    const {
        setShopsName, 
        setShopsAddress, 
        setShopsDescription,
        setIsVisibleMap,
        locationShops
    } = props;

    return (
        <View style={styles.viewForm}>
          <Input
          placeholder="Shop name"
          containerStyle={styles.input}
          onChange={(e) => setShopsName(e.nativeEvent.text)}
          /> 
          <Input
          placeholder="Shop Address"
          containerStyle={styles.input}
          onChange={(e) => setShopsAddress(e.nativeEvent.text)}
          rightIcon={{
              type: "material-community",
              name: "google-maps",
              color: locationShops ? "#00a680" : "#c2c2c2",
              onPress: () => setIsVisibleMap(true),
          }}
          />
          <Input
          placeholder="Shop Description"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={(e) => setShopsDescription(e.nativeEvent.text)}
          />

        </View>
    );
}

   function Map(props) {
    const {isVisibleMap, setIsVisibleMap, setLocationShops, toastRef} = props;
    const [location, setLocation] = useState(null);

    useEffect(() => {
     (async ()=> {
        const resultPermissions = await Permissions.askAsync(
            Permissions.LOCATION
        );
        const statusPermissions = resultPermissions.permissions.location.status;

        if (statusPermissions !== "granted") {
            toastRef.current.show(
              "You need to accept Location permissions to be able to open a shop profile",
              4000
            );
        } else {
            const loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            });
        }
     })();
    }, []);

    const confirmLocation = () => {
        setLocationShops(location);
        toastRef.current.show("Location Saved");
        setIsVisibleMap(false);
    };

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                     style={styles.mapStyle}
                     initialRegion={location}
                     showUserLocation={true}
                     onRegionChange={(region) => setLocation(region)}
                     >
                       <MapView.Marker 
                       coordinate={{
                           latitude: location.latitude,
                           longitude: location.longitude,
                       }}
                       draggable
                       />
                     </MapView>
                )}
                <View style={styles.viewMapBtn}>
                <Button 
                title="Save Location"
                containerStyle={styles.viewMapBtnContainerSave}
                buttonStyle={styles.viewMapBtnSave}
                onPress={confirmLocation}
                
                 />
                <Button 
                title="Cancel Location" 
                containerStyle={styles.viewMapBtnContainerCancel} 
                buttonStyle={styles.viewMapBtnCancel}
                onPress={() => setIsVisibleMap(false)}
                /> 
                </View> 
            </View>
        </Modal>
    );
}

function UploadImage(props) {
    const { toastRef, imagesSelected, setImagesSelected } = props;

       const imageSelect = async () =>{
        const resultPermissions = await Permissions.askAsync(
            Permissions.MEDIA_LIBRARY
        );

        if(resultPermissions === "denied") {
            toastRef.current.show(
                "It is mandatory to accept the permissions of the gallery,if you have rejected them you will need to go to settings and activatethem manually", 
                4000 
               );
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

           
            if(result.cancelled) {
                toastRef.current.show(
                    "You have closed the gallery without selecting any image",2000
                );
            } else {
               setImagesSelected([...imagesSelected, result.uri]);

            }
        }
    };

    const removeImage = (image) => {
           Alert.alert(
            "Delete Image",
            "Are you sure you want to delete the image?",
            [
                {
                    text: "Cancel",
                    style: "Cancel",
                },
                {
                    text: "Delete",
                    onPress: () => {
                        setImagesSelected(
                       filter(imagesSelected, (imageUrl) => imageUrl !== image)
                    );                     
                    },
                },
            ],
            { cancelable: false }

        );
    };
    return (
        <View style={styles.viewImages}>
            {size(imagesSelected) < 4 && (
          <Icon 
            type="material-community"
            name="camera"
            color="#7a7a7a"
            containerStyle={styles.containerIcon}
            onPress={imageSelect}
          />
            )}
          {map(imagesSelected, (imageShops, index) => (
          <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageShops }}
          onPress={() => removeImage(imageShops)}
          />
        ))}
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
    },
    viewForm: {
      marginLeft: 10,
      marginRight: 10,  
    },
    input: {
      marginBottom: 10,
    },
    textArea: {
      height: 100,
      width: "100%",
      padding: 0,
      margin: 0, 
    },
    btnAddShops: {
      backgroundColor: "#00a680",
      margin: 20,
    },
    viewImages: {
      flexDirection: "row",
      marginLeft: 20,
      marginRight: 20,
      marginTop: 30,
    },
    containerIcon: {
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      height: 70,
      width: 70,
      backgroundColor: "#e3e3e3",
    },
    miniatureStyle: {
      width: 70,
      height: 70,
      marginRight: 10,
    },
    viewPhoto: {
       alignItems: "center",
       height: 200,
       marginBottom: 20, 
    },
    mapStyle: {
       width: "100%",
       height: 550, 
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5,
        marginBottom: 40,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d",
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
        marginBottom: 40,
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680",
    },

});
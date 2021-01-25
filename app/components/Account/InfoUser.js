import React from "react"
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from  "expo-image-picker";



export default function InfoUser(props) {
    const { 
      userInfo: { uid, photoURL, distplayName, email },
      toastRef,
      setLoading,
      setLoadingText,
    } = props;
    
    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
            );
        const resultPermissionCamera = 
        resultPermission.permissions.cameraRoll.status;

        if(resultPermissionCamera === "denied"){
             toastRef.current.show("It is mandatory to accept the gallery permissions");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });

            if(result.cancelled) {
                toasterRef.current.show("you have closed the selection of images");
            } else {
               uploadImage(result.uri)
               .then(() => {
                   updatePhotoUrl();
                })
                .catch(() => {
                    toastRef.current.show("Avatar update error");
                });
            }    
        }
    }; 


    const uploadImage = async (uri) => {
        setLoadingText("Avatar update");
        setLoading(true);


     const response = await fetch(uri);
     const blob = await response.blob();

     const ref = firebase.storage().ref().child(`avatar/${uid}`);
     return ref.put(blob);
    };
    
    const updatePhotoUrl = () => {
        firebase
        .storage()
        .ref(`avatar/${uid}`)
        .getDownloadURL()
        .then(async (response) => {
          const update = {
              photoURL: response,
          };
          await firebase.auth().currentUser.updateProfile(update);
          setLoading(false);
        })
        .catch(() => {
            toastRef.current.show("Avatar update error");
        });
    };    

    return (
        <View style={styles.viewUserInfo}>
            <Avatar
            rounded
            size="large"
            showEditButton
            onEditPress={ChangeAvatar}
            containerStyle={styles.userInfoAvatar}
            source={
                photoURL
                ? { uri: photoURL }
                : require("../../../assets/img/avatar-default.jpg")
            }
            />
            <View>
              <Text style={styles.displayName}>
                  {displayName ? displayName : "Anonymous"}
              </Text>
              <Text>{email ? email : "Social Login"} </Text>  
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
    },
    userInfoAvatar: {
        marginRight: 20,
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
});


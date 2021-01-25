import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";

export default function ChangeDisplayNameForm(props) {
    const {displayName, setShowModal, toastRef } = props;
    const [newDisplayName, setNewDisplayName] = useState(null);

    const onSubmit = () => {
        console.log(newDisplayName);
    };

    return(
        <View style={styles.view}>
          <Input
          placeholder="Name and Surname"
          containerStyle={styles.input}
          rightIcon={{
              type: "material-community",
              name: "account-circle-outline",
              color: "#c2c2c2",
          }}
          defaultValue={displayName || ""}
          onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
          />
          <Button
          title="Change Name"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={onSubmit}
          />

        </View>
    );
}

const styles = StyleSheet.create({
    view: {
       alignItems: "center",
       paddingTop: 10,
       paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680",
    },
});
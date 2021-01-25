import React, { useState } from "react";
import { StyleSheet, View} from "react-native";
import {Input, Icon, Button} from "react-native-elements";
import Loading from "../Loading";
import {validateEmail} from "../../utils/validations";
import { size, isEmpty } from "lodash"; 
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

export default function RegisterForm(props) {
const { toastRef } = props;
const [showPassword, setShowPassword] = useState(false);
const [showRepeatPassword, setShowRepeatPassword] = useState(false);
const [formData, setFormData] = useState(defaultFormValue());
const [loading, setLoading] = useState(false);
const navigation = useNavigation();


const onSubmit = () => {
    if (
    isEmpty(formData.email) ||
    isEmpty(formData.password) ||
    isEmpty(formData.repeatPassword)
    ) {
       toastRef.current.show("All fields are required");
     } else if (!validateEmail(formData.email)) {
       toastRef.current.show("Wrong email address");
    } else if (formData.password !== formData.repeatPassword) {
       toastRef.current.show("Both passwords have to be the same");
    } else if (size(formData.password)<6) {
       toastRef.current.show("The password must be at least 6 characters long");
    } else {
        setLoading(true);
        firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
            setLoading(false);
            navigation.navigate("account");
            
        })
        .catch(() => {
            toastRef.current.show("there is an account already under that email address")
        });
    }
};

const onChange = (e, type) => {
    setFormData({...formData, [type]: e.nativeEvent.text});
    };


   return (
       <View style ={styles.formContainer}>
           <Input
           placeholder="Email address"
           containerStyle={styles.inputForm}
           onChange={(e) => onChange(e, "email")}
           rightIcon={
            
               <Icon
               type="material-community"
               name="at"
               iconStyle={styles.iconRight}
               />
           }
           />
           <Input
           placeholder="Password"
           containerStyle={styles.inputForm}
           password={true}
           secureTextEntry={showPassword ? false : true}
           onChange={(e) => onChange(e,"password")}
           rightIcon={
            <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(! showPassword)}
        />
        }
        />
           <Input
           placeholder="Repeat Password"
           containerStyle={styles.inputForm}
           password={true}
           secureTextEntry={showRepeatPassword ? false : true}
           onChange={(e) => onChange(e,"repeatPassword")}
           rightIcon={
            <Icon
            type="material-community"
            name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setShowRepeatPassword(! showRepeatPassword)}
            /> 
           }
           />
           <Button
           title="Log in"
           containerStyle={styles.btnContainerRegister}
           buttonStyle={styles.btnRegister}
           onPress={onSubmit}
           />
           <Loading isVisible={loading} text="Creating account" />
       </View>
   );
}

function defaultFormValue() {
    return {
        email: "",
        password: "",
        repeatPassword: "",
    };
}

const styles = StyleSheet.create ({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm:{
         width: "100%",
         marginTop: 20,
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%",
    },
    btnRegister: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color: "#c1c1c1",
    },

});
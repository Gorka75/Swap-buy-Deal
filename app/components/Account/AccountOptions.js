import React, { useState } from "react"; 
import { StyleSheet, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import { map } from "lodash";
import Modal from "./Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";

export default function AccountOptions(props) {
    const { userInfo, toastRef } = props;
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const selectedComponent = (key) => {
        switch(key) {
           case "displayName":
            setRenderComponent(
                <ChangeDisplayNameForm
                displayName={userInfo.displayName}
                setShowModal={setShowModal}
                toastRef={toastRef}
                />
            );
            setShowModal(true);
            break;
           case "email":
            setRenderComponent(<Text>Updating Email</Text>);
            setShowModal(true);
            break;
           case "password":
            setRenderComponent(<Text>Updating Password</Text>);
            setShowModal(true);
            break;
           default:
            setRenderComponent(null);
            setShowModal(false);
            break;
        }
    };
    const menuOptions = generateOptions(selectedComponent);

    return (
        <View>
            {map(menuOptions, (menu, index) => (
                <ListItem 
                key={index} 
                title={menu.title}
                leftIcon={{
                    type: menu.iconType,
                    name: menu.iconNameLeft,
                    color: menu.iconColorLeft,
                }}
                rightIcon={{
                    type: menu.iconType,
                    name: menu.iconNameRight,
                    color: menu.iconColorRight,
                }}
                containerStyle={styles.menuItem}
                onPress={menu.onPress}
                />
            ))}
            
            {renderComponent && (
            <Modal isVisible={showModal} setIsVisible={setShowModal}>
               {renderComponent}
            </Modal>
            )}
        </View>
    );
}

function generateOptions(selectedComponent)  {
   return [
       {
           title: "Update Name and Surname",
           iconType: "material-community",
           iconNameLeft: "account-circle",
           iconColorLeft: "#ccc",
           iconNameRight: "chevron-right",
           iconColorRight: "#ccc",
           onPress: () => selectedComponent("displayName"),
       },
       {
           title: "Update Email Address",
         iconType: "material-community",
           iconNameLeft: "at",
           iconColorLeft: "#ccc",
           iconNameRight: "chevron-right",
           iconColorRight: "#ccc",
           onPress: () => selectedComponent("email"),
       },
       {
           title: "Update Password",
         iconType: "material-community",
           iconNameLeft: "Lock-reset",
           iconColorLeft: "#ccc",
           iconNameRight: "chevron-right",
           iconColorRight: "#ccc",
           onPress: () => selectedComponent("password"),
       },
     ];      
}

const styles = StyleSheet.create({});
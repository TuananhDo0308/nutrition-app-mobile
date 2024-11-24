import React from "react";
import { Text, View } from "react-native";
import { Avatar, Button } from "react-native-paper";
import { useAppSelector } from "../hooks/hook";
import { RootState } from "../store/store";

const SettingScreen = () => {
  const user = useAppSelector((state: RootState) => state.user);
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: '95%', height: 100, marginTop: 110, alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 30 }}>
        <Avatar.Text size={100} label="AB" style={{ position: 'absolute', bottom: 50}} />
        
          <View style={{ left: 100, top: 20 }}>
            <Button
              mode="contained-tonal"
              onPress={() => alert}
            >
              Sửa
            </Button>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 20 }}>{user?.name}</Text>
          </View>
       
      </View>
    </View>
  );
};

export default SettingScreen;

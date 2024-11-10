import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearUser } from "../slices/userSlice/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hook";

const Home = ({ navigation }: any) => {
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    navigation.navigate("signIn");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {user?.name}!</Text>
      <Text style={styles.text}>Email: {user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Home;

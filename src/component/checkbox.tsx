import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface CustomCheckboxProps {
  onPress: () => void;
  checked: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ onPress, checked }) => {

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.checkbox}>
        <View style={checked && styles.checkboxChecked}></View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: 11,
    borderColor: 'green',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'green',
  },
});

export default CustomCheckbox;

import React, { useState, useRef } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Modal, View, TextInput, StyleSheet, Button, Text } from "react-native";

import ImageViewer from '@/components/ui/ImageViewer';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
}

const AddCommentModal = ({ visible, onClose, onSave }: Props) => {
  const [content, setContent] = useState("");
  const [nameError, setNameError] = useState("");

  const validateForm = (): boolean => {
    if (!content.trim()) {
      setNameError("Un commentaire ne peut pas être vide");
      return false;
    }

    setNameError("");
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(content.trim());
      setContent("");
      onClose();
    }
  };

  const imageRef = useRef<View>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const PlaceholderImage = require('@/assets/images/defaultImg.webp');

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Ajouter un commentaire</Text>
          <TextInput
            placeholder="Votre commentaire"
            value={content}
            onChangeText={setContent}
            multiline
            style={[styles.input,
            nameError ? styles.inputError : null]}

          />
          {nameError ? (
            <Text style={styles.errorText}>{nameError}</Text>
          ) : null}
          
          <View ref={imageRef} collapsable={false}>
            <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          </View>
          <View>
            <Button title="Choisir une photo" onPress={pickImageAsync} />
          </View>

          <View style={styles.button}>
            <Button title="Envoyer" onPress={handleSubmit} />
            <Button title="Annuler" onPress={onClose} color="grey" />
          </View>
        </View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  inputError: {
    borderColor: "#F44336",
  },
  errorText: {
    color: "#F44336",
    marginTop: 4,
    fontSize: 12,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    height: 100,
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 10,
  },
});

export default AddCommentModal;
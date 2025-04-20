import { TicketFirst, TicketTrue } from "@/types/ticket";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

// Props pour le formulaire
interface AddTicketFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (ticket: TicketFirst) => void;
  initialTicket?: TicketFirst;
}

const AddTicketForm: React.FC<AddTicketFormProps> = ({
  visible,
  onClose,
  onSave,
  initialTicket,
}) => {
  // État initial du ticket
  const [ticket, setTicket] = useState<TicketFirst>
   ({
    title: "",
    description:"",
    status: "new",
    priority: "medium",
    category: "hardware",
    dueDate: undefined, 
  });
  const [typeForm, setTypeForm] = useState<string>("")

  useEffect(() => {
    if (initialTicket) {
      setTicket(initialTicket);
      setTypeForm("edit")
    } else {
      setTypeForm("add")
    }
  }, [initialTicket]);
  // Options disponibles
  const statusOptions = ["new", "assigned", "in-progress","resolved","closed"];
  const priorityOptions = ["low", "medium", "high","critical"];
  const categoryOPtions = ["hardware","software","network","access","other"]
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Gestion des erreurs
  const [nameError, setNameError] = useState("");

  // Validation du formulaire
  const validateForm = (): boolean => {
    if (!ticket.title.trim()) {
      setNameError("Le titre du ticket est requis");
      return false;
    }
    if (!ticket.description.trim()) {
      setNameError("La description du ticket est requis");
      return false;
    }
    setNameError("");
    return true;
  };

  // Soumission du formulaire
  const handleSubmit = () => {

    if (validateForm()) {
      onSave(ticket);
      // Réinitialiser le formulaire
      setTicket({
    title: "",
    description:"",
    status: "new",
    priority: "medium",
    category: "hardware",
      });
      onClose();
    }
  };

  const detectLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission de localisation refusée");
        return;
      }
  
      const location = await Location.getCurrentPositionAsync({});
      const coords = `${location.coords.latitude},${location.coords.longitude}`;
      setTicket((prev) => ({ ...prev, location: coords }));
    } catch (error) {
      console.error("Erreur de géolocalisation :", error);
      alert("Impossible d'obtenir la position");
    }
  };

  // Selection d'option
  const renderOptions = (
    options: string[],
    selectedValue: string,
    field: "status" | "priority"|"category"
  ) => {
    const isEditMode = typeForm === "edit";
    const isStatusField = field === "status";
    return (
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              ticket[field] === option && styles.selectedOption,
            ]}
            onPress={() => {
              if (isStatusField || !isEditMode) {
                setTicket({ ...ticket, [field]: option });
              }
            }}
            disabled={isEditMode && field !== "status"}
          >
            <Text
              style={[
                styles.optionText,
                ticket[field] === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingContainer}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nouveau Ticket</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nom du ticket</Text>
                  <TextInput
                    style={[styles.input, 
                      nameError ? styles.inputError : null, 
                      typeForm === "edit" && { backgroundColor: "#EDEDED", color: "#999" },]}
                    value={ticket.title}
                    onChangeText={(text) => {
                      if (typeForm !== "edit") {
                        setTicket({ ...ticket, title: text });
                        if (text.trim()) setNameError("");
                      }
                    }}
                    placeholder="Titre du ticket..."
                    placeholderTextColor="#A0A0A0"
                  />
                  {nameError ? (
                    <Text style={styles.errorText}>{nameError}</Text>
                  ) : null}

                  <Text style={styles.label}>Description du ticket</Text>
                  <TextInput
                    style={[styles.input,
                       nameError ? styles.inputError : null, 
                      typeForm === "edit" && { backgroundColor: "#EDEDED", color: "#999" },]}
                    value={ticket.description}
                    onChangeText={(text) => {
                      if (typeForm !== "edit") {
                        setTicket({ ...ticket, description: text });
                        if (text.trim()) setNameError("");
                      }
                    }}
                    placeholder="Décrivez le ticket..."
                    placeholderTextColor="#A0A0A0"
                  />
                  {nameError ? (
                    <Text style={styles.errorText}>{nameError}</Text>
                  ) : null}
                </View>
                {typeForm !== "edit" && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date limite</Text>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Ionicons name="calendar-outline" size={16} color="#2196F3" />
                      <Text style={styles.dateButtonText}>
                        {ticket.dueDate
                          ? `Date choisie : ${ticket.dueDate.toDate().toLocaleDateString()}`
                          : "Choisir une date"}
                      </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={ticket.dueDate ? ticket.dueDate.toDate() : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setTicket((prev) => ({
                              ...prev,
                              dueDate: Timestamp.fromDate(selectedDate),
                            }));
                          }
                        }}
                      />
                    )}
                  </View>
                )}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Statut</Text>
                  {renderOptions(statusOptions, ticket.status, "status")}
                </View>

                {typeForm !== "edit" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Priorité</Text>
                  {renderOptions(priorityOptions, ticket.priority, "priority")}
                </View>
              )}
              
                {typeForm !== "edit" && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Catégorie</Text>
                    {renderOptions(categoryOPtions, ticket.category, "category")}
                  </View>
                )}

              {typeForm == "add" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Localisation</Text>
                  {ticket.location && (
                    <Text style={styles.locationText}>
                      Position détectée : {ticket.location}
                    </Text>
                  )}
                  <TouchableOpacity onPress={detectLocation} style={styles.detectButton}>
                    <Ionicons name="earth-outline" size={16}></Ionicons>
                    <Text style={styles.detectButtonText}>Détecter la position</Text>
                  </TouchableOpacity>
            
                </View>
              )}
              </ScrollView>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "60%",
    maxHeight: "90%",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#757575",
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#424242",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "#212121",
  },
  inputError: {
    borderColor: "#F44336",
  },
  errorText: {
    color: "#F44336",
    marginTop: 4,
    fontSize: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#F5F5F5",
  },
  selectedOption: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  optionText: {
    color: "#757575",
    fontSize: 14,
  },
  selectedOptionText: {
    color: "#2196F3",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  detectButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  detectButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  locationText: {
    marginTop: 8,
    color: "#424242",
    fontSize: 14,
  },
  dateButton: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateButtonText: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default AddTicketForm;
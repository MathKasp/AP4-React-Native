import { Ticket } from "@/services/ticket.service";
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

// Props pour le formulaire
interface AddTicketFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (ticket: Ticket) => void;
  initialTicket?: Ticket;
}

const AddTicketForm: React.FC<AddTicketFormProps> = ({
  visible,
  onClose,
  onSave,
  initialTicket,
}) => {
  // État initial du ticket
  const [ticket, setTicket] = useState<Ticket>
   ({
    idTicket: "",
    name: "",
    status: "Open",
    priority: "Medium", 
  });

  useEffect(() => {
    if (initialTicket) {
      setTicket(initialTicket);
    }
  }, [initialTicket]);
  // Options disponibles
  const statusOptions = ["Open", "In Progress", "Closed"];
  const priorityOptions = ["High", "Medium", "Low"];

  // Gestion des erreurs
  const [nameError, setNameError] = useState("");

  // Validation du formulaire
  const validateForm = (): boolean => {
    if (!ticket.name.trim()) {
      setNameError("Le nom du ticket est requis");
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
        idTicket:"",
        name: "",
        status: "Open",
        priority: "Medium",
      });
      onClose();
    }
  };

  // Selection d'option
  const renderOptions = (
    options: string[],
    selectedValue: string,
    field: "status" | "priority"
  ) => {
    return (
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              ticket[field] === option && styles.selectedOption,
            ]}
            onPress={() => setTicket({ ...ticket, [field]: option })}
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
                    style={[styles.input, nameError ? styles.inputError : null]}
                    value={ticket.name}
                    onChangeText={(text) => {
                      setTicket({ ...ticket, name: text });
                      if (text.trim()) setNameError("");
                    }}
                    placeholder="Décrivez le ticket..."
                    placeholderTextColor="#A0A0A0"
                  />
                  {nameError ? (
                    <Text style={styles.errorText}>{nameError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Statut</Text>
                  {renderOptions(statusOptions, ticket.status, "status")}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Priorité</Text>
                  {renderOptions(priorityOptions, ticket.priority, "priority")}
                </View>
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
});

export default AddTicketForm;
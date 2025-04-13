import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from "@expo/vector-icons/build/Ionicons";
type Props = {
  label: string;
  theme?: string;
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  if (theme === 'edit') {
    return (
      <View style={[styles.buttonContainer, styles.editButton]}>
        <Pressable style={styles.buttonMain} onPress={onPress}>
          <Ionicons size={24} name='create-outline'></Ionicons>
          <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      </View>
    );
  } else if (theme === 'delete') {
    return (
      <View style={[styles.buttonContainer, styles.deleteButton]}>
        <Pressable style={styles.buttonMain} onPress={onPress}>
          <Ionicons size={24} name='trash-outline'></Ionicons>
          <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      </View>
    );
  }
  else if (theme === 'primary') {
    return (
      <View
        style={[
          styles.buttonContainerMain,
          { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
        ]}>
        <Pressable style={[styles.buttonMain, { backgroundColor: '#fff' }]} onPress={onPress}>
          {/* <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} /> */}
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }
  else if (theme === 'secondary') {
    return (
      <View
        style={[
          styles.buttonContainerMain,
          { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
        ]}>
        <Pressable style={[styles.buttonMain, { backgroundColor: '#ff0000' }]} onPress={onPress}>
          <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainerMain}>
      <Pressable style={styles.buttonMain} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainerMain: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  buttonMain: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#000000',
    fontSize: 16,
  },
  buttonContainer: {
    height: 68,
    marginHorizontal: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    flex: 1, 
  },
  editButton: {
    borderWidth: 2,
    borderColor: 'yellow',
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: 'red',
  },
});

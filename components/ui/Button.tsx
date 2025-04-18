import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from "@expo/vector-icons/build/Ionicons";
type Props = {
  label: string;
  theme?: string;
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  const renderButton = () => {
    switch (theme) {
      case 'edit':
        return (
          <View style={[styles.buttonContainer, styles.editButton]}>
            <Pressable style={styles.buttonMain} onPress={onPress}>
              <Ionicons size={24} name='create-outline' />
              <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
          </View>
        );
        case 'delete':
          return (
            <View style={[styles.buttonContainer, styles.deleteButton]}>
              <Pressable style={styles.buttonMain} onPress={onPress}>
                <Ionicons size={24} name='trash-outline' />
                <Text style={styles.buttonLabel}>{label}</Text>
              </Pressable>
            </View>
          );
          case 'comment':
          return (
            <View style={[styles.buttonContainerComment, styles.commentbutton]}>
              <Pressable style={styles.buttonMainComment} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
              </Pressable>
            </View>
          );
  
          case 'primary':
            return (
              <View style={[styles.buttonContainerMain, { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 }]}>
                <Pressable style={[styles.buttonMain, { backgroundColor: '#fff' }]} onPress={onPress}>
                  <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
                </Pressable>
              </View>
            );
            case 'secondary':
              return (
                <View style={[styles.buttonContainerMain, { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 }]}>
                  <Pressable style={[styles.buttonMain, { backgroundColor: '#ff0000' }]} onPress={onPress}>
                    <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
                    <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
                  </Pressable>
                </View>
              );

              default:
                return (
                  <View style={styles.buttonContainerMain}>
                    <Pressable style={styles.buttonMain} onPress={onPress}>
                      <Text style={styles.buttonLabel}>{label}</Text>
                    </Pressable>
                  </View>
                );
            }
          };
  return renderButton();
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
  buttonMainComment: {
    borderRadius: 10,
    width: '70%',
    height: '50%',
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
  buttonContainerComment: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  editButton: {
    borderWidth: 2,
    borderColor: 'yellow',
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: 'red',
  },
  commentbutton: {
    borderWidth: 2,
    borderColor: "blue"
  }
});

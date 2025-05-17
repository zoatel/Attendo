import { createStackNavigator } from '@react-navigation/stack';
import UIDInputScreen from '../screens/UIDInputScreen';
import MACAddressScreen from '../screens/MACAddressScreen';
import CoursesScreen from '../screens/CoursesScreen';
import AttendanceDetailsScreen from '../screens/AttendanceDetailsScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="UIDInput">
      <Stack.Screen name="UIDInput" component={UIDInputScreen} />
      <Stack.Screen name="MACAddress" component={MACAddressScreen} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="AttendanceDetails" component={AttendanceDetailsScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
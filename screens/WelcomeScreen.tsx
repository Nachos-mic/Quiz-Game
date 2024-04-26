/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlatList , RefreshControl, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Results'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,

} from 'react-native/Libraries/NewAppScreen';
import { RootStackParamList } from '../data/types';




type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const [isSelected, setSelection] = React.useState(false);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);


  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      navigation.navigate('Home'); // Attempting to navigate to 'Home'
    } catch (error) {
      console.log(error);
    }
  };

  


  return (

         <SafeAreaView>
          <ScrollView>
            <View style = {styles.terms}>
                <Text style = {styles.termsText}>Terms of Use</Text>

                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>
                <Text>Blah Blah Blah</Text>

            </View>
          </ScrollView>
          
          <View style = {styles.terms}>
            <View style = {styles.welcomeBoxView}>
                <Text>By continuing, you agree to abide by the following rules and guidelines.</Text>
                <Switch
               trackColor={{ false: "#767577", true: "#54BF72" }}
               thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
               ios_backgroundColor="#3e3e3e"
               onValueChange={toggleSwitch}
               value={isEnabled}
            />
            </View>
          </View>
            

            <TouchableOpacity style = {styles.dec} onPress={handleContinue} disabled={!isEnabled}>
                <Text>Accept Terms of Use</Text>
            </TouchableOpacity>

        </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  welcomeBoxView: {
    flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
},
welcomeBox: {
  flex: 1,
  backgroundColor: 'white',
  borderRadius: 15,
  shadowColor: 'black',
  shadowOpacity: 0.5,
  shadowOffset: {width: 0, height: 2},
  shadowRadius: 10,
  elevation: 5,
  padding: 10,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 20,
  marginRight: 20,
},
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  resultTile: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'cyan',
    height: 100,
    margin: 5,
    borderRadius: 25 ,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },

  terms: {
    alignItems: 'center',    
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    margin: 30,
    borderRadius: 25 ,
  },
  termsText: {
    fontSize: 20
  },
  dec: {
    
    alignItems: 'center',    
    justifyContent: 'center',
    backgroundColor: 'cyan',
    height: 50,
    margin: 30,
    borderRadius: 25 ,
  }, 
});


export default WelcomeScreen;
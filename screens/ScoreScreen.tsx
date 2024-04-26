/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Test'
>;

interface Quiz {
  id: string;
  name: string;
  level: string;
  numberOfTasks: number;
  description: string;
  tasks: Task[];
  // add other properties as needed
}

interface Task {
  question: string;
  answers: Answer[];
  duration: number;
  // add other properties as needed
}

interface Answer {
  content: string;
  isCorrect: boolean;
}


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



function TestScreen({navigation}: Props): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (

    <SafeAreaView style={[styles.head]}>

            <View style={styles.question}>
                <Text style = {styles.mainText}>Congrats , you ended your Quiz</Text>
            </View>

            <View style={styles.question}>
                <Text>Your score: 1</Text>
            </View>
    
            <TouchableOpacity style = {styles.aButton} onPress={ () => navigation.navigate("Home") }>
                <Text>Go to HomeScreen</Text>
            </TouchableOpacity>
   
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  mainText: {
    fontSize: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  head: {
    flex: 1,
    backgroundColor: 'white'
},
  aButton: {
    alignItems: 'center',    
    justifyContent: 'center',
    backgroundColor: 'cyan',
    margin: 30,
    height: 40,
    width: 100,
    borderRadius: 25 ,
  },
  question: {
    alignItems: 'center',    
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 30,
    borderRadius: 25 ,
  },

});

export default TestScreen;

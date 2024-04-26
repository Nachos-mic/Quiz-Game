/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect , useState} from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import { FlatList , RefreshControl , ActivityIndicator } from 'react-native';
import { fonts } from '../assets/fonts/fonts';
import axios from 'axios';

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



function ResultScreen({navigation}: Props): JSX.Element {

  const [results, setResults] = useState([] as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://tgryl.pl/quiz/results?last=20',
    {
      method: "GET",
      headers: {
        "Content-Type" : "application/json"
      }
    })
      .then((resp) => resp.json())
      .then((json) => setResults(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  return (

         <SafeAreaView style={backgroundStyle}>

            <View style={styles.headerTile} >

                <Text style={fonts.Roboto}>Last 20 test results</Text>

                <TouchableOpacity style = {styles.back} onPress={ () => navigation.navigate("Home") }>
                    <Text>Go back to Home screen</Text>
                </TouchableOpacity>

            </View>

            {loading ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  data={results}
                  keyExtractor={({ id }) => id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.resultTile}>
                      <Text style = {fonts.Afacad}>Użytkownik: {item.nick}</Text>
                      <Text style = {fonts.Afacad}>Wynik: {item.score}/{item.total}</Text>
                      <Text style = {fonts.Afacad}>Typ: {item.type}</Text>
                      <Text style = {fonts.Afacad}>Ukończony: {item.createdOn}</Text>
                    </View>
                  )}
              />
                
              )}

        </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 24,
    alignSelf: 'center'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerTile: {
    backgroundColor: 'cyan',  
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
  back: {
    
    alignItems: 'center',    
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    padding: 10,
    height: 50,
    margin: 30,
    borderRadius: 25 ,
  }, 
});

export default ResultScreen;

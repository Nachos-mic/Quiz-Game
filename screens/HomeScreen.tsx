/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React , { useState , useEffect, useRef} from 'react';

import { RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import { FlatList , RefreshControl , ActivityIndicator , RefreshControlBase , Alert} from 'react-native';
import axios from 'axios';
import { fonts } from '../assets/fonts/fonts'; 
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from "lodash";
import SQLite from 'react-native-sqlite-2';
import NetInfo from "@react-native-community/netinfo";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
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




function HomeScreen({navigation}: Props): JSX.Element {

  interface Quiz {
    id: string;
    name: string;
    level: string;
    numberOfTasks: number;
    description: string;
    tags: string[];
    // add other properties as needed
}

interface Scores {
    [key: string]: number;
}

type RootStackParamList = {
    Welcome: undefined;
    Home: undefined;
    Results: undefined;
    Quiz: { id: string };
    Search: undefined;
};

const route = useRoute<RouteProp<RootStackParamList, 'Quiz'>>();
//const quizIndex = route.params?.quizIndex ?? 0;
const [loading, setLoading] = useState(true);
const [tests, setTests] = useState<Quiz[]>([]);
const [refreshing, setRefreshing] = React.useState(false);
const shufTests = _.shuffle(tests) as any;
const scrollViewRef = useRef<ScrollView>(null);

const randomPick = () => {
    const randomNumber = Math.floor(Math.random() * shufTests.length);
    navigation.navigate("Test" , { testId: shufTests[randomNumber].id})
  }

  const Reload = async () => {
    setLoading(true);
    await fetchTests();
    onRefresh();
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

const fetchTests = () => {
    NetInfo.fetch().then(state => {
        if (!state.isConnected) {
            Alert.alert('Brak internetu!', 'Prosze sprawdz swoje połączenie i spróbuj ponownie.');
        } else {
            fetch('http://tgryl.pl/quiz/tests')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const db = SQLite.openDatabase('quizData.db', '1.0', '', 1);
                    db.transaction(function(txn) {
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS Quizzes(id TEXT PRIMARY KEY NOT NULL, name TEXT, level TEXT, numberOfTasks INTEGER, description TEXT, tags TEXT);',
                            []
                        );

                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS QuizDetails(quizId TEXT, question TEXT, answers TEXT, duration INTEGER);',
                            []
                        );

                        txn.executeSql(
                            'SELECT * FROM Quizzes;',
                            [],
                            (tx, resultSet) => {
                                if (JSON.stringify(resultSet.rows) !== JSON.stringify(data)) {
                                    txn.executeSql(
                                        'DELETE FROM Quizzes;',
                                        [],
                                        (tx, resultSet) => {
                                            console.log('Deleted old data from Quizzes');
                                        },
                                        (tx, error) => {
                                            console.log('Deletion error: ', error);
                                            return true;
                                        }
                                    );

                                    txn.executeSql(
                                        'DELETE FROM QuizDetails;',
                                        [],
                                        (tx, resultSet) => {
                                            console.log('Deleted old data from QuizDetails');
                                        },
                                        (tx, error) => {
                                            console.log('Deletion error: ', error);
                                            return true;
                                        }
                                    );

                                    data.forEach((quiz: Quiz) => {
                                        const tagsString = JSON.stringify(quiz.tags);
                                        console.log('Inserting quiz: ', quiz);

                                        txn.executeSql(
                                            'INSERT INTO Quizzes (id, name, level, numberOfTasks, description, tags) VALUES (?, ?, ?, ?, ?, ?)',
                                            [quiz.id, quiz.name, quiz.level, quiz.numberOfTasks, quiz.description, tagsString],
                                            (tx, resultSet) => {
                                                console.log('Insertion result: ', resultSet);
                                            },
                                            (tx, error) => {
                                                console.log('Insertion error: ', error);
                                                return true;
                                            }
                                        );

                                        fetch(`http://tgryl.pl/quiz/test/${quiz.id}`)
                                            .then(response => response.json())
                                            .then(quizDetail => {
                                                db.transaction(function(innerTxn) {
                                                    quizDetail.tasks.forEach((task: any) => {
                                                        const answersString = JSON.stringify(task.answers);
                                                        console.log('Inserting quiz detail: ', task);

                                                        innerTxn.executeSql(
                                                            'INSERT INTO QuizDetails (quizId, question, answers, duration) VALUES (?, ?, ?, ?)',
                                                            [quiz.id, task.question, answersString, task.duration],
                                                            (tx, resultSet) => {
                                                                console.log('Insertion result: ', resultSet);
                                                            },
                                                            (tx, error) => {
                                                                console.log('Insertion error: ', error);
                                                                return true;
                                                            }
                                                        );
                                                    });
                                                });
                                            })
                                            .catch(error => console.error(error));
                                    });
                                }
                            },
                            (tx, error) => {
                                console.log('Selection error: ', error);
                                return true;
                            }
                        );
                    });
                })
                .catch(error => console.error(error));
        }
    });
};




const createQuizDetailsTable = () => {
    const db = SQLite.openDatabase('quizData.db', '1.0', '', 1);
    db.transaction(function(txn) {
        txn.executeSql(
            'CREATE TABLE IF NOT EXISTS QuizDetails(quizId TEXT, question TEXT, answers TEXT, duration INTEGER);',
            []
        );
    });
};

// Call this function when your app starts or in an appropriate initialization section.
createQuizDetailsTable();

const logQuizzes = () => {
    const db = SQLite.openDatabase('quizData.db', '1.0', '', 1);
    db.transaction(txn => {
        txn.executeSql('SELECT * FROM Quizzes', [], (tx, res) => {
            const quizzes: Quiz[] = [];
            for (let i = 0; i < res.rows.length; ++i) {
                const item = res.rows.item(i);
                const parsedTags = JSON.parse(item.tags || '[]'); // Parse the tags string back to an array
                const quizWithTags = { ...item, tags: parsedTags }; // Replace the tags string with parsed array
                quizzes.push(quizWithTags);
            }
            // Log the quizzes
            console.log(quizzes);
        });
    });
};

const logQuizDetails = () => {
    // Open the SQLite2 database
    const db = SQLite.openDatabase('quizData.db', '1.0', '', 1);
    db.transaction(function(txn) {
        // Select all details for the specified quiz from the QuizDetails table
        txn.executeSql('SELECT * FROM QuizDetails', [], function(tx, res) {
            const quizDetails: any[] = [];
            for (let i = 0; i < res.rows.length; ++i) {
                quizDetails.push(res.rows.item(i));
            }
            // Log the quiz details
            console.log(quizDetails);
        }, function(tx, error) {
            // Log the error
            console.log('Error executing SQL: ', error);
            // Return false to roll back the transaction
            return false;
        });
    });
};


useEffect(() => {
    fetchTests(); // Fetch quizzes on component mount
}, []);
    

useEffect(() => {
    fetch('http://tgryl.pl/quiz/tests')
        .then(response => response.json())
        .then(data => setTests
        (data))
        .catch(error => console.error(error));
}, []);



 

  return (

         <SafeAreaView>

              <View style={styles.headerTile} >

                  <Text style={fonts.Roboto}>Tests available</Text>

                  <TouchableOpacity style = {styles.result} onPress={ () => navigation.navigate("Results") }>
                      <Text>See results</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style = {styles.result} onPress={Reload}>
                      <Text>Reload tests</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style = {styles.result} onPress={randomPick}>
                      <Text>Take random test</Text>
                  </TouchableOpacity>

              </View>


            <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }>
            {shufTests.map((item, index) => (
                <View key={index}>
                <TouchableOpacity style={styles.test} onPress={() => navigation.navigate("Test", { testId: item.id })}>
                    <Text style={fonts.Afacad}>{item.name}</Text>
                    <Text></Text>
                    <Text style={fonts.Afacad}>Opis: {item.description}</Text>
                    <Text style={fonts.Afacad}>Poziom: {item.level}</Text>
                </TouchableOpacity>
                </View>
            ))}
            </ScrollView>

    
        </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  headerTile: {
    backgroundColor: 'cyan',  
  },
  headerText: {
    fontSize: 24,
    alignSelf: 'center'
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
  test: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'cyan',
    height: 100,
    margin: 5,
    borderRadius: 25 ,
  },    
  result: {
    
    alignItems: 'center',    
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    padding: 10,
    height: 50,
    margin: 5,
    borderRadius: 25 ,
  },  
},
);

export default HomeScreen;


import { StackNavigationProp } from '@react-navigation/stack';

type TestScreenParams = {
    testId: any; // Example parameter for the Test screen
  };

export type RootStackParamList = {
    Welcome : undefined;
    Home : undefined;
    Test : TestScreenParams;
    Score: undefined;
    Results : undefined;
}
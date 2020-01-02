import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './Home';

const MainNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            header: null
        }
    },
})

const AppNavigator = createAppContainer(MainNavigator);

export default AppNavigator;
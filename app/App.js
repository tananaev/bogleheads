import React, { Component, Fragment } from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Forums from './Forums';
import Topics from './Topics';
import Posts from './Posts';

const RootStack = createStackNavigator({
  Forums,
  Topics,
  Posts
}, {
  initialRouteName: 'Forums',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#1565C0'
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'normal'
    }
  }
});

class App extends Component {
  render() {
    return (
      <Fragment>
        <StatusBar
          backgroundColor="#0D47A1"
          barStyle="light-content" />
        <RootStack />
      </Fragment>
    );
  }
}

export default App;

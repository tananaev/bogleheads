import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation';
import Forums from './Forums';
import Topics from './Topics';
import Posts from './Posts';

const RootStack = createStackNavigator({
  Forums,
  Topics,
  Posts
}, {
  initialRouteName: 'Forums'
});

class App extends Component {
  render() {
    return <RootStack />;
  }
}

export default App;

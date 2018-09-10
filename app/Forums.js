import React, {Component} from 'react';
import {View} from 'react-native';
import cheerio from 'react-native-cheerio';
import { Screen, NavigationBar, Title, ListView, Tile, Subtitle, Divider } from '@shoutem/ui';
import {displayName} from '../app.json';

class Forums extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forums: []
    }
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount(){
    fetch('https://www.bogleheads.org/forum/index.php')
      .then((response) => response.text())
      .then((responseText) => {
        const document = cheerio.load(responseText);

        /*this.setState({
          isLoading: false,
          dataSource: responseJson.movies,
        }, function(){

        });*/

        console.log(responseText);

      });
  }

  renderRow(forum) {
    return (
      <View>
        <Tile>
          <Title styleName="md-gutter">COOL BLACK AND WHITE STYLISH WATCHES</Title>
          <Subtitle styleName="sm-gutter">$280.00</Subtitle>
        </Tile>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    const { forums } = this.state;
    return (
      <Screen>
        <NavigationBar
          title={displayName}
          styleName="inline" />
        <ListView
          data={forums}
          renderRow={this.renderRow} />
      </Screen>
    );
  }
}

export default Forums;

import React, { Component } from 'react';
import { View } from 'react-native';
import { Screen, NavigationBar, Title, ListView, Tile, Subtitle, Divider } from '@shoutem/ui';
import { displayName } from '../app.json';
import Parser from './Parser';

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
        const parser = new Parser(responseText);
        const forums = parser
          .find('body', 0)
          .find('div', 0)
          .find('div', 1)
          .find('div', 0)
          .find('div', 0)
          .find('ul', 1)
          .find('li')
          .map(item => {
            item = item
              .find('dl', 0)
              .find('dt', 0)
              .find('div', 0);
            const link = item.find('a', 0);
            return {
              id: link.attr('href'),
              title: link.text(),
              description: item.text()
            }
          });
        this.setState({ forums });
      });
  }

  renderRow(forum) {
    return (
      <View>
        <Tile>
          <Title styleName="md-gutter">{forum.title}</Title>
          <Subtitle styleName="md-gutter-horizontal md-gutter-bottom">{forum.description}</Subtitle>
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

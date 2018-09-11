import React, { Component } from 'react';
import { Screen, NavigationBar, Text, ListView, Tile, Title, Divider, Spinner, View, TouchableOpacity } from '@shoutem/ui';
import { displayName } from '../app.json';
import Parser from './Parser';

class Forums extends Component {
  static navigationOptions = {
    title: displayName
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      forums: []
    }
    this.openForum = this.openForum.bind(this);
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
              id: link.attr('href').match(/f=\d+/g)[0].substring(2),
              title: link.text(),
              description: item.text()
            }
          });
        this.setState({ forums });
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  openForum(forum) {
    this.props.navigation.navigate('Topics', {
      forumId: forum.id,
      forumTitle: forum.title
    });
  }

  renderRow(forum) {
    return (
      <View>
        <TouchableOpacity onPress={() => this.openForum(forum)}>
          <Tile>
            <Title styleName="md-gutter">{forum.title}</Title>
            <Text styleName="md-gutter-horizontal md-gutter-bottom">{forum.description}</Text>
          </Tile>
        </TouchableOpacity>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    const { error, forums } = this.state;
    let content;
    if (!error && !forums.length) {
      content = (
        <Spinner styleName="large center xl-gutter-top" />
      );
    } else if (error) {
      content = (
        <View styleName="center xl-gutter-top">
          <Title>Page error</Title>
        </View>
      );
    } else {
      content = (
        <ListView
          data={forums}
          renderRow={this.renderRow} />
      );
    }
    return (
      <Screen>
        {content}
      </Screen>
    );
  }
}

export default Forums;

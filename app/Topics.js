import React, { Component } from 'react';
import { Screen, NavigationBar, Text, ListView, Tile, Title, Divider, Spinner, View, TouchableOpacity } from '@shoutem/ui';
import Parser from './Parser';

class Topics extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('forumTitle'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      topics: []
    }
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount(){
    const { navigation } = this.props;
    const forumId = navigation.getParam('forumId');
    fetch(`https://www.bogleheads.org/forum/viewforum.php?f=${forumId}`)
      .then((response) => response.text())
      .then((responseText) => {
        const parser = new Parser(responseText);
        const topics = parser
          .find('body', 0)
          .find('div', 0)
          .find('div', 1)
          .find('div', 3)
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
              id: link.attr('href').match(/t=\d+/g)[0].substring(2),
              title: link.text(),
              update: item.find('div', 0).find('a', 1).text()
            }
          });
        this.setState({ topics });
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  openTopic(topic) {
    const { navigation } = this.props;
    this.props.navigation.navigate('Posts', {
      forumId: navigation.getParam('forumId'),
      topicId: topic.id,
      topicTitle: topic.title
    });
  }

  renderRow(topic) {
    return (
      <View>
        <TouchableOpacity onPress={() => this.openTopic(topic)}>
          <Tile>
            <Title styleName="md-gutter">{topic.title}</Title>
            <Text styleName="md-gutter-horizontal md-gutter-bottom">{topic.update}</Text>
          </Tile>
        </TouchableOpacity>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { error, topics } = this.state;
    let content;
    if (!error && !topics.length) {
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
          data={topics}
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

export default Topics;

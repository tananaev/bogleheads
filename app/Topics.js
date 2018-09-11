import React, { Component, Fragment } from 'react';
import { Screen, Text, ListView, Tile, Title, Divider, Spinner, View, TouchableOpacity, DropDownMenu } from '@shoutem/ui';
import Parser from './Parser';

class Topics extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Title numberOfLines={1} style={{color: 'white'}} styleName="md-gutter-right">
          {navigation.getParam('forumTitle')}
        </Title>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      topics: []
    }
    this.openPage = this.openPage.bind(this);
    this.openTopic = this.openTopic.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    const forumId = navigation.getParam('forumId');
    const start = navigation.getParam('page') * 50;
    fetch(`https://www.bogleheads.org/forum/viewforum.php?f=${forumId}&start=${start}`)
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
            item = item.find('dl', 0);
            const count = parseInt(item.find('dd', 0).text()) + 1;
            item = item.find('dt', 0).find('div', 0);
            const link = item.find('a', 0);
            return {
              id: link.attr('href').match(/t=\d+/g)[0].substring(2),
              title: link.text(),
              update: item.find('div', 0).find('a', 1).text(),
              count: count
            }
          });
        this.setState({ topics });
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  openPage(index) {
    const { navigation } = this.props;
    navigation.replace('Topics', {
      forumId: navigation.getParam('forumId'),
      forumTitle: navigation.getParam('forumTitle'),
      topicCount: navigation.getParam('topicCount'),
      page: index
    });
  }

  openTopic(topic) {
    const { navigation } = this.props;
    navigation.navigate('Posts', {
      forumId: navigation.getParam('forumId'),
      topicId: topic.id,
      topicTitle: topic.title,
      postCount: topic.count,
      page: 0
    });
  }

  renderRow(topic, _, rowId) {
    return (
      <View>
        <TouchableOpacity onPress={() => this.openTopic(topic)}>
          <Tile style={{backgroundColor: (parseInt(rowId) & 1) ? '#ECF3F7' : '#E1EBF2'}}>
            <Title styleName="md-gutter">{topic.title}</Title>
            <Text styleName="md-gutter-horizontal md-gutter-bottom">{topic.update}</Text>
          </Tile>
        </TouchableOpacity>
        <Divider styleName="line" />
      </View>
    );
  }

  createMenu() {
    const { navigation } = this.props;
    const menu = [];
    const page = navigation.getParam('page');
    const count = Math.trunc(navigation.getParam('topicCount') / 50);
    const begin = Math.max(0, page - 5);
    const end = Math.min(count, page + 5);
    for (let i = begin; i <= end; i += 1) {
      menu.push({
        index: i,
        name: `Page ${i + 1}`
      });
    }
    return [menu, page - begin];
  }

  render() {
    const { error, topics } = this.state;
    const [menu, index] = this.createMenu();
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
        <Fragment>
          <ListView
            data={topics}
            renderRow={this.renderRow} />
          { menu.length > 1 &&
            <DropDownMenu
              styleName="horizontal"
              options={menu}
              selectedOption={menu[index]}
              onOptionSelected={(page) => this.openPage(page.index)}
              titleProperty="name"
              valueProperty="index" />
          }
        </Fragment>
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

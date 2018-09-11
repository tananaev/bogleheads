import React, { Component, Fragment } from 'react';
import { XMLSerializer } from 'xmldom';
import HTMLView from 'react-native-htmlview';
import { Screen, Html, ListView, Tile, Title, Divider, Spinner, View, DropDownMenu } from '@shoutem/ui';
import Parser from './Parser';

class Posts extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Title numberOfLines={1} style={{color: 'white'}} styleName="md-gutter-right">
          {navigation.getParam('topicTitle')}
        </Title>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      posts: []
    }
    this.openPage = this.openPage.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount(){
    const { navigation } = this.props;
    const forumId = navigation.getParam('forumId');
    const topicId = navigation.getParam('topicId');
    const start = navigation.getParam('page') * 50;
    const serializer = new XMLSerializer();
    fetch(`https://www.bogleheads.org/forum/viewtopic.php?f=${forumId}&t=${topicId}&start=${start}`)
      .then((response) => response.text())
      .then((responseText) => {
        const parser = new Parser(responseText);
        const posts = parser
          .find('body', 0)
          .find('div', 0)
          .find('div', 1)
          .find('div')
          .filter((_, index, array) => index > 1 && index < array.length - 2)
          .map(item => {
            item = item
              .find('div', 0)
              .find('div', 0)
              .find('div', 0)
              .find('div', 0);
            return {
              html: serializer.serializeToString(item.element)
            }
          });
        this.setState({ posts });
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  openPage(index) {
    const { navigation } = this.props;
    navigation.replace('Posts', {
      forumId: navigation.getParam('forumId'),
      topicId: navigation.getParam('topicId'),
      topicTitle: navigation.getParam('topicTitle'),
      postCount: navigation.getParam('postCount'),
      page: index
    });
  }

  renderRow(post) {
    return (
      <View>
        <Tile>
          <Html body={post.html} />
        </Tile>
        <Divider styleName="line" />
      </View>
    );
  }

  createMenu() {
    const { navigation } = this.props;
    const menu = [];
    const page = navigation.getParam('page');
    const count = Math.trunc(navigation.getParam('postCount') / 50);
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
    const { error, posts } = this.state;
    const [menu, index] = this.createMenu();
    let content;
    if (!error && !posts.length) {
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
            data={posts}
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

export default Posts;

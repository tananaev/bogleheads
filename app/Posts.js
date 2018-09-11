import React, { Component } from 'react';
import { XMLSerializer } from 'xmldom';
import { Screen, NavigationBar, Html, ListView, Tile, Title, Divider, Spinner, View } from '@shoutem/ui';
import Parser from './Parser';

class Posts extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('topicTitle'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      posts: []
    }
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount(){
    const { navigation } = this.props;
    const forumId = navigation.getParam('forumId');
    const topicId = navigation.getParam('topicId');
    const serializer = new XMLSerializer();
    fetch(`https://www.bogleheads.org/forum/viewtopic.php?f=${forumId}&t=${topicId}`)
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

  render() {
    const { navigation } = this.props;
    const { error, posts } = this.state;
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
        <ListView
          data={posts}
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

export default Posts;

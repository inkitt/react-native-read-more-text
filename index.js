import React from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default class ReadMore extends React.Component {
  state = {
    measured: false,
    shouldShowReadMore: false,
    showAllText: false,
  }

  async componentDidMount() {
    await nextFrameAsync()

    if (this._text) {
      // Get the height of the text with no restriction on number of lines
      const fullHeight = await measureHeightAsync(this._text)
      this.setState({measured: true})
      await nextFrameAsync()

      // Get the height of the text now that number of lines has been set
      if (this._text) {
        const limitedHeight = await measureHeightAsync(this._text)
        if (fullHeight > limitedHeight) {
          this.setState({shouldShowReadMore: true}, () => {
            this.props.onReady && this.props.onReady()
          })
        }
      }
    }
  }

  render() {
    const {
      measured,
      showAllText,
    } = this.state

    const { numberOfLines } = this.props

    return (
      <View>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          ref={text => { this._text = text }}>
          {this.props.children}
        </Text>

        {this._maybeRenderReadMore()}
      </View>
    )
  }

  _handlePressReadMore = () => this.setState({showAllText: true})

  _handlePressReadLess = () => this.setState({showAllText: false})

  _maybeRenderReadMore = () => {
    const {
      shouldShowReadMore,
      showAllText,
    } = this.state

    const {
      renderTruncatedFooter,
      renderRevealedFooter,
    } = this.props

    return shouldShowReadMore
      ? !showAllText
        ? renderTruncatedFooter
          ? renderTruncatedFooter(this._handlePressReadMore)
          : (
            <Text style={styles.button} onPress={this._handlePressReadMore}>
              Read more
            </Text>
          )
        : renderRevealedFooter
          ? renderRevealedFooter(this._handlePressReadLess)
          : (
            <Text style={styles.button} onPress={this._handlePressReadLess}>
              Hide
            </Text>
          )
      : null
  }
}

const measureHeightAsync = component => new Promise(resolve => {
  component.measure((x, y, w, h) => resolve(h))
})

const nextFrameAsync = () => new Promise(resolve => requestAnimationFrame(() => resolve()))

const styles = StyleSheet.create({
  button: {
    color: '#888',
    marginTop: 5,
  },
})

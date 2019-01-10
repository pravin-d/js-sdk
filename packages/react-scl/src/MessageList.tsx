import { ChannelReferencingMessage } from '@mitter-io/models'
import React, { CSSProperties, ReactElement, ReactNode } from 'react'
import { AutoSizer, IndexRange, InfiniteLoader, List } from 'react-virtualized'
import { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer'

const randText = () => {
  const text = [
    'Lorem ipsum dolor sit amet.',
    'Consectetur adipisicing elit.',
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident.',
    'Sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ]

  return text[Math.floor(Math.random() * text.length)]
}


interface MessageListProps {
  messages: ChannelReferencingMessage[]
  onEndCallback: () => void
  getViewFromProducer: (item: ChannelReferencingMessage) => ReactElement<any>
  isLoading: boolean,
  loader: () => ReactElement<any>
  scrollToIndex: number
}

interface MessageListState {
  rowCount: number,
  scrollToIndex: number,
  isLoading: boolean
}

class MessageList extends React.PureComponent<MessageListProps> {

  private done: any
  private scrollTop: number = 0
  constructor(props: MessageListProps) {
    super(props)
    this.state = {
      rowCount: 0,
      scrollToIndex: -1,
      isLoading: false
    }
    this._isRowLoaded = this._isRowLoaded.bind(this)
    this._loadMoreRows = this._loadMoreRows.bind(this)
    this._getRowHeight = this._getRowHeight.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)
    this._onScroll = this._onScroll.bind(this)
  }

  componentWillUpdate(nextProps: MessageListProps) {
    /*if (this.props.isLoading !== prevProps.isLoading && prevProps.isLoading !== undefined) {
      console.log('%c is loading' + this.props.isLoading, 'color: red')
    }*/

    if(nextProps.messages.length !== this.props.messages.length) {
      // this.done()
      /*this.setState({
        rowCount:  nextProps.messages.length,
        scrollToIndex:nextProps.messages.length - this.props.messages.length - 1,
      },this.done)*/
    }

  }

  _onScroll({ clientHeight, scrollHeight, scrollTop }: { clientHeight: number, scrollHeight: number, scrollTop: number }): void {
    console.log('%c clientHeight' + clientHeight, 'color:red')
    console.log('%c scrollHeight' + scrollHeight, 'color:blue')
    console.log('%c scrollTop' + scrollTop, 'color:green')
    this.scrollTop = scrollTop
  }

  _isRowLoaded({ index }: { index: number }) {
    // const { rowCount } = this.state
    return index > 0
  }

  _rowRenderer({ key, index, parent, style }: { key: string, index: number, parent: MeasuredCellParent, style: CSSProperties }) {
    let content: ReactNode
    const messages = this.props.messages

    /*if (index === 0) {
      content = <div>Loading... { index }</div>
    }*/
    // else {

      content = (
        <React.Fragment>
          {
            this.props.getViewFromProducer(messages[index])
          }
        </React.Fragment>
      )
   // }

    return (
      <div key={ key } style={ style }>
        { content }
      </div>
    )
  }

  _loadMoreRows(params: IndexRange) {
    // && params.startIndex !== params.stopIndex
    if (!this.props.isLoading && this.scrollTop > 0) {
      this.props.onEndCallback()
    }
    return new Promise(resolve => this.done = resolve)
  }

  _getRowHeight({ index }: { index: number }) {
    return 50
  }

  render() {
    // const { rowCount, scrollToIndex } = this.state
   // console.log('b;ah',rowCount, scrollToIndex)
    return (
      <React.Fragment>
        {
          this.props.isLoading ?
            (
              <div style={{position: 'absolute', top:0,left:500}}>
                {this.props.loader()}
              </div>
            )
            :
            <React.Fragment/>

        }
        <InfiniteLoader
          isRowLoaded={ this._isRowLoaded }
          loadMoreRows={ this._loadMoreRows }
          rowCount={ this.props.messages.length }
          threshold={ 1 }
        >
          { ({ onRowsRendered, registerChild }) => {
            return (
              <AutoSizer
              >
                { ({ height, width }) => {
                  console.log('height is', height)
                  return (
                    <List
                      width={ width }
                      height={ height }
                      ref={ registerChild }
                      onRowsRendered={ onRowsRendered }
                      rowCount={ this.props.messages.length }
                      rowHeight={ this._getRowHeight }
                      rowRenderer={ this._rowRenderer }
                      onScroll={this._onScroll}
                      /*isScrolling={true}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}*/
                      scrollToIndex={ this.props.scrollToIndex}
                      scrollToAlignment="start"
                    />
                  )
                } }
              </AutoSizer>
            )
          } }
        </InfiniteLoader>
      </React.Fragment>
    )
  }

}

export default MessageList
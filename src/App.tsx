import * as React from 'react';
import './App.css';
import { Record } from 'immutable';
import { Action, createAction, handleActions } from 'redux-actions';
import { createStore } from 'redux';
import { connect, Dispatch, Provider } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import * as injectTapEventPlugin from 'react-tap-event-plugin';

// injectTapEventPlugin();

class MainState extends Record({counter: 0}) {
    counter: number;
    modify(diff: number) {
        return new MainState(this.set('counter', this.counter + diff));
    }
}

interface MainAppProps {
    data: MainState;
    updateState: (d: MainState) => void;
}

interface MainAppState {}

class MainApp extends React.Component<MainAppProps, MainAppState> {
    render() {
        const {
            data,
            updateState
        } = this.props;
        return (
            <MuiThemeProvider>
                <div className="App">
                    <h1>{data.counter}</h1>
                    <FloatingActionButton onClick={() => updateState(data.modify(1))}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <FloatingActionButton
                        secondary={true}
                        onClick={() => updateState(data.modify(-1))}
                    >
                        <ContentRemove />
                    </FloatingActionButton>
                </div>
            </MuiThemeProvider>
        );
    }
}

interface AppProps {}
interface AppState {}

class App extends React.Component<AppProps, AppState> {
    render() {
        const updateState = createAction<MainState>('UPDATE_MODEL');
        const store = createStore(handleActions<MainState>(
            {['UPDATE_MODEL']: (state: MainState, action: Action<MainState>) => action.payload},
            new MainState()
        ));
        const mapStateToProps = (state: MainState) => ({
            data: state,
        });
        const mapDispatchToProps = (dispatch: Dispatch<MainState>) => ({
            updateState: function (m: MainState) {
                dispatch(updateState(m));
            }
        });
        const DApp = connect(
            mapStateToProps,
            mapDispatchToProps)(MainApp);
        return (
            <Provider store={store}>
                <DApp />
            </Provider>);
    }
}

export default App;

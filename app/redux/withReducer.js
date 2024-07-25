// src/redux/withRedux.js

import { Provider } from 'react-redux';
import store from './store';

const withRedux = (Component) => {
    const WrappedComponent = (props) => (
        <Provider store={store}>
            <Component {...props} />
        </Provider>
    );

    return WrappedComponent;
};

export default withRedux;

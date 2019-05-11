import React from 'react';

const loader = {
    alignItems: 'center',
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    width: '100vw'
}
const loaderImage = {
    height: '6rem',
    width: '6rem'
}
const LoadingPage = () => (
    <div style={loader}>
        <img style={loaderImage} src="/images/loader.gif" />
    </div>
);
export default LoadingPage;
import React from 'react';

const Home = React.lazy(() => import('./components/Home/Home'));
const Offers = React.lazy(() => import('./components/Offers/Offers'));
const Candidates = React.lazy(() => import('./components/Candidates/Candidates'));
const Login = React.lazy(() => import('./components/Login/Login'));
const Signup = React.lazy(() => import('./components/Signup/Signup'));
const Logout = React.lazy(() => import('./components/Logout/Logout'));
const Contact = React.lazy(() => import('./components/Contact/Contact'));
const Settings = React.lazy(() => import('./components/Settings/Settings'));
const Messaging = React.lazy(() => import('./components/Messaging/Messaging'));

const routes = [
    { path: '/home', name: 'Home', component: Home },
    { path: '/offers', name: 'Offers', component: Offers },
    { path: '/candidates', name: 'Candidates', component: Candidates },
    { path: '/login', name: 'Login', component: Login },
    { path: '/signup', name: 'Sign up', component: Signup },
    { path: '/logout', name: 'Logout', component: Logout },
    { path: '/contact', name: 'Contact', component: Contact },
    { path: '/settings', name: 'Settings', component: Settings },
    { path: '/messaging/:id', name: 'Messaging', component: Messaging },
    { path: '/messaging', name: 'Messaging', component: Messaging },
];

export default routes;

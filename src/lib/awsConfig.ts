import { Amplify } from 'aws-amplify';
import config from '@/aws-exports';

function isLocalhost() {
    return typeof window !== 'undefined' && window.location.hostname === "localhost";
}

// check if env is localhost or not
// if you're not developing on localhost, you will need to detect this is another way—the docs linked above give some examples. 
// const isLocalhost = !!(window.location.hostname === "localhost");

// split redirect signin and signout strings into correct URIs
const [
    productionRedirectSignIn,
    localRedirectSignIn] = config.oauth.redirectSignIn.split(",");
const [
    productionRedirectSignOut,
    localRedirectSignOut] = config.oauth.redirectSignOut.split(",");

//use correct URI in the right env
const updatedAwsConfig = {
    ...config,
    oauth: {
        ...config.oauth,
        redirectSignIn: isLocalhost()
            ? localRedirectSignIn
            : productionRedirectSignIn,
        redirectSignOut: isLocalhost()
            ? localRedirectSignOut
            : productionRedirectSignOut,
    }
}

Amplify.configure({ ...updatedAwsConfig, ssr: true });
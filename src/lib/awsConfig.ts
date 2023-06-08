import { Amplify } from 'aws-amplify';
import config from '@/aws-exports';

// check if env is localhost or not
// if you're not developing on localhost, you will need to detect this is another way—the docs linked above give some examples. 

function isLocalhost() {
    if (typeof window === 'undefined') {
        return false;
    }

    return Boolean(
        window.location.hostname === "localhost" ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === "[::1]" ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
    )
}

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
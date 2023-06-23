interface AmplifySecrets {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
}

const secrets = process.env.secrets == null ?
    null :
    JSON.parse(process.env.secrets) as AmplifySecrets

if (secrets) {
    console.log("Settings environment secrets");
    for (const [key, value] of Object.entries(secrets)) {
        console.log("Setting secret: " + key);
        process.env[key] = value;
    }
}
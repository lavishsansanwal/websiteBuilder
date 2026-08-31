module.exports = {
    apps: [
        {
            name: "yellowchairs-backend",
            cwd: "/home/yellowchairs-dashboard/backend",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 5757
            }




        }
    ]
};



module.exports = {
    apps: [
        {
            name: "yellowchairs-frontend",
            cwd: "/home/yellowchairs-dashboard/frontend",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 5858
            }
        }
    ]
};
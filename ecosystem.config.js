module.exports = {
  apps: [{
    name: 'trailer',
    script: './start.js',
    watch: false,
    env: {
      COMMON_VARIABLE: true,
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy: {
    production: {
      user: 'trailer',
      host: '192.168.0.120',
      ref: 'origin/master',
      repo: 'git@xxxx:oooo/trailer.git',
      path: '/www/trailer/production',
      ssh_options: 'StrictHostKeyChecking=no',
      'pre-deploy': 'git fetch',
      'post-deploy': 'source $HOME/.zshrc && yarn install && yarn build && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
}

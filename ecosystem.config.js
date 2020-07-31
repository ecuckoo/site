module.exports = {
    apps : [{
	name: 'site',
	script: 'bin/www',
	node_args: '',
	
	watch: ['bin', 'lib', 'routes', 'views', 'ecosystem.config.js'],
	ignore_watch: ['node_modules'],
	max_memory_restart: '200M',

	env: {
	    NODE_ENV: 'development'
	},
	env_production: {
	    NODE_ENV: 'production'
	},
	
	error_file: 'logs/site-error.log',
	out_file: 'logs/site.log',
	merge_logs: true,
	log_date_format: 'DD MM YYYY HH:mm:ss Z',
	
	max_restarts: 3,
	min_uptime: 3000,
	listen_timeout: 3000,
	kill_timeout: 1000
    }],

    deploy : {
	production : {
	    user : 'SSH_USERNAME',
	    host : 'SSH_HOSTMACHINE',
	    ref  : 'origin/master',
	    repo : 'GIT_REPOSITORY',
	    path : 'DESTINATION_PATH',
	    env: {},
	    'ssh_option': '',
	    'pre-deploy-local': '',
	    'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
	    'pre-setup': ''
	}
    }
};

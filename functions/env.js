const projectId = process.env.GCLOUD_PROJECT;
let env = 'staging'; // setting staging by default

if (projectId === 'prod-c3aa1') {
  env = 'production';
}

module.exports = function () {
  return env;
};

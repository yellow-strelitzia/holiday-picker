FROM gitpod/workspace-full

USER root
RUN ["npm", "install", "-g", "http-server"]
RUN ["npm", "install", "-g", "now"]
RUN ["npm", "install", "-g", "netlify-lambda"]

RUN curl https://cli-assets.heroku.com/install.sh | sh
RUN chown -R gitpod:gitpod /home/gitpod/.cache/heroku

USER gitpod

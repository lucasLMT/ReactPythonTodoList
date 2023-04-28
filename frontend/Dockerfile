FROM node:lts-alpine3.17
# Creatinng and setting the user
RUN addgroup app && adduser -S -G app app
USER app
# Defining the working directory
WORKDIR /app
# Copying the package json before the rest of application you guarantee that the npm install will be executed
# once and be used from the cache in the next build, unless you install a new package, wich is less frequent that change application files.
# The chown command is nedded because in tthis version of node, only the node user has the permission to execute the npm install.
COPY --chown=app:node package*.json .
RUN npm install
# Copying the app files and folders to the working directory 
COPY . .
# COPY ["hello.txt", "."]

# How to define an environment variable
# ENV API_URL=http://.../2

# This command works more like a documentation about what port that application will listen.
EXPOSE 3000

# Execute this command after the container starts. At runtime. 
# Shell form, it starts a shell to execute the command.
# CMD npm start

# Exec form
# This way the command is executed directly
CMD ["npm", "start"]
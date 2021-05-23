# quiz-app

An application that allows rapid quiz creation.

# Usage

To be able to run the stack, you must first login to the repository container
registry:

```
docker login registry.gitlab.com
```

To deploy locally, just run

```
docker-compose pull --parallel
docker-compose up
```

To deploy the services using docker swarm, run the following commands:

```
docker swarm init
docker-compose pull --parallel
docker stack deploy -c docker-compose.yml {stack-name}
```

# Unimplemented features in the frontend

- Timed quizzes: although the backends exist, the frontend does not handle them.
- Submission count limitation.

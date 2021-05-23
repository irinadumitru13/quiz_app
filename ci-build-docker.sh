#!/bin/sh
# Script for building docker images with gitlab CI

DOCKERFILE=Dockerfile

# Iterate through all services in the repository's root to build them
for app in $(find . -mindepth 1 -maxdepth 1 -type d); do
	if [ -f $app/$DOCKERFILE ]; then
		cd $app

		docker build -t registry.gitlab.com/idp-2021/quiz-app/$app .
		docker push registry.gitlab.com/idp-2021/quiz-app/$app:latest

		# Exit with failure if the previous command didn't run successfully
		if [ $? -ne 0 ]; then
			echo "Failed to build $app"
			exit 2
		fi

		cd -
	fi
done

FROM golang:buster

# Set necessary environmet variables needed for our image
ENV GO111MODULE=on \
	CGO_ENABLED=0 \
	GOOS=linux \
	GOARCH=amd64

# Move to build directory
WORKDIR /build

# Copy and download module dependencies
COPY . .
RUN go mod download


# Build the application
RUN go build -o main .

# Move to the directory to run the binary from
WORKDIR /dist

# Copy binary from build to main folder
RUN cp /build/main .

# Command to run when starting the container
CMD ["/dist/main"]

# Contributing to HyPrism

Thank you for your interest in contributing to HyPrism! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/HyPrism.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

## Development Setup

### Prerequisites

- Go 1.23 or higher
- Node.js 18 or higher
- Wails v2.11.0 or higher

### Setting up the Development Environment

```bash
# Install dependencies
go mod download
cd frontend && npm install && cd ..

# Run in development mode
wails dev
```

## Code Style

### Go Code

- Follow the [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- Use `gofmt` to format your code
- Add comments for exported functions and types
- Write tests for new features

### TypeScript/React Code

- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Add prop types for components
- Keep components small and focused

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update documentation for any changed functionality
3. The PR will be merged once you have approval from a maintainer

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Test on multiple platforms if possible

## Reporting Bugs

- Use the GitHub issue tracker
- Include system information (OS, version, etc.)
- Provide steps to reproduce the bug
- Include error messages and logs if applicable

## Feature Requests

- Use the GitHub issue tracker
- Clearly describe the feature and its benefits
- Provide use cases and examples

## Questions?

Feel free to open an issue for any questions about contributing!

Thank you for contributing to HyPrism! 🎮

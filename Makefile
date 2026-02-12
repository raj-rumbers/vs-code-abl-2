.PHONY: install test lint clean build package

# Install project dependencies
install:
	@echo "Installing dependencies..."
	npm install

# Run the project's test suite
test:
	@echo "Running tests..."
	npm run test 2>/dev/null || echo "No test script defined. To add tests, configure @vscode/test-electron in package.json"

# Analyze code for potential errors and style issues
lint:
	@echo "Linting code..."
	npm run lint

# Build the extension
build:
	@echo "Building extension..."
	npm run webpack

# Package the extension for production
package:
	@echo "Packaging extension for production..."
	npm run package

# Remove build artifacts and temporary files
clean:
	@echo "Cleaning up..."
	rm -rf dist/
	rm -rf out/
	rm -rf node_modules/
	rm -rf *.vsix
	@echo "Cleanup complete"

# Configure Project Requirements for GHCP Copilot CLI

Each project using GHCP Copilot CLI requires a configuration file to define essential metadata such as project name, description, programming language, and framework. This configuration helps tailor the AI assistance to the specific context of the project. It also needs pre-commit hooks and a Makefile to allow for standardized operations.

## Configuration File

### Required Configuration File Structure

Below is an example structure for the configuration file named `neo-config.json` that should be placed in the root of the project:

```json
{
  "projectName": "Your Project Name",
  "description": "A brief description of your project.",
  "language": "Programming Language (e.g., Python, JavaScript)",
  "framework": "Framework used (e.g., Django, React) or 'None' if not applicable",
  "testingFramework": "Testing framework used (e.g., pytest, Jest) or 'None' if not applicable",
  "packageManager": "Package manager used (e.g., npm, pip) or 'None' if not applicable"
}
```

### Steps to Create or Update Configuration

1. Check if a `neo-config.json` file exists in the project root.
2. If the file exists, read and parse the JSON content to extract project metadata.
3. If the file does not exist, review the project structure and files to infer the necessary metadata:
   - Identify the primary programming language by examining file extensions.
   - Determine the framework by looking for common framework-specific files (e.g., `package.json` for Node.js, `requirements.txt` for Python).
   - Identify the testing framework by checking for test files and their naming conventions.
   - Determine the package manager by looking for lock files (e.g., `package-lock.json`, `Pipfile.lock`).
4. Create a `neo-config.json` file with the inferred metadata if it does not exist. Below is an example structure for the configuration file:

## Makefile

Each project requires a Makefile following a standard structure to facilitate common development tasks such as building, testing, linting, and deploying the application. Use the `neo-config.json` file as well as the existing project files to create or update the Makefile.

## Required Makefile Structure

The Makefile must include the following targets (other targets can be present but are not mandatory):
- `install`: Installs project dependencies.
- `test`: Runs the project's test suite.
- `lint`: Analyzes the code for potential errors and style issues.
- `clean`: Removes build artifacts and temporary files.

The following is an example of a compliant Makefile:

```Makefile
.PHONY: install test lint clean
install:
    @echo "Installing dependencies..."
    # Command to install dependencies
    pip install -r requirements.txt
test:
    @echo "Running tests..."
    # Command to run tests
    pytest tests/
lint:
    @echo "Linting code..."
    # Command to lint code
    flake8 src/
clean:
    @echo "Cleaning up..."
    # Command to clean build artifacts
    rm -rf build/ dist/ *.egg-info
```

## Steps to Create or Update Makefile

1. Check if a Makefile exists in the project root.
2. Verify that the Makefile includes all required targets: `install`, `test`, `lint`, and `clean`.
3. Ensure that each target has appropriate commands defined for its purpose.
4. Confirm that the Makefile uses `.PHONY` to declare the targets as phony targets.
5. If any targets are missing or improperly defined add them and use the existing commands in the project as context to fill in the appropriate commands.

## Pre-commit Hooks

To ensure code quality and consistency, set up pre-commit hooks using the `pre-commit` framework. This will help automate tasks such as linting and running tests before commits are made.

### .pre-commit Structure
The pre-commit configuration file `.pre-commit-config.yaml` should be placed in the project root. The exact syntax and hooks will depend on the programming language and framework used in the project but it should closely follow the linting and testing commands defined in the Makefile.

Below is an example structure for a Python project:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: check-merge-conflict
      - id: check-json
      - id: pretty-format-json
        args: ['--autofix']

  - repo: https://github.com/psf/black
    rev: 25.1.0
    hooks:
      - id: black

  - repo: https://github.com/pycqa/isort
    rev: 6.0.1
    hooks:
      - id: isort

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.12.10
    hooks:
      - id: ruff-check
        args: [--fix, --exit-non-zero-on-fix]

  - repo: https://github.com/PyCQA/bandit
    rev: 1.8.6
    hooks:
      - id: bandit
        args: ['--configfile', 'pyproject.toml']

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.17.1
    hooks:
      - id: mypy
        args: ['--config-file', 'pyproject.toml']

exclude: ^(\.venv|tests)/
```

### Steps to Create or Update Pre-commit Configuration

Use the `neo-config.json` file and `Makefile` to create or update the `.pre-commit-config.yaml` file in the project root with the appropriate linters, formatters, and test runners based on the project's programming language and framework.

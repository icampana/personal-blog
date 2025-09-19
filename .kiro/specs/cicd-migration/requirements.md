# Requirements Document

## Introduction

This feature involves migrating CI/CD and deployment configuration files from the astro-blog subdirectory to the root level of the project. This migration is part of the broader project restructuring to move the Astro blog from a subdirectory to the root level, ensuring that GitHub Actions workflows, Lighthouse configuration, and Netlify deployment settings work correctly with the new project structure.

## Requirements

### Requirement 1

**User Story:** As a developer, I want the GitHub Actions CI/CD pipeline to work correctly after the project migration, so that automated testing, building, and deployment continue to function without interruption.

#### Acceptance Criteria

1. WHEN the CI/CD workflow runs THEN the system SHALL execute all jobs (test, build, lighthouse, security, deploy-preview, deploy-production) successfully
2. WHEN the workflow installs dependencies THEN the system SHALL install from the root package.json without specifying a working directory
3. WHEN the workflow runs tests THEN the system SHALL execute tests from the root directory structure
4. WHEN the workflow builds the project THEN the system SHALL generate build artifacts in the correct output directory
5. WHEN the workflow uploads artifacts THEN the system SHALL use the correct path for the dist directory

### Requirement 2

**User Story:** As a developer, I want Lighthouse performance testing to continue working after migration, so that performance monitoring remains intact in the CI/CD pipeline.

#### Acceptance Criteria

1. WHEN Lighthouse CI runs THEN the system SHALL use the correct configuration file from the root directory
2. WHEN Lighthouse analyzes the build THEN the system SHALL find the built site files in the correct location
3. WHEN Lighthouse completes THEN the system SHALL report performance metrics accurately
4. IF the Lighthouse configuration references subdirectory paths THEN the system SHALL update them to root-level paths

### Requirement 3

**User Story:** As a developer, I want Netlify deployments to work correctly after migration, so that both preview and production deployments continue to function.

#### Acceptance Criteria

1. WHEN a preview deployment is triggered THEN the system SHALL deploy the correct build artifacts to Netlify
2. WHEN a production deployment is triggered THEN the system SHALL deploy from the main branch successfully
3. WHEN Netlify processes the deployment THEN the system SHALL use the correct configuration from the root netlify.toml
4. IF the Netlify configuration contains subdirectory references THEN the system SHALL update them to work with the root structure

### Requirement 4

**User Story:** As a developer, I want the security scanning to continue working after migration, so that vulnerability detection remains active in the CI/CD pipeline.

#### Acceptance Criteria

1. WHEN Trivy security scanner runs THEN the system SHALL scan the correct project directory structure
2. WHEN security vulnerabilities are found THEN the system SHALL report them accurately
3. WHEN the scan completes THEN the system SHALL upload SARIF results to GitHub Security tab
4. IF the security scan references the old subdirectory THEN the system SHALL update to scan the root directory

### Requirement 5

**User Story:** As a developer, I want all configuration files to be properly organized at the root level, so that the project structure is clean and maintainable.

#### Acceptance Criteria

1. WHEN the migration is complete THEN the system SHALL have moved all CI/CD files to appropriate root-level locations
2. WHEN examining the project structure THEN the system SHALL show no duplicate configuration files between root and astro-blog directories
3. WHEN configuration files are updated THEN the system SHALL maintain all existing functionality
4. WHEN the old astro-blog directory is cleaned up THEN the system SHALL remove obsolete configuration files from the subdirectory
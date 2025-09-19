# Implementation Plan

- [x] 1. Create updated GitHub Actions workflow at root level
  - Copy the existing workflow from `astro-blog/.github/workflows/ci.yml` to `.github/workflows/ci.yml`
  - Remove all `working-directory: ./astro-blog` references from workflow steps
  - Update artifact paths from `./astro-blog/dist` to `./dist`
  - Update coverage path from `./astro-blog/coverage` to `./coverage`
  - Update Trivy scan reference from `./astro-blog` to `.`
  - Update pnpm cache key to reference root-level `pnpm-lock.yaml`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [-] 2. Validate workflow syntax and job dependencies
  - Run workflow validation to ensure YAML syntax is correct
  - Verify all job dependencies and artifact upload/download paths are consistent
  - Check that environment variables and secrets are properly referenced
  - _Requirements: 1.1, 5.3_

- [ ] 3. Test the updated workflow on a feature branch
  - Create a test branch with the new workflow
  - Run the complete CI/CD pipeline to verify all jobs execute successfully
  - Verify test job runs linting, TypeScript checks, and unit tests correctly
  - Confirm build job generates artifacts in the correct location
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 4. Validate Lighthouse CI integration
  - Verify Lighthouse job can access the root-level `lighthouserc.js` configuration
  - Confirm Lighthouse can find and analyze the built site files
  - Test that performance metrics are reported correctly
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 5. Test security scanning functionality
  - Verify Trivy security scanner runs against the root directory structure
  - Confirm security scan results are uploaded to GitHub Security tab correctly
  - Test that vulnerability detection works with the new directory structure
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 6. Validate deployment functionality
  - Test preview deployment to Netlify using the updated artifact paths
  - Verify production deployment works with the root-level `netlify.toml` configuration
  - Confirm deployment notifications and status reporting work correctly
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 7. Remove duplicate configuration files from astro-blog directory
  - Delete `astro-blog/.github/workflows/ci.yml` after confirming root workflow works
  - Remove `astro-blog/lighthouserc.js` since identical version exists at root
  - Delete `astro-blog/netlify.toml` since identical version exists at root
  - _Requirements: 5.1, 5.2, 5.4_

- [ ] 8. Create validation tests for the migration
  - Write a test script to verify all configuration files are in correct locations
  - Create checks to ensure no duplicate configuration files exist
  - Implement validation that workflow paths are correctly updated
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 9. Update any documentation references to the old workflow paths
  - Search for and update any documentation that references the old CI/CD file locations
  - Update deployment guides or README files that mention the astro-blog subdirectory structure
  - Ensure all references point to the new root-level configuration files
  - _Requirements: 5.3_

- [ ] 10. Perform final integration testing
  - Run a complete end-to-end test of the CI/CD pipeline
  - Verify all jobs complete successfully with the new file structure
  - Test both preview and production deployment workflows
  - Confirm all monitoring and reporting features work correctly
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.3_
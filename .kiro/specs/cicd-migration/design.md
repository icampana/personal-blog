# Design Document

## Overview

The CI/CD migration involves updating the GitHub Actions workflow to work with the root-level project structure and cleaning up duplicate configuration files. The key insight from research is that `lighthouserc.js` and `netlify.toml` already exist at the root level with identical configurations, so the main work involves updating the GitHub Actions workflow and removing duplicate files.

## Architecture

### Current State
- GitHub Actions workflow located at `astro-blog/.github/workflows/ci.yml`
- All workflow steps use `working-directory: ./astro-blog`
- Configuration files duplicated between root and `astro-blog/` directory
- Workflow references subdirectory paths for artifacts and deployments

### Target State
- GitHub Actions workflow moved to `.github/workflows/ci.yml`
- All `working-directory` references removed from workflow steps
- Duplicate configuration files removed from `astro-blog/` directory
- Workflow paths updated to work with root-level project structure

## Components and Interfaces

### GitHub Actions Workflow Migration
The CI/CD pipeline consists of several jobs that need path updates:

1. **Test Job**
   - Remove `working-directory: ./astro-blog` from all steps
   - Update pnpm cache key to use root-level `pnpm-lock.yaml`
   - Update coverage upload path from `./astro-blog/coverage` to `./coverage`

2. **Build Job**
   - Remove `working-directory: ./astro-blog` from all steps
   - Update artifact upload path from `./astro-blog/dist` to `./dist`

3. **Lighthouse Job**
   - Remove `working-directory: ./astro-blog` from dependency installation
   - Update artifact download path from `./astro-blog/dist` to `./dist`
   - Lighthouse configuration already correct at root level

4. **Security Job**
   - Update Trivy scan reference from `./astro-blog` to `.` (current directory)

5. **Deploy Jobs**
   - Update publish directory from `./astro-blog/dist` to `./dist`
   - Remove `working-directory` from build steps in production deployment

### Configuration File Management
- **Lighthouse Configuration**: Already exists at root with correct paths
- **Netlify Configuration**: Already exists at root with correct settings
- **Cleanup**: Remove duplicate files from `astro-blog/` directory

## Data Models

### Workflow Path Mappings
```yaml
# Before (astro-blog subdirectory)
working-directory: ./astro-blog
publish-dir: './astro-blog/dist'
directory: ./astro-blog/coverage
scan-ref: './astro-blog'

# After (root level)
# working-directory: removed
publish-dir: './dist'
directory: ./coverage
scan-ref: '.'
```

### File Operations
```
Move: astro-blog/.github/workflows/ci.yml → .github/workflows/ci.yml
Delete: astro-blog/lighthouserc.js (duplicate)
Delete: astro-blog/netlify.toml (duplicate)
```

## Error Handling

### Migration Validation
- Verify that root-level configuration files exist before removing duplicates
- Ensure workflow syntax remains valid after path updates
- Validate that all job dependencies and artifact paths are correctly updated

### Rollback Strategy
- Keep backup of original workflow file during migration
- Verify each job can run successfully before removing old files
- Maintain git history for easy rollback if issues arise

### Common Issues and Solutions
1. **Missing Dependencies**: Ensure root-level `package.json` and `pnpm-lock.yaml` are accessible
2. **Artifact Path Mismatches**: Verify all upload/download artifact paths are consistent
3. **Cache Key Changes**: Update cache keys to reflect new file locations
4. **Environment Variables**: Ensure secrets and environment variables work with new structure

## Testing Strategy

### Pre-Migration Testing
- Verify current workflow runs successfully in astro-blog subdirectory
- Confirm root-level configuration files are identical to subdirectory versions
- Test that root-level package.json scripts work correctly

### Post-Migration Testing
- Run complete CI/CD pipeline to verify all jobs execute successfully
- Test preview deployment functionality
- Verify production deployment works correctly
- Confirm Lighthouse performance testing runs without errors
- Validate security scanning covers the correct directory structure

### Validation Checklist
- [ ] All workflow jobs complete successfully
- [ ] Test coverage reports are generated and uploaded correctly
- [ ] Build artifacts are created in the correct location
- [ ] Lighthouse CI runs and reports performance metrics
- [ ] Security scanning completes without path errors
- [ ] Preview deployments work correctly
- [ ] Production deployments function as expected
- [ ] No duplicate configuration files remain in astro-blog directory

## Implementation Considerations

### Minimal Disruption Approach
1. Create updated workflow file first
2. Test new workflow on a feature branch
3. Remove duplicate configuration files only after successful testing
4. Clean up old workflow file last

### Path Consistency
- Ensure all paths in the workflow are relative to the project root
- Maintain consistency between artifact upload and download paths
- Verify that deployment paths match the actual build output location

### Configuration Synchronization
- Confirm that root-level configurations match the functionality of subdirectory versions
- Ensure no configuration drift has occurred between duplicate files
- Validate that all environment-specific settings are preserved
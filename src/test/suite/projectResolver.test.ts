/**
 * Unit tests for projectResolver module
 * Tests the intelligent project selection algorithm
 */

import * as assert from 'assert';
import { OpenEdgeProjectConfig } from '../../shared/openEdgeConfigFile';
import { 
    resolveProjectWithFallback, 
    findAllMatchingProjects, 
    getMostSpecificProject 
} from '../../shared/projectResolver';

// Test suite configuration
suite('Project Resolver Tests', () => {
    
    // Helper function to create mock projects
    function createMockProject(name: string, rootDir: string): OpenEdgeProjectConfig {
        const mockProject = new OpenEdgeProjectConfig();
        mockProject.name = name;
        mockProject.rootDir = rootDir;
        mockProject.uri = { toString: () => `file://${rootDir}` } as any;
        mockProject.version = '1.0.0';
        mockProject.activeProfile = 'default';
        mockProject.defaultProfileDisplayName = 'default';
        mockProject.profiles = new Map();
        return mockProject;
    }
    
    // Helper function to create mock getProjectByName
    function createGetProjectByName(projects: OpenEdgeProjectConfig[]) {
        return (name: string) => projects.find(p => p.name === name);
    }
    
    suite('findAllMatchingProjects', () => {
        
        test('should return empty array for null/undefined inputs', () => {
            const projects = [createMockProject('TestProject', '/test/project')];
            
            assert.strictEqual(findAllMatchingProjects(null as any, projects).length, 0);
            assert.strictEqual(findAllMatchingProjects(undefined as any, projects).length, 0);
            assert.strictEqual(findAllMatchingProjects('', projects).length, 0);
            assert.strictEqual(findAllMatchingProjects('/test/file.p', null as any).length, 0);
            assert.strictEqual(findAllMatchingProjects('/test/file.p', []).length, 0);
        });
        
        test('should find single matching project', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            
            const matches = findAllMatchingProjects('/workspace/projectA/src/test.p', projects);
            
            assert.strictEqual(matches.length, 1);
            assert.strictEqual(matches[0].name, 'ProjectA');
        });
        
        test('should find multiple matching projects (nested)', () => {
            const projects = [
                createMockProject('ParentProject', '/workspace/parent'),
                createMockProject('ChildProject', '/workspace/parent/child')
            ];
            
            const matches = findAllMatchingProjects('/workspace/parent/child/src/test.p', projects);
            
            assert.strictEqual(matches.length, 2);
            assert.ok(matches.some(p => p.name === 'ParentProject'));
            assert.ok(matches.some(p => p.name === 'ChildProject'));
        });
        
        test('should return empty array when no projects match', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            
            const matches = findAllMatchingProjects('/external/test.p', projects);
            
            assert.strictEqual(matches.length, 0);
        });
        
        test('should handle case sensitivity on Windows', () => {
            const projects = [
                createMockProject('TestProject', '/Workspace/Project')
            ];
            
            // On Windows, should match regardless of case
            // On Unix, should be case-sensitive
            const matches = findAllMatchingProjects('/workspace/project/test.p', projects);
            
            if (process.platform === 'win32') {
                assert.strictEqual(matches.length, 1, 'Windows should match case-insensitively');
            } else {
                assert.strictEqual(matches.length, 0, 'Unix should match case-sensitively');
            }
        });
        
        test('should skip projects with invalid rootDir', () => {
            const projects = [
                createMockProject('ValidProject', '/workspace/valid'),
                { name: 'InvalidProject', rootDir: null } as any,
                createMockProject('AnotherValid', '/workspace/another')
            ];
            
            const matches = findAllMatchingProjects('/workspace/valid/test.p', projects);
            
            assert.strictEqual(matches.length, 1);
            assert.strictEqual(matches[0].name, 'ValidProject');
        });
    });
    
    suite('getMostSpecificProject', () => {
        
        test('should throw error for empty array', () => {
            assert.throws(
                () => getMostSpecificProject([]),
                /empty/i,
                'Should throw error when array is empty'
            );
        });
        
        test('should return single project when array has one element', () => {
            const projects = [createMockProject('OnlyProject', '/workspace/project')];
            
            const result = getMostSpecificProject(projects);
            
            assert.strictEqual(result.name, 'OnlyProject');
        });
        
        test('should return project with longest root path', () => {
            const projects = [
                createMockProject('ParentProject', '/workspace/parent'),
                createMockProject('ChildProject', '/workspace/parent/child'),
                createMockProject('GrandchildProject', '/workspace/parent/child/grandchild')
            ];
            
            const result = getMostSpecificProject(projects);
            
            assert.strictEqual(result.name, 'GrandchildProject');
            assert.strictEqual(result.rootDir, '/workspace/parent/child/grandchild');
        });
        
        test('should handle projects with same depth correctly', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            
            const result = getMostSpecificProject(projects);
            
            // Should return one of them (both have same length)
            // Order doesn't matter as they shouldn't match same file
            assert.ok(result.name === 'ProjectA' || result.name === 'ProjectB');
        });
        
        test('should not modify original array', () => {
            const projects = [
                createMockProject('Project1', '/short'),
                createMockProject('Project2', '/very/long/path')
            ];
            
            const originalOrder = projects.map(p => p.name);
            getMostSpecificProject(projects);
            const newOrder = projects.map(p => p.name);
            
            assert.deepStrictEqual(originalOrder, newOrder, 'Original array should not be modified');
        });
    });
    
    suite('resolveProjectWithFallback', () => {
        
        test('should return null for empty inputs', () => {
            const result1 = resolveProjectWithFallback('', [], undefined, undefined);
            const result2 = resolveProjectWithFallback(null as any, [], undefined, undefined);
            const result3 = resolveProjectWithFallback('/test.p', [], undefined, undefined);
            
            assert.strictEqual(result1, null);
            assert.strictEqual(result2, null);
            assert.strictEqual(result3, null);
        });
        
        test('should auto-select single project in workspace', () => {
            const projects = [createMockProject('OnlyProject', '/workspace/project')];
            
            // File inside project
            const result1 = resolveProjectWithFallback(
                '/workspace/project/src/test.p',
                projects,
                undefined,
                undefined
            );
            
            // File outside project (single project should still be used)
            const result2 = resolveProjectWithFallback(
                '/external/test.p',
                projects,
                undefined,
                undefined
            );
            
            assert.strictEqual(result1?.name, 'OnlyProject');
            assert.strictEqual(result2?.name, 'OnlyProject');
        });
        
        test('should auto-detect project from file path (single match)', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            const getProjectByName = createGetProjectByName(projects);
            
            const result = resolveProjectWithFallback(
                '/workspace/projectB/src/test.p',
                projects,
                undefined,
                getProjectByName
            );
            
            assert.strictEqual(result?.name, 'ProjectB');
        });
        
        test('should select most specific for nested projects', () => {
            const projects = [
                createMockProject('ParentProject', '/workspace/parent'),
                createMockProject('ChildProject', '/workspace/parent/child')
            ];
            const getProjectByName = createGetProjectByName(projects);
            
            const result = resolveProjectWithFallback(
                '/workspace/parent/child/src/test.p',
                projects,
                undefined,
                getProjectByName
            );
            
            assert.strictEqual(result?.name, 'ChildProject');
        });
        
        test('should override default project when file matches different project', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            const getProjectByName = createGetProjectByName(projects);
            
            // Default is ProjectA, but file is in ProjectB
            const result = resolveProjectWithFallback(
                '/workspace/projectB/src/test.p',
                projects,
                'ProjectA', // default project
                getProjectByName
            );
            
            assert.strictEqual(result?.name, 'ProjectB', 'Should use auto-detected project, not default');
        });
        
        test('should use default project when no auto-detection match', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            const getProjectByName = createGetProjectByName(projects);
            
            // File outside all projects, but default is set
            const result = resolveProjectWithFallback(
                '/external/test.p',
                projects,
                'ProjectA', // default project
                getProjectByName
            );
            
            assert.strictEqual(result?.name, 'ProjectA', 'Should fall back to default');
        });
        
        test('should return null when no match and no valid default', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            const getProjectByName = createGetProjectByName(projects);
            
            // File outside all projects, no default
            const result1 = resolveProjectWithFallback(
                '/external/test.p',
                projects,
                undefined,
                getProjectByName
            );
            
            // File outside all projects, invalid default name
            const result2 = resolveProjectWithFallback(
                '/external/test.p',
                projects,
                'NonExistentProject',
                getProjectByName
            );
            
            assert.strictEqual(result1, null);
            assert.strictEqual(result2, null);
        });
        
        test('should handle missing getProjectByName function gracefully', () => {
            const projects = [
                createMockProject('ProjectA', '/workspace/projectA'),
                createMockProject('ProjectB', '/workspace/projectB')
            ];
            
            // File outside projects, default set, but no getter function
            const result = resolveProjectWithFallback(
                '/external/test.p',
                projects,
                'ProjectA',
                undefined // no getter function
            );
            
            assert.strictEqual(result, null, 'Should return null when cannot retrieve default');
        });
    });
});

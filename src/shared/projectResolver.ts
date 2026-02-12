/**
 * Project Resolution Utility
 * 
 * Provides intelligent project selection for multi-project workspaces.
 * Implements priority-based resolution:
 *   1. Auto-detect from file path (single match)
 *   2. Most specific match (nested projects)
 *   3. Default project fallback (when no auto-detection)
 *   4. Return null for manual selection
 * 
 * @module projectResolver
 */

import { OpenEdgeProjectConfig } from './openEdgeConfigFile';
import { outputChannel } from '../ablStatus';

/**
 * Normalizes a file path for platform-aware comparison.
 * On Windows: converts to lowercase and ensures trailing backslash
 * On Unix/Linux/Mac: preserves case and ensures trailing forward slash
 * 
 * @param filePath - The file or directory path to normalize
 * @returns Normalized path suitable for prefix matching
 * 
 * @example
 * // Windows
 * normalizePath('C:\\Projects\\MyApp\\src\\file.p')
 * // Returns: 'c:\\projects\\myapp\\src\\'
 * 
 * // Unix
 * normalizePath('/home/user/projects/MyApp/src/file.p')
 * // Returns: '/home/user/projects/MyApp/src/'
 */
function normalizePath(filePath: string): string {
    if (!filePath) {
        return '';
    }
    
    // Determine platform-specific separator
    const separator = process.platform === 'win32' ? '\\' : '/';
    
    // Add trailing separator if not present (for directory matching)
    const withSeparator = filePath.endsWith(separator) ? filePath : filePath + separator;
    
    // Apply case transformation for Windows (case-insensitive filesystem)
    return process.platform === 'win32' ? withSeparator.toLowerCase() : withSeparator;
}

/**
 * Finds all projects that contain the given file path.
 * A project "contains" a file if the file path starts with the project's root directory.
 * 
 * @param filePath - Absolute path to the file
 * @param projects - Array of all loaded OpenEdge projects
 * @returns Array of projects that contain the file (may be empty)
 * 
 * @example
 * const matches = findAllMatchingProjects('/workspace/projectA/src/test.p', projects);
 * // Returns [ProjectA] if file is in ProjectA
 * // Returns [ProjectA, ProjectB] if ProjectB is nested in ProjectA
 * // Returns [] if file is outside all projects
 */
function findAllMatchingProjects(
    filePath: string, 
    projects: OpenEdgeProjectConfig[]
): OpenEdgeProjectConfig[] {
    if (!filePath || !projects || projects.length === 0) {
        return [];
    }
    
    const normalizedFilePath = normalizePath(filePath);
    
    return projects.filter(project => {
        if (!project.rootDir) {
            outputChannel.warn(`Project '${project.name}' has no rootDir defined, skipping in file matching`);
            return false;
        }
        
        try {
            const normalizedRootDir = normalizePath(project.rootDir);
            return normalizedFilePath.startsWith(normalizedRootDir);
        } catch (error) {
            outputChannel.warn(`Error processing project '${project.name}' root directory: ${(error as Error).message}`);
            return false;
        }
    });
}

/**
 * Selects the most specific project from multiple matches.
 * "Most specific" means the project with the longest root directory path.
 * This handles nested project scenarios correctly.
 * 
 * @param projects - Array of projects that all match the file
 * @returns The project with the longest (most specific) root path
 * @throws Error if projects array is empty
 * 
 * @example
 * // Given: ProjectA at '/workspace/parent'
 * //        ProjectB at '/workspace/parent/submodule'
 * const specific = getMostSpecificProject([ProjectA, ProjectB]);
 * // Returns: ProjectB (longer root path)
 */
function getMostSpecificProject(projects: OpenEdgeProjectConfig[]): OpenEdgeProjectConfig {
    if (!projects || projects.length === 0) {
        throw new Error('Cannot determine most specific project: projects array is empty');
    }
    
    if (projects.length === 1) {
        return projects[0];
    }
    
    // Sort by root directory length in descending order (longest first = most specific)
    const sorted = [...projects].sort((a, b) => {
        const lengthA = a.rootDir?.length || 0;
        const lengthB = b.rootDir?.length || 0;
        return lengthB - lengthA;
    });
    
    const selected = sorted[0];
    
    // Log selection for debugging
    outputChannel.info(`Selected most specific project '${selected.name}' from ${projects.length} matches`);
    
    return selected;
}

/**
 * Resolves the appropriate project for a given file using priority-based selection.
 * 
 * Selection priority:
 *   1. Auto-detect from file path (if single match found)
 *   2. Most specific match (if multiple nested projects match)
 *   3. Default project (only if no auto-detection match found)
 *   4. Return null (triggers manual selection prompt)
 * 
 * @param filePath - Absolute path to the file
 * @param projects - Array of all loaded OpenEdge projects
 * @param defaultProjectName - Optional name of the default project
 * @param getProjectByName - Function to retrieve project by name
 * @returns Selected project or null if manual selection needed
 * 
 * @example
 * const project = resolveProjectWithFallback(
 *   '/workspace/projectA/src/test.p',
 *   allProjects,
 *   'ProjectB', // default project (will be ignored since file is in ProjectA)
 *   getProjectByName
 * );
 * // Returns: ProjectA (auto-detected from file path)
 */
function resolveProjectWithFallback(
    filePath: string,
    projects: OpenEdgeProjectConfig[],
    defaultProjectName?: string,
    getProjectByName?: (name: string) => OpenEdgeProjectConfig | undefined
): OpenEdgeProjectConfig | null {
    if (!filePath || !projects || projects.length === 0) {
        return null;
    }
    
    // Single project workspace - always use that project (backward compatibility)
    if (projects.length === 1) {
        outputChannel.info(`Single project workspace: using '${projects[0].name}'`);
        return projects[0];
    }
    
    // PRIORITY 1 & 2: Auto-detect from file path
    const matchedProjects = findAllMatchingProjects(filePath, projects);
    
    if (matchedProjects.length === 1) {
        // Single match - perfect scenario
        outputChannel.info(`Auto-detected project '${matchedProjects[0].name}' for file: ${filePath}`);
        return matchedProjects[0];
    }
    
    if (matchedProjects.length > 1) {
        // Multiple matches - nested projects scenario
        const mostSpecific = getMostSpecificProject(matchedProjects);
        outputChannel.info(`Multiple project matches for file, selected most specific: '${mostSpecific.name}'`);
        return mostSpecific;
    }
    
    // PRIORITY 3: Fall back to default project (only when no auto-detection)
    if (defaultProjectName && getProjectByName) {
        const defaultProject = getProjectByName(defaultProjectName);
        if (defaultProject) {
            outputChannel.info(`No project auto-detected for file, using default project: '${defaultProject.name}'`);
            return defaultProject;
        } else {
            outputChannel.warn(`Default project '${defaultProjectName}' not found in loaded projects`);
        }
    }
    
    // PRIORITY 4: No match, no valid default - return null for manual selection
    outputChannel.info(`Could not determine project for file: ${filePath} - manual selection required`);
    return null;
}

// Public API exports
export {
    resolveProjectWithFallback,
    findAllMatchingProjects,
    getMostSpecificProject
};

// normalizePath is internal utility, not exported

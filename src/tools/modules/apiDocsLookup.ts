// API Documentation Lookup Tool
// Fetches and parses the latest GenLayer API documentation from the official source

import { GENLAYER_URLS } from '../../config/constants.js';

export interface ToolResult {
  content: string;
  isError?: boolean;
}

interface ApiDocSection {
  title: string;
  content: string;
}

export class ApiDocsLookupTools {
  private static readonly API_DOCS_URL = GENLAYER_URLS.apiReference;

  private static readonly SECTION_PATTERNS: Record<string, RegExp[]> = {
    types: [
      /## Core Types[\s\S]*?(?=##|$)/gi,
      /\*\*Primitive Types:\*\*[\s\S]*?(?=\*\*|##|$)/gi,
      /\*\*Collection Types:\*\*[\s\S]*?(?=\*\*|##|$)/gi,
      /\*\*Storage Structures:\*\*[\s\S]*?(?=\*\*|##|$)/gi,
      /\*\*Special Types:\*\*[\s\S]*?(?=\*\*|##|$)/gi
    ],
    decorators: [
      /## Decorators[\s\S]*?(?=##|$)/gi,
      /@gl\.public[\s\S]*?(?=@gl\.|##|$)/gi,
      /@gl\.private[\s\S]*?(?=@gl\.|##|$)/gi,
      /@gl\.contract_interface[\s\S]*?(?=@gl\.|##|$)/gi,
      /@gl\.allow_storage[\s\S]*?(?=@gl\.|##|$)/gi
    ],
    web_access: [
      /## Web Access[\s\S]*?(?=##|$)/gi,
      /gl\.nondet\.web[\s\S]*?(?=##|gl\.[^n]|$)/gi
    ],
    llm: [
      /## LLM\/Prompt Execution[\s\S]*?(?=##|$)/gi,
      /gl\.nondet\.exec_prompt[\s\S]*?(?=##|$)/gi
    ],
    consensus: [
      /## Equivalence Principles[\s\S]*?(?=##|$)/gi,
      /## Non-Deterministic Operations[\s\S]*?(?=##|$)/gi,
      /gl\.eq_principle[\s\S]*?(?=##|$)/gi,
      /gl\.vm\.run_nondet[\s\S]*?(?=##|$)/gi
    ],
    storage: [
      /## Storage Patterns[\s\S]*?(?=##|$)/gi,
      /Root\.get\(\)[\s\S]*?(?=##|$)/gi,
      /Indirection\[[\s\S]*?(?=##|$)/gi
    ],
    events: [/## Events[\s\S]*?(?=##|$)/gi, /class.*Event[\s\S]*?(?=##|class|$)/gi],
    contract_structure: [
      /## Contract Structure[\s\S]*?(?=##|$)/gi,
      /class.*gl\.Contract[\s\S]*?(?=##|$)/gi
    ],
    message_access: [/## Message Access[\s\S]*?(?=##|$)/gi, /gl\.message[\s\S]*?(?=##|$)/gi],
    evm_integration: [/## EVM Integration[\s\S]*?(?=##|$)/gi, /@gl\.evm[\s\S]*?(?=##|$)/gi]
  };

  /**
   * Fetch and parse the latest GenLayer API documentation
   *
   * @param params.topic - Optional topic to filter documentation
   * @returns Parsed API documentation content
   */
  static async fetchLatestApiDocs(params: { topic?: string }): Promise<ToolResult> {
    try {
      const response = await fetch(this.API_DOCS_URL);

      if (!response.ok) {
        return {
          content: `Error: Failed to fetch API documentation. Status: ${response.status}.

Please try again later or visit the documentation directly at:
${GENLAYER_URLS.docs}

API Reference URL: ${this.API_DOCS_URL}`,
          isError: true
        };
      }

      const fullDocs = await response.text();

      // If no topic specified, return a summary with available topics
      if (!params.topic || params.topic === 'all') {
        return {
          content: this.formatFullDocs(fullDocs),
          isError: false
        };
      }

      // Extract specific topic
      const topicContent = this.extractTopic(fullDocs, params.topic);

      if (!topicContent) {
        return {
          content: `Topic '${params.topic}' not found in the API documentation.

Available topics:
- types: Primitive, collection, and storage types
- decorators: Method and class decorators (@gl.public, @gl.private, etc.)
- web_access: Web data fetching methods (gl.nondet.web.*)
- llm: LLM/prompt execution (gl.nondet.exec_prompt)
- consensus: Equivalence principles and non-deterministic operations
- storage: Storage patterns and structures
- events: Event emission and handling
- contract_structure: Contract class structure and special methods
- message_access: Transaction message access (gl.message)
- evm_integration: EVM contract interfaces
- all: Complete API documentation

API Reference URL: ${this.API_DOCS_URL}`,
          isError: false
        };
      }

      return {
        content: `# GenLayer API Documentation: ${params.topic.toUpperCase()}

${topicContent}

---
Source: ${this.API_DOCS_URL}
Last fetched: ${new Date().toISOString()}

For complete documentation, visit: ${GENLAYER_URLS.docs}`,
        isError: false
      };
    } catch (error) {
      return {
        content: `Error fetching API documentation: ${(error as Error).message}

The API documentation URL may be temporarily unavailable.

Fallback resources:
- GenLayer Documentation: ${GENLAYER_URLS.docs}
- GitHub Repository: ${GENLAYER_URLS.github}
- API Reference: ${this.API_DOCS_URL}

Please try again later.`,
        isError: true
      };
    }
  }

  /**
   * Format the full documentation with a summary
   */
  private static formatFullDocs(docs: string): string {
    const summary = this.extractSummary(docs);

    return `# GenLayer API Documentation (Latest)

## Quick Reference

${summary}

## Full Documentation

${docs.length > 15000 ? docs.substring(0, 15000) + '\n\n... (truncated for length)\n\nFull documentation available at: ' + this.API_DOCS_URL : docs}

---
Source: ${this.API_DOCS_URL}
Last fetched: ${new Date().toISOString()}

For topic-specific documentation, use the 'topic' parameter with one of:
types, decorators, web_access, llm, consensus, storage, events, contract_structure, message_access, evm_integration`;
  }

  /**
   * Extract a summary of the documentation
   */
  private static extractSummary(docs: string): string {
    const sections: string[] = [];

    // Extract main headings
    const headingMatches = docs.match(/^## .+$/gm);
    if (headingMatches) {
      sections.push('### Available Sections:');
      headingMatches.slice(0, 15).forEach(heading => {
        sections.push(`- ${heading.replace('## ', '')}`);
      });
    }

    return sections.join('\n');
  }

  /**
   * Extract content for a specific topic
   */
  private static extractTopic(docs: string, topic: string): string | null {
    const patterns = this.SECTION_PATTERNS[topic.toLowerCase()];

    if (!patterns) {
      return null;
    }

    const extractedSections: string[] = [];

    for (const pattern of patterns) {
      const matches = docs.match(pattern);
      if (matches) {
        extractedSections.push(...matches);
      }
    }

    if (extractedSections.length === 0) {
      // Fallback: try simple keyword search
      const keywordPattern = new RegExp(`[^#]*${topic}[^#]*(?=##|$)`, 'gi');
      const keywordMatches = docs.match(keywordPattern);
      if (keywordMatches) {
        extractedSections.push(...keywordMatches.slice(0, 5));
      }
    }

    if (extractedSections.length === 0) {
      return null;
    }

    // Remove duplicates and format
    const uniqueSections = [...new Set(extractedSections)];
    return uniqueSections.join('\n\n---\n\n').trim();
  }
}

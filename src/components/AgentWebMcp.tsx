"use client";

import { useEffect } from "react";

type ModelContext = {
  registerTool: (tool: {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (input: Record<string, unknown>) => Promise<unknown>;
  }) => () => void;
};

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
}

/**
 * WebMCP tool registration for agent-ready discovery scans.
 * @see https://webmachinelearning.github.io/webmcp/
 */
export function AgentWebMcp() {
  useEffect(() => {
    const mc = navigator.modelContext;
    if (!mc?.registerTool) return;

    const unregister: Array<() => void> = [];

    unregister.push(
      mc.registerTool({
        name: "get_integration_guide",
        description: "Return the SlicePay Website Pay Widget integration guide URL and summary.",
        inputSchema: {
          type: "object",
          properties: {},
        },
        execute: async () => ({
          guideUrl: "https://slicechain.io/website-pay-widget/",
          markdownUrl: "https://slicechain.io/website-pay-widget.md",
          embedScript: "https://pay.slicechain.io/embed.js",
          testPage: "https://pay.slicechain.io/test-embed.html",
        }),
      })
    );

    unregister.push(
      mc.registerTool({
        name: "get_api_catalog",
        description: "Return SlicePay Gateway API discovery URLs (OpenAPI, health, auth).",
        inputSchema: {
          type: "object",
          properties: {},
        },
        execute: async () => ({
          apiCatalog: "https://slicechain.io/.well-known/api-catalog",
          openapi: "https://slicechain.io/.well-known/openapi/gateway.json",
          baseUrl: "https://api.slicechain.io/api/gateway",
          health: "https://api.slicechain.io/api/health",
          auth: "https://slicechain.io/auth.md",
        }),
      })
    );

    unregister.push(
      mc.registerTool({
        name: "navigate_to_section",
        description: "Scroll to a section on the SlicePay marketing homepage.",
        inputSchema: {
          type: "object",
          required: ["sectionId"],
          properties: {
            sectionId: {
              type: "string",
              description: "DOM id of the landing section (e.g. pay-widget, contact, roadmap)",
            },
          },
        },
        execute: async (input) => {
          const sectionId = String(input.sectionId ?? "");
          const el = document.getElementById(sectionId);
          if (!el) {
            return { ok: false, error: `Section #${sectionId} not found` };
          }
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return { ok: true, sectionId };
        },
      })
    );

    return () => {
      for (const off of unregister) off();
    };
  }, []);

  return null;
}
